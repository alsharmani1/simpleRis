import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Login from "./components/Login";

const App = (props) => {
  return <Router>
    <Switch>
      {/* <Route exact path="/login" component="" /> */}
      <Route exact path="/login" component={Login} />
      {/* <Route exact path="/" component="" />
      <Route exact path="/" component="" />
      <Route exact path="/" component="" />
      <Route exact path="/" component="" /> */}
    </Switch>
  </Router>
}

export default App;
