import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux";
// import { useLogoutUserMutation } from "../services/appApi";
// import {Button} from 'react-bootstrap';
import companyLogo from '../assets/chat-Go-logo-78.png'

const Navigation = () => {
  const user = useSelector((state) => state.user);
  // const [logoutUser] = useLogoutUserMutation();
  
  //   async function handleLogout(e) {
  //     e.preventDefault();
  //     await logoutUser(user);
  //     // redirect to home page
  //     window.location.replace("/");
  // }

 
  return (
    <>
    {!user ?(
    <Navbar bg="light" expand="lg">
    <Container>
   
      <Navbar.Brand href="/"className='fw-bold d-flex gap-0 p-2'>
      <img src={companyLogo} alt='chatLogo' className='chat-logo m-0 p-0'/>
       <p className='mt-2 m-0 p-0'>Chat-Go</p>
       </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">       
          <NavLink to='/login' className='text-dark p-2 fw-bold mx-2'>Login</NavLink>
          <NavLink to='/signup' className='text-dark p-2 fw-bold mx-2'>Register</NavLink>      
                  
{/* {user && ( <>
  
          <NavDropdown title={
            <>
            <img src={user.picture} alt='profileImg' style={{ width: 30, height: 30, marginRight: 10, objectFit: "cover", borderRadius: "50%" }} />
            {user.name}
            </>
          } id="basic-nav-dropdown">
            
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          
            <NavDropdown.Item>
            <Button className='bg-dark border-0' onClick={handleLogout}>
                                        Logout
                                    </Button>
            </NavDropdown.Item>

          </NavDropdown>
          </>
)} */}
        </Nav>
      </Navbar.Collapse>
    
    </Container>
    </Navbar>
    ):<></>}
  </>
  )
}

export default Navigation;