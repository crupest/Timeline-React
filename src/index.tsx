import "regenerator-runtime";
import "core-js/modules/es.promise";
import "core-js/modules/es.array.iterator";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import App from "./App";

import { checkUserLoginState } from "./data/user";

checkUserLoginState();

ReactDOM.render(<App />, document.getElementById("app"));
