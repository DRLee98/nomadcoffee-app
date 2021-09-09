import { useMutation, useReactiveVar } from "@apollo/client";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import AddressInput from "../components/form/AddressInput";
import Button from "../components/form/Button";
import ErrorMsg from "../components/form/ErrorMsg";
import { Form, Input } from "../components/form/formShared";
import Go from "../components/GoText";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import FormLayout from "../components/form/FormLayout";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { darkTheme, lightTheme } from "../styles";
import { darkModeVar } from "../apollo";
import { TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ReactNativeFile } from "apollo-upload-client";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation(
    $username: String!
    $email: String!
    $name: String!
    $location: String
    $avatar: Upload
    $password: String!
  ) {
    createAccount(
      username: $username
      email: $email
      name: $name
      location: $location
      avatar: $avatar
      password: $password
    ) {
      ok
      error
    }
  }
`;

const Box = styled.View``;

const InputBox = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const ImageBox = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 50px;
  margin-bottom: 5px;
`;

const Image = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const Icon = styled(Ionicons)`
  font-weight: bold;
  color: ${(props) => props.theme.accent};
`;

interface ISignUpForm {
  username: string;
  email: string;
  name: string;
  location?: string;
  password: string;
  verifyPassword: string;
  result?: string;
}

enum Keys {
  username = "username",
  email = "email",
  name = "name",
  password = "password",
  verifyPassword = "verifyPassword",
}

interface ErrorState {
  key: Keys;
  message: string;
}

interface SignUpProps {
  navigation: NavigationProp<RootSharedStackParamList, "SignUp">;
  route: RouteProp<RootSharedStackParamList, "SignUp">;
}

