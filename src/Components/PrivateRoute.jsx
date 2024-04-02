import React from 'react'
import { auth } from '../Utilities/Firebase/firebaseConfig';
import { useIdToken } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  // const { isAuthenticated } = useAuth0();
  const user = useIdToken(auth);
  // return isAuthenticated ? children : <Navigate to="/dashboard" />;

  return (
    user ? children: <Navigate to="/" />
  )
}
