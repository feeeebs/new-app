import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFirstName, updateLastName, updateEmail } from './Redux/userSlice';
import { useCollection } from '@squidcloud/react';

const useUserInfo = (user) => {
  const dispatch = useDispatch();
  const userInformation = useSelector(state => state.user.userInfo);
  const { id } = userInformation;
  const usersCollection = useCollection('users', 'postgres_id');

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const userSnapshot = await usersCollection.query().where('id', '==', id).dereference().snapshot();
          const { first_name, last_name, email } = userSnapshot[0];
          dispatch(updateFirstName(first_name));
          dispatch(updateLastName(last_name));
          dispatch(updateEmail(email));
        } catch (error) {
          console.error('Error in getUserInfo: ', error);
        }
      })();
    }
  }, [user, id, dispatch, usersCollection]);

  return userInformation;
};

export default useUserInfo;