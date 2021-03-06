import { useMutation, useReactiveVar } from "@apollo/client";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import gql from "graphql-tag";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import styled from "styled-components/native";
import { darkModeVar, login } from "../apollo";
import Button from "../components/form/Button";
import ErrorMsg from "../components/form/ErrorMsg";
import { Form, Input } from "../components/form/formShared";
import Go from "../components/GoText";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import FormLayout from "../components/form/FormLayout";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { darkTheme, lightTheme } from "../styles";

const LOGIN_MUTATION = gql`
  mutation loginMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      error
      token
    }
  }
`;

const Box = styled.View``;

interface LoginFormProps {
  username: string;
  password: string;
  result?: string;
}

interface ErrorState {
  key: "username" | "password";
  message: string;
}

interface LoginProps {
  navigation: NavigationProp<RootSharedStackParamList, "Login">;
  route: RouteProp<RootSharedStackParamList, "Login">;
}

const Login: React.FC<LoginProps> = ({ navigation, route }) => {
  const darkMode = useReactiveVar(darkModeVar);
  const [error, setError] = useState<ErrorState>();
  const { register, handleSubmit, watch, setValue } = useForm<LoginFormProps>({
    defaultValues: {
      username: route.params?.username || "",
      password: route.params?.password || "",
    },
  });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok && error) {
      return setValue("result", error);
    }
    if (token) {
      login(token);
    }
  };

  const [loginMutation, { loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmitValid = (data: LoginFormProps) => {
    checkError();
    if (loading || error) {
      return;
    }
    const { username, password } = data;
    loginMutation({
      variables: { username, password },
    });
  };

  const checkError = () => {
    if (!watch("username")) {
      setError({ key: "username", message: "????????? ????????? ?????? ?????????" });
    } else if (!watch("password")) {
      setError({ key: "password", message: "??????????????? ?????? ?????????" });
    }
  };

  useEffect(() => {
    register("username", {
      required: true,
    });
    register("password", {
      required: true,
    });
  }, [register]);

  const goSignUp = () => {
    navigation.navigate("SignUp");
  };

  const onChangeText = (key: "username" | "password", value: string) => {
    setValue("result", "");
    setValue(key, value);
  };

  const passwordRef = React.useRef<TextInput | null>(null);

  const onNext = (nextOne: React.MutableRefObject<TextInput | null>) => {
    nextOne?.current?.focus();
  };

  return (
    <FormLayout>
      <Box>
        <Form>
          <Input
            value={watch("username") || ""}
            onChangeText={(text) => onChangeText("username", text)}
            placeholder="????????? ??????"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            returnKeyType="next"
            error={error?.key === "username"}
            onSubmitEditing={() => onNext(passwordRef)}
          />
          <ErrorMsg msg={error?.key === "username" ? error.message : ""} />
          <Input
            ref={(ref) => (passwordRef.current = ref)}
            value={watch("password") || ""}
            onChangeText={(text) => onChangeText("password", text)}
            placeholder="????????????"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            secureTextEntry
            returnKeyType="done"
            error={error?.key === "password"}
            onSubmitEditing={handleSubmit(onSubmitValid)}
          />
          <ErrorMsg msg={error?.key === "password" ? error.message : ""} />
          <Button
            onPress={handleSubmit(onSubmitValid)}
            text={"?????????"}
            errorMsg={watch("result")}
            loading={loading}
            disabled={!watch("username") || !watch("password")}
          />
          <Go onPress={goSignUp} text={"???????????? ???????????? ???"} />
        </Form>
      </Box>
    </FormLayout>
  );
};

export default Login;
