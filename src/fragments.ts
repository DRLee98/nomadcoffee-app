import { gql } from "@apollo/client";

export const FOLLOW_USER_FRAGMENT = gql`
  fragment FollowUserFragment on User {
    id
    username
    name
    avatarURL
    isMe
    isFollowing
  }
`;
