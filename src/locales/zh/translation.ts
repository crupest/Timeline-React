import TranslationResource from "../scheme";

const translation: TranslationResource = {
  welcome: "欢迎来到时间线！",
  home: {
    description: `<0>这是我，<1>crupest</1>，创建的第一个Web App。这个网站就是它的前端。你可以在Github上找到它的源代码（<3>前端</3>，<5>后端</5>）。现在我正在努力开发它，欢迎在Github上留下任何想法！</0><1>这个页面将来会被替换掉。</1>`
  },
  user: {
    username: "用户名",
    password: "密码",
    login: "登录",
    noLoginPrompt: "你还没有登录!",
    welcome: "欢迎，{{name}} ！",
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
