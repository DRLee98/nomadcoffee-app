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
  editCoffeeShopMutation,
  editCoffeeShopMutationVariables,
} from "../__generated__/editCoffeeShopMutation";
import FormLayout from "../components/form/FormLayout";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { darkTheme, lightTheme } from "../styles";
import { darkModeVar } from "../apollo";
import { ScrollView, TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ReactNativeFile } from "apollo-upload-client";
import useMe from "../hooks/useMe";
import { getCategoryObj } from "../utils";
import {
  seeCoffeeShopsQuery_seeCoffeeShops_categories,
  seeCoffeeShopsQuery_seeCoffeeShops_photos,
} from "../__generated__/seeCoffeeShopsQuery";
import { useAppDispatch } from "../app/hooks";
import { editItem } from "../app/store";

const EDIT_COFFEE_SHOP_MUTATION = gql`
  mutation editCoffeeShopMutation(
    $id: Int!
    $name: String
    $latitude: String
    $longitude: String
    $address: String
    $categories: String
    $photos: [Upload]
  ) {
    editCoffeeShop(
      id: $id
      name: $name
      latitude: $latitude
      longitude: $longitude
      address: $address
      categories: $categories
      photos: $photos
    ) {
      ok
      error
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

interface IEditShopForm {
  name?: string;
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

interface EditShopProps {
  navigation: NavigationProp<RootSharedStackParamList, "EditShop">;
  route: RouteProp<RootSharedStackParamList, "EditShop">;
}

const EditShop: React.FC<EditShopProps> = ({ navigation, route }) => {
  const id = route.params.id;
  const { data: meData } = useMe();
  const darkMode = useReactiveVar(darkModeVar);
  const [images, setImages] = useState<string[]>();
  const [viewPhoto, setViewPhoto] = useState<string>();
  const [imageChange, setImageChange] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState>();
  const { register, handleSubmit, getValues, setValue, watch } =
    useForm<IEditShopForm>({
      defaultValues: {
        name: route.params.name,
        categories: route.params.categories,
        location: route.params.address || "",
      },
    });

  const updateEditCoffeeShop = (
    cache: ApolloCache<editCoffeeShopMutation>,
    result: FetchResult<editCoffeeShopMutation>,
  ) => {
    const resultData = result.data?.editCoffeeShop;
    console.log(resultData);
    if (resultData?.ok) {
      const { name, categories, location } = getValues();
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
      cache.modify({
        id: `CoffeeShop:${id}`,
        fields: {
          name() {
            if (name) {
              return name;
            }
          },
          photos() {
            if (photos && photos.length > 0) {
              return photos;
            }
          },
          categories() {
            if (shopCategories && shopCategories.length > 0) {
              return shopCategories;
            }
          },
          address() {
            if (location) {
              return location;
            }
          },
        },
      });
      navigation.navigate("Detail", { id });
    }
  };

  const [editCoffeeShopMutation, { loading }] = useMutation<
    editCoffeeShopMutation,
    editCoffeeShopMutationVariables
  >(EDIT_COFFEE_SHOP_MUTATION, { update: updateEditCoffeeShop });

  const onSubmitValid = (data: IEditShopForm) => {
    if (loading) {
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
      console.log(id);
      console.log(photos);
      editCoffeeShopMutation({
        variables: {
          id,
          ...(name && { name }),
          ...(categories && { categories }),
          ...(address && { address }),
          ...(imageChange && { photos }),
        },
      });
    }
  };

  useEffect(() => {
    register(Keys.name);
    register(Keys.categories);
    register("location");
  }, [register]);

  const goSelectPhoto = () => {
    navigation.navigate("Photo", {
      callbackScreen: "EditShop",
      photoLimit: 10,
      id,
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
      setImageChange(true);
      setImages(route.params?.images);
      setViewPhoto(route.params?.images[0]);
    }
  }, [route.params?.images]);

  useEffect(() => {
    if (route.params?.currentImages) {
      setImages(route.params?.currentImages);
      setViewPhoto(route.params?.currentImages[0]);
    }
  }, [route.params?.currentImages]);

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
              text={"커피숍 수정하기"}
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
export default EditShop;
