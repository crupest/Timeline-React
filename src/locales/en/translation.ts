import TranslationResource from "../scheme";

const translation: TranslationResource = {
  welcome: "Welcome to Timeline!",
  home: {
    description: `<0>This is the first Web App created by me, <1>crupest</1>. This page is the front-end of it. You can find the source code on Github (<3>front-end</3>, <5>back-end</5>). Now it is under active development by me. You are welcomed to leave any thoughts on Github!</0><1>This page will be replaced in the future.</1>`
  },
  user: {
    username: "username",
    password: "password",
    login: "login",
    noLoginPrompt: "You haven't login.",
    welcome: "Welcome, {{name}} !",
    logout: "logout",
    rememberMe: "Remember Me"
  },
  settings: {
    subheaders: {
      account: "Account",
      customization: "Customization"
    },
    languagePrimary: "Choose display language.",
    languageSecondary:
      "You language preference will be saved locally. Next time you visit this page, last language option will be used.",
    changePassword: "Change account's password."
  },
  admin: {
    title: "admin"
  }
};

export default translation;
