import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('running auth useEffect')
    console.log('auth: ', auth);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is signed out
        console.log("about to navigate?");
        navigate('/', { replace: true });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);

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