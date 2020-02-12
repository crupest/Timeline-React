import TranslationResource from '../scheme';

const translation: TranslationResource = {
  welcome: 'Welcome!',
  home: {
    /*
    guide:
      "<0>Input a username, and press enter, go to his timeline!</0><1>No idea? Just enter without input. Go to the website author's timeline!</1>",
    description: `<0>This is the first Web App created by me, <1>crupest</1>. This page is the front-end of it. You can find the source code on Github (<3>front-end</3>, <5>back-end</5>). Now it is under active development by me. You are welcomed to leave any thoughts on Github!</0>`
    */
    allTimeline: 'All Timelines',
    joinTimeline: 'Joined Timelines',
    ownTimeline: 'Owned Timelines'
  },
  operationDialog: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    ok: 'OK!',
    processing: 'Processing...',
    success: 'Success!',
    error: 'An error occured.'
  },
  timeline: {
    messageCantSee: 'Sorry, you are not allowed to see this timeline.😅',
    userNotExist: 'The user does not exist!',
    visibility: {
      public: 'public to everyone',
      register: 'only registed people can see',
      private: 'only members can see'
    },
    visibilityTooltip: {
      public:
        'Everyone including those without accounts can see content of the timeline.',
      register:
        'Only those who have an account and logined can see content of the timeline.',
      private: 'Only members of this timeline can see content of the timeline.'
    },
    dialogChangeProperty: {
      title: 'Change Timeline Properties',
      visibility: 'Visibility',
      description: 'Description'
    },
    member: {
      alreadyMember: 'The user is already a member.'
    }
  },
  user: {
    username: 'username',
    password: 'password',
    login: 'login',
    noLoginPrompt: "You haven't login.",
    welcome: 'Welcome, {{name}} !',
    logout: 'logout',
    rememberMe: 'Remember Me'
  },
  login: {
    emptyUsername: "Username can't be empty.",
    emptyPassword: "Password can't be empty.",
    badCredential: 'Username or password is invalid.'
  },
  userPage: {
    dialogEditSelect: {
      title: 'Change what?',
      avatar: 'Avatar',
      nickname: 'Nickname',
      timelineproperty: 'Timeline properties'
    },
    dialogChangeNickname: {
      title: 'Change Nickname',
      inputLabel: 'New nickname'
    },
    dialogChangeAvatar: {
      title: 'Change Avatar',
      prompt:
        'Currently you must manually crop the image into a square. Then you can upload it as avatar. A cropper component will be added in the future. So looking forward to it!😅',
      previewImgAlt: 'preview',
      imgPrompt: {
        select: 'Please select a picture.',
        loadingFile: 'Loading the file...',
        decoding: 'Decoding picture...',
        errorNotSquare: 'The image is not a square.'
      },
      upload: 'upload'
    }
  },
  settings: {
    subheaders: {
      account: 'Account',
      customization: 'Customization'
    },
    languagePrimary: 'Choose display language.',
    languageSecondary:
      'You language preference will be saved locally. Next time you visit this page, last language option will be used.',
    changePassword: "Change account's password.",
    dialogChangePassword: {
      title: 'Change Password',
      prompt:
        'You are changing your password. You need to input the correct old password. After change, you need to login again and all old login will be invalid.',
      inputOldPassword: 'Old password',
      inputNewPassword: 'New password',
      inputRetypeNewPassword: 'Retype new password',
      errorEmptyOldPassword: "Old password can't be empty.",
      errorEmptyNewPassword: "New password can't be empty.",
      errorRetypeNotMatch: 'Password retyped does not match.'
    }
  },
  admin: {
    title: 'admin'
  }
};

export default translation;
