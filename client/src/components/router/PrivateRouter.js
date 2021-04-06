import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { defaultHomePage } from "../common/consts";
import Navigation from "../common/Navigation";
import PageNotFound from "../common/PageNotFound";

const PrivateRouter = ({ component: Component, ...rest }) => {
  const authUser = () => JSON.parse(localStorage.getItem("userInfo"))?.userRole;

  return authUser() && rest.location.pathname === "/" ? (
    (window.location = defaultHomePage[authUser()])
  ) : authUser() ? (
    <>
      <Navigation />
      <Route {...rest} component={Component} />
    </>
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRouter;
