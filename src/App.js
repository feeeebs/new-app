import './App.css';
import Homepage from './Routes/Homepage';
import ErrorPage from './Routes/ErrorPage';
import LoadingPage from './Routes/LoadingPage';
import Dashboard from './Routes/Dashboard';
import Profile from './Routes/Profile';
import AddNewLyrics from './Routes/AddNewLyrics';
import NewLyricSearch from './Routes/NewLyricSearch';
import EditFavoriteLyric from './Routes/EditFavoriteLyric';
import { updateEmail, updateFirstName, updateId, updateIsLoggedIn, updateLastName } from './Utilities/Redux/userSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSquid, useCollection } from '@squidcloud/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRoute';
import { auth } from './Utilities/Firebase/firebaseConfig';
import { useIdToken } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './Routes/Login';
import Signup from './Routes/Signup';

function App() {
    const dispatch = useDispatch();
    // Get Firebase Authentication state
    const [user, loading, error] = useIdToken(auth);
    const { setAuthProvider } = useSquid();

    useEffect(() => {
      // Pass the auth token to the Squid backend
      setAuthProvider({
        integrationId: 'firebase_auth_id',
        getToken: async () => {
          if (!user) return undefined;
          return await user.getIdToken();
        },
      });

      if (loading) return;

      if (!user) {
        dispatch(updateIsLoggedIn(false));
        // Navigate to the homepage if the user is not logged in
        <Homepage />
      } else {
        dispatch(updateIsLoggedIn(true));
        // Navigate to the dashboard if the user is logged in
        <Dashboard />
      }
    }, [user, loading, setAuthProvider]);

    // Watch for changes in auth state
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('User is signed in: ', user);
          const uid = user.uid;

          dispatch(updateId(uid));
        
        } else {
          console.log('No user is signed in');
        }
      });
    }, [])
  
    const usersCollection = useCollection('users', 'postgres_id'); // Reference to users collection in DB
  
      // Store initial user info in variables to use here
      const userInformation = useSelector(state => state.user.userInfo);
      const { id } = userInformation;
    
  
      // Get current user info from Postgres
      useEffect(() => {
        if (user) {
          console.log('doop');
          (async () => {
            getUserInfo();
          })();
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [user]);
  
  
      // Function to query Postgres for user data and update user info stored in Redux
      const getUserInfo = async () => {
        try {
          console.log('running getUserInfo function')
          const userSnapshot = await usersCollection
              .query()
              .where('id', '==', id)
              .dereference()
              .snapshot();

          console.log('userSnapshot during getUserInfo: ', userSnapshot);
          const { first_name, last_name, email } = userSnapshot[0];
          console.log('first name during getUserInfo: ', first_name);
          dispatch(updateFirstName(first_name));
          dispatch(updateLastName(last_name));
          dispatch(updateEmail(email));

        } catch (error) {
          console.error('Error in getUserInfo: ', error);
        }     
      };
  

// Routing
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/loading",
    element: <LoadingPage userInfo={userInformation} />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard userInfo={userInformation} /></PrivateRoute>,
  },
  {
    path: "/profile",
    element: <PrivateRoute><Profile userInfo={userInformation} /></PrivateRoute>,
  },
  {
    path: "/add-lyrics/:lyricId",
    element: <PrivateRoute><AddNewLyrics userInfo={userInformation} /></PrivateRoute>,
  },
  {
    path: "/lyric-search",
    element: <PrivateRoute><NewLyricSearch userInfo={userInformation} /></PrivateRoute>,
  },
  {
    path: "/edit-favorite/:favoriteId",
    element: <PrivateRoute><EditFavoriteLyric userInfo={userInformation} /></PrivateRoute>,
  },

]);

// If firebase is checking authentication, return loading page
if (loading) {
  return <LoadingPage />;
}

// Otherwise route accordingly
return (
  <RouterProvider router={router} />
)
}

export default App;
