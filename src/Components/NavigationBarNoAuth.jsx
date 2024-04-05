import React from 'react'
import { Container, Col, Form, Nav, Navbar, Row } from 'react-bootstrap'
import LogoutButton from './Logout'
import { Link } from 'react-router-dom'

export default function NavigationBar() {

  return (
    <Container className='mb-3'>
        <Navbar expand="lg" className='bg-body-tertiary'>
            <Navbar.Brand href='/'>Standom</Navbar.Brand>
        </Navbar>
</Container>
  )
}
