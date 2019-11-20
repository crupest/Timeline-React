export default interface TranslationResource {
  welcome: string;
  home: {
    description: string;
  };
  user: {
    username: string;
    password: string;
    login: string;
    noLoginPrompt: string;
    welcome: string;
    logout: string;
    rememberMe: string;
  };
  settings: {
    languagePrimary: string;
    languageSecondary: string;
  };
  admin: {
    title: string;
  };
}
