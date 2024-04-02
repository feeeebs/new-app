import React, { useEffect } from 'react'
import { Container, Row, Col} from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom';

import Signup from './Signup';
import { AuthProvider } from '../Utilities/Firebase/AuthContext';



export default function Homepage() {

  const { user } = useAuth0();
  const navigate = useNavigate();

  console.log(user);
  // Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (user) {
      // think about having a loading page so it's not so uggo while auth0 checks authentication
      navigate('/dashboard');
    }
  }, [user]);
  
  return (
    <>
      <Container fluid>
        <Row >
          <Col>
            <div>
              <h1 className='text-center'>Standom</h1>
            </div>
            <div>
              <h3 className='text-center'>Where every day is The Best Day</h3>
            </div>
            <div>
              <h5 className='text-center'>Sign in or sign up to start stanning</h5>
              <Signup />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}
