import { Container, Row, Col} from 'react-bootstrap';
import Signup from './Signup';
import { useEffect } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { auth } from '../Utilities/Firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';


export default function Homepage() {
  const user = useIdToken(auth);
  const navigate = useNavigate();
  
  // Check if user is authenticated and navigate to dashboard if so
  // useEffect(() => {
  //   if (user) {
  //     navigate('/dashboard');
  //   }
  // }, [])
  
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
