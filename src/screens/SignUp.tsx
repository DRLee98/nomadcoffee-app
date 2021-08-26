import { useMutation } from "@apollo/client";
import { NavigationProp } from "@react-navigation/native";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import AddressInput from "../components/form/AddressInput";
import Button from "../components/form/Button";
import ErrorMsg from "../components/form/ErrorMsg";
import * as MediaLibrary from "expo-media-library";
import { Form, Input } from "../components/form/formShared";
import Go from "../components/GoText";
import { RootLoggedOutUserStackParamList } from "../navigators/LoggedOutUserStackNavi";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import { Platform } from "react-native";
import FormLayout from "../components/form/FormLayout";

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

const SignUpForm = styled.View``;

const InputBox = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
`;

const ImageBox = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonBox = styled.View``;

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
  navigation: NavigationProp<RootLoggedOutUserStackParamList, "SignUp">;
}

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [chosenPhoto, setChosenPhoto] = useState("");
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
      createAccountMutation({
        variables: { username, email, name, location, password },
      });
    }
  };

  const getPhotos = async () => {
    const { assets: photos } = await MediaLibrary.getAssetsAsync();
    setPhotos(photos);
    setChosenPhoto(photos[0]?.uri);
    console.log(photos);
  };

  const getPermissions = async () => {
    const { accessPrivileges, canAskAgain } =
      await MediaLibrary.getPermissionsAsync();
    if (accessPrivileges === "none" && canAskAgain) {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
      if (accessPrivileges !== "none") {
        getPhotos();
      }
    } else if (accessPrivileges !== "none") {
      getPhotos();
    }
  };

  // useEffect(() => {
  //   if (Platform.OS !== "web") {
  //     getPermissions();
  //   }
  // }, []);

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

  const onChangeText = (
    key: "username" | "email" | "name" | "password" | "verifyPassword",
    value: string,
  ) => {
    setError(undefined);
    setValue("result", "");
    setValue(key, value);
  };

  return (
    <FormLayout>
      <Box style={{ zIndex: 1 }}>
        <Form>
          {/* <ImageBox>
              <ImageInput register={register} files={watch("file")} />
            </ImageBox> */}
          <InputBox>
            <Input
              value={watch(Keys.username) || ""}
              onChangeText={(text) => onChangeText(Keys.username, text)}
              placeholder="사용자 이름"
              returnKeyType="next"
              error={error?.key === Keys.username}
            />
            <ErrorMsg msg={error?.key === Keys.username ? error.message : ""} />
            <Input
              value={watch(Keys.email) || ""}
              onChangeText={(text) => onChangeText(Keys.email, text)}
              placeholder="이메일"
              returnKeyType="next"
              error={error?.key === Keys.email}
            />
            <ErrorMsg msg={error?.key === Keys.email ? error.message : ""} />
            <Input
              value={watch(Keys.name) || ""}
              onChangeText={(text) => onChangeText(Keys.name, text)}
              placeholder="이름"
              returnKeyType="next"
              error={error?.key === Keys.name}
            />
            <ErrorMsg msg={error?.key === Keys.name ? error.message : ""} />
            <Input
              value={watch(Keys.password) || ""}
              onChangeText={(text) => onChangeText(Keys.password, text)}
              placeholder="비밀번호"
              secureTextEntry
              returnKeyType="next"
              error={error?.key === Keys.password}
            />
            <ErrorMsg msg={error?.key === Keys.password ? error.message : ""} />
            <Input
              value={watch(Keys.verifyPassword) || ""}
              onChangeText={(text) => onChangeText(Keys.verifyPassword, text)}
              placeholder="비밀번호 확인"
              secureTextEntry
              returnKeyType="done"
              error={error?.key === Keys.verifyPassword}
            />
            <ErrorMsg
              msg={error?.key === Keys.verifyPassword ? error.message : ""}
            />
            <AddressInput
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </InputBox>
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
        </Form>
        <Go onPress={goLogin} text={"로그인 하러가기 →"} />
      </Box>
    </FormLayout>
  );
};
export default SignUp;
