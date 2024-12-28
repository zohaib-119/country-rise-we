'use client';

import React, { useState, useEffect } from "react";
import EnrolledCourseCard from "@/components/EnrolledCourseCard"; 
import LoadingComponent from "@/components/LoadingComponent";

const OfferedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses/enrolled"); 
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

  if (loading) {
    return <LoadingComponent/>
  }

  return (
    <div className="m-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Enrolled Courses</h1>
      </div>
      <div className="flex flex-wrap gap-6">
        {courses.map((course) => (
          <EnrolledCourseCard
            key={course.id}
            course={course}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferedCourses;
