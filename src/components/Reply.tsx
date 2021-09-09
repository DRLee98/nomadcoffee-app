import React, { useState } from "react";
import styled from "styled-components/native";
import { seeCoffeeShopQuery_seeCoffeeShop_comments } from "../__generated__/seeCoffeeShopQuery";
import { seeRepliesQuery_seeReplies } from "../__generated__/seeRepliesQuery";
import { Image } from "./shared";

const Container = styled.View`
  padding: 5px;
  margin-left: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Box = styled.View``;

const Touchable = styled.TouchableOpacity``;

const UserName = styled.Text`
  color: ${(props) => props.theme.fontColor};
  font-weight: bold;
  font-size: 10px;
`;

const CreatedAt = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 8px;
  margin-left: 3px;
`;

const Payload = styled.Text`
  color: ${(props) => props.theme.fontColor};
`;

const Reply: React.FC<seeRepliesQuery_seeReplies> = ({
  id,
  payload,
  createdAt,
  user,
}) => {
  return (
    <Container>
      <Touchable>
        <Image
          source={{ uri: user.avatarURL || "" }}
          style={{ width: 30, height: 30 }}
        />
      </Touchable>
      <Box style={{ marginLeft: 5 }}>
        <Box style={{ flexDirection: "row" }}>
          <UserName>{user.username}</UserName>
          <CreatedAt>{new Date(+createdAt).toLocaleDateString()}</CreatedAt>
        </Box>
        <Payload>{payload}</Payload>
      </Box>
    </Container>
  );
};

export default Reply;
