import {
  ApolloCache,
  FetchResult,
  useApolloClient,
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
  createReplyMutation,
  createReplyMutationVariables,
} from "../../__generated__/createReplyMutation";
import useMe from "../../hooks/useMe";
import { SEE_REPLIES_QUERY } from "../Comment";
import { seeRepliesQuery } from "../../__generated__/seeRepliesQuery";
import { Image } from "../shared";

const CREATE_REPLY_MUTATION = gql`
  mutation createReplyMutation($commentId: Int!, $payload: String!) {
    createReply(commentId: $commentId, payload: $payload) {
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

const SReplyInput = styled(Input)`
  color: ${(props) => props.theme.fontColor};
  width: 100%;
  border-style: solid;
  border-color: ${(props) => props.theme.accent};
  border-bottom-width: 1px;
`;

const ButtonBox = styled.View`
  width: 20%;
`;

interface ReplyInputProps {
  commentId: number;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ commentId }) => {
  const darkMode = useReactiveVar(darkModeVar);
  const { data: meData } = useMe();
  const [payload, setPayload] = useState<string>();
  const [createReplyMutation, { data, loading }] = useMutation<
    createReplyMutation,
    createReplyMutationVariables
  >(CREATE_REPLY_MUTATION);

  const changeText = (text: string) => {
    setPayload(text);
  };

  const updatecreateReply = (
    cache: ApolloCache<createReplyMutation>,
    result: FetchResult<createReplyMutation>,
  ) => {
    const resultData = result.data?.createReply;
    if (meData) {
      if (!resultData?.ok && resultData?.error) {
        console.log(resultData.error);
      } else {
        const newReply = {
          __typename: "Reply",
          id: resultData?.id,
          payload,
          createdAt: new Date(),
          user: {
            ...meData.me,
          },
        };
        setPayload("");
        cache.modify({
          id: `Comment:${commentId}`,
          fields: {
            totalReply(prev) {
              return prev + 1;
            },
          },
        });
        const readData: seeRepliesQuery | null = cache.readQuery({
          query: SEE_REPLIES_QUERY,
          variables: {
            commentId,
          },
        });
        cache.writeQuery({
          query: SEE_REPLIES_QUERY,
          data: {
            seeReplies: [newReply, ...(readData?.seeReplies || [])],
          },
          variables: {
            commentId,
          },
        });
      }
    }
  };

  const createReply = () => {
    console.log("create");
    if (!loading && payload) {
      createReplyMutation({
        variables: {
          payload,
          commentId,
        },
        update: updatecreateReply,
      });
    }
  };

  return (
    <Container>
      <Image
        source={{ uri: meData?.me?.avatarURL || "" }}
        style={{ width: 30, height: 30 }}
      />
      <SReplyInput
        value={payload}
        onChangeText={changeText}
        placeholder="답글을 입력해주세요"
        placeholderTextColor={
          darkMode
            ? darkTheme.placeholderTextColor
            : lightTheme.placeholderTextColor
        }
        returnKeyType="done"
        onSubmitEditing={createReply}
      />
    </Container>
  );
};

export default ReplyInput;
