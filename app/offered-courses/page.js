'use client';

import React, { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard"; // Assuming CourseCard is in the same folder
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/LoadingComponent";
import Sidebar from "@/components/Sidebar";

const OfferedCourses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses/offered"); // Adjust API endpoint if necessary
      const data = await response.json();
      if (!response.ok) {
        console.error(data.error)
      }
      setCourses(data.courses);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    router.push('/course/create');
  };

  const handleEditCourse = (id) => {
    router.push(`/course/edit/${id}`);
  };

  const handleDeleteCourse = (id) => {
    console.log(`Delete Course with ID: ${id}`);
    // Add delete logic if needed
  };

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-5/6 h-screen overflow-auto m-10">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">Offered Courses</h1>
          <button
            onClick={handleCreateCourse}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Course
          </button>
        </div>
        <div className="flex flex-wrap gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferedCourses;
