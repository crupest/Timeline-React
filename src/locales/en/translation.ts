import TranslationResource from "../scheme";

const translation: TranslationResource = {
  welcome: "Welcome to Timeline!",
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