const SignUp: React.FC<SignUpProps> = ({ navigation, route }) => {
  const darkMode = useReactiveVar(darkModeVar);
  const [avatarUri, setAvatarUri] = useState<string>();
  const [error, setError] = useState<ErrorState>();
  const { register, handleSubmit, getValues, setValue, watch } =
    useForm<ISignUpForm>();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok && error) {
      console.log(error);
      return setValue("result", error);
    }
    const { username, password } = getValues();
    navigation.navigate("Login", { username, password });
  };
  const [createAccountMutation, { loading }] = useMutation<
    createAccountMutation,
    createAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, { onCompleted });

  const onSubmitValid = (data: ISignUpForm) => {
    const reg_email =
      /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!watch(Keys.username)) {
      setError({ key: Keys.username, message: "사용자 이름은 필수 입니다" });
      return;
    } else if (!watch(Keys.email)) {
      setError({ key: Keys.email, message: "이메일은 필수 입니다" });
      return;
    } else if (!reg_email.test(watch(Keys.email))) {
      setError({ key: Keys.email, message: "이메일 형식이 잘못되었습니다" });
      return;
    } else if (!watch(Keys.name)) {
      setError({ key: Keys.name, message: "이름은 필수 입니다" });
      return;
    } else if (!watch(Keys.password)) {
      setError({ key: Keys.password, message: "비밀번호는 필수 입니다" });
      return;
    } else if (!watch(Keys.verifyPassword)) {
      setError({
        key: Keys.verifyPassword,
        message: "비밀번호 확인은 필수 입니다",
      });
      return;
    } else if (watch(Keys.password) !== watch(Keys.verifyPassword)) {
      setError({
        key: Keys.verifyPassword,
        message: "비밀번호가 일치하지 않습니다",
      });
      return;
    } else if (loading) {
      return;
    } else {
      const { username, email, name, location, password } = data;
      let file = null;
      if (avatarUri) {
        file = new ReactNativeFile({
          uri: avatarUri,
          name: `${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }
      createAccountMutation({
        variables: {
          username,
          email,
          name,
          location,
          password,
          ...(file && { avatar: file }),
        },
      });
    }
  };

  useEffect(() => {
    register(Keys.username, {
      required: true,
    });
    register(Keys.email, {
      required: true,
    });
    register(Keys.name, {
      required: true,
    });
    register("location");
    register(Keys.password, {
      required: true,
    });
    register(Keys.verifyPassword, {
      required: true,
    });
  }, [register]);

  const goLogin = () => {
    navigation.navigate("Login");
  };

  const goSelectPhoto = () => {
    navigation.navigate("Photo", {
      callbackScreen: "SignUp",
      photoLimit: 1,
    });
  };

  const onChangeText = (
    key: "username" | "email" | "name" | "password" | "verifyPassword",
    value: string,
  ) => {
    setError(undefined);
    setValue("result", "");
    setValue(key, value);
  };

  const emailRef = React.useRef<TextInput | null>(null);
  const nameRef = React.useRef<TextInput | null>(null);
  const passwordRef = React.useRef<TextInput | null>(null);
  const verifyPasswordRef = React.useRef<TextInput | null>(null);

  const onNext = (nextOne: React.MutableRefObject<TextInput | null>) => {
    nextOne?.current?.focus();
  };

  useEffect(() => {
    setAvatarUri(route.params?.avatarUri);
  }, [route.params?.avatarUri]);

  return (
    <FormLayout>
      <Box>
        <Form>
          <ImageBox onPress={goSelectPhoto}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri || "" }} />
            ) : (
              <Icon name={"add"} size={50} />
            )}
          </ImageBox>
          <Input
            value={watch(Keys.username) || ""}
            onChangeText={(text) => onChangeText(Keys.username, text)}
            placeholder="사용자 이름"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            returnKeyType="next"
            error={error?.key === Keys.username}
            onSubmitEditing={() => onNext(emailRef)}
          />
          <ErrorMsg msg={error?.key === Keys.username ? error.message : ""} />
          <Input
            ref={(ref) => (emailRef.current = ref)}
            value={watch(Keys.email) || ""}
            onChangeText={(text) => onChangeText(Keys.email, text)}
            placeholder="이메일"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            returnKeyType="next"
            error={error?.key === Keys.email}
            onSubmitEditing={() => onNext(nameRef)}
          />
          <ErrorMsg msg={error?.key === Keys.email ? error.message : ""} />
          <Input
            ref={(ref) => (nameRef.current = ref)}
            value={watch(Keys.name) || ""}
            onChangeText={(text) => onChangeText(Keys.name, text)}
            placeholder="이름"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            returnKeyType="next"
            error={error?.key === Keys.name}
            onSubmitEditing={() => onNext(passwordRef)}
          />
          <ErrorMsg msg={error?.key === Keys.name ? error.message : ""} />
          <Input
            ref={(ref) => (passwordRef.current = ref)}
            value={watch(Keys.password) || ""}
            onChangeText={(text) => onChangeText(Keys.password, text)}
            placeholder="비밀번호"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            secureTextEntry
            returnKeyType="next"
            error={error?.key === Keys.password}
            onSubmitEditing={() => onNext(verifyPasswordRef)}
          />
          <ErrorMsg msg={error?.key === Keys.password ? error.message : ""} />
          <Input
            ref={(ref) => (verifyPasswordRef.current = ref)}
            value={watch(Keys.verifyPassword) || ""}
            onChangeText={(text) => onChangeText(Keys.verifyPassword, text)}
            placeholder="비밀번호 확인"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            secureTextEntry
            returnKeyType="done"
            error={error?.key === Keys.verifyPassword}
          />
          <ErrorMsg
            msg={error?.key === Keys.verifyPassword ? error.message : ""}
          />
          <AddressInput setValue={setValue} watch={watch} />
          <Box style={{ marginTop: 10, width: "100%" }}>
            <Button
              onPress={handleSubmit(onSubmitValid)}
              text={"회원가입"}
              errorMsg={watch("result")}
              loading={loading}
              disabled={
                !watch(Keys.username) ||
                !watch(Keys.email) ||
                !watch(Keys.name) ||
                !watch(Keys.password) ||
                !watch(Keys.verifyPassword)
              }
            />
          </Box>
          <Go onPress={goLogin} text={"로그인 하러가기 →"} />
        </Form>
      </Box>
    </FormLayout>
  );
};
export default SignUp;
