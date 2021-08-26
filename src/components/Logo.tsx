import React from "react";
import styled from "styled-components/native";

const LogoBox = styled.View``;

const LogoText = styled.Text`
  font-weight: bold;
  font-size: 22px;
  color: ${(props) => props.theme.accent};
`;

const Logo = () => (
  <LogoBox>
    <LogoText>노마드 커피</LogoText>
  </LogoBox>
);

export default Logo;
