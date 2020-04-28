export default interface TranslationResource {
  welcome: string;
  search: string;
  chooseImage: string;
  loadImageError: string;
  nav: {
    settings: string;
    login: string;
    about: string;
  };
  home: {
    go: string;
    allTimeline: string;
    joinTimeline: string;
    ownTimeline: string;
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
    retry: string;
    nextStep: string;
    previousStep: string;
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
    timelineNotExist: string;
    manage: string;
    memberButton: string;
    send: string;
    deletePostFailed: string;
    sendPostFailed: string;
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
      add: string;
      remove: string;
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
    rememberMe: string;
    welcomeBack: string;
    verifyTokenFailed: string;
    verifyTokenFailedNetwork: string;
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
      previewImgAlt: string;
      prompt: {
        select: string;
        crop: string;
        processingCrop: string;
        preview: string;
        uploading: string;
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
    logout: string;
    gotoSelf: string;
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
  about: {
    author: {
      title: string;
      fullname: string;
      nickname: string;
      introduction: string;
      introductionContent: string;
      links: string;
    };
    site: {
      title: string;
      content: string;
      frontendRepo: string;
      backendRepo: string;
    };
    credits: {
      title: string;
      content: string;
      frontend: string;
      backend: string;
    };
  };
  admin: {
    title: string;
  };
}
