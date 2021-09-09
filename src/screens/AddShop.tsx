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
import {
  createCoffeeShopMutation,
  createCoffeeShopMutationVariables,
} from "../__generated__/createCoffeeShopMutation";
import FormLayout from "../components/form/FormLayout";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { darkTheme, lightTheme } from "../styles";
import { darkModeVar } from "../apollo";
import { ScrollView, TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ReactNativeFile } from "apollo-upload-client";
import useMe from "../hooks/useMe";
import { getCategoryObj } from "../utils";
import { useAppDispatch } from "../app/hooks";
import { addItem } from "../app/store";
import {
  seeCoffeeShopsQuery_seeCoffeeShops,
  seeCoffeeShopsQuery_seeCoffeeShops_categories,
  seeCoffeeShopsQuery_seeCoffeeShops_photos,
} from "../__generated__/seeCoffeeShopsQuery";

const CREATE_COFFEE_SHOP_MUTATION = gql`
  mutation createCoffeeShopMutation(
    $name: String!
    $latitude: String
    $longitude: String
    $address: String
    $categories: String
    $photos: [Upload]
  ) {
    createCoffeeShop(
      name: $name
      latitude: $latitude
      longitude: $longitude
      address: $address
      categories: $categories
      photos: $photos
    ) {
      ok
      error
      id
      photoUrls
    }
  }
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
`;

const Box = styled.View``;

const ImageItem = styled.TouchableOpacity<ImageItemProp>`
  width: 50px;
  height: 50px;
  padding: 5px;
  ${(props) =>
    props.selected ? `background-color: ${props.theme.accent};` : ""}
  margin-right: 5px;
`;

const SmallImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ImageBox = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background-color: ${(props) => props.theme.bgColor};
  margin-bottom: 5px;
`;

const Image = styled.Image`
  width: 200px;
  height: 200px;
`;

const Icon = styled(Ionicons)`
  font-weight: bold;
  color: ${(props) => props.theme.accent};
