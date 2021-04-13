import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import uploadImage from "../../assests/images/upload.svg";
import { useToasts } from "react-toast-notifications";

const UploadImages = (props) => {
  const { addToast } = useToasts();

  const [state, setState] = useState({
    formData: [],
    fileNames: [],
    appointmentInfo: {},
    error: "",
  });
  useEffect(() => {
    axios
      .get(`/api/appointment/${props.match.params.id}`)
      .then((res) =>
        setState((state) => ({ ...state, appointmentInfo: res.data }))
      )
      .catch((error) =>
        addToast(error.response.data, {
          appearance: "error",
          autoDismiss: true,
        })
      );
  }, []);

  const renderFileNames = () => {
    let elementValue = ""
    if(state.fileNames.length) {
      state.fileNames.map(name => {
        elementValue = elementValue ? elementValue + `        ${name}` : name
      })
      return <div>{elementValue}</div>
    }

  }
  const onChange = (e) => {
    setState((state) => ({ ...state, error: "" }));
    if (e.target.files.length > 3) {
      setState((state) => ({
        ...state,
        error: "Cannot select more than 3 files!",
      }));
    } else {
      console.log(e.target.files);

      let fileNames = [];
      let files = [];
      Object.keys(e.target.files).map((key, index) => {
        const file = e.target.files[key];
        console.log(file.name);

        fileNames.push(file.name);
        files.push(file);
      });
      setState((state) => ({ ...state, fileNames, files }));
    }
  };

  const handleSubmit = (e) => {
    const formData = new FormData();
    state.files.map((file, index) => {
      formData.append(`images`, file);
    });

    e.preventDefault();
    axios
      .post(
        `/api/worklist/upload/${state.appointmentInfo.appointmentId}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        addToast(res.data, {
          appearance: "success",
          autoDismiss: true,
        })
      })
      .catch((error) => {
        addToast(error.response.data, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  return (
    <div
      className="image-upload"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

        <input
          type="file"
          name="upload"
          style={{ display: "none" }}
          id="upload"
          multiple
          onChange={(e) => onChange(e)}
        />
        <label
          style={{ width: "150px", position: "relative", top: 25 }}
          htmlFor="upload"
        >
          <img src={uploadImage} style={{ width: "150px", margin: "0 auto" }} />
        </label>
        <div>Upload Images: max 3</div>
        {renderFileNames()}
        {state.error && <div style={{ color: "red" }}>{state.error}</div>}

        <Button
          className="image-upload-btn mt-3"
          type="submit"
          onClick={(e) => handleSubmit(e)}
          disabled={state.fileNames.length === 0}
        >
          Submit
        </Button>

    </div>
  );
};

export default UploadImages;
