import { Container, Row, Col} from 'react-bootstrap';
import Signup from './Signup';


export default function Homepage() {

  // TO DO: Add useEffect to check if user is authenticated and navigate to dashboard if so
  
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
