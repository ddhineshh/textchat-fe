import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Login.css";
import { useSignupUserMutation } from "../services/appApi";
import { Link,useNavigate} from "react-router-dom";
import Profile from '../assets/profile.jpg'

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [signupUser] = useSignupUserMutation();
  const navigate = useNavigate();

 function validateImg(e) {
  const file = e.target.files[0];
  if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
  } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
  }
}

async function uploadImage(){
  const data = new FormData();
  data.append("file", image);
  data.append('upload_preset','2672dsvhjnbne');
  try{
    setUploadingImg(true);
    let res = await fetch("https://api.cloudinary.com/v1_1/dsotbcpm6/image/upload", {
                method: "post",
                body: data,
              });
              const urlData = await res.json();
              setUploadingImg(false);
              return urlData.url;
          } catch (error) {
              setUploadingImg(false);
              console.log(error);
          }
      }
  
  async function handleSignup(e) {
    e.preventDefault();
    if (!image || uploadingImg) return alert("Please upload your profile picture");
    const url = await uploadImage(image);
    console.log(url);
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
          console.log(data);
          navigate("/chatgo");
      }
  });
  }
  return (
    <Container>
      <Row>
      <Col lg="6" className="signup-bg"></Col>
        <Col
          lg="6"
          className="d-flex align-items-center  flex-direction-column mt-5 "
        >
          <Form className="form" onSubmit={handleSignup}>
            

            <div className="signup-profile-pic__container">
              <img
                src={imagePreview || Profile}
                className="signup-profile-pic"
                alt="loading"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon rounded-5"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={validateImg}
              />
            </div>
            <Form.Group className="mb-3 form-input" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 form-input" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 form-input" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </Form.Group>
            <Button className="bg-dark border-0 w-100 mt-2" type="submit">
             {uploadingImg ? 'Signing is Processed...' :"Signup"}
            </Button>
            <div className="py-4">
              <p className="text-center text-secondary">
                Already have an account?{" "}
                <Link to="/login" className="text-dark p-1">
                  Login
                </Link>
              </p>
            </div>
          </Form>
        </Col>
       
      </Row>
    </Container>
  );
};

export default Signup;
