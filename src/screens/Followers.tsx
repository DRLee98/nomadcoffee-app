import { gql, useQuery } from "@apollo/client";
import { RouteProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useState } from "react";
import { FlatList } from "react-native";
import FollowUser from "../components/FollowUser";
import ScreenLayout from "../components/ScreenLayout";
import { Separator } from "../components/shared";
import { FOLLOW_USER_FRAGMENT } from "../fragments";
import { RootFollowTabParamList } from "../navigators/FollowNavi";
import {
  seeFollowersQuery,
  seeFollowersQuery_seeFollowers_followers,
} from "../__generated__/seeFollowersQuery";

const SEE_FOLLOWERS_QUERY = gql`
  query seeFollowersQuery($id: Int!, $page: Int) {
    seeFollowers(id: $id, page: $page) {
      ok
      error
      totalPage
      followers {
        ...FollowUserFragment
      }
    }
  }
  ${FOLLOW_USER_FRAGMENT}
`;

interface FollowersProps {
  route: RouteProp<RootFollowTabParamList, "Followers">;
}

const Followers: React.FC<FollowersProps> = ({ route }) => {
  const [followers, setFollowers] = useState<
    seeFollowersQuery_seeFollowers_followers[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data, loading, called, refetch, fetchMore } =
    useQuery<seeFollowersQuery>(SEE_FOLLOWERS_QUERY, {
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
    const totalPage = data?.seeFollowers?.totalPage;
    if (totalPage && totalPage > page) {
      fetchMore({
        variables: {
          page: page + 1,
        },
      }).then((fetchData) => {
        const loadFollowers = fetchData.data.seeFollowers?.followers;
        if (loadFollowers) {
          setFollowers((prev) => [...prev, ...loadFollowers]);
        }
      });
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({
    item,
  }: {
    item: seeFollowersQuery_seeFollowers_followers;
  }) => {
    return <FollowUser {...item} />;
  };

  useEffect(() => {
    console.log("called");
    if (data?.seeFollowers.followers && followers.length === 0) {
      setFollowers(data.seeFollowers.followers);
    }
  }, [called, loading]);

  console.log(data);

  return (
    <ScreenLayout loading={loading}>
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
        data={data?.seeFollowers.followers}
        keyExtractor={(follower) => follower.id + ""}
      />
    </ScreenLayout>
  );
};

export default Followers;
