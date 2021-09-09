import { useReactiveVar } from "@apollo/client";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { isLoggedInVar } from "../apollo";
import useMe from "../hooks/useMe";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { FollowUserFragment } from "../__generated__/FollowUserFragment";
import FollowButton from "./FollowButton";
import Button from "./form/Button";
import { Image } from "./shared";

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background-color: ${(props) => props.theme.bgColor};
`;

const Touchable = styled.TouchableOpacity``;

const Box = styled.View``;

const Username = styled.Text`
  font-weight: bold;
  color: ${(props) => props.theme.fontColor};
`;

const Name = styled.Text`
  color: ${(props) => props.theme.grayColor};
`;

const FollowUser: React.FC<FollowUserFragment> = ({
  id,
  username,
  name,
  avatarURL,
  isMe,
  isFollowing,
}) => {
  const hasToken = useReactiveVar(isLoggedInVar);
  const navigation = useNavigation<NavigationProp<RootSharedStackParamList>>();
  const { data: meData } = useMe();

  const goProfile = (id: number) => {
    if (meData?.me?.id === id) {
      navigation.navigate("MyProfile");
    } else {
      navigation.navigate("Profile", { id });
    }
  };

  return (
    <Container>
      <Touchable onPress={() => goProfile(id)} style={{ flexDirection: "row" }}>
        <Image
          resizeMode="cover"
          style={{ height: 40, width: 40 }}
          source={{ uri: avatarURL || "" }}
        />
        <Box style={{ justifyContent: "center", marginLeft: 10 }}>
          <Username>{username}</Username>
          <Name>{name}</Name>
        </Box>
      </Touchable>
      {hasToken && !isMe && (
        <Box style={{ width: "20%" }}>
          <FollowButton id={id} isFollowing={isFollowing} />
        </Box>
      )}
    </Container>
  );
};

export default FollowUser;
