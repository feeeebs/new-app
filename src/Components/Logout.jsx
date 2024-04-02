import React from "react";
import { Button } from "react-bootstrap";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/");
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