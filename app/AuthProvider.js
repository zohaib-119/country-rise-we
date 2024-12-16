"use client";

import { SessionProvider } from 'next-auth/react';
import AuthRedirect from '@/components/AuthRedirect';

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <AuthRedirect>
        {children}
      </AuthRedirect>
    </SessionProvider>
  );
};

