'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingComponent from '@/components/LoadingComponent';
import { FaArrowRight } from 'react-icons/fa'; // Importing the right arrow icon from react-icons
import { translations } from '@/constants';
import { useLanguage } from '@/context/LanguageProvider';

const EnrollmentSuccess = () => {
  const {language} =useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const session_id = searchParams.get('session_id');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!session_id) {
      alert('session_id is missing');
      router.push('enrolled-courses')
      return;
    }
    if (hasFetched.current) return; // Skip if already fetched
    hasFetched.current = true;

    const fetchSessionDetails = async () => {
      try {
        // Send the session_id to the backend to verify payment and process enrollment
        const response = await fetch('/api/course/verify-enrollment', {
          method: 'POST',
          body: JSON.stringify({ sessionId: session_id }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsEnrolled(true);
          setLoading(false);
        } else {
          if(response.status === 404){
            router.push('/enrolled-courses')
          } else {
            console.error('Enrollment failed or payment not successful');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error fetching session details.');
        setLoading(false);
      }
    };

    fetchSessionDetails();
    console.log('ethe roula lagda')
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <div className="m-10">
      {isEnrolled ? (
        <h1 className="text-3xl font-bold text-green-700">{translations[language].enrollmentSuccessful}</h1>
      ) : (
        <h1 className="text-3xl font-bold text-red-700">{translations[language].enrollmentFailed}</h1>
      )}
      <p>{isEnrolled ? translations[language].enrollmentSuccessMessage : translations[language].enrollmentFailMessage }</p>
      <button className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600 transition duration-200" onClick={()=> router.push('/enrolled-courses')}>
        <FaArrowRight className="mr-2" />
        {translations[language].goToEnrolledCourses}
      </button>
    </div>
  );
};

export default EnrollmentSuccess;
