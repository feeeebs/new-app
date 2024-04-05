import React from 'react'
import { Container, Navbar } from 'react-bootstrap'

export default function NavigationBarNoAuth() {

  return (
    <Container className='mb-3'>
        <Navbar expand="lg" className='bg-body-tertiary'>
            <Navbar.Brand href='/'>Standom</Navbar.Brand>
        </Navbar>
</Container>
  )
}
