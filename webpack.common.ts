import HtmlWebpackPlugin from "html-webpack-plugin";

export const htmlCommonConfig: HtmlWebpackPlugin.Options = {
  inject: false,
  template: require("html-webpack-template"),

  appMountId: "app",
  mobile: true,
  links: [
    "https://fonts.googleapis.com/icon?family=Material+Icons|Noto+Sans",
    {
      href: "/manifest.json",
      rel: "manifest"
    },
    {
      href: "/logo192.png",
      rel: "apple-touch-icon"
    },
    {
      href: "/favicon.ico",
      rel: "shortcut icon"
    }
  ],
  title: "Timeline"
};
