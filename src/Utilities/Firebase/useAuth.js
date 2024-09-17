import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useIdToken } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { updateId, updateIsLoggedIn } from '../Redux/userSlice';
import { useSquid, useCollection } from '@squidcloud/react';

const useAuth = () => {
  const dispatch = useDispatch();
  const [user, loading, error] = useIdToken(auth);
  const { setAuthProvider } = useSquid();
  const usersCollection = useCollection('users', 'postgres_id');

  useEffect(() => {
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
    } else {
      dispatch(updateIsLoggedIn(true));
    }
  }, [user, loading, setAuthProvider, dispatch]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        dispatch(updateId(uid));
        const email = user.email;
        usersCollection.doc({ id: uid }).update({ email })
          .then(() => console.log("User email updated successfully"))
          .catch((err) => console.error("Error updating user email: ", err));
      }
    });
  }, [dispatch, usersCollection]);

  return { user, loading, error };
};

export default useAuth;