import React from "react";

const EnrolledCourseCard = ({ course, onEnroll }) => {

    const truncatedDescription = course.description.length > 53
        ? course.description.slice(0, 50) + '...'
        : course.description;

    return (
        <div
            className={`w-96 bg-white shadow-md rounded-lg overflow-hidden cursor-pointer`} // Add hover effect if clickable
        >
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
                <div className="flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2" onClick={()=> onEnroll(course.id)}>
                        Enroll
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCourseCard;
