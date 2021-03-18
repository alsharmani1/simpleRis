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
  const authUser = () => {
    return false;
  };

  return authUser() ? (
    <Route {...rest} component={Component} />
  ) : authUser() && rest.path === "/*" ?
    <PageNotFound />
  :(
    <Redirect to="/login" />
  );
};

export default PrivateRouter;
