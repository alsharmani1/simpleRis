import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import axios from "axios";

const UserSearch = (props) => {
  const [state, setState] = useState({});

  const onChange = (e) => {
    e.preventDefault();
    setState((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // axios
    //   .post("/api/patient/search", state)
    //   .then((res) => {
    //     const patients = res.data;
    //     // save data to state if you don't know something ; console log it
    //     setState((state) => ({ ...state, patients }));
    //   })
    //   .catch((error) => {
    //     // console log the error or do something with it
    //     console.log(error);
    //   });

    const patients = [
        {
            id: 1,
            dob: "07/19/1996",
            firstName: "Abdulla",
            middleInitial: "A",
            insuranceNum: "5215151",
            lastName: "Abdulla",
            phone: "54554545"
        },
        {
            id: 2,
            dob: "08/10/1999",
            firstName: "Cedric",
            middleInitial: "A",
            insuranceNum: "5215151",
            lastName: "Baaklini",
            phone: "54554545"
        },

        {
           id: 3,
           dob: "04/20/1969",
           firstName: "Doom",
           middleInitial: "G",
           insuranceNum: "66624601",
           lastName: "Slayer",
           phone: "6662493"
        }
    ]

    setState((state) => ({ ...state,  patients }));

  };

  return (
    <div>
      <Form className="container mt-5">
        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Phone #</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>DOB</Form.Label>
            <Form.Control
              type="text"
              name="dob"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Insurance #</Form.Label>
            <Form.Control
              type="text"
              name="insuranceNum"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
        </Form.Row>

        <Button
          variant="primary"
          type="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </Button>
      </Form>

      <div>
        <h3 className="text-center mt-3">PATIENTS RESULTS: </h3>

        {/* DISPLAY THE RESULTS WITH THE .map FUNCTION*/}

        const imageSizes = [
          { name: "horizontal", width: 600, height: 380 },
          { name: "vertical", width: 400, height: 650 },
          { name: "thumbnail", width: 300, height: 300 },
        ];

        imageSizes.map((a) => {
          const capitalizedName = a.name[0].toUpperCase() + a.name.slice(1);
          return ${capitalizedName} image - ${a.width} x ${a.height};
        });

        const stringifyImageSizes = (imageSizes) => {
          return imageSizes.map((a) => {
            const capitalizedName = a.name[0].toUpperCase() + a.name.slice(1);
            return ${capitalizedName} image - ${a.width} x ${a.height};
          });
        };

        const Images = () => {
          const imageSizes = [
            { name: "horizontal", width: 600, height: 380 },
            { name: "vertical", width: 400, height: 650 },
            { name: "thumbnail", width: 300, height: 300 },
          ];

          const normalizedImageStrings = stringifyImageSizes(imageSizes);

          return (
            <div className="images">
            {normalizedImageStrings.map((s) => (
              <div className="image-type">{s}</div>
            ))}
            </div>
          );
        };

      </div>
    </div>
  );
};

export default UserSearch;
