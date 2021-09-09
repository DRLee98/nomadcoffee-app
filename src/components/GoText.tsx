import React from "react";
import { GestureResponderEvent } from "react-native";
import styled from "styled-components/native";

const GoBox = styled.TouchableOpacity`
  margin-top: 15px;
`;

const GoText = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.accent};
`;

interface GoProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

const Go: React.FC<GoProps> = ({ text, onPress }) => (
  <GoBox onPress={onPress}>
    <GoText>{text}</GoText>
  </GoBox>
);

export default Go;
