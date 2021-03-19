import React from "react";
import axios from "axios";
import { Navbar, Nav, Form, Button, FormControl } from "react-bootstrap";

const Navigation = () => {
  const { name } = JSON.parse(localStorage.getItem("userInfo"));

  const logout = () => {
    axios
      .get("/api/logout")
      .then((res) => {
        localStorage.clear();
        window.location = "/login";
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#">SimpleRIS</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/schedule">Schedule</Nav.Link>
          <Nav.Link href="/patients">Patients</Nav.Link>
        </Nav>
        <Nav inline>
          <div style={{ margin: "7px 8px 0", color: "white" }}>
            Welcome {name}!
          </div>
          <Button
            variant="outline-info"
            onClick={() => logout()}
          > 
            Logout
          </Button>
        </Nav>
      </Navbar>
    </>
  );
};

export default Navigation;
