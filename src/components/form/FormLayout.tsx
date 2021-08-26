import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../DismissKeyboard";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
  max-width: 900px;
  margin: auto;
`;

interface FormLayoutProps {
  children: React.ReactChild;
}

export default function FormLayout({ children }: FormLayoutProps) {
  return (
    <DismissKeyboard>
      <Container>
        {/* <KeyboardAvoidingView
          style={{
            width: "100%",
            maxWidth: 900,
          }}
          behavior="position"
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        > */}
        {children}
        {/* </KeyboardAvoidingView> */}
      </Container>
    </DismissKeyboard>
  );
}
