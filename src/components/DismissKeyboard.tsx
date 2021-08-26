import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

interface DismissKeyboardProps {
  children: React.ReactChild;
}

export default function DismissKeyboard({ children }: DismissKeyboardProps) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      onPress={dismissKeyboard}
      disabled={Platform.OS === "web"}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}
