import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from "react-redux";
import companyLogo from '../assets/chat-Go-logo-78.png'


const Welcome = () => {
    const user = useSelector((state) => state.user);
  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center mt-5 pt-5 h-75">
      <Row>
        <Col className="text-center">
          <img src={companyLogo} alt="ChatGo Logo" className='w-50' />
          <h1>Welcome <span className='text-warning fw-bold'>{user.name}!</span></h1>
          <p>Keep your phone connected to ChatGoApp to use on your computer.</p>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button className='bg-dark border-0'>" Stay connected, chat away! "</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
