import React from "react";
import axios from "axios";
import { Navbar, Nav, Form, Button, FormControl } from "react-bootstrap";
import { defaultHomePage } from "./consts";

const Navigation = () => {
  const { name, jobRole } = JSON.parse(localStorage.getItem("userInfo"));

  const redirectToHomePage = () => {
    const jobRole = JSON.parse(localStorage.getItem("userInfo")).jobRole;
    window.location = defaultHomePage[jobRole];
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
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => redirectToHomePage()}
        >
          SimpleRIS
        </Navbar.Brand>
        <Nav className="mr-auto">
          {jobRole === "technician" || jobRole === "radiologist" ? (
            <Nav.Link href="/worklist">Worklist</Nav.Link>
          ) : (
            <Nav.Link href="/appointments">Schedule</Nav.Link>
          )}
          {(jobRole === "receptionist" || jobRole === "MD") && (
            <Nav.Link href="/patients">Patients</Nav.Link>
          )}
          {jobRole === "receptionist" && (
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
