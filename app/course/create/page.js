// works fine for now..

"use client";

import React, { useState } from 'react';
import CustomInput from '@/components/CustomInput';
import { useRouter } from 'next/navigation';

const CreateCourse = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        description: '',
        fee: '',
        category: '',
        startDate: null,
        endDate: null,
        thumbnail: null,
    });

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
        // Update categoryId directly
        setForm({ ...form, category: e.target.value });
    };


    const handleFileChange = (e) => {
        setForm({ ...form, thumbnail: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('files', form.thumbnail);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to upload images');
            }

            const { result } = await res.json();
            console.log('Uploaded URLs:', result);

            // Now, make another API call to create the product
            const courseRes = await fetch('/api/course/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    fee: form.fee,
                    start_date: form.startDate,
                    end_date: form.endDate,
                    category: form.category,
                    thumbnail_url: result[0].url, // Attach uploaded image URLs
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!courseRes.ok) {
                throw new Error('Failed to create product');
            }

            router.push('/offered-courses')

            // Clear the form on successful submission
            setForm({
                title: '',
                description: '',
                fee: '',
                category: '',
                startDate: null,
                endDate: null,
                thumbnail: null,
            });
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6">
                <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Create Course</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className='flex gap-6'>
                        <CustomInput
                            label="Title"
                            placeholder="Enter the course title"
                            value={form.title}
                            handleChange={handleTitleChange}
                        />

                        <CustomInput
                            label="Course Fee"
                            placeholder="Enter the course fee"
                            value={form.fee}
                            handleChange={handleFeeChange}
                        />

                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-lg font-semibold mb-2">Category</label>
                            <select
                                id="category"
                                value={form.category}
                                onChange={handleCategoryChange}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <CustomInput
                        label="Description"
                        placeholder="Enter the course description"
                        value={form.description}
                        handleChange={handleDescriptionChange}
                    />


                    <div className='flex justify-between'>
                        <CustomInput
                            label="Start Date"
                            type="date"
                            placeholder="Enter the course fee"
                            value={form.startDate ?? ''}
                            handleChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        />

                        <CustomInput
                            label="End Date"
                            type="date"
                            placeholder="Enter the course fee"
                            value={form.endDate ?? ''}
                            handleChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        />
                        <div>
                            <label htmlFor="image" className="block text-lg font-semibold mb-2">Upload Thumbnail</label>
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
                        <label className="block text-lg font-semibold mb-2">Thumbnail Preview</label>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <div className="w-96 h-48 border bg-gray-400 border-gray-300 rounded-md overflow-hidden">
                                {form.thumbnail ? <img
                                    src={URL.createObjectURL(form.thumbnail)}
                                    alt={`Uploaded thumbnail`}
                                    className="w-full h-full object-cover"
                                /> : <div className='flex justify-center items-center h-full font-bold font-serif text-xl'>No Thumbnail Uploaded</div>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/offered-courses')}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;