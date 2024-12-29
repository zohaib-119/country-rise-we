import React from "react";
import { useRouter } from "next/navigation";

const EnrolledCourseCard = ({ course }) => {
    const router = useRouter();

    const hasStarted = () => {
        const startDate = new Date(course.start_date);
        const today = new Date();
        return startDate <= today;
    };

    const handleCardClick = () => {
        if (hasStarted()) {
            router.push(`/course/${course.id}`);
        } else {
            alert("This course has not started yet!");
        }
    };

    const truncatedDescription = course.description.length > 53
        ? course.description.slice(0, 50) + '...'
        : course.description;

    return (
        <div
            onClick={handleCardClick}
            className={`w-96 bg-white shadow-md rounded-lg overflow-hidden cursor-pointer ${hasStarted() ? 'hover:shadow-lg' : ''}`} // Add hover effect if clickable
        >
            <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-bold text-blue-600">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{truncatedDescription}</p>
                <p className="text-green-600 font-semibold">
                    Start Date: {course.start_date}
                </p>
                <p className="text-red-600 font-semibold">
                    End Date: {course.end_date}
                </p>
            </div>
        </div>
    );
};

export default EnrolledCourseCard;
