import { gql, useQuery } from "@apollo/client";
import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import FollowUser from "../components/FollowUser";
import ScreenLayout from "../components/ScreenLayout";
import { Separator } from "../components/shared";
import { FOLLOW_USER_FRAGMENT } from "../fragments";
import { RootFollowTabParamList } from "../navigators/FollowNavi";
import {
  seeFollowingQuery,
  seeFollowingQuery_seeFollowing_following,
} from "../__generated__/seeFollowingQuery";

export const SEE_FOLLOWING_QUERY = gql`
  query seeFollowingQuery($id: Int!, $page: Int) {
    seeFollowing(id: $id, page: $page) {
      ok
      error
      totalPage
      following {
        ...FollowUserFragment
      }
    }
  }
  ${FOLLOW_USER_FRAGMENT}
`;

const Text = styled.Text``;

interface FollowingProps {
  route: RouteProp<RootFollowTabParamList, "Following">;
}

const Following: React.FC<FollowingProps> = ({ route }) => {
  const [following, setFollowing] = useState<
    seeFollowingQuery_seeFollowing_following[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data, loading, called, refetch, fetchMore } =
    useQuery<seeFollowingQuery>(SEE_FOLLOWING_QUERY, {
      variables: {
        id: route.params.id,
        page,
      },
    });

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const nextPage = () => {
    const totalPage = data?.seeFollowing?.totalPage;
    if (totalPage && totalPage > page) {
      fetchMore({
        variables: {
          page: page + 1,
        },
      }).then((fetchData) => {
        const loadFollowing = fetchData.data.seeFollowing?.following;
        if (loadFollowing) {
          setFollowing((prev) => [...prev, ...loadFollowing]);
        }
      });
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({
    item,
  }: {
    item: seeFollowingQuery_seeFollowing_following;
  }) => {
    return <FollowUser {...item} />;
  };

  useEffect(() => {
    if (data?.seeFollowing.following && following.length === 0) {
      setFollowing(data.seeFollowing.following);
    }
  }, [called, loading]);

  return (
    <ScreenLayout loading={false}>
      <FlatList
        style={{
          width: "100%",
          marginTop: 20,
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        ItemSeparatorComponent={() => <Separator />}
        onEndReachedThreshold={0.5}
        onEndReached={nextPage}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        data={data?.seeFollowing.following}
        keyExtractor={(following) => following.id + ""}
      />
    </ScreenLayout>
  );
};

export default Following;
