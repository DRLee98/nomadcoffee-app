import React, { useEffect, useState } from "react";
import { ActivityIndicator, GestureResponderEvent } from "react-native";
import styled from "styled-components/native";

export const SButton = styled.TouchableOpacity<SButtonProp>`
  border-radius: 3px;
  background-color: ${(props) =>
    props.error || props.redBgColor
      ? props.theme.errorColor
      : props.basicBgColor
      ? props.theme.bgColor
      : props.disabled
      ? props.theme.disabledBg
      : props.theme.accent};
  padding: 10px 0px;
  width: 100%;
  ${(props) =>
    props.basicBgColor ? `border: 1px solid ${props.theme.fontColor}` : ""};
`;

const SButtonText = styled.Text<SButtonTextProp>`
  width: 100%;
  font-weight: 800;
  text-align: center;
  color: ${(props) => (props.basicBgColor ? props.theme.fontColor : "white")};
`;

interface SButtonProp {
  disabled?: boolean;
  error?: boolean;
  redBgColor?: boolean;
  basicBgColor?: boolean;
}

interface SButtonTextProp {
  basicBgColor?: boolean;
}

interface IButtonProp {
  text: string;
  errorMsg?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  redBgColor?: boolean;
  basicBgColor?: boolean;
}

const Button: React.FC<IButtonProp> = ({
  text,
  errorMsg,
  loading,
  disabled,
  onPress,
  redBgColor,
  basicBgColor,
}) => {
  const [value, setValue] = useState<string>(text);
  useEffect(() => {
    if (errorMsg) {
      setValue(errorMsg);
    } else {
      setValue(text);
    }
  }, [errorMsg, text]);
  return (
    <SButton
      redBgColor={redBgColor}
      basicBgColor={basicBgColor}
      onPress={!disabled ? onPress : () => {}}
      error={Boolean(errorMsg)}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <SButtonText basicBgColor={basicBgColor}>{value}</SButtonText>
      )}
    </SButton>
  );
};

export default Button;
