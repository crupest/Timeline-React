import React, { Fragment } from "react";
import { Tabs, Tab } from "@material-ui/core";
import {
  withRouter,
  RouteComponentProps,
  Redirect,
  Route,
  Switch
} from "react-router";

import { UserWithToken } from "../services/user";

import { AppBar } from "../common/AppBar";
import UserAdmin from "./UserAdmin";

interface AdminProps extends RouteComponentProps {
  user: UserWithToken;
}

class Admin extends React.Component<AdminProps> {
  constructor(props: AdminProps) {
    super(props);

    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(_: React.ChangeEvent<{}>, newValue: string) {
    this.props.history.push(`${this.props.match.url}/${newValue}`);
  }

  render() {
    const createRoute = (
      name: string,
      body: React.ReactNode
    ): React.ReactNode => {
      return (
        <Route path={`${this.props.match.path}/${name}`}>
          <AppBar user={this.props.user}>
            <Tabs value={name} onChange={this.onTabChange}>
              <Tab label="Users" value="users" />
              <Tab label="More" value="more" />
            </Tabs>
          </AppBar>
          <div style={{ height: 104 }} />
          {body}
        </Route>
      );
    };

    return (
      <Fragment>
        <Switch>
          <Redirect
            from={this.props.match.path}
            to={`${this.props.match.path}/users`}
            exact
          />
          {createRoute("users", <UserAdmin user={this.props.user} />)}
          {createRoute("more", <div>More Page Works</div>)}
        </Switch>
      </Fragment>
    );
  }
}

export default withRouter(Admin);
