import React from "react";
import axios from "axios";
import { Navbar, Nav, Form, Button, FormControl } from "react-bootstrap";
import { defaultHomePage } from "./consts";

const Navigation = () => {
  const { name, userRole } = JSON.parse(localStorage.getItem("userInfo"));

  const redirectToHomePage = () => {
    const userRole = JSON.parse(localStorage.getItem("userInfo")).userRole;
    window.location = defaultHomePage[userRole];
  };

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
        <Navbar.Brand onClick={() => redirectToHomePage()}>
          SimpleRIS
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/appointments">Schedule</Nav.Link>
          <Nav.Link href="/patients">Patients</Nav.Link>
          {userRole === "receptionist" && (
            <Nav.Link href="/referrals">Referrals</Nav.Link>
          )}
        </Nav>
        <Nav inline="true">
          <div style={{ margin: "7px 8px 0", color: "white" }}>
            Welcome {name}!
          </div>
          <Button variant="outline-info" onClick={() => logout()}>
            Logout
          </Button>
        </Nav>
      </Navbar>
    </>
  );
};

export default Navigation;
