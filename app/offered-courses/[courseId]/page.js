'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const CourseDashboard = () => {
    const router = useRouter();
    const { courseId } = useParams();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete confirmation modal
    const [newMaterial, setNewMaterial] = useState({ title: '', file: null });
    const [courseMaterials, setCourseMaterials] = useState([
        {
            id: 1,
            title: "Introduction Video",
            url: "https://example.com/video1",
            created_at: "2024-12-01T10:30:00Z",
        },
        {
            id: 2,
            title: "Module 1 PDF",
            url: "https://example.com/pdf1",
            created_at: "2024-12-02T15:00:00Z",
        },
        {
            id: 3,
            title: "Assignment 1",
            url: "https://example.com/doc1",
            created_at: "2024-12-03T09:00:00Z",
        },
    ]);
    const [materialToDelete, setMaterialToDelete] = useState(null); // For storing the material to delete

    useEffect(()=>{
        const fetchCourse = async () => {

        }
    }, [])
    const sortedMaterials = courseMaterials.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    const handleViewEnrollments = () => {
        router.push('/course/enrollments/1');
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewMaterial({ title: '', file: null });
    };

    const handleFileChange = (e) => {
        setNewMaterial({ ...newMaterial, file: e.target.files[0] });
    };

    const handleTitleChange = (e) => {
        setNewMaterial({ ...newMaterial, title: e.target.value });
    };

    const addMaterial = () => {
        if (newMaterial.title && newMaterial.file) {
            const newEntry = {
                id: courseMaterials.length + 1,
                title: newMaterial.title,
                url: URL.createObjectURL(newMaterial.file),
                created_at: new Date().toISOString(),
            };
            setCourseMaterials([newEntry, ...courseMaterials]);
            closeModal();
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

    const deleteMaterial = () => {
        setCourseMaterials(courseMaterials.filter(material => material.id !== materialToDelete.id));
        closeDeleteModal();
    };

    return (
        <div className="m-10">
            {/* Course Details */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-blue-700">Full-Stack Development</h1>
                <p className="text-lg text-gray-700 mt-2">Learn full-stack development from scratch and become job-ready.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleViewEnrollments}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    View Enrollments
                </button>
                <button
                    onClick={openModal}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add Course Material
                </button>
            </div>

            {/* Course Materials */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Materials</h2>
                {sortedMaterials.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {sortedMaterials.map((material) => (
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
                                <div className='flex gap-6'>
                                    <span className="text-sm text-gray-500">
                                        {new Date(material.created_at).toLocaleDateString()}
                                    </span>
                                    <button 
                                        onClick={() => openDeleteModal(material)}
                                        className='text-red-500'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No materials have been shared yet.</p>
                )}
            </div>

            {/* Add Material Modal */}
            {isModalOpen && (
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
                                onClick={closeModal}
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
    );
};

export default CourseDashboard;
