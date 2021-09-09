import { gql, useMutation } from "@apollo/client";
import {
  followUserMutation,
  followUserMutationVariables,
} from "../__generated__/followUserMutation";

const FOLLOW_USER_MUTATION = gql`
  mutation followUserMutation($id: Int!) {
    followUser(id: $id) {
      ok
      error
    }
  }
`;

export default function useFollow() {
  return useMutation<followUserMutation, followUserMutationVariables>(
    FOLLOW_USER_MUTATION,
  );
}
