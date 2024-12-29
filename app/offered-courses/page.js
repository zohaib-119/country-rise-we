'use client';

import React, { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard"; // Assuming CourseCard is in the same folder
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/LoadingComponent";
import Sidebar from "@/components/Sidebar";
import { useLanguage } from "@/context/LanguageProvider";
import { translations } from "@/constants";

const OfferedCourses = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

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

  const openDeleteModal = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleCreateCourse = () => {
    router.push('/course/create');
  };

  const handleEditCourse = (id) => {
    router.push(`/course/edit/${id}`);
  };

  const handleDeleteCourse = async (id) => {
    try {
      // Log the course ID for debugging
      console.log(`Attempting to delete course with ID: ${id}`);

      // Call the backend DELETE API
      const response = await fetch(`/api/course`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_id: id }),
      });

      // Parse the response
      const data = await response.json();

      if (response.ok) {
        console.log(`Course deleted successfully: ${id}`);
        setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
      } else {
        console.error(`Failed to delete course: ${data.error}`);
        alert(`Failed to delete course: ${data.error}`);
      }
    } catch (error) {
      console.error('Error during course deletion:', error);
      alert('An unexpected error occurred while deleting the course.');
    }
  };


  if (loading) {
    return <LoadingComponent />
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-5/6 h-screen overflow-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">{translations[language].offeredCourses}</h1>
          <button
            onClick={handleCreateCourse}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {translations[language].createCourse}
          </button>
        </div>
        <div className="flex flex-wrap gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={() => openDeleteModal(course)}
            />
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>{`${translations[language].deleteCourseConfirmation} ${courseToDelete.title}`}?</p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  {translations[language].cancel}
                </button>
                <button
                  onClick={() => handleDeleteCourse(courseToDelete.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  {translations[language].delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferedCourses;
