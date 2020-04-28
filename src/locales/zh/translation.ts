import TranslationResource from '../scheme';

const translation: TranslationResource = {
  welcome: '欢迎！',
  search: '搜索',
  nav: {
    settings: '设置',
    login: '登陆',
    about: '关于',
  },
  chooseImage: '选择一个图片',
  loadImageError: '加载图片失败',
  home: {
    go: '冲！',
    allTimeline: '所有的时间线',
    joinTimeline: '加入的时间线',
    ownTimeline: '拥有的时间线',
    createButton: '创建时间线',
    createDialog: {
      title: '创建时间线！',
      name: '名字',
      nameFormat:
        '名字只能由字母、汉字、数字、下划线（_）和连字符（-）构成，且长度不能超过26.',
      badFormat: '格式错误',
      noEmpty: '不能为空',
      tooLong: '太长了',
    },
  },
  operationDialog: {
    retry: '重试',
    nextStep: '下一步',
    previousStep: '上一步',
    confirm: '确定',
    cancel: '取消',
    ok: '好的！',
    processing: '处理中...',
    success: '成功！',
    error: '出错啦！',
  },
  timeline: {
    messageCantSee: '不好意思，你没有权限查看这个时间线。😅',
    userNotExist: '该用户不存在！',
    timelineNotExist: '该时间线不存在！',
    manage: '管理',
    memberButton: '成员',
    send: '发送',
    deletePostFailed: '删除消息失败。',
    sendPostFailed: '发送消息失败。',
    visibility: {
      public: '对所有人公开',
      register: '仅注册可见',
      private: '仅成员可见',
    },
    visibilityTooltip: {
      public: '所有人都可以看到这个时间线的内容，包括没有注册的人。',
      register: '只有拥有本网站的账号且登陆了的人才能看到这个时间线的内容。',
      private: '只有这个时间线的成员可以看到这个时间线的内容。',
    },
    dialogChangeProperty: {
      title: '修改时间线属性',
      visibility: '可见性',
      description: '描述',
    },
    member: {
      alreadyMember: '该用户已经是一个成员。',
      add: '添加',
      remove: '移除',
    },
    manageItem: {
      nickname: '昵称',
      avatar: '头像',
      property: '时间线属性',
      member: '时间线成员',
      delete: '删除时间线',
    },
    deleteDialog: {
      title: '删除时间线',
      inputPrompt:
        '这是一个危险的操作。如果您确认要删除时间线<1>{{name}}</1>，请在下面输入它的名字并点击确认。',
      notMatch: '名字不匹配',
    },
  },
  user: {
    username: '用户名',
    password: '密码',
    login: '登录',
    rememberMe: '记住我',
    welcomeBack: '欢迎回来！',
    verifyTokenFailed: '用户登录信息已过期，请重新登陆！',
    verifyTokenFailedNetwork:
      '验证用户登录信息失败，请检查网络连接并刷新页面！',
  },
  login: {
    emptyUsername: '用户名不能为空。',
    emptyPassword: '密码不能为空。',
    badCredential: '用户名或密码错误。',
    alreadyLogin: '已经登陆，三秒后导航到首页！',
  },
  userPage: {
    dialogChangeNickname: {
      title: '更改昵称',
      inputLabel: '新昵称',
    },
    dialogChangeAvatar: {
      title: '修改头像',
      previewImgAlt: '预览',
      prompt: {
        select: '请选择一个图片',
        crop: '请裁剪图片',
        processingCrop: '正在裁剪图片',
        uploading: '正在上传',
        preview: '请预览图片',
      },
      upload: '上传',
    },
  },
  settings: {
    subheaders: {
      account: '账户',
      customization: '个性化',
    },
    languagePrimary: '选择显示的语言。',
    languageSecondary:
      '您的语言偏好将会存储在本地，下次浏览时将自动使用上次保存的语言选项。',
    changePassword: '更改账号的密码。',
    logout: '注销此账号。',
    gotoSelf: '点击前往个人时间线修改昵称和头像！',
    dialogChangePassword: {
      title: '修改密码',
      prompt:
        '您正在修改密码，您需要输入正确的旧密码。成功修改后您需要重新登陆，而且以前所有的登录都会失效。',
      inputOldPassword: '旧密码',
      inputNewPassword: '新密码',
      inputRetypeNewPassword: '再次输入新密码',
      errorEmptyOldPassword: '旧密码不能为空。',
      errorEmptyNewPassword: '新密码不能为空',
      errorRetypeNotMatch: '两次输入的密码不一致',
    },
  },
  about: {
    author: {
      title: '网站作者',
      fullname: '姓名：',
      nickname: '昵称：',
      introduction: '简介：',
      introductionContent: '一个基于巧合编程的代码爱好者。',
      links: '链接：',
    },
    site: {
      title: '网站信息',
      content:
        '这个网站的名字叫 <1>Timeline</1>，是一个以<3>时间线</3>为核心概念的 Web App . 它的前端和后端都是由<5>我</5>开发，并且在 GitHub 上开源。大家可以相对轻松的把它们部署在自己的服务器上，这也是我的目标之一。欢迎大家前往 GitHub 仓库提出任何意见。',
      frontendRepo: '前端 GitHub 仓库',
      backendRepo: '后端 GitHub 仓库',
    },
    credits: {
      title: '鸣谢',
      content:
        'Timeline 是站在巨人肩膀上的作品，感谢以下列出的和其他未列出的许多开源项目，相关 License 请在 GitHub 仓库中查看。',
      frontend: '前端：',
      backend: '后端：',
    },
  },
  admin: {
    title: '管理',
  },
};

export default translation;
