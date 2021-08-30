import { gql, useQuery } from "@apollo/client";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { logout } from "../apollo";
import Button from "../components/form/Button";
import ScreenLayout from "../components/ScreenLayout";
import { Image } from "../components/shared";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { meQuery } from "../__generated__/meQuery";

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      username
      email
      name
      avatarURL
      totalFollowing
      totalFollowers
    }
  }
`;

const UserProfileContainer = styled.View``;

const UserInfoBox = styled.View`
  margin: 10px 0;
  align-items: center;
`;

const Username = styled.Text`
  font-weight: bold;
  font-size: 25;
  color: ${(props) => props.theme.accent};
`;

const Name = styled.Text`
  font-weight: bold;
  font-size: 18;
  color: ${(props) => props.theme.grayColor};
`;

const Email = styled.Text`
  color: ${(props) => props.theme.grayColor};
  margin-bottom: 10px;
`;

const FollowContainer = styled.View`
  max-width: 300px;
  padding: 8px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 5px;
`;

const FollowText = styled.Text`
  text-align: center;
  font-weight: bold;
`;

const FollowValue = styled.Text`
  text-align: center;
`;

const FollowContentsBox = styled.TouchableOpacity`
  width: 50%;
  border-color: ${(props) => props.theme.accent};
`;

interface MyProfileProps {
  navigation: NavigationProp<RootSharedStackParamList, "Profile">;
}

const MyProfile: React.FC<MyProfileProps> = ({ navigation }) => {
  const { data, loading } = useQuery<meQuery>(ME_QUERY);

  useEffect(() => {
    if (data?.me) {
      navigation.setOptions({
        headerTitle: `${data.me.name}의 프로필`,
      });
    }
  }, [data]);

  const editProfile = () => {
    console.log("press");
  };

  return (
    <ScreenLayout loading={loading}>
      <UserProfileContainer>
        <Image
          resizeMode="cover"
          style={{ height: 150, width: 150, alignSelf: "center" }}
          source={{ uri: data?.me?.avatarURL || "" }}
        />
        <UserInfoBox>
          <Username>{data?.me?.username}</Username>
          <Name>{data?.me?.name}</Name>
          <Email>{data?.me?.email}</Email>
          <Button onPress={editProfile} text={"프로필 수정하기"} />
          <Button redBgColor={true} onPress={logout} text={"로그아웃"} />
        </UserInfoBox>
        <FollowContainer>
          <FollowContentsBox
            style={{ borderRightWidth: 1, borderStyle: "solid" }}
          >
            <FollowText>팔로워</FollowText>
            <FollowValue>{data?.me?.totalFollowers}</FollowValue>
          </FollowContentsBox>
          <FollowContentsBox>
            <FollowText>팔로잉</FollowText>
            <FollowValue>{data?.me?.totalFollowing}</FollowValue>
          </FollowContentsBox>
        </FollowContainer>
      </UserProfileContainer>
    </ScreenLayout>
  );
};

export default MyProfile;
