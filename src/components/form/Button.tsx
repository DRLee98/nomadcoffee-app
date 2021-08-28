import React, { useEffect, useState } from "react";
import { ActivityIndicator, GestureResponderEvent } from "react-native";
import styled from "styled-components/native";

export const SButton = styled.TouchableOpacity<ISButtonProp>`
  border-radius: 3px;
  background-color: ${(props) =>
    props.error || props.redBgColor
      ? props.theme.errorColor
      : props.disabled
      ? props.theme.disabledBg
      : props.theme.accent};
  padding: 10px 0px;
  width: 100%;
`;

const SButtonText = styled.Text`
  width: 100%;
  font-weight: 800;
  text-align: center;
  color: white;
`;

interface ISButtonProp {
  disabled?: boolean;
  error?: boolean;
  redBgColor?: boolean;
}

interface IButtonProp {
  text: string;
  errorMsg?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  redBgColor?: boolean;
}

const Button: React.FC<IButtonProp> = ({
  text,
  errorMsg,
  loading,
  disabled,
  onPress,
  redBgColor,
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
      onPress={!disabled ? onPress : () => {}}
      error={Boolean(errorMsg)}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <SButtonText>{value}</SButtonText>
      )}
    </SButton>
  );
};

export default Button;
