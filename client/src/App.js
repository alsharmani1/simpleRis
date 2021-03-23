import React from "react";
import Login from "./components/Login";
import PrivateRouter from "./components/router/PrivateRouter";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import UserSearch from "./components/search/UserSearch";
import PageNotFound from "./components/common/PageNotFound";
import Schedule from "./components/schedule/Schedule";

const App = (props) => {
  return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <PrivateRouter exact path="/schedule" component={Schedule} />
          <PrivateRouter exact path="/patients" component={UserSearch} />
          <PrivateRouter path="/*" component={PageNotFound} />
        </Switch>
      </Router>
  );
};

export default App;
