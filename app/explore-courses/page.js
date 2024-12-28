'use client';

import React, { useState, useEffect } from "react";
import ExploreCourseCard from "@/components/ExploreCourseCard";
import LoadingComponent from "@/components/LoadingComponent";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

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

const ExploreCourses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // For search input
  const [selectedCategory, setSelectedCategory] = useState(""); // For category filter
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Function to fetch courses from the API
  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses/explore"); // Adjust API endpoint if necessary
      const data = await response.json();
      if (!response.ok) {
        console.error(data.error)
      }
      setCourses(data.courses);
    } catch (error) {
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on searchText and selectedCategory
  const filterCourses = () => {
    let filtered = courses;

    if (searchText) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(course =>
        course.category === selectedCategory
      );
    }

    setFilteredCourses(filtered);
  };

  // Trigger filtering whenever courses, searchText, or selectedCategory change
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchText, selectedCategory]);

  const handleEnrollment = (course_id) => {
    router.push(`/course/get-enroll/${course_id}`);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="m-10 h-screen w-5/6 overflow-auto">
        <div className="mb-6 flex justify-between">
          <h1 className="text-3xl font-bold text-blue-700">Explore Courses</h1>

          {/* Search and filter controls */}
          <div className="mb-6 flex gap-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search courses by title..."
              className="p-2 w-[500px] border border-gray-300 rounded"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {/* Category Filter */}
            <select
              className="p-2 w-64 border border-gray-300 rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <ExploreCourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnrollment}
              />
            ))
          ) : (
            <p>No courses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreCourses;
