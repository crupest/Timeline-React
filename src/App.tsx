import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  NavLink
} from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

import Login from "./user/Login";
import { User, UserService } from "./user/user-service";
import Loading from "./common/Loading";
import { Subscription } from "rxjs";

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
      userArea = <Loading size={40} />;
    } else if (user === null) {
      userArea = (
        <NavLink to="/login" activeClassName="no-display">
          login
        </NavLink>
      );
    } else {
      //TODO: Complete this.
    }

    return (
      <Router>
        <nav>
          <Link to="/">
            <img width="30" height="30" src={logo} alt="logo" />
            Timeline
          </Link>
          <span className="fill-remaining-space"></span>
          {userArea}
        </nav>
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
