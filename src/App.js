import './App.css';
import Homepage from './Routes/Homepage';
import ErrorPage from './Routes/ErrorPage';
import LoadingPage from './Routes/LoadingPage';
import Dashboard from './Routes/Dashboard';
import Profile from './Routes/Profile';
import UpdateProfile from './Routes/UpdateProfile';
import AddNewLyrics from './Routes/AddNewLyrics';
import NewLyricSearch from './Routes/NewLyricSearch';
import EditFavoriteLyric from './Routes/EditFavoriteLyric';
import { updateAll, updateEmail, updateFirstName, updateIsLoggedIn, updateLastName } from './Utilities/Redux/userSlice';
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

          //Split out first/last names
          const fullName = user.displayName;

          // TO DO: GATHER NAME INFO ON SIGN UP
          // const [firstName, ...lastNames] = fullName.split(' ');
          // const lastName = lastNames.join(' ');
  
          // console.log('first name: ', firstName);
          // console.log('last name: ', lastName);
          dispatch(updateAll({
            id: uid,
            email: user.email,
            firstName: fullName,
            lastName: fullName,
          }))
        
        } else {
          console.log('No user is signed in');
        }
      });
    }, [])
  
    const usersCollection = useCollection('users', 'postgres_id'); // Reference to users collection in DB
  
    // ***** TO DO EVENTUALLY ***** -- update to only have the user information query/update once after login instead of every time page loads
    // ^^ will setting up the session stuff fix that?
  
      // Store initial user info in variables to use here
      const userInformation = useSelector(state => state.user.userInfo);
      const { id, email, firstName, lastName } = userInformation;
    
  
      // Check to see if current user exists in DB - triggers other functions to update Redux, insert new users into DB
      useEffect(() => {
        if (user) {
          console.log('doop');
          (async () => {
            const doesUserExist = await userExists();
            console.log('does the user exist? ', doesUserExist);
            
            if (doesUserExist) {
              // if user exists in DB, update state with the stored information
              getUserInfo();
            }
            if (!doesUserExist) {
                console.log('User does not exist - about to run insertUser');
              // if user doesn't exist in DB yet, insert them into the DB
              insertNewUser();
            }
          })();
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [user]);
  
  
      // Function to check if user file exists in the DB
      const userExists = async () => {
        const userDoc = await usersCollection
        .doc({ id: id })
        .snapshot();
        console.log('userQuery during userExists: ', userDoc);
        if (userDoc) {
          // if the user is in the DB, return true
          return true;
        }
        else {
          // if the user is not in the DB, return false
          return false;
        }
    };
  
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
  
  
  // Function to insert data into Postgres for new user
  const insertNewUser = async () => {
    console.log("Running inserNewUser");
    console.log("Form data being inserted: ", userInformation);
    await usersCollection.doc({ id: id }).insert({
        id: id,
        first_name: firstName,
        last_name: lastName,
        email: email,
    })
        .then(() => console.log("New user inserted into DB successfully"))
        .catch((err) => console.error("Error inserting new user into DB: ", err));
  }
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
    path: "/update-profile",
    element: <PrivateRoute><UpdateProfile userInfo={userInformation} /></PrivateRoute>,
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
