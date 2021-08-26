import { useMutation } from "@apollo/client";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import gql from "graphql-tag";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import styled from "styled-components/native";
import { login } from "../apollo";
import Button from "../components/form/Button";
import ErrorMsg from "../components/form/ErrorMsg";
import { Form, Input } from "../components/form/formShared";
import Go from "../components/GoText";
import { RootLoggedOutUserStackParamList } from "../navigators/LoggedOutUserStackNavi";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import FormLayout from "../components/form/FormLayout";

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
  navigation: NavigationProp<RootLoggedOutUserStackParamList, "Login">;
  route: RouteProp<RootLoggedOutUserStackParamList, "Login">;
}

const Login: React.FC<LoginProps> = ({ navigation, route }) => {
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
      setError({ key: "username", message: "사용자 이름은 필수 입니다" });
    } else if (!watch("password")) {
      setError({ key: "password", message: "비밀번호는 필수 입니다" });
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

  const passwordRef = useRef<TextInput>();

  const onNext = (nextOne: React.MutableRefObject<TextInput | undefined>) => {
    nextOne?.current?.focus();
  };

  return (
    <FormLayout>
      <Box>
        <Form>
          <Input
            value={watch("username") || ""}
            onChangeText={(text) => onChangeText("username", text)}
            placeholder="사용자 이름"
            returnKeyType="next"
            error={error?.key === "username"}
            onSubmitEditing={() => onNext(passwordRef)}
          />
          <ErrorMsg msg={error?.key === "username" ? error.message : ""} />
          <Input
            ref={(ref) => {
              // if (passwordRef && ref) {
              //   passwordRef.current = ref;
              // }
            }}
            value={watch("password") || ""}
            onChangeText={(text) => onChangeText("password", text)}
            placeholder="비밀번호"
            secureTextEntry
            returnKeyType="done"
            error={error?.key === "password"}
            onSubmitEditing={handleSubmit(onSubmitValid)}
          />
          <ErrorMsg msg={error?.key === "password" ? error.message : ""} />
          <Button
            onPress={handleSubmit(onSubmitValid)}
            text={"로그인"}
            errorMsg={watch("result")}
            loading={loading}
            disabled={!watch("username") || !watch("password")}
          />
        </Form>
        <Go onPress={goSignUp} text={"회원가입 하러가기 →"} />
      </Box>
    </FormLayout>
  );
};

export default Login;