`;

interface ImageItemProp {
  selected: boolean;
}

interface IAddShopForm {
  name: string;
  location?: string;
  categories?: string;
  result?: string;
}

enum Keys {
  name = "name",
  categories = "categories",
}

interface ErrorState {
  key: Keys;
  message: string;
}

interface AddShopProps {
  navigation: NavigationProp<RootSharedStackParamList, "AddShop">;
  route: RouteProp<RootSharedStackParamList, "AddShop">;
}

const AddShop: React.FC<AddShopProps> = ({ navigation, route }) => {
  const { data: meData } = useMe();
  const darkMode = useReactiveVar(darkModeVar);
  const [images, setImages] = useState<string[]>();
  const [viewPhoto, setViewPhoto] = useState<string>();
  const [error, setError] = useState<ErrorState>();
  const { register, handleSubmit, getValues, setValue, watch } =
    useForm<IAddShopForm>();

  const updateAddCoffeeShop = (
    cache: ApolloCache<createCoffeeShopMutation>,
    result: FetchResult<createCoffeeShopMutation>,
  ) => {
    const resultData = result.data?.createCoffeeShop;
    if (resultData?.ok && resultData?.id && meData?.me) {
      const { name, categories } = getValues();
      let photos: seeCoffeeShopsQuery_seeCoffeeShops_photos[] | null = null;
      if (resultData?.photoUrls && resultData?.photoUrls.length > 0) {
        resultData.photoUrls.forEach((photo) => {
          if (photos && photos?.length > 0) {
            photos.push({ __typename: "CoffeeShopPhoto", url: photo });
          } else {
            photos = [{ __typename: "CoffeeShopPhoto", url: photo }];
          }
        });
      }
      let shopCategories:
        | seeCoffeeShopsQuery_seeCoffeeShops_categories[]
        | null = null;
      if (categories) {
        shopCategories = getCategoryObj(categories);
      }
      const newCoffeeShop: seeCoffeeShopsQuery_seeCoffeeShops = {
        __typename: "CoffeeShop",
        id: resultData.id,
        name,
        totalLikes: 0,
        totalComments: 0,
        isLiked: false,
        photos,
        categories: shopCategories,
        user: {
          ...meData.me,
          isMe: true,
        },
      };
      const newCacheCoffeeShop = cache.writeFragment({
        data: newCoffeeShop,
        fragment: gql`
          fragment CoffeeShopFrag on CoffeeShop {
            id
            name
            totalLikes
            totalComments
            isLiked
            user {
              id
              username
              avatarURL
              isMe
            }
            photos {
              url
            }
            categories {
              name
              slug
            }
          }
        `,
      });
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeCoffeeShops(prev) {
            return [newCacheCoffeeShop, ...prev];
          },
        },
      });
      navigation.navigate("Home");
    }
  };

  const [createCoffeeShopMutation, { loading }] = useMutation<
    createCoffeeShopMutation,
    createCoffeeShopMutationVariables
  >(CREATE_COFFEE_SHOP_MUTATION, { update: updateAddCoffeeShop });

  const onSubmitValid = (data: IAddShopForm) => {
    if (!watch(Keys.name)) {
      setError({ key: Keys.name, message: "이름은 필수 입니다" });
      return;
    } else if (loading) {
      return;
    } else {
      const { name, categories, location: address } = data;
      const photos: ReactNativeFile[] = [];
      if (images && images?.length > 0) {
        images.forEach((image) => {
          const file = new ReactNativeFile({
            uri: image,
            name: `${Date.now()}.jpg`,
            type: "image/jpeg",
          });
          photos.push(file);
        });
      }
      createCoffeeShopMutation({
        variables: {
          name,
          categories,
          address,
          ...(photos.length > 0 && { photos }),
        },
      });
    }
  };

  useEffect(() => {
    register(Keys.name, {
      required: true,
    });
    register(Keys.categories);
    register("location");
  }, [register]);

  const goSelectPhoto = () => {
    navigation.navigate("Photo", {
      callbackScreen: "AddShop",
      photoLimit: 10,
    });
  };

  const onChangeText = (key: "name" | "categories", value: string) => {
    setError(undefined);
    setValue("result", "");
    setValue(key, value);
  };

  const categoriesRef = React.useRef<TextInput | null>(null);

  const onNext = (nextOne: React.MutableRefObject<TextInput | null>) => {
    nextOne?.current?.focus();
  };

  useEffect(() => {
    if (route.params?.images) {
      setImages(route.params?.images);
      setViewPhoto(route.params?.images[0]);
    }
  }, [route.params?.images]);

  return (
    <FormLayout>
      <Container>
        <Form>
          <ImageBox onPress={goSelectPhoto}>
            {images ? (
              <Image source={{ uri: viewPhoto || "" }} />
            ) : (
              <Icon name={"add"} size={50} />
            )}
          </ImageBox>
          {images && images?.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={{ flexDirection: "row" }}
              style={{ marginTop: 5 }}
            >
              {images?.map((photo) => (
                <ImageItem
                  selected={photo === viewPhoto}
                  key={`photo${photo}`}
                  onPress={() => {
                    setViewPhoto(photo);
                  }}
                >
                  <SmallImage
                    resizeMode="cover"
                    source={{ uri: photo || "" }}
                  />
                </ImageItem>
              ))}
            </ScrollView>
          )}
          <Input
            value={watch(Keys.name) || ""}
            onChangeText={(text) => onChangeText(Keys.name, text)}
            placeholder="커피숍 이름"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            returnKeyType="next"
            error={error?.key === Keys.name}
            onSubmitEditing={() => onNext(categoriesRef)}
          />
          <ErrorMsg msg={error?.key === Keys.name ? error.message : ""} />
          <Input
            ref={(ref) => (categoriesRef.current = ref)}
            value={watch(Keys.categories) || ""}
            onChangeText={(text) => onChangeText(Keys.categories, text)}
            placeholder="','를 이용하여 카테고리를 분류 해주세요"
            placeholderTextColor={
              darkMode
                ? darkTheme.placeholderTextColor
                : lightTheme.placeholderTextColor
            }
            returnKeyType="next"
            error={error?.key === Keys.categories}
          />
          <AddressInput setValue={setValue} watch={watch} />
          <Box style={{ marginTop: 10, width: "100%" }}>
            <Button
              onPress={handleSubmit(onSubmitValid)}
              text={"커피숍 추가하기"}
              errorMsg={watch("result")}
              loading={loading}
              disabled={!watch(Keys.name)}
            />
          </Box>
        </Form>
      </Container>
    </FormLayout>
  );
};
export default AddShop;
