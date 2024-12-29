'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import getStripe from '@/lib/getStripe';
import LoadingComponent from '@/components/LoadingComponent';


const CourseEnrollmentPage = () => {
  const { courseId } = useParams();
  const stripePromise = getStripe(); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [courseEnrollmentPossible, setCourseEnrollmentPossible] = useState(true);

  useEffect(()=>{
    if(!courseEnrollmentPossible){
      router.push('/enrolled-courses')
    }
  }, [courseEnrollmentPossible]);

  useEffect(()=>{
    const fetchEnrollmentStatus = async () => {
      const response = await fetch(`/api/course/enrollment-possible/${courseId}`);
      const data = await response.json();
      if(!response.ok){
        router.push('/explore-courses')
      }
      setCourseEnrollmentPossible(data.enrollment_possible);
    };

    if (courseId) {
      fetchEnrollmentStatus();
    }
  }, [courseId]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const response = await fetch(`/api/course/${courseId}`);
      const data = await response.json();
      setCourse(data.course);
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    setLoading(true);

    const res = await fetch(`/api/stripe/${courseId}`);

    if(!res.ok){
      console.log('response not okay')
      return
    }

    const { sessionId } = await res.json();

    if (sessionId) {
      const stripe = await stripePromise;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    } else {
      console.error('Failed to create checkout session');
    }
    setLoading(false);
  };

  if (loading) return <LoadingComponent />;

  if (!course) return <LoadingComponent />;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="md:w-3/4 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 flex items-center">
          <img src={course.thumbnail} alt={course.title} className="w-full rounded-lg" />
        </div>
        <div className="flex flex-col justify-center w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-blue-700">{course.title}</h1>
          <div className="my-4">
            <p className="text-gray-700">
              Description: {course.description}
            </p>
            <p className="text-gray-700 mt-2">
              Category: {course.category}
            </p>
            <p className="text-green-600 font-semibold mt-2">
              Start Date: {new Date(course.startDate).toLocaleDateString()}
            </p>
            <p className="text-red-600 font-semibold mt-2">
              <strong>End Date:</strong> {new Date(course.endDate).toLocaleDateString()}
            </p>
            <p className="text-blue-700 text-xl  font-bold mt-2">
              Rs.{' '}{course.fee}
            </p>
          </div>

          <button
            onClick={handleEnroll}
            className="bg-blue-600 text-white py-2 px-6 rounded-md mt-6"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollmentPage;
