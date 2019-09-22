import React from "react";
import { BrowserRouter as Router, Route, Link, Switch, NavLink } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import Login from "./user/Login";


const Home: React.FC = () => {
  return <div> Home Page!</div>;
};

const NoMatch: React.FC = () => {
  return <div>Ah-oh, 404!</div>;
};

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/">
          <img width="30" height="30" src={logo} alt="logo"/>
          Timeline
        </Link>
        <span className="fill-remaining-space"></span>
        <NavLink to="/login" activeClassName="no-display">login</NavLink>
      </nav>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route component={NoMatch} />
      </Switch>
    </Router>
  );
};

export default App;
