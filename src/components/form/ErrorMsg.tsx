import React from "react";
import styled from "styled-components/native";

export const Error = styled.Text`
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: ${(props) => props.theme.errorColor};
`;

interface IErrorMsg {
  msg?: string;
}

const ErrorMsg: React.FC<IErrorMsg> = ({ msg }) => {
  return msg ? <Error>{msg}</Error> : null;
};

export default ErrorMsg;
