import React from "react";
import PropTypes from "prop-types";

const OnSubmitErrorMessage = ({ type, message, ...rest }) => {
  return type === "success" ? (
    <div
      className={`onSubmitMessage ${rest.className}`}
      style={{
        marginBottom: 10,
        color: "#11b72d",
        ...rest.style,
      }}
    >
      {message}
    </div>
  ) : type === "error" ? (
    <div
      className={`onSubmitMessage ${rest.className}`}
      style={{
        marginBottom: 10,
        color: "red",
        ...rest.style,
      }}
    >
      {message}
    </div>
  ) : (
    ""
  );
};

OnSubmitErrorMessage.propTypes = {
  type: PropTypes.oneOf(["success", "error"]),
};
export default OnSubmitErrorMessage;
