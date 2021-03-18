import React from "react";
import { Navbar, Nav, Form, Button, FormControl} from "react-bootstrap";

const Navigation = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">SimpleRIS</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Nav inline>
          <Button variant="outline-info" onClick={() => window.location = "/login"} >Login</Button>
        </Nav>
      </Navbar>
    </>
  );
};

export default Navigation;
