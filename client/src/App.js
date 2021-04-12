import React from "react";
import Login from "./components/Login";
import PrivateRouter from "./components/router/PrivateRouter";
import { ToastProvider } from 'react-toast-notifications';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import PatientSearch from "./components/patients/PatientSearch";
import PageNotFound from "./components/common/PageNotFound";
import Schedule from "./components/schedule/Schedule";
import NewAppointment from "./components/schedule/NewAppointment";
import PatientProfile from "./components/patients/PatientProfile";
import AppointmentDetails from "./components/schedule/AppointmentDetails";

const App = (props) => {
  return (
    <ToastProvider>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <PrivateRouter exact path="/appointments" component={Schedule} />
          <PrivateRouter exact path="/appointments/:id" component={AppointmentDetails} />
          <PrivateRouter exact path="/appointments/new" component={NewAppointment} />
          <PrivateRouter exact path="/patients" component={PatientSearch} />
          <PrivateRouter exact path="/patients/:id" component={PatientProfile} />
          <PrivateRouter exact path="/referrals" component={PatientProfile} />
          <PrivateRouter path="/*" component={PageNotFound} />
        </Switch>
      </Router>
    </ToastProvider>
  );
};

export default App;
