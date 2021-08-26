import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logout } from "../apollo";
import { simpleMeQuery } from "../__generated__/simpleMeQuery";

const SIMPLE_ME_QUERY = gql`
  query simpleMeQuery {
    me {
      id
      username
      avatarURL
    }
  }
`;

export default function useMe() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery<simpleMeQuery>(SIMPLE_ME_QUERY, {
    skip: !hasToken,
  });
  useEffect(() => {
    if (data?.me === null) {
      logout();
    }
  }, [data]);
  return { data };
}
