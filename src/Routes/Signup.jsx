import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Container, Card, Form, Button } from 'react-bootstrap';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const auth = getAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
      const [isLoggedIn, setIsLoggedIn] = useState(false);

    // TO DO: ADD ERROR FOR EMAIL EXISTS
    // TO DO: WRITE FUNCTION TO ADD USER F/L NAMES TO DB

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setLoading(false);
            return setError('Passwords do not match');
        }

        createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
            .then((userCredential) => {
                // Signed up
                // const user = userCredential.user; <-- do i need that for anything? maybe can run a function here to add user to DB
                // navigate('/dashboard');
                setIsLoggedIn(true);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
            setLoading(false);
    }

    useEffect(() => {
        if (isLoggedIn) {
          navigate('/dashboard');
        }
      }, [isLoggedIn]);

  return (
    <>
    <Container className='d-flex align-items-center justify-content-center' style={{ minHeight: '50vh' }}>
        <div className='w-100' style={{ maxWidth: '400px' }}>
        <Card>
            <Card.Body>
                <h2 className='text-center mb-4'>Sign Up</h2>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                <Form.Group id='first-name'>
                        <Form.Label className='text-left'>First Name</Form.Label>
                        <Form.Control type='text' ref={firstNameRef} required />
                    </Form.Group>
                    <Form.Group id='last-name'>
                        <Form.Label className='text-left'>Last Name</Form.Label>
                        <Form.Control type='text' ref={lastNameRef} required />
                    </Form.Group>
                    <Form.Group id='email'>
                        <Form.Label className='text-left'>Email</Form.Label>
                        <Form.Control type='email' ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id='password'>
                        <Form.Label className='text-left'>Password</Form.Label>
                        <Form.Control type='password' ref={passwordRef} required />
                    </Form.Group>
                    <Form.Group id='password-confirm'>
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type='password' ref={passwordConfirmRef} required />
                    </Form.Group>
                    <Button disabled={loading} className='w-100 mt-3' type='submit' >Sign Up</Button>
                </Form>
            </Card.Body>  
        </Card>
        <div className='w-100 text-center mt-2'>
            Already have an account? <Link to="/login">Log In</Link>
        </div>
        </div>
    </Container>
    </>
  )
}
