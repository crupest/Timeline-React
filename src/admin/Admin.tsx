import React from "react";

import { AppBar } from "../common/AppBar";
import { PageProps } from "../PageProps";

class Admin extends React.Component<PageProps> {
  constructor(props: PageProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <AppBar user={this.props.user}></AppBar>
        <div>Admin Page Work!</div>
      </div>
    );
  }
}

export default Admin;
