export default interface TranslationResource {
  welcome: string;
  user: {
    username: string;
    password: string;
    login: string;
    noLoginPrompt: string;
    welcome0: string;
    welcome1: string;
    logout: string;
    rememberMe: string;
  };
  settings: {
    languagePrimary: string; 
    languageSecondary: string;
  }
  admin: {
    title: string;
  }
}
