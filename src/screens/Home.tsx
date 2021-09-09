import { useQuery, useReactiveVar } from "@apollo/client";
import { NavigationProp } from "@react-navigation/native";
import gql from "graphql-tag";
import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { useEffect } from "react";
import { FlatList, Text, useWindowDimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Logo from "../components/Logo";
import ScreenLayout from "../components/ScreenLayout";
import { Separator } from "../components/shared";
import ShopItem from "../components/ShopItem";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import {
  seeCoffeeShopsQuery,
  seeCoffeeShopsQuery_seeCoffeeShops,
} from "../__generated__/seeCoffeeShopsQuery";
import DarkModeBtn from "../components/DarkMode";
import { isLoggedInVar } from "../apollo";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addArray } from "../app/store";

const SEE_COFFEE_SHOPS_QUERY = gql`
  query seeCoffeeShopsQuery($page: Int) {
    seeCoffeeShops(page: $page) {
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
  }
`;

const Box = styled.View`
  flex-direction: row;
`;

const TouchBox = styled.TouchableOpacity`
  margin-right: 10px;
`;

const Icon = styled(Ionicons)`
  color: ${(props) => props.theme.accent};
`;

interface HomeProps {
  navigation: NavigationProp<RootSharedStackParamList, "Home">;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { width } = useWindowDimensions();
  const numColumns = width > 900 ? 2 : 1;
  const [page, setPage] = useState<number>(1);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const flatListRef =
    useRef<FlatList<seeCoffeeShopsQuery_seeCoffeeShops | null> | null>();
  const { data, loading, refetch, fetchMore, called } =
    useQuery<seeCoffeeShopsQuery>(SEE_COFFEE_SHOPS_QUERY, {
      variables: { page },
    });
  const refresh = async () => {
    setRefreshing(true);
    await setPage(1);
    await refetch();
    setRefreshing(false);
  };
  const nextPage = () => {
    if (!loading && loadMore) {
      console.log("next");
      fetchMore({
        variables: {
          page: page + 1,
        },
      });
    }
    setPage((prev) => prev + 1);
  };

  const renderItem = ({
    item,
  }: {
    item: seeCoffeeShopsQuery_seeCoffeeShops;
  }) => {
    return <ShopItem {...item} numColumns={numColumns} />;
  };

  const goAddShop = () => {
    navigation.navigate("AddShop");
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: Logo,
      headerRight: () => (
        <Box>
          {isLoggedIn && (
            <TouchBox onPress={goAddShop}>
              <Icon name={"add-circle"} size={22} />
            </TouchBox>
          )}
          <DarkModeBtn />
        </Box>
      ),
    });
  }, []);

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        numColumns={numColumns}
        style={{
          width: "100%",
          marginTop: 20,
          margin: 20,
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        ItemSeparatorComponent={() => <Separator />}
        onEndReachedThreshold={0.5}
        onEndReached={nextPage}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        data={data?.seeCoffeeShops}
        keyExtractor={(shop) => shop?.id + ""}
      />
    </ScreenLayout>
  );
};

export default Home;
