import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme extends CommonTheme {
    bgColor: string;
    fontColor: string;
    accent: string;
    hoverColor: string;
    disabledBg: string;
    errorColor: string;
    wrapperBg: string;
    darkModeBtn: string;
    placeholderTextColor: string;
  }
}

export interface CommonTheme {
  maxWidth: string;
  BtnTextColor: string;
  greenBtnColor: string;
  redBtnColor: string;
  grayColor: string;
}
