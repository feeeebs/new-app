import React from 'react';
import { Container, Row } from 'react-bootstrap';
import MyFavoriteLyrics from '../Components/MyFavoriteLyrics';
import NavigationBar from '../Components/NavigationBar';
import QuizParent from '../Components/QuizParent';
import { useSelector } from 'react-redux';

export default function Dashboard({ userInfo }) {

    // Store initial user info in variables to use here
    const userInformation = useSelector(state => state.user.userInfo);
    const firstName = userInformation.firstName;

    
  return (
    <>
        <NavigationBar />
        {userInformation ? (
        <>
          <div className='text-center mb-4'>
            <h1>Welcome, {firstName}!</h1>
          </div>
          <Container>
            <Row>
              <QuizParent quizStatus={userInfo.albumQuizTaken} />
            </Row>
            <Row className='mt-3'>
              <MyFavoriteLyrics />
            </Row>
          </Container>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}
