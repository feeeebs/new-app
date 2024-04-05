import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Container, Card, Form, Button } from 'react-bootstrap';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useCollection } from '@squidcloud/react';

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

    const usersCollection = useCollection('users', 'postgres_id'); // Reference to users collection in DB

    // TO DO: ADD ERROR FOR EMAIL EXISTS

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setLoading(false);
            return setError('Passwords do not match');
        }

        createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
            .then((userCredential) => {
                const insertNewUser = async () => {
                    console.log("Running inserNewUser");
                    const id = userCredential.user.uid;
                    await usersCollection.doc({ id: id }).insert({
                        id: id,
                        first_name: firstNameRef.current.value,
                        last_name: lastNameRef.current.value,
                        email: emailRef.current.value,
                    })
                        .then(() => console.log("New user inserted into DB successfully"))
                        .catch((err) => console.error("Error inserting new user into DB: ", err));
                  }
                insertNewUser();
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
