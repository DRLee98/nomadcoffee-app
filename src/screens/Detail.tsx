import {
  ApolloCache,
  FetchResult,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import gql from "graphql-tag";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CategoryItem from "../components/CategoryItem";
import DismissKeyboard from "../components/DismissKeyboard";
import FormLayout from "../components/form/FormLayout";
import { Image, Separator } from "../components/shared";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import {
  seeCoffeeShopQuery,
  seeCoffeeShopQuery_seeCoffeeShop_comments,
} from "../__generated__/seeCoffeeShopQuery";
import {
  toggleLikeMutation,
  toggleLikeMutationVariables,
} from "../__generated__/toggleLikeMutation";
import Comment from "../components/Comment";
import { isLoggedInVar } from "../apollo";
import useMe from "../hooks/useMe";
import { Input } from "../components/form/formShared";
import Button from "../components/form/Button";
import CommentInput from "../components/form/CommentInput";
import {
  deleteCoffeeShopMutation,
  deleteCoffeeShopMutationVariables,
} from "../__generated__/deleteCoffeeShopMutation";
import Loading from "../components/Loading";
import { useAppDispatch } from "../app/hooks";
import { editItem, removeItem } from "../app/store";

const SEE_COFFEE_SHOP_QUERY = gql`
  query seeCoffeeShopQuery($id: Int!) {
    seeCoffeeShop(id: $id) {
      id
      name
      address
      totalLikes
      totalComments
      isLiked
      user {
        id
        name
        email
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
      comments {
        id
        payload
        totalReply
        createdAt
        user {
          id
          username
          avatarURL
        }
      }
    }
  }
`;

const DELETE_COFFEE_SHOP_MUTATION = gql`
  mutation deleteCoffeeShopMutation($id: Int!) {
    deleteCoffeeShop(id: $id) {
      ok
      error
    }
  }
`;

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLikeMutation($shopId: Int!) {
    toggleLike(shopId: $shopId) {
      ok
      error
      isLiked
    }
  }
`;

const Container = styled.View`
  flex: 1;
  position: relative;
`;

const ScrollContainer = styled.ScrollView`
  max-width: 900px;
  padding: 5px;
  margin-bottom: 10px;
`;

const Box = styled.View``;

const ButtonBox = styled.View`
  margin-top: 5px;
  width: 100%;
`;

const ShopMain = styled.View`
  margin: auto;
  position: relative;
`;

const IconBox = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #ffffff4d;
  border-radius: 15px;
  z-index: 5;
`;

const IconText = styled.Text`
  margin-left: 2px;
`;

const Icon = styled(Ionicons)``;

const ShopName = styled.Text`
  font-weight: bold;
  left: 0;
  right: 0;
  top: 20px;
  text-align: center;
  padding: 10px;
  background-color: #ffffff4d;
  z-index: 5;
`;

const BigImg = styled.Image`
  max-width: 500px;
  max-height: 500px;
  background-color: black;
`;

const ImageItem = styled.TouchableOpacity<ImageItemProp>`
  width: 120px;
  height: 120px;
  padding: 10px;
  ${(props) =>
    props.selected ? `background-color: ${props.theme.accent};` : ""}
  margin-right: 5px;
`;

const SmallImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const UserBox = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
  background-color: ${(props) => props.theme.hoverColor};
`;

const UserName = styled.Text`
  color: ${(props) => props.theme.fontColor};
  font-weight: bold;
  font-size: 18px;
`;

const UserEmail = styled.Text`
  color: ${(props) => props.theme.fontColor};
`;

const CommentBox = styled.View`
  margin-top: 10px;
  padding: 10px;
  padding-bottom: 20px;
  background-color: ${(props) => props.theme.bgColor};
`;

const CommentText = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${(props) => props.theme.grayColor};
  border-style: solid;
  border-color: ${(props) => props.theme.grayColor};
`;

interface ImageItemProp {
  selected: boolean;
}

interface DetailProps {
  navigation: NavigationProp<RootSharedStackParamList, "Detail">;
  route: RouteProp<RootSharedStackParamList, "Detail">;
}

const Detail: React.FC<DetailProps> = ({ navigation, route }) => {
  const { data: meData } = useMe();
  const { width } = useWindowDimensions();
  const [url, setUrl] = useState<string>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery<seeCoffeeShopQuery>(
    SEE_COFFEE_SHOP_QUERY,
    {
      variables: { id: route.params.id },
    },
  );

  const [
    deleteCoffeeShopMutation,
    { data: deleteData, loading: deleteLoading },
  ] = useMutation<deleteCoffeeShopMutation, deleteCoffeeShopMutationVariables>(
    DELETE_COFFEE_SHOP_MUTATION,
  );

  const [toggleLikeMutation, { data: likeData, loading: likeLoading }] =
    useMutation<toggleLikeMutation, toggleLikeMutationVariables>(
      TOGGLE_LIKE_MUTATION,
    );

  const shop = data?.seeCoffeeShop;

  const refresh = async () => {
    console.log("refresh");
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const updateDeleteCoffeeShop = (
    cache: ApolloCache<deleteCoffeeShopMutation>,
    result: FetchResult<deleteCoffeeShopMutation>,
  ) => {
    const resultData = result.data?.deleteCoffeeShop;
    console.log(resultData);
    if (resultData?.ok) {
      navigation.navigate("Home");
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeCoffeeShops(prev) {
            return prev.filter(
              (item: any) => item.__ref !== `CoffeeShop:${route.params.id}`,
            );
          },
        },
      });
    }
  };

  const deleteShop = () => {
    Alert.alert("커피숍 삭제", `${shop?.name}을 삭제하시겠습니까?`, [
      {
        text: "삭제",
        onPress: () =>
          deleteCoffeeShopMutation({
            variables: { id: route.params.id },
            update: updateDeleteCoffeeShop,
          }),
      },
      {
        text: "취소",
      },
    ]);
  };

  const updateToggleLike = (
    cache: ApolloCache<toggleLikeMutation>,
    result: FetchResult<toggleLikeMutation>,
  ) => {
    const resultData = result.data?.toggleLike;
    if (resultData) {
      console.log(resultData);
      if (!resultData?.ok && resultData?.error) {
        console.log(resultData.error);
      } else if (resultData.isLiked) {
        cache.modify({
          id: `CoffeeShop:${route.params.id}`,
          fields: {
            totalLikes(prev) {
              return resultData.isLiked ? prev + 1 : prev - 1;
            },
            isLiked() {
              return resultData.isLiked;
            },
          },
        });
      }
    }
  };

  const handleToggleLike = () => {
    toggleLikeMutation({
      variables: { shopId: route.params.id },
      update: updateToggleLike,
    });
  };

  const goProfile = () => {
    if (shop) {
      if (shop?.user.isMe) {
        navigation.navigate("MyProfile");
      } else {
        navigation.navigate("Profile", { id: shop.user.id });
      }
    }
  };

  const goEditShop = () => {
    let categories = "";
    shop?.categories?.forEach((category, i) => {
      categories += i === 0 ? category?.name : `, ${category?.name}`;
    });
    const images: string[] = [];
    shop?.photos?.forEach((photo) => {
      images.push(photo.url);
    });
    if (shop) {
      navigation.navigate("EditShop", {
        id: shop?.id,
        name: shop?.name,
        categories,
        address: shop?.address,
        currentImages: images,
      });
    }
  };

  const renderItem = ({
    item,
  }: {
    item: seeCoffeeShopQuery_seeCoffeeShop_comments;
  }) => {
    return <Comment {...item} />;
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: shop?.name,
    });
    if (shop?.photos) {
      setUrl(shop?.photos[0]?.url);
    }
  }, [shop]);

  console.log(shop?.user);

  return (
    <FormLayout
      loading={loading}
      behavior={"position"}
      keyboardVerticalOffset={80}
    >
      <Container>
        {deleteLoading && <Loading />}
        <ScrollContainer
          style={{ width }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          <ShopMain>
            <BigImg
              style={{
                width: width > 900 ? width : width - 10,
                height: width > 900 ? width : width - 10,
              }}
              resizeMode="cover"
              source={{ uri: url || "" }}
            />
            <IconBox onPress={handleToggleLike}>
              <Icon
                name={shop?.isLiked ? "heart" : "heart-outline"}
                color={shop?.isLiked ? "red" : "black"}
                size={22}
              />
              <IconText>{shop?.totalLikes}</IconText>
            </IconBox>
          </ShopMain>
          {shop?.photos && shop?.photos?.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={{ flexDirection: "row" }}
              style={{ marginTop: 5 }}
            >
              {shop?.photos?.map((photo) => (
                <ImageItem
                  selected={photo?.url === url}
                  key={`photo${photo?.url}`}
                  onPress={() => {
                    setUrl(photo?.url);
                  }}
                >
                  <SmallImage
                    resizeMode="cover"
                    source={{ uri: photo?.url || "" }}
                  />
                </ImageItem>
              ))}
            </ScrollView>
          )}
          {shop?.categories && shop?.categories?.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={{ flexDirection: "row" }}
              style={{ marginTop: 5 }}
            >
              {shop?.categories?.map((category) => (
                <CategoryItem
                  {...category}
                  key={`category${category?.name}_${shop.id}`}
                />
              ))}
            </ScrollView>
          )}
          <UserBox onPress={goProfile}>
            <Image
              resizeMode="cover"
              source={{ uri: shop?.user?.avatarURL || "" }}
              style={{ width: 80, height: 80 }}
            />
            <Box style={{ marginLeft: 10 }}>
              <UserName>{shop?.user?.name}</UserName>
              <UserEmail>{shop?.user?.email}</UserEmail>
            </Box>
          </UserBox>
          {shop?.user.isMe && (
            <>
              <ButtonBox>
                <Button onPress={goEditShop} text={"수정하기"} />
              </ButtonBox>
              <ButtonBox>
                <Button
                  redBgColor={true}
                  onPress={deleteShop}
                  text={"삭제하기"}
                />
              </ButtonBox>
            </>
          )}
          <CommentBox>
            <CommentText style={{ borderBottomWidth: 1 }}>
              댓글 : {shop?.totalComments}
            </CommentText>
            {meData && shop && (
              <Box
                style={{
                  marginTop: 10,
                  padding: 5,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: meData.me?.avatarURL || "" }}
                  style={{ width: 40, height: 40 }}
                />
                <CommentInput shopId={shop.id} />
              </Box>
            )}
            {shop?.comments?.map((comment) => (
              <Comment key={`comment_${comment.id}`} {...comment} />
            ))}
          </CommentBox>
        </ScrollContainer>
      </Container>
    </FormLayout>
  );
};

export default Detail;
