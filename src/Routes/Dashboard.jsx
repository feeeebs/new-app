import React from 'react';
import { Container, Row } from 'react-bootstrap';
import MyFavoriteLyrics from '../Components/MyFavoriteLyrics';
import NavigationBar from '../Components/NavigationBar';
import QuizParent from '../Components/QuizParent';

export default function Dashboard({ userInfo }) {

    if (!userInfo) {
        return <div>Loading...</div>;
    }
    
    
  return (
    <>
        <NavigationBar />
        <div className='text-center mb-4'>
            <h1>Welcome, {userInfo.firstName}!</h1>
        </div>
        <Container>
            <Row>
                <QuizParent />
            </Row>
            <Row>
                <MyFavoriteLyrics />
            </Row>
        </Container>
    </>
  )
}