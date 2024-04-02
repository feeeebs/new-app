import React from 'react'
import { auth } from '../Utilities/Firebase/firebaseConfig';
import { useIdToken } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth';

export default function PrivateRoute({ children }) {
  // const { isAuthenticated } = useAuth0();
  const auth = getAuth();
  const user = auth.currentUser
  // return isAuthenticated ? children : <Navigate to="/dashboard" />;

  return (
    user ? children: <Navigate to="/" />
  )
}
