import {
  ApolloCache,
  FetchResult,
  useMutation,
  useReactiveVar,
} from "@apollo/client";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import AddressInput from "../components/form/AddressInput";
import Button from "../components/form/Button";
import ErrorMsg from "../components/form/ErrorMsg";
import { Form, Input } from "../components/form/formShared";
import FormLayout from "../components/form/FormLayout";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { darkTheme, lightTheme } from "../styles";
import { darkModeVar } from "../apollo";
import { TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ReactNativeFile } from "apollo-upload-client";
import {
  editProfileMutation,
  editProfileMutationVariables,
} from "../__generated__/editProfileMutation";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation(
    $username: String
    $email: String
    $name: String
    $location: String
    $avatar: Upload
  ) {
    editProfile(
      username: $username
      email: $email
      name: $name
      location: $location
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

const Box = styled.View``;

const InputBox = styled.View`
  width: 100%;
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

interface IEditProfileForm {
  username?: string;
  email?: string;
  name?: string;
  location?: string;
  result?: string;
}

enum Keys {
  username = "username",
  email = "email",
  name = "name",
}

interface ErrorState {
  key: Keys;
  message: string;
}

interface EditProfileProps {
  navigation: NavigationProp<RootSharedStackParamList, "EditProfile">;
  route: RouteProp<RootSharedStackParamList, "EditProfile">;
}

const EditProfile: React.FC<EditProfileProps> = ({ navigation, route }) => {
  const darkMode = useReactiveVar(darkModeVar);
  const [avatarUri, setAvatarUri] = useState<string>();
  const [error, setError] = useState<ErrorState>();
  const { register, handleSubmit, getValues, setValue, watch } =
    useForm<IEditProfileForm>({
      defaultValues: {
        username: route.params?.username || "",
        email: route.params?.email || "",
        name: route.params?.name || "",
        location: route.params?.location || "",
      },
    });
  const updateProfile = (
    cache: ApolloCache<editProfileMutation>,
    result: FetchResult<editProfileMutation>,
  ) => {
    const resultData = result.data?.editProfile;
    if (!resultData?.ok && resultData?.error) {
      console.log(error);
      return setValue("result", resultData?.error);
    }
    const { username, email, name, location } = getValues();
    cache.modify({
      id: `User:${route.params?.id}`,
      fields: {
        username(prev) {
          return username ? username : prev;
        },
        email(prev) {
          return email ? email : prev;
        },
        name(prev) {
          return name ? name : prev;
        },
        location(prev) {
          return location ? location : prev;
        },
        avatar(prev) {
          return avatarUri ? avatarUri : prev;
        },
      },
    });
    navigation.navigate("MyProfile");
  };
  const [editProfileMutation, { loading }] = useMutation<
    editProfileMutation,
    editProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, { update: updateProfile });

  const onSubmitValid = (data: IEditProfileForm) => {
    const reg_email =
      /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(watch(Keys.email))) {
      setError({ key: Keys.email, message: "이메일 형식이 잘못되었습니다" });
      return;
    } else if (loading) {
      return;
    } else {
      const { username, email, name, location } = data;
      let file = undefined;
      if (avatarUri) {
        file = new ReactNativeFile({
          uri: avatarUri,
          name: `${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }
      editProfileMutation({
        variables: {
          username,
          email,
          name,
          location,
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
  }, [register]);

  const goSelectPhoto = () => {
    navigation.navigate("Photo", {
      callbackScreen: "EditProfile",
      photoLimit: 1,
    });
  };

  const onChangeText = (key: "username" | "email" | "name", value: string) => {
    setError(undefined);
    setValue("result", "");
    setValue(key, value);
  };

  const emailRef = React.useRef<TextInput | null>(null);
  const nameRef = React.useRef<TextInput | null>(null);

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
              <Image source={{ uri: avatarUri }} />
            ) : route.params?.currentAvatar ? (
              <Image source={{ uri: route.params?.currentAvatar }} />
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
          />
          <ErrorMsg msg={error?.key === Keys.name ? error.message : ""} />
          <AddressInput setValue={setValue} watch={watch} />
          <Box style={{ marginTop: 10, width: "100%" }}>
            <Button
              onPress={handleSubmit(onSubmitValid)}
              text={"수정하기"}
              errorMsg={watch("result")}
              loading={loading}
            />
          </Box>
        </Form>
      </Box>
    </FormLayout>
  );
};
export default EditProfile;
