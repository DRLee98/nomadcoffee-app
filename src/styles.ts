import { DefaultTheme } from "styled-components/native";
import { CommonTheme } from "./styled";

const commonTheme: CommonTheme = {
  maxWidth: "930px",
  BtnTextColor: "white",
  greenBtnColor: "#36b33b",
  redBtnColor: "#f14635",
  grayColor: "#94949490",
};

export const lightTheme: DefaultTheme = {
  fontColor: "#2c2c2c",
  bgColor: "#f9f9f9",
  accent: "#00b894",
  hoverColor: "#41f7d31a",
  disabledBg: "#94949466",
  errorColor: "#ff6565",
  wrapperBg: "#f2f2f2",
  darkModeBtn: "#673ab7",
  placeholderTextColor: "#909090cc",
  ...commonTheme,
};

export const darkTheme: DefaultTheme = {
  fontColor: "lightgray",
  bgColor: "#2c2c2c",
  accent: "#8c64d4",
  hoverColor: "#673ab74d",
  disabledBg: "#94949466",
  errorColor: "#ff6565",
  wrapperBg: "#191919cc",
  darkModeBtn: "#ff9800",
  placeholderTextColor: "#d3d3d3cc",
  ...commonTheme,
};
