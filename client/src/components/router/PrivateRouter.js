import axios from "axios";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { defaultHomePage } from "../common/consts";
import Navigation from "../common/Navigation";

const PrivateRouter = ({ component: Component, ...rest }) => {
  const [state, setState] = useState({ fetching: true, userRole: "" });
  useEffect(() => {
    authUser();
  }, []);
  const getUserInfo = () => {
    if (localStorage.getItem("userInfo")) {
      return JSON.parse(localStorage.getItem("userInfo"));
    } else return false;
  };
  const authUser = async () => {
    try {
      const auth = await axios.get(
        `/api/auth/users/${getUserInfo()?.username}`
      );
      auth.data && localStorage.setItem("userInfo", JSON.stringify(auth.data));
      setState({ fetching: false, userRole: getUserInfo()?.userRole });
    } catch (error) {
      setState((state) => ({ ...state, fetching: false }));
    }
  };

  if (state.fetching) return "";
  return !state.fetching && state.userRole && rest.location.pathname === "/" ? (
    (window.location = defaultHomePage[state.userRole])
  ) : state.userRole ? (
    <>
      <Navigation />
      <Route {...rest} component={Component} />
    </>
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRouter;
