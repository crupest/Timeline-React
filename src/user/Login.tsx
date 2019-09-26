import React from "react";
import "./Login.css";

import Loading from "../common/Loading";
import { UserService } from "./user-service";
import { withRouter, RouteComponentProps } from "react-router";

interface LoginState {
  username: string;
  password: string;
  rememberMe: boolean;
  process: boolean;
  error: object | string | undefined;
}

class Login extends React.Component<RouteComponentProps, LoginState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      rememberMe: false,
      process: false,
      error: undefined
    };

    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onInput(event: React.SyntheticEvent) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.setState({
        [target.name]: target.value
      } as any);
    }
  }

  onSubmit(event: React.SyntheticEvent) {
    this.setState({
      process: true
    });
    UserService.getInstance()
      .login(
        {
          username: this.state.username,
          password: this.state.password
        },
        this.state.rememberMe
      )
      .then(
        _ => {
          this.props.history.goBack();
        },
        e => {
          this.setState({
            error: e,
            process: false
          });
        }
      );
    event.preventDefault();
  }

  render(): React.ReactNode {
    return (
      <form className="login-form">
        <h1 className="login-title">Welcome to Timeline!</h1>
        <div className="login-body">
          <div className="login-input-box">
            <div className="login-item">
              <label className="login-label">username</label>
              <input
                name="username"
                disabled={this.state.process}
                className="login-input"
                onChange={this.onInput}
                value={this.state.username}
              />
            </div>
            <div className="login-item">
              <label className="login-label">password</label>
              <input
                name="password"
                disabled={this.state.process}
                className="login-input"
                type="password"
                onChange={this.onInput}
                value={this.state.password}
              />
            </div>
            <div>
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                onChange={this.onInput}
                disabled={this.state.process}
              />
              <label htmlFor="rememberMe">Remember me!</label>
            </div>
          </div>
          {this.state.error ? (
            <div className="login-error-message">
              {this.state.error.toString()}
            </div>
          ) : null}
          <div className="login-submit-box">
            {this.state.process ? (
              <Loading size={50} />
            ) : (
              <button className="cru-button create" onClick={this.onSubmit}>
                Login
              </button>
            )}
          </div>
        </div>
      </form>
    );
  }
}

export default withRouter(Login);
