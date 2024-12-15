'use client'

import React from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';

const Dashboard = () => {
  const { data: session } = useSession();

  const { id, email, name, profile_picture, phone_number, address } = session.user;

  return (
    <div className='flex'>
      <Sidebar/>
    <div className='w-5/6 h-screen overflow-auto'>
      <h1>Dashboard</h1>
      <div>
        <img src={profile_picture} alt={`${name}'s profile`} style={{ width: '100px', borderRadius: '50%' }} />
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone Number:</strong> {phone_number}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>User ID:</strong> {id}</p>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
