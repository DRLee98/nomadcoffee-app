import { useReactiveVar } from "@apollo/client";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { darkModeVar } from "../../apollo";
import DismissKeyboard from "../DismissKeyboard";

const Background = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.wrapperBg};
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
  width: 100%;
  max-width: 900px;
  margin: auto;
  background-color: ${(props) => props.theme.wrapperBg};
`;

interface FormLayoutProps {
  loading?: Boolean;
  children: React.ReactChild;
  behavior?: "height" | "position" | "padding";
  keyboardVerticalOffset?: number;
}

export default function FormLayout({
  children,
  loading,
  behavior,
  keyboardVerticalOffset,
}: FormLayoutProps) {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Background>
      <DismissKeyboard>
        <Container>
          <KeyboardAvoidingView
            behavior={behavior ? behavior : "height"}
            keyboardVerticalOffset={
              keyboardVerticalOffset
                ? keyboardVerticalOffset
                : Platform.OS === "ios"
                ? 10
                : 0
            }
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {loading ? (
              <ActivityIndicator color={darkMode ? "white" : "gray"} />
            ) : (
              children
            )}
          </KeyboardAvoidingView>
        </Container>
      </DismissKeyboard>
    </Background>
  );
}
