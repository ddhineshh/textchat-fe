import React from "react";
import { Row, Col } from "react-bootstrap";
import {Button} from 'react-bootstrap'
import '../styles/Home.css'
import { useSelector } from "react-redux";
import {Link} from 'react-router-dom'

const Home = () => {
  const user = useSelector((state) => state.user);
  return (
    <Row>
      <Col
        lg="6"
        className="d-flex flex-direction-coulumn align-items-center justify-content-end"
      >
        <div>
          <h1>Share the world with your friends</h1>
          <p>chat app lets you connect with the world</p>
          { !user && (
          <Link to="/login">
            <Button className="bg-dark border-0">
              Get started <i className="fa-solid fa-comments"></i>
            </Button>
          </Link>
)}
          { user && (
          <Link to="/chatgo">
            <Button className="bg-dark border-0">
              Get started <i className="fa-solid fa-comments"></i>
            </Button>
          </Link>
)}
        </div>
        
      </Col>
      <Col lg='6' className="home-bg">
      </Col>
    </Row>
  );
};

export default Home;
