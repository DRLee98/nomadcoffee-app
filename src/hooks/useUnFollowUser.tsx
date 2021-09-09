import { gql, useMutation } from "@apollo/client";
import {
  unfollowUserMutation,
  unfollowUserMutationVariables,
} from "../__generated__/unfollowUserMutation";

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUserMutation($id: Int!) {
    unfollowUser(id: $id) {
      ok
      error
    }
  }
`;

export default function useUnfollow() {
  return useMutation<unfollowUserMutation, unfollowUserMutationVariables>(
    UNFOLLOW_USER_MUTATION,
  );
}
