import { useReactiveVar } from "@apollo/client";
import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { darkModeVar } from "../apollo";
import { darkTheme, lightTheme } from "../styles";

const LoadingDim = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #3a3a3a66;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Loading = () => {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <LoadingDim>
      <ActivityIndicator
        color={darkMode ? darkTheme.accent : lightTheme.accent}
      />
    </LoadingDim>
  );
};

export default Loading;
