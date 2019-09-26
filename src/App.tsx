import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  NavLink
} from "react-router-dom";
import { Subscription } from "rxjs";

import { AppBar } from "@material-ui/core";

import logo from "./logo.svg";
import "./App.css";

import { User, UserService } from "./user/user-service";

import Login from "./user/Login";
import Loading from "./common/Loading";
import NavUser from "./NavUser";

const Home: React.FC = () => {
  return <div> Home Page!</div>;
};

const NoMatch: React.FC = () => {
  return <div>Ah-oh, 404!</div>;
};

interface AppState {
  user: User | null | undefined;
}

class App extends React.Component<{}, AppState> {
  private userSubscription!: Subscription;

  constructor(props: {}) {
    super(props);
    this.state = {
      user: undefined
    };

    UserService.getInstance().checkSavedLoginState();
  }

  public componentDidMount() {
    this.userSubscription = UserService.getInstance().user$.subscribe(u =>
      this.setState({ user: u })
    );
  }

  public componentWillUnmount() {
    this.userSubscription.unsubscribe();
  }

  public render(): React.ReactNode {
    let userArea: React.ReactNode;
    const user = this.state.user;
    if (user === undefined) {
      userArea = <Loading size={50} />;
    } else if (user === null) {
      userArea = (
        <NavLink to="/login" activeClassName="no-display">
          login
        </NavLink>
      );
    } else {
      userArea = <NavUser user={user} />;
    }

    return (
      <Router>
        <AppBar>
          <div className="app-bar-body">
            <Link className="app-bar-link" to="/">
              <img width="30" height="30" src={logo} alt="logo" />
              Timeline
            </Link>
            <span className="fill-remaining-space"></span>
            {userArea}
          </div>
        </AppBar>
        <div style={{height:50}}></div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;
