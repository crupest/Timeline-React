import TranslationResource from "../scheme";

const translation: TranslationResource = {
  welcome: "欢迎来到时间线！",
  user: {
    username: "用户名",
    password: "密码",
    login: "登录",
    noLoginPrompt: "你还没有登录!",
    welcome0: "欢迎，",
    welcome1: "！",
    logout: "注销",
    rememberMe: "记住我"
  },
  settings: {
    languagePrimary: "选择显示的语言。",
    languageSecondary:
      "您的语言偏好将会存储在本地，下次浏览时将自动使用上次保存的语言选项。"
  },
  admin: {
    title: "管理"
  }
};

export default translation;
