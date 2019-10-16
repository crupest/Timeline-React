export default interface TranslationResource {
  welcome: string;
  home: {
    description: {
      p1: {
        0: string;
        // 1: username
        2: string;
        3: string; // front-end (a link)
        4: string;
        5: string; // back-end (a link)
        6: string;
      };
      p2: {
        0: string;
      }
    };
  };
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
  };
  admin: {
    title: string;
  };
}
