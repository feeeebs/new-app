import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const auth = getAuth();

  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    
    setError('');
    setLoading(true);

    signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('user: ', user);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        setError('Failed to log. Check your email or password and try again.');
        setLoading(false);
      })
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
                <h2 className='text-center mb-4'>Log In</h2>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id='email'>
                        <Form.Label className='text-left'>Email</Form.Label>
                        <Form.Control type='email' ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id='password'>
                        <Form.Label className='text-left'>Password</Form.Label>
                        <Form.Control type='password' ref={passwordRef} required />
                    </Form.Group>
                    <Button disabled={loading} className='w-100 mt-3' type='submit' >Log In</Button>
                </Form>
            </Card.Body>  
        </Card>
        <div className='w-100 text-center mt-2'>
            <Link to='/reset-password'>Forgot Password?</Link>
        </div>
        <div className='w-100 text-center mt-2'>
            New to Standom? <Link to='/signup'>Sign Up</Link>
        </div>
        </div>
    </Container>
    </>
  )
}
