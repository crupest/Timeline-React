export default interface TranslationResource {
  welcome: string;
  search: string;
  home: {
    go: string;
    allTimeline: string;
    joinTimeline: string;
    ownTimeline: string;
    /*
    guide: string;
    description: string;
    */
    createButton: string;
    createDialog: {
      title: string;
      name: string;
      nameFormat: string;
      badFormat: string;
      noEmpty: string;
      tooLong: string;
    };
  };
  operationDialog: {
    confirm: string;
    cancel: string;
    ok: string;
    processing: string;
    success: string;
    error: string;
  };
  timeline: {
    messageCantSee: string;
    userNotExist: string;
    manage: string;
    memberButton: string;
    visibility: {
      public: string;
      register: string;
      private: string;
    };
    visibilityTooltip: {
      public: string;
      register: string;
      private: string;
    };
    dialogChangeProperty: {
      title: string;
      visibility: string;
      description: string;
    };
    member: {
      alreadyMember: string;
    };
    manageItem: {
      nickname: string;
      avatar: string;
      property: string;
      member: string;
      delete: string;
    };
    deleteDialog: {
      title: string;
      inputPrompt: string;
      notMatch: string;
    };
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
  login: {
    emptyUsername: string;
    emptyPassword: string;
    badCredential: string;
    alreadyLogin: string;
  };
  userPage: {
    dialogChangeNickname: {
      title: string;
      inputLabel: string;
    };
    dialogChangeAvatar: {
      title: string;
      prompt: string;
      previewImgAlt: string;
      imgPrompt: {
        select: string;
        loadingFile: string;
        decoding: string;
        errorNotSquare: string;
      };
      upload: string;
    };
  };
  settings: {
    subheaders: {
      account: string;
      customization: string;
    };
    languagePrimary: string;
    languageSecondary: string;
    changePassword: string;
    dialogChangePassword: {
      title: string;
      prompt: string;
      inputOldPassword: string;
      inputNewPassword: string;
      inputRetypeNewPassword: string;
      errorEmptyOldPassword: string;
      errorEmptyNewPassword: string;
      errorRetypeNotMatch: string;
    };
  };
  admin: {
    title: string;
  };
}
