'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';

const AuthRedirect = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(pathname)
    if (status === 'unauthenticated') {
      // Redirect to the landing page if the user is not authenticated
      if (pathname !== '/landing-page' && pathname !== '/login' && pathname !== '/signup') {
        router.replace('/landing-page');
      }
    } else if (status === 'authenticated') {
      // Redirect to home if the user is authenticated
      if (pathname === '/landing-page' || pathname === '/login' || pathname === '/signup') {
        router.replace('/');
      }
    }
  }, [status, pathname]);
  // added the pathname in dependency array to ensure if a authentic user tries to navigate to login, signup or landing page after the initial loading of website through a button that have be added for no reason, user is again redirected to '/'

  if (status === 'loading' || (status == 'authenticated' && (pathname === '/landing-page' || pathname === '/login' || pathname === '/signup')) || (status == 'unauthenticated' && (pathname !== '/landing-page' && pathname !== '/login' && pathname !== '/signup'))) {
    return <LoadingComponent/>;
  }

  return children;
};

export default AuthRedirect;