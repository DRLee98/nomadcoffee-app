import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { NavigationProp, RouteProp } from "@react-navigation/native";
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
  seeCategoryQuery,
  seeCategoryQuery_seeCategory_shops,
} from "../__generated__/seeCategoryQuery";
import Ionicons from "react-native-vector-icons/Ionicons";

const SEE_CATEGORY_QUERY = gql`
  query seeCategoryQuery($slug: String!, $page: Int) {
    seeCategory(slug: $slug, page: $page) {
      totalShops
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

const Box = styled.View`
  flex: 1;
  padding: 10px 0;
  align-items: center;
`;

const CategoryTitleBox = styled.View`
  text-align: center;
  border-radius: 20px;
  border: 2px solid ${(props) => props.theme.accent};
  padding: 2px 20px;
  background-color: ${(props) => props.theme.bgColor};
`;

const CategoryTitleText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.accent};
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

interface CategoryProps {
  navigation: NavigationProp<RootSharedStackParamList, "Category">;
  route: RouteProp<RootSharedStackParamList, "Category">;
}

const Category: React.FC<CategoryProps> = ({ navigation, route }) => {
  const darkMode = useReactiveVar(darkModeVar);
  const { width } = useWindowDimensions();
  const numColumns = width > 900 ? 4 : 2;
  const [shops, setShops] = useState<seeCategoryQuery_seeCategory_shops[] | []>(
    [],
  );
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { loading, data, refetch, fetchMore, called } =
    useQuery<seeCategoryQuery>(SEE_CATEGORY_QUERY, {
      variables: {
        slug: route.params.slug,
        page,
      },
    });

  const refresh = async () => {
    if (refetch) {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    }
  };

  const nextPage = () => {
    if (loadMore && shops.length >= 30) {
      console.log(page);
      fetchMore({
        variables: {
          slug: route.params.slug,
          page: page + 1,
        },
      }).then(({ data }) => {
        if (data.seeCategory?.shops && data.seeCategory?.shops?.length < 30) {
          setLoadMore(false);
        }
      });
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({
    item,
  }: {
    item: seeCategoryQuery_seeCategory_shops;
  }) => {
    return <SimpleShopItem {...item} numColumns={numColumns} />;
  };

  useEffect(() => {
    const resultShop = data?.seeCategory?.shops || [];
    if (resultShop && shops.length === 0) {
      setShops(resultShop);
      if (resultShop.length < 30) {
        setLoadMore(false);
      }
    }
  }, [called, loading]);

  return (
    <ScreenLayout loading={loading}>
      <DismissKeyboard>
        <Box>
          <CategoryTitleBox>
            <CategoryTitleText>{route.params.name}</CategoryTitleText>
          </CategoryTitleBox>
          {shops.length > 0 ? (
            <FlatList
              numColumns={numColumns}
              style={{
                width: "100%",
                marginTop: 10,
                marginBottom: 10,
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
        </Box>
      </DismissKeyboard>
    </ScreenLayout>
  );
};

export default Category;
