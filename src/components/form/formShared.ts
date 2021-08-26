import styled from "styled-components/native";

export const Form = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

interface IInputProp {
  error?: boolean;
}

export const Input = styled.TextInput<IInputProp>`
  min-width: 250px;
  width: 100%;
  padding: 10px;
  color: ${(props) => props.theme.accent};
  border: ${(props) =>
    props.error ? `2px solid ${props.theme.errorColor}` : "none"};
  border-radius: 3px;
`;
