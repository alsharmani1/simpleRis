import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import "../assests/css/login.css";

const Login = (props) => {
  const [state, setState] = useState({ username: "", password: "" });

  const onChange = (e) => {
      e.preventDefault()
      console.log(e)
    setState((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    axios
      .get("/api/getUserInfo")
      .then((res) => {
          
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login-page-container">
      <h2 className="login-header text-center">Welcome to SimpleRIS</h2>
      <Form className="login-form-container">
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="username"
            placeholder="Enter email"
            value={state.username}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={state.password}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <div className="text-center">
          <Button className="login-submit-btn" variant="primary" type="submit" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
