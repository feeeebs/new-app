import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateIsLoggedIn } from "../Utilities/Redux/userSlice";

const LogoutButton = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('running auth useEffect')
    console.log('auth: ', auth);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is signed out
        console.log("about to navigate?");
        dispatch(updateIsLoggedIn(false));
        return navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error(error);
      });
  }


  return (
    <Button onClick={handleLogout}>
      Log Out
    </Button>
  );
};

export default LogoutButton;