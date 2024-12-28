'use client'

import LoadingComponent from "@/components/LoadingComponent";
import Sidebar from "@/components/Sidebar";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Enrollments = () => {
  const router = useRouter();
  const { courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [enrolledUsers, setEnrolledUsers] = useState(null);

  // Fetch course details and enrollments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/course/enrollments/${courseId}`);
        const data = await res.json();

        if (res.ok) {
          setCourseDetails(data.course);
          setEnrolledUsers(data.active_enrollments);
        } else {
          router.push('/offered-courses');
        }
      } catch (err) {
        router.push('/offered-courses');
      }
    };

    fetchData();
  }, [courseId]);



  if (!courseDetails || !enrolledUsers)
    return <LoadingComponent />

  return (
    <div className="flex">
      <Sidebar />

      <div className="m-10 h-screen w-5/6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">{courseDetails.title}</h1>
          <p className="text-gray-600">
            Start Date: {courseDetails.start_date} | End Date: {courseDetails.end_date}
          </p>
        </div>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Enrolled Members</h2>
        {enrolledUsers.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            <p className="text-lg">No students have enrolled in this course yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 text-left">Profile</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Fee Paid</th>
                  <th className="p-3 text-left">Enrollment At</th>
                </tr>
              </thead>
              <tbody>
                {enrolledUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      <img
                        src={user.profile_pic}
                        alt={user.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">{user.address}</td>
                    <td className="p-3 text-blue-500 font-semibold">{user.fee_paid}</td>
                    <td className="p-3">{new Date(user.enrollment_date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollments;
