import React from "react";
import "./Login.css";

import Loading from "../common/Loading";

interface LoginState {
  username: string;
  password: string;
  process: boolean;
}

class Login extends React.Component<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      username: "",
      password: "",
      process: false
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
                type="checkbox"
                disabled={this.state.process}
              />
              <label htmlFor="rememberMe">Remember me!</label>
            </div>
          </div>
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

export default Login;
