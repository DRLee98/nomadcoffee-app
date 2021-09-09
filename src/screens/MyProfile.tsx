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
      location
      totalFollowing
      totalFollowers
    }
  }
`;

const ButtonBox = styled.View`
  width: 100%;
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
  color: ${(props) => props.theme.fontColor};
`;

const FollowValue = styled.Text`
  text-align: center;
  color: ${(props) => props.theme.fontColor};
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
    if (data?.me) {
      const meData = data.me;
      navigation.navigate("EditProfile", {
        id: meData.id,
        username: meData.username,
        email: meData.email,
        name: meData.name,
        ...(meData.location && { location: meData.location }),
        ...(meData.avatarURL && { currentAvatar: meData.avatarURL }),
      });
    }
  };

  const goFollow = () => {
    if (data?.me?.id) {
      navigation.navigate("Follow", { id: data?.me?.id });
    }
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
          <ButtonBox>
            <Button onPress={editProfile} text={"프로필 수정하기"} />
          </ButtonBox>
          <ButtonBox style={{ marginTop: 5 }}>
            <Button redBgColor={true} onPress={logout} text={"로그아웃"} />
          </ButtonBox>
        </UserInfoBox>
        <FollowContainer>
          <FollowContentsBox
            onPress={goFollow}
            style={{ borderRightWidth: 1, borderStyle: "solid" }}
          >
            <FollowText>팔로워</FollowText>
            <FollowValue>{data?.me?.totalFollowers}</FollowValue>
          </FollowContentsBox>
          <FollowContentsBox onPress={goFollow}>
            <FollowText>팔로잉</FollowText>
            <FollowValue>{data?.me?.totalFollowing}</FollowValue>
          </FollowContentsBox>
        </FollowContainer>
      </UserProfileContainer>
    </ScreenLayout>
  );
};

export default MyProfile;
