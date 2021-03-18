import React from "react";
import Login from "./components/Login";
import PrivateRouter from "./components/router/PrivateRouter";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import UserSearch from "./components/general/UserSearch";
const App = (props) => {
  return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <PrivateRouter exact path="/search" component={UserSearch} />
        </Switch>
      </Router>
  );
};

export default App;
