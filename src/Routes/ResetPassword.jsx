import React, { useState, useRef } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Alert, Container, Form, Button } from 'react-bootstrap';
import NavigationBarNoAuth from '../Components/NavigationBarNoAuth';

export default function ResetPassword() {
    const auth = getAuth();
    const emailRef = useRef();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Function to handle password reset
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
      
        try {
          await sendPasswordResetEmail(auth, emailRef.current.value);
          setSuccessMessage('Password reset email sent. Please check your email for instructions.');
          console.log('Password reset email sent!');
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setError('The email address is not valid. Please check and try again.');
            } else if (error.code === 'auth/missing-email') {
                setError('Please enter an email address.');
            } else {
                console.log('Error sending password reset email: ', error.code, error.message);
            }
        }
      }

  return (
    <>
        <NavigationBarNoAuth />
        <Container className='align-items-center justify-content-center' style={{ minHeight: '50vh', flexDirection: 'column' }}>
            <h2 className='text-center mb-4'>Reset Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handlePasswordReset}>
                    <Form.Group className="mb-3" id='email'>
                        <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" ref={emailRef}/>
                            <Form.Text className="text-muted">
                                Please enter the email you use with Standom, and we'll send you instructions to reset your password.
                            </Form.Text>
                    </Form.Group>
                <Button className='mt-3' type='submit'>Reset Password</Button>
            </Form>
        </Container>
    </>
  )
}
