import { gql, useLazyQuery, useReactiveVar } from "@apollo/client";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { FlatList, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { darkModeVar } from "../apollo";
import DismissKeyboard from "../components/DismissKeyboard";
import ScreenLayout from "../components/ScreenLayout";
import SimpleShopItem from "../components/SimpleShopItem";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { darkTheme, lightTheme } from "../styles";
import {
  searchCoffeeShopQuery,
  searchCoffeeShopQueryVariables,
  searchCoffeeShopQuery_searchCoffeeShop_shops,
} from "../__generated__/searchCoffeeShopQuery";
import Ionicons from "react-native-vector-icons/Ionicons";

const SEARCH_COFFEE_SHOP_QUERY = gql`
  query searchCoffeeShopQuery($word: String!, $page: Int) {
    searchCoffeeShop(word: $word, page: $page) {
      totalPage
      totalCount
      shops {
        id
        name
        photos {
          url
        }
      }
    }
  }
`;

const SearchInput = styled.TextInput`
  width: 80%;
  min-width: 200px;
  max-width: 700px;
  background-color: ${(props) => props.theme.wrapperBg};
  color: ${(props) => props.theme.fontColor};
  padding: 8px;
  border-radius: 10px;
`;

const IconBox = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Icon = styled(Ionicons)`
  color: ${(props) => props.theme.grayColor};
  opacity: 0.5;
`;

interface SearchProps {
  navigation: NavigationProp<RootSharedStackParamList, "Search">;
}

const Search: React.FC<SearchProps> = ({ navigation }) => {
  const darkMode = useReactiveVar(darkModeVar);
  const { width } = useWindowDimensions();
  const numColumns = width > 900 ? 4 : 2;
  const [shops, setShops] = useState<
    searchCoffeeShopQuery_searchCoffeeShop_shops[] | []
  >([]);
  const [word, setWord] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchCoffeeShopQuery, { loading, data, refetch, fetchMore }] =
    useLazyQuery<searchCoffeeShopQuery, searchCoffeeShopQueryVariables>(
      SEARCH_COFFEE_SHOP_QUERY,
    );

  const refresh = async () => {
    if (refetch) {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    }
  };
  const nextPage = () => {
    if (fetchMore) {
      setPage((prev) => prev + 1);
      console.log(page);
      const totalPage = data?.searchCoffeeShop?.totalPage;
      if (totalPage && totalPage >= page) {
        fetchMore({
          variables: {
            page,
            word,
          },
        });
      }
    }
  };

  const renderItem = ({
    item,
  }: {
    item: searchCoffeeShopQuery_searchCoffeeShop_shops;
  }) => {
    return <SimpleShopItem {...item} numColumns={numColumns} />;
  };

  const changeText = (text: string) => {
    setWord(text);
    setPage(1);
    setShops([]);
    searchCoffeeShopQuery({ variables: { page, word: text } });
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchInput
          onChangeText={changeText}
          placeholder="검색어를 입력해주세요"
          placeholderTextColor={
            darkMode
              ? darkTheme.placeholderTextColor
              : lightTheme.placeholderTextColor
          }
        />
      ),
      headerTitleStyle: {
        textAlign: "center",
        width: "100%",
      },
    });
  }, []);

  useEffect(() => {
    const resultShop = data?.searchCoffeeShop?.shops || [];
    setShops((prev) => [...prev, ...resultShop]);
  }, [data]);

  return (
    <ScreenLayout loading={loading}>
      <DismissKeyboard>
        {shops.length > 0 ? (
          <FlatList
            numColumns={numColumns}
            style={{
              width: "100%",
              marginTop: 20,
              marginBottom: 20,
            }}
            refreshing={refreshing}
            onRefresh={refresh}
            onEndReachedThreshold={0}
            onEndReached={nextPage}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            data={shops}
            keyExtractor={(shop) => shop?.id + ""}
          />
        ) : (
          <IconBox>
            <Icon name="search" size={100} />
          </IconBox>
        )}
      </DismissKeyboard>
    </ScreenLayout>
  );
};

export default Search;
