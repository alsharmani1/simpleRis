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
import Referrals from "./components/referrals/Referrals";
import UploadImages from "./components/referrals/UploadImages";

const App = (props) => {
  const jobRole = JSON.parse(localStorage.getItem("userInfo"))?.jobRole;
  const role = jobRole === "technician" || jobRole === "radiologist"
  return (
    <ToastProvider>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <PrivateRouter exact path="/" component={Login}/>
          <PrivateRouter exact path={role ? "/worklist" : "/appointments"} component={Schedule} />
          <PrivateRouter exact path={role ? "/worklist/:id" : "/appointments/:id"} component={role ? UploadImages : AppointmentDetails} />
          <PrivateRouter exact path="/appointments/new" component={NewAppointment} />
          <PrivateRouter exact path="/patients" component={PatientSearch} />
          <PrivateRouter exact path="/patients/:id" component={PatientProfile} />
          <PrivateRouter exact path="/referrals" component={Referrals} />
          <PrivateRouter path="/*" component={PageNotFound} />
        </Switch>
      </Router>
    </ToastProvider>
  );
};

export default App;
