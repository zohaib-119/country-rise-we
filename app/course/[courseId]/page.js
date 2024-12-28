'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoadingComponent from '@/components/LoadingComponent';
import Sidebar from '@/components/Sidebar';

const CourseDashboard = () => {
    const router = useRouter();
    const { courseId } = useParams();
    const { data: session } = useSession();

    const [courseMaterials, setCourseMaterials] = useState(null);
    const [course, setCourse] = useState(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newMaterial, setNewMaterial] = useState({ title: '', file: null });

    const [materialToDelete, setMaterialToDelete] = useState(null);

    const fetchCourse = async () => {
        try {
            const response = await fetch(`/api/course/material/${courseId}`);
            const data = await response.json();

            if (response.ok) {
                setCourse(data.course);
                setCourseMaterials(data.course_materials.sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                ));
            } else {
                router.push('/enrolled-courses');
            }
        } catch (err) {
            console.error("Error fetching course:", err);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const handleViewEnrollments = () => {
        router.push(`/course/enrollments/${courseId}`);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewMaterial({ title: '', file: null });
    };

    const handleFileChange = (e) => {
        setNewMaterial({ ...newMaterial, file: e.target.files[0] });
    };

    const handleTitleChange = (e) => {
        setNewMaterial({ ...newMaterial, title: e.target.value });
    };

    const addMaterial = async () => {
        if (newMaterial.title && newMaterial.file) {
            const formData = new FormData();
            formData.append('files', newMaterial.file);

            try {
                // Step 1: Upload the file
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error('Failed to upload image');
                }

                const { result } = await res.json();
                console.log('Uploaded URLs:', result);

                // Step 2: Create course material with uploaded file URL
                const courseMaterialRes = await fetch('/api/course/material', {
                    method: 'POST',
                    body: JSON.stringify({
                        course_id: course.id,
                        title: newMaterial.title,
                        url: result[0].url,
                        public_id: result[0].public_id,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!courseMaterialRes.ok) {
                    throw new Error('Failed to create course material');
                }

                // Successfully added material, close modal
                closeAddModal();
                console.log('Course material added successfully');

                fetchCourse();
            } catch (error) {
                console.error('Error:', error.message || error);
            }
        } else {
            alert('Please provide both a title and a file.');
        }
    };


    const openDeleteModal = (material) => {
        setMaterialToDelete(material);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setMaterialToDelete(null);
    };

    const deleteMaterial = async () => {
        if (!materialToDelete) {
            return;
        }

        try {
            // Sending DELETE request to the API with the course material ID
            const res = await fetch('/api/course/material', {
                method: 'DELETE',
                body: JSON.stringify({ course_material_id: materialToDelete.id }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || 'Failed to delete course material');
            }

            const { message } = await res.json();
            console.log(message);

            closeDeleteModal();
            fetchCourse();
        } catch (error) {
            console.error('Error deleting course material:', error);
            alert(`Error: ${error.message}`);
        }
    };


    if (!course || !courseMaterials)
        return <LoadingComponent />

    return (
        <div className='flex'>
            <Sidebar />
            <div className="p-6 w-5/6 h-screen overflow-auto">
                {/* Course Details */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-blue-700">{course.title}</h1>
                    <p className="text-lg text-gray-700 mt-2">{course.description}</p>
                </div>

                {/* Action Buttons */}

                {course.creator_id === session.user.id && (
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={handleViewEnrollments}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            View Enrollments
                        </button>
                        <button
                            onClick={openAddModal}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Add Course Material
                        </button>
                    </div>
                )}

                {/* Course Materials */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Materials</h2>
                    {courseMaterials.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {courseMaterials.map((material) => (
                                <li
                                    key={material.id}
                                    className="flex justify-between items-center py-2"
                                >
                                    <Link
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {material.title}
                                    </Link>
                                    <div className='flex gap-6 items-center'>
                                        <span className="text-sm text-gray-500">
                                            {new Date(material.created_at).toLocaleDateString()}
                                        </span>
                                        {course.creator_id === session.user.id && (
                                            <button
                                                onClick={() => openDeleteModal(material)}
                                                className='text-red-500'
                                            >
                                                Delete
                                            </button>)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No materials have been shared yet.</p>
                    )}
                </div>

                {/* Add Material Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Add Course Material</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={newMaterial.title}
                                    onChange={handleTitleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">File</label>
                                <input
                                    type="file"
                                    className="w-full border rounded px-3 py-2"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={closeAddModal}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addMaterial}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                            <p>Are you sure you want to delete "{materialToDelete.title}"?</p>
                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    onClick={closeDeleteModal}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteMaterial}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDashboard;
