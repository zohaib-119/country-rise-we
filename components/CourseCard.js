import React from "react";
import { FaTrash, FaEdit } from 'react-icons/fa';

const CourseCard = ({ course, onEdit, onDelete }) => {

    const truncatedDescription = course.description.length > 55
    ? course.description.slice(0, 52) + '...' 
    : course.description;

    return (
        <div className="w-96 bg-white shadow-md rounded-lg overflow-hidden">
            <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-bold text-blue-600">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{truncatedDescription}</p>
                <p className="text-gray-800 font-semibold">
                    Fee: <span className="text-blue-500">Rs.{' '}{course.fee}</span>
                </p>
                <p className="text-green-600 font-semibold">
                    Start Date: {course.start_date}
                </p>
                <p className="text-red-600 font-semibold">
                    End Date: {course.end_date}
                </p>
                <div className="flex justify-end gap-4 mt-2">

                    {/* Edit Button */}
                    <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-x-1"
                        onClick={() => onEdit(course.id)}
                        title="Edit Product"
                    >
                        <FaEdit size={14} />
                        <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                        className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-x-1"
                        onClick={() => onDelete(course.id)}
                        title="Delete Product"
                    >
                        <FaTrash size={14} />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
