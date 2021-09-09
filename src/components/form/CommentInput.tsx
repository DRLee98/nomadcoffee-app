import {
  ApolloCache,
  FetchResult,
  useMutation,
  useReactiveVar,
} from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import styled from "styled-components/native";
import { darkModeVar } from "../../apollo";
import { darkTheme, lightTheme } from "../../styles";
import { Input } from "./formShared";
import Button from "./Button";
import {
  createCommentMutation,
  createCommentMutationVariables,
} from "../../__generated__/createCommentMutation";
import useMe from "../../hooks/useMe";
import { set } from "react-hook-form";

const CREATE_COMMENT_MUTATION = gql`
  mutation createCommentMutation($shopId: Int!, $payload: String!) {
    createComment(shopId: $shopId, payload: $payload) {
      id
      ok
      error
    }
  }
`;

const Container = styled.View`
  width: 95%;
  flex-direction: row;
`;

const SCommentInput = styled(Input)`
  color: ${(props) => props.theme.fontColor};
  width: 100%;
  border-style: solid;
  border-color: ${(props) => props.theme.accent};
  border-bottom-width: 1px;
`;

const ButtonBox = styled.View`
  width: 20%;
`;

interface CommentInputProps {
  shopId: number;
}

const CommentInput: React.FC<CommentInputProps> = ({ shopId }) => {
  const darkMode = useReactiveVar(darkModeVar);
  const { data: meData } = useMe();
  const [payload, setPayload] = useState<string>();
  const [createCommentMutation, { data, loading }] = useMutation<
    createCommentMutation,
    createCommentMutationVariables
  >(CREATE_COMMENT_MUTATION);

  const changeText = (text: string) => {
    setPayload(text);
  };

  const updateCreateComment = (
    cache: ApolloCache<createCommentMutation>,
    result: FetchResult<createCommentMutation>,
  ) => {
    const resultData = result.data?.createComment;
    if (meData) {
      if (!resultData?.ok && resultData?.error) {
        console.log(resultData.error);
      } else {
        const newComment = {
          __typename: "Comment",
          id: resultData?.id,
          payload,
          totalReply: 0,
          createdAt: new Date(),
          user: {
            ...meData.me,
          },
        };
        setPayload("");
        const newCacheComment = cache.writeFragment({
          data: newComment,
          fragment: gql`
            fragment CommentFrag on Comment {
              id
              payload
              totalReply
              createdAt
              user {
                id
                username
                avatarURL
              }
            }
          `,
        });
        cache.modify({
          id: `CoffeeShop:${shopId}`,
          fields: {
            totalComments(prev) {
              return prev + 1;
            },
            comments(prev) {
              return [newCacheComment, ...prev];
            },
          },
        });
      }
    }
  };

  const createComment = () => {
    console.log("create");
    if (!loading && payload) {
      createCommentMutation({
        variables: {
          payload,
          shopId,
        },
        update: updateCreateComment,
      });
    }
  };

  return (
    <Container>
      <SCommentInput
        value={payload}
        onChangeText={changeText}
        placeholder="댓글을 입력해주세요"
        placeholderTextColor={
          darkMode
            ? darkTheme.placeholderTextColor
            : lightTheme.placeholderTextColor
        }
        returnKeyType="done"
        onSubmitEditing={createComment}
      />
    </Container>
  );
};

export default CommentInput;
