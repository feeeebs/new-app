import React from 'react'
import { Navigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function PrivateRoute({ children }) {
  const auth = getAuth();
  const [ user, loading ] = useAuthState(auth);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setCurrentUser(user);
  //       setLoading(false);
  //     }
  //   });
  // }, [auth])

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//         setCurrentUser(user);

//     });
// }, [auth]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    user ? children: <Navigate to="/" />
  )
}
