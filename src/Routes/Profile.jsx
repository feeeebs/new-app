import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Container, Form } from 'react-bootstrap';
import NavigationBar from "../Components/NavigationBar";
import { getAuth, sendPasswordResetEmail, verifyBeforeUpdateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAll } from '../Utilities/Redux/userSlice';
import { useCollection } from '@squidcloud/react';

// TO DO: ADD DISPLAY NAME COLUMN TO USERS TABLE IN POSTGRES
const Profile = ({ userInfo }) => {

  const auth = getAuth();
  const emailRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Set default form data
  const [formData, setFormData] = useState({
    id: userInfo.id,
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
      });
    }
  }, [userInfo]);

useEffect(() => {
  console.log('form data: ', formData);
}, [formData]);

  const usersCollection = useCollection('users', 'postgres_id'); // Reference to users collection in DB

  if (!userInfo) {
    return <div>Loading ...</div>;
  }

      // Function to update data
      const updateData = async () => {
        console.log("Running updateData");
        console.log("Form data being inserted: ", formData);
        await usersCollection.doc({ id: formData.id }).update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
        })
            .then(() => console.log("User data updated successfully"))
            .catch((err) => console.error("Error inserting user data: ", err));
        console.log("finished DB update");
    };


    // Track form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        //console.log("Form data: ", formData);
    }

      // Handle password reset
      const handlePasswordReset = async () => {
        setSuccessMessage('');
        setError('');
        sendPasswordResetEmail(auth, userInfo.email)
            .then(() => {
                // Password reset email sent!
                console.log('Password reset email sent!');
                setSuccessMessage('Password reset email sent. Please check your email for instructions.');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Error sending password reset email: ', errorCode, errorMessage);
                setError('Error sending password reset email. Please try again.');
            });
      }


       // Handle form submissions
       // TO DO -- SHOW MESSAGES ON SUBMIT FOR EMAIL/PASSWORD CHANGES TO CHECK EMAIL
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSuccessMessage('');
      setError('');
      // TO DO - validation for email and password
      console.log("handleFormSubmit running");

      // Update Firebase if email has changed
      if (emailRef.current.value) {
        console.log('updating email');
        // Sends a verification email to the user; user's email updates in postgres next time they log in
        verifyBeforeUpdateEmail(auth.currentUser, emailRef.current.value)
          .then(() => {
            console.log('Email updated!');
            setSuccessMessage('Email updated! Please check your email to verify the change.');
          }).catch((error) => {
            console.log('Error updating user email: ', error.code, error.message);
            setError('Error updating email. Please try again.');
          })
      }

      if (!error) {
        // Update Squid DB
        await updateData();
        // Update Redux
        dispatch(updateAll(formData))
        setSuccessMessage('Profile updated!');
        console.log("Check to see if it did anything");
      }

      setLoading(true);

  }


  return (
    <>
      <NavigationBar />
      <Container className='align-items-center justify-content-center' style={{ minHeight: '50vh', flexDirection: 'column' }}>
        <h2 className="text-center mb-4">{userInfo.firstName}'s Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <div>
          <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder={formData.email} ref={emailRef} onChange={handleInputChange}/>
                      <Form.Text className="text-muted">
                        Please enter the email you'd like to use with Standom.
                      </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label>Display Name</Form.Label>
                    <Form.Control type="text" name="firstName" onChange={handleInputChange} placeholder={formData.firstName} />
                      <Form.Text className="text-muted">
                        Tell us what you'd like to be called.
                      </Form.Text>
              </Form.Group>

              <Link onClick={handlePasswordReset}>Reset Password</Link>

              <div>
              <Button variant="primary" type="submit" className="mt-4">
                Submit
              </Button>
              </div>
      </Form>
      </div>
      </Container>
    </>
  );
};

export default Profile;