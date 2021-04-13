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

  const formData = new FormData();
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
      Object.keys(e.target.files).map((key) => {
        const file = e.target.files[key];
        fileNames.push(file.name);
        formData.append(file.name, file, file.name);
      });
      setState((state) => ({ ...state, fileNames, formData }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/api/worklist/upload/${state.appointmentInfo.appointmentId}`, {formData: state.formData, appointmentInfo: state.appointmentInfo})
      .then((res) =>
        addToast(res.data, {
          appearance: "success",
          autoDismiss: true,
        })
      )
      .catch((error) =>
        addToast(error.response.data, {
          appearance: "error",
          autoDismiss: true,
        })
      );
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
      {state.error && <div style={{ color: "red" }}>{state.error}</div>}

      <Button
        className="image-upload-btn mt-3"
        disabled={state.fileNames.length === 0}
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </Button>
    </div>
  );
};

export default UploadImages;
