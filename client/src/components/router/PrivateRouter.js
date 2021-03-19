import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Navigation from "../common/Navigation";
import PageNotFound from "../common/PageNotFound";

const PrivateRouter = ({ component: Component, ...rest }) => {
  const authUser = () => localStorage.getItem("userInfo");

  return authUser() ? (
    <>
      <Navigation />
      <Route {...rest} component={Component} />
    </>
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRouter;
