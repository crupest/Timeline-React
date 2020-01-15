import { EditItem as UserPageEditSelectDialogItem } from '../user/EditItem';

export default interface TranslationResource {
  welcome: string;
  home: {
    guide: string;
    description: string;
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
  userPage: {
    dialogEditSelect: {
      title: string;
    } & Record<UserPageEditSelectDialogItem, string>;
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
