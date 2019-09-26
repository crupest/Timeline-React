import React, { Fragment } from "react";

import "./NavUser.css";

import { User } from "./user/http-entity";
import { UserService } from "./user/user-service";
import { apiBaseUrl } from "./config";
import { Popover, MenuList, MenuItem, Typography } from "@material-ui/core";

interface NavUserProps {
  user: User;
}

interface NavUserState {
  anchorEl: Element | null;
}

class NavUser extends React.Component<NavUserProps, NavUserState> {
  constructor(props: NavUserProps) {
    super(props);

    this.state = {
      anchorEl: null
    };

    this.onClick = this.onClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onClick(event: React.SyntheticEvent) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  onClose(_: {}) {
    this.setState({
      anchorEl: null
    });
  }

  onLogout(_: React.MouseEvent) {
    UserService.getInstance().logout();
  }

  render(): React.ReactNode {
    const token = UserService.getInstance().token;
    const user = this.props.user;
    const avatarUrl = `${apiBaseUrl}/users/${user.username}/avatar?token=${token}`;
    return (
      <Fragment>
        <img
          onClick={this.onClick}
          className="nav-user-avatar"
          src={avatarUrl}
          alt="avatar"
        ></img>
        <Popover
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          onClose={this.onClose}
        >
          <MenuList>
            <MenuItem dense={true}>
              <Typography color="error" onClick={this.onLogout}>Logout</Typography>
            </MenuItem>
          </MenuList>
        </Popover>
      </Fragment>
    );
  }
}

export default NavUser;
