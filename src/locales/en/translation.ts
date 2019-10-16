import TranslationResource from "../scheme";

const translation: TranslationResource = {
  welcome: "Welcome to Timeline!",
  home: {
    description: {
      p1: {
        0: "This is the first Web App created by me, ",
        2: ". This page is the front-end of it. You can find the source code on Github (",
        3: "front-end",
        4: ", ",
        5: "back-end",
        6: "). Now it is under active development by me. You are welcomed to leave any thoughts on Github!"
      },
      p2: {
        0: "This page will be replaced in the future."
      }
    }
  },
  user: {
    username: "username",
    password: "password",
    login: "login",
    noLoginPrompt: "You haven't login.",
    welcome0: "Welcome, ",
    welcome1: " !",
    logout: "logout",
    rememberMe: "Remember Me"
  },
  settings: {
    languagePrimary: "Choose display language.",
    languageSecondary:
      "You language preference will be saved locally. Next time you visit this page, last language option will be used."
  },
  admin: {
    title: "admin"
  }
};

export default translation;
