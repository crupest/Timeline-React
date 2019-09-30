import React from "react";
import { Tabs, Tab } from "@material-ui/core";
import {
  withRouter,
  RouteComponentProps,
  Redirect,
  Route,
  Switch
} from "react-router";

import { AppBar } from "../common/AppBar";
import { PageProps } from "../PageProps";

interface AdminProps extends PageProps, RouteComponentProps {}

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
        <Route path={`${this.props.match.path}/${name}`} exact>
          <AppBar user={this.props.user}>
            <Tabs value={name} onChange={this.onTabChange}>
              <Tab label="Users" value="users" />
              <Tab label="More" value="more" />
            </Tabs>
          </AppBar>
          {body}
        </Route>
      );
    };

    return (
      <div>
        <Redirect
          from={this.props.match.path}
          to={`${this.props.match.path}/users`}
          exact
        />
        <Switch>
          {createRoute("users", <div>Users Page Works</div>)}
          {createRoute("more", <div>More Page Works</div>)}
        </Switch>
      </div>
    );
  }
}

export default withRouter(Admin);
