import { useReactiveVar } from "@apollo/client";
import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { darkModeVar } from "../apollo";

const Background = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.wrapperBg};
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 900;
  margin: auto;
  background-color: ${(props) => props.theme.wrapperBg};
`;

interface ScreenLayoutProps {
  loading: Boolean;
  children: React.ReactChild;
}

export default function ScreenLayout({ loading, children }: ScreenLayoutProps) {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Background>
      <Container>
        {loading ? (
          <ActivityIndicator color={darkMode ? "white" : "gray"} />
        ) : (
          children
        )}
      </Container>
    </Background>
  );
}
