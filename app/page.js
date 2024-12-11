'use client'

import React from 'react';
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  const { id, email, name, profile_picture, phone_number, address } = session.user;

  return (
    <div>
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
  );
};

export default Dashboard;
