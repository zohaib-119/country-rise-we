// working fine for now

"use client";

import React, { useEffect, useState } from 'react';
import CustomInput from '@/components/CustomInput';
import { useRouter, useParams } from 'next/navigation';
import LoadingComponent from '@/components/LoadingComponent';
import { useSession } from 'next-auth/react';
import { translations } from '@/constants';
import { useLanguage } from '@/context/LanguageProvider';


const EditCourse = () => {
    const { language } = useLanguage()
    const router = useRouter();
    const { courseId } = useParams(); // Extract productId from the dynamic route

    const { data: session } = useSession();

    const [form, setForm] = useState(null);

    const categories = [
        { id: 1, name: "Business Development" },
        { id: 2, name: "Marketing Strategies" },
        { id: 3, name: "Financial Management" },
        { id: 4, name: "Leadership & Team Building" },
        { id: 5, name: "Innovation & Creativity" },
        { id: 6, name: "E-Commerce Essentials" },
        { id: 7, name: "Start-up Launch" },
        { id: 8, name: "Customer Relationship Management" },
        { id: 9, name: "Social Media Marketing" },
        { id: 10, name: "Pitching & Fundraising" },
    ];

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/course/${courseId}`);
                const result = await res.json(); // Await the parsed JSON data
                if (!res.ok) {
                    console.log(result.error);
                    router.push('/offered-courses');
                } else {
                    if (result.course.creator_id === session.user.id) {
                        setForm(result.course);
                    } else {
                        router.push('/offered-courses')
                    }
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                router.push('/offered-courses');
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleTitleChange = (e) => {
        const value = e.target.value;
        // Update only if the title contains valid characters
        if (/^[a-zA-Z0-9\s.,!?;:_-]*$/.test(value)) {
            setForm({ ...form, title: value });
        }
    };

    const handleDescriptionChange = (e) => {
        // No validation required for description
        setForm({ ...form, description: e.target.value });
    };

    const handleFeeChange = (e) => {
        const value = e.target.value;
        if (/^(?!0$)\d+(\.\d+)?$/.test(value)) {
            // Update if numeric and does not start with a single zero
            setForm({ ...form, fee: value });
        } else if (value === "") {
            // Allow empty input for clearing the field
            setForm({ ...form, fee: "" });
        }
    };

    const handleCategoryChange = (e) => {
        setForm({ ...form, category: e.target.value });
    };


    const handleFileChange = (e) => {
        setForm({ ...form, thumbnail: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let thumbnail = null

            if (form.thumbnail instanceof File) {
                const formData = new FormData();

                formData.append('files', form.thumbnail);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error('Failed to upload images');
                }

                const { result } = await res.json();
                thumbnail = result[0].url;
            }


            // Now, make another API call to create the product
            const courseRes = await fetch('/api/course', {
                method: 'PATCH',
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    fee: form.fee,
                    start_date: form.startDate,
                    end_date: form.endDate,
                    category: form.category,
                    thumbnail_url: thumbnail ? thumbnail : form.thumbnail, // Attach uploaded image URLs
                    course_id: courseId
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!courseRes.ok) {
                throw new Error('Failed to edit course');
            }

            // Clear the form on successful submission
            setForm(null);

            router.push('/offered-courses')
        } catch (error) {
            console.error('Error editing course:', error);
        }
    };

    if (!form)
        return <LoadingComponent />

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6">
                <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">{translations[language].editCourse}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className='flex gap-6'>
                        <CustomInput
                            label={translations[language].courseTitle}  
                            placeholder={translations[language].enterCourseTitle}  
                            value={form.title}
                            handleChange={handleTitleChange}
                        />

                        <CustomInput
                            label={translations[language].courseFee}  
                            placeholder={translations[language].enterCourseFee}  
                            value={form.fee}
                            handleChange={handleFeeChange}
                        />

                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-lg font-semibold mb-2">{translations[language].category}</label>  
                            <select
                                id="category"
                                value={form.category}
                                onChange={handleCategoryChange}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" disabled>{translations[language].selectCategory}</option>  
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <CustomInput
                        label={translations[language].courseDescription}  
                        placeholder={translations[language].enterCourseDescription}  
                        value={form.description}
                        handleChange={handleDescriptionChange}
                    />

                    <div className='flex justify-between'>
                        <CustomInput
                            label={translations[language].startDate} 
                            type="date"
                            placeholder={translations[language].enterStartDate}  
                            value={form.startDate}
                            handleChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        />

                        <CustomInput
                            label={translations[language].endDate}  
                            type="date"
                            placeholder={translations[language].enterEndDate} 
                            value={form.endDate}
                            handleChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        />
                        <div>
                            <label htmlFor="image" className="block text-lg font-semibold mb-2">{translations[language].uploadThumbnail}</label>  
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-lg font-semibold mb-2">{translations[language].thumbnailPreview}</label>  
                        <div className="mt-4 flex flex-wrap gap-4">
                            <div className="w-96 h-48 border bg-gray-400 border-gray-300 rounded-md overflow-hidden">
                                {form.thumbnail ? <img
                                    src={form.thumbnail instanceof File ? URL.createObjectURL(form.thumbnail) : form.thumbnail}
                                    alt={`Uploaded thumbnail`}
                                    className="w-full h-full object-cover"
                                /> : <div className='flex justify-center items-center h-full font-bold font-serif text-xl'>{translations[language].noThumbnailUploaded}</div>}  
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/offered-courses')}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 transition"
                        >
                            {translations[language].cancel}  
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition"
                        >
                            {translations[language].update}  
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default EditCourse;