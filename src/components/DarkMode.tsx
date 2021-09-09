import React from "react";
import { useReactiveVar } from "@apollo/client";
import styled from "styled-components/native";
import { darkModeVar, toggleDarkMode } from "../apollo";
import Ionicons from "react-native-vector-icons/Ionicons";

const TouchBox = styled.TouchableOpacity`
  margin-right: 8px;
`;

const Icon = styled(Ionicons)`
  color: ${(props) => props.theme.darkModeBtn};
`;

const DarkModeBtn = () => {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <TouchBox onPress={toggleDarkMode}>
      <Icon name={darkMode ? "sunny" : "moon"} size={22} />
    </TouchBox>
  );
};

export default DarkModeBtn;
