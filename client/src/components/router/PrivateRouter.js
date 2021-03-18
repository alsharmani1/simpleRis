import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Navigation from "../common/Navigation";

const PrivateRouter = ({ component: Component, ...rest }) => {
  const authUser = () => {
    return false;
  };

  return authUser() ? (
    <Route {...rest} component={Component} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRouter;
