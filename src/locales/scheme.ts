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
  };
  admin: {
    title: string;
  }
}
