import { useQuery } from "@apollo/client";
import { NavigationProp } from "@react-navigation/native";
import gql from "graphql-tag";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { FlatList, Text, useWindowDimensions } from "react-native";
import Logo from "../components/Logo";
import ScreenLayout from "../components/ScreenLayout";
import { Separator } from "../components/shared";
import ShopItem from "../components/ShopItem";
import { RootTabParamList } from "../navigators/MainTabsNavi";
import {
  seeCoffeeShopsQuery,
  seeCoffeeShopsQuery_seeCoffeeShops,
  seeCoffeeShopsQuery_seeCoffeeShops_shops,
} from "../__generated__/seeCoffeeShopsQuery";

const SEE_COFFEE_SHOPS_QUERY = gql`
  query seeCoffeeShopsQuery($page: Int) {
    seeCoffeeShops(page: $page) {
      totalPage
      totalCount
      shops {
        id
        name
        user {
          id
          username
          avatarURL
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
  }
`;

interface HomeProps {
  navigation: NavigationProp<RootTabParamList, "Home">;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const numColumns = width > 900 ? 2 : 1;
  const [page, setPage] = useState<number>(1);
  const [shops, setShops] = useState<
    seeCoffeeShopsQuery_seeCoffeeShops_shops[] | []
  >([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const flatListRef =
    useRef<FlatList<seeCoffeeShopsQuery_seeCoffeeShops | null> | null>();
  const { data, loading, refetch, fetchMore, called } =
    useQuery<seeCoffeeShopsQuery>(SEE_COFFEE_SHOPS_QUERY, {
      variables: { page },
    });
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const nextPage = () => {
    console.log("next");
    const totalPage = data?.seeCoffeeShops?.totalPage;
    if (totalPage && totalPage > page) {
      fetchMore({
        variables: {
          page: page + 1,
        },
      }).then((fetchData) => {
        const loadShops = fetchData.data.seeCoffeeShops?.shops;
        if (loadShops) {
          setShops((prev) => [...prev, ...loadShops]);
        }
      });
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({
    item,
  }: {
    item: seeCoffeeShopsQuery_seeCoffeeShops_shops;
  }) => {
    return <ShopItem {...item} numColumns={numColumns} />;
  };

  useEffect(() => {
    console.log("call");
    if (data?.seeCoffeeShops?.shops && data.seeCoffeeShops.shops !== null) {
      setShops(data.seeCoffeeShops.shops);
    }
  }, [called]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: Logo,
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
        data={shops}
        keyExtractor={(shop) => Date.now().toString() + shop?.id}
      />
    </ScreenLayout>
  );
};

export default Home;
