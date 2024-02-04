import React,{useContext,useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container,Row,Col} from 'react-bootstrap';
import '../styles/Login.css'
import {Link, useNavigate } from 'react-router-dom'
import { useLoginUserMutation } from "../services/appApi";
import { AppContext } from "../context/appContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {

    const [values, setValues] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loginUser] = useLoginUserMutation();
    const { socket } = useContext(AppContext);

    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };

    const validateForm = () => {
      const { email, password } = values;
      if (email === "" && password ==="") {
        toast.error("Email and password are required.", toastOptions);
        return false;
      } else if (email === "") {
        toast.error(" email is required.", toastOptions);
        return false;
      } else if(password === ""){
        toast.error(" password is required.", toastOptions);
        return false;
      }else if(!email){
        toast.error(" email is invalid.", toastOptions);
      }else if(!password){
        toast.error(" password is invalid.", toastOptions);
      }
      return true;
    };

    const handleChange = (event) => {
      setValues({ ...values, [event.target.name]: event.target.value });
    };

    function handleLogin(e) {
      e.preventDefault();
      if (validateForm()) {
        const {email,password}=values;
        loginUser({ email,password}).then(({ data }) => {
         
          if(data) {
            // socket work
            socket.emit("new-user");
            // navigate to the chat
            navigate("/chatgo");
          }
          else if(data && data.msg) {
            toast.error(data.msg, toastOptions);
          }
          else if(error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500){
            setError(error.response.data.message);
          }
        });
      }
    }
    
    
  return (
<Container>
<Row>
  <Col lg='6' className='login-bg'>
  </Col>
  <Col lg='6' className='d-flex align-items-center  flex-direction-column mt-5 pt-5'>
  <Form className='form' onSubmit={handleLogin}>
      <Form.Group className="mb-3 form-input" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={(e) => handleChange(e)} name='email'   />
      </Form.Group>

      <Form.Group className="mb-3 form-input" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(e) => handleChange(e)} name="password" />
      </Form.Group>
      {error && <div>{error}</div>}
      <Button className='bg-dark border-0 w-100 mt-2' type="submit">
       Login
      </Button>
    <div className="py-4">
      <p className='text-center text-secondary'>
      Don't have an account? <Link to='/signup' className='text-dark p-1'>Signup</Link>
      </p>
    </div>
    </Form>
    <ToastContainer />
  </Col>
</Row>
    

</Container>
  );
}


  

export default Login