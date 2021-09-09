import { ApolloCache, FetchResult } from "@apollo/client";
import React from "react";
import { FOLLOW_USER_FRAGMENT } from "../fragments";
import useFollow from "../hooks/useFollowUser";
import useMe from "../hooks/useMe";
import useUnfollow from "../hooks/useUnFollowUser";
import { SEE_FOLLOWING_QUERY } from "../screens/Following";
import { followUserMutation } from "../__generated__/followUserMutation";
import { seeFollowingQuery } from "../__generated__/seeFollowingQuery";
import { unfollowUserMutation } from "../__generated__/unfollowUserMutation";
import Button from "./form/Button";

interface FollowButtonProps {
  id: number;
  isFollowing?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ id, isFollowing }) => {
  const { data: meData } = useMe();
  const [followUserMutation, { data: followData, loading: followLoading }] =
    useFollow();
  const [
    unfollowUserMutation,
    { data: unfollowData, loading: unfollowLoading },
  ] = useUnfollow();

  const updateFollowUser = (
    cache: ApolloCache<followUserMutation>,
    result: FetchResult<followUserMutation>,
  ) => {
    const resultData = result.data?.followUser;
    if (!resultData?.ok && resultData?.error) {
      console.log(resultData.error);
    }
    cache.modify({
      id: `User:${id}`,
      fields: {
        isFollowing() {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });
    cache.modify({
      id: `User:${meData?.me?.id}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
    const readData: seeFollowingQuery | null = cache.readQuery({
      query: SEE_FOLLOWING_QUERY,
      variables: {
        id: meData?.me?.id,
      },
    });
    const followingUser = cache.readFragment({
      id: `User:${id}`,
      fragment: FOLLOW_USER_FRAGMENT,
    });
    const following = [
      ...(readData?.seeFollowing.following || []),
      followingUser,
    ];
    if (readData) {
      cache.writeQuery({
        query: SEE_FOLLOWING_QUERY,
        data: {
          seeFollowing: {
            ...readData.seeFollowing,
            following,
          },
        },
        variables: {
          id: meData?.me?.id,
        },
      });
    }
  };

  const updateUnfollowUser = (
    cache: ApolloCache<unfollowUserMutation>,
    result: FetchResult<unfollowUserMutation>,
  ) => {
    const resultData = result.data?.unfollowUser;
    if (!resultData?.ok && resultData?.error) {
      console.log(resultData.error);
    } else {
      cache.modify({
        id: `User:${id}`,
        fields: {
          isFollowing() {
            return false;
          },
          totalFollowers(prev) {
            return prev - 1;
          },
        },
      });
      cache.modify({
        id: `User:${meData?.me?.id}`,
        fields: {
          totalFollowing(prev) {
            return prev - 1;
          },
        },
      });
      const readData: seeFollowingQuery | null = cache.readQuery({
        query: SEE_FOLLOWING_QUERY,
        variables: {
          id: meData?.me?.id,
        },
      });
      if (readData) {
        cache.writeQuery({
          query: SEE_FOLLOWING_QUERY,
          data: {
            seeFollowing: {
              ...readData.seeFollowing,
              following: readData.seeFollowing.following?.filter(
                (user) => user.id !== id,
              ),
            },
          },
          variables: {
            id: meData?.me?.id,
          },
        });
      }
    }
  };

  const follow = () => {
    followUserMutation({
      variables: {
        id,
      },
      update: updateFollowUser,
    });
  };

  const unfollow = () => {
    unfollowUserMutation({
      variables: {
        id,
      },
      update: updateUnfollowUser,
    });
  };

  return isFollowing ? (
    <Button basicBgColor={true} onPress={unfollow} text={"팔로잉"} />
  ) : (
    <Button onPress={follow} text={"팔로우"} />
  );
};

export default FollowButton;
