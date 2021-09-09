import { useLazyQuery, useReactiveVar } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import styled from "styled-components/native";
import { isLoggedInVar } from "../apollo";
import { seeCoffeeShopQuery_seeCoffeeShop_comments } from "../__generated__/seeCoffeeShopQuery";
import {
  seeRepliesQuery,
  seeRepliesQueryVariables,
} from "../__generated__/seeRepliesQuery";
import ReplyInput from "./form/ReplyInput";
import Loading from "./Loading";
import Reply from "./Reply";
import { Image } from "./shared";

export const SEE_REPLIES_QUERY = gql`
  query seeRepliesQuery($commentId: Int!) {
    seeReplies(commentId: $commentId) {
      id
      payload
      createdAt
      user {
        id
        username
        avatarURL
      }
    }
  }
`;

const Container = styled.View`
  padding: 5px;
  position: relative;
`;

const CommentBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Box = styled.View``;

const Touchable = styled.TouchableOpacity``;

const UserName = styled.Text`
  color: ${(props) => props.theme.fontColor};
  font-weight: bold;
  font-size: 12px;
`;

const CreatedAt = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 10px;
  margin-left: 3px;
`;

const Payload = styled.Text`
  color: ${(props) => props.theme.fontColor};
`;

const ReplyBtnText = styled.Text`
  color: ${(props) => props.theme.accent};
`;

const ReplyContainer = styled.View`
  padding: 10px;
`;

const Comment: React.FC<seeCoffeeShopQuery_seeCoffeeShop_comments> = ({
  id,
  payload,
  totalReply,
  createdAt,
  user,
}) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const [seeRepliesQuery, { data, loading, called }] = useLazyQuery<
    seeRepliesQuery,
    seeRepliesQueryVariables
  >(SEE_REPLIES_QUERY);

  const [openReply, setOpenReply] = useState<boolean>(false);

  const toggleOpenReply = () => {
    setOpenReply((prev) => !prev);
    if (!called) {
      seeRepliesQuery({ variables: { commentId: id } });
    }
    console.log(data);
  };

  return (
    <Container>
      {loading && <Loading />}
      <CommentBox>
        <Box style={{ flexDirection: "row" }}>
          <Touchable>
            <Image
              source={{ uri: user.avatarURL || "" }}
              style={{ width: 40, height: 40 }}
            />
          </Touchable>
          <Box style={{ marginLeft: 5 }}>
            <Box style={{ flexDirection: "row" }}>
              <UserName>{user.username}</UserName>
              <CreatedAt>{new Date(+createdAt).toLocaleDateString()}</CreatedAt>
            </Box>
            <Payload>{payload}</Payload>
          </Box>
        </Box>
        <Box>
          <Box>
            {totalReply > 0 && (
              <Touchable onPress={toggleOpenReply}>
                <ReplyBtnText>
                  {openReply
                    ? `답글 ${totalReply}개 숨기기`
                    : `답글 ${totalReply}개 보기`}
                </ReplyBtnText>
              </Touchable>
            )}
            {totalReply === 0 && isLoggedIn && (
              <Touchable onPress={toggleOpenReply}>
                <ReplyBtnText>답글 작성하기</ReplyBtnText>
              </Touchable>
            )}
          </Box>
        </Box>
      </CommentBox>
      {openReply && (
        <ReplyContainer>
          {isLoggedIn && <ReplyInput commentId={id} />}
          {data?.seeReplies?.map((reply) => (
            <Reply {...reply} key={`reply_${reply.id}`} />
          ))}
        </ReplyContainer>
      )}
    </Container>
  );
};

export default Comment;
