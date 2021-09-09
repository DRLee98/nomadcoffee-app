import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { isLoggedInVar } from "../apollo";
import FollowButton from "../components/FollowButton";
import ScreenLayout from "../components/ScreenLayout";
import { Image } from "../components/shared";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { seeProfileQuery } from "../__generated__/seeProfileQuery";

const SEE_PROFILE_QUERY = gql`
  query seeProfileQuery($id: Int) {
    seeProfile(id: $id) {
      id
      username
      email
      name
      avatarURL
      totalFollowing
      totalFollowers
      isFollowing
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

interface ProfileProps {
  navigation: NavigationProp<RootSharedStackParamList, "Profile">;
  route: RouteProp<RootSharedStackParamList, "Profile">;
}

const Profile: React.FC<ProfileProps> = ({ navigation, route }) => {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data, loading } = useQuery<seeProfileQuery>(SEE_PROFILE_QUERY, {
    variables: {
      id: route.params.id,
    },
  });

  useEffect(() => {
    if (data?.seeProfile) {
      navigation.setOptions({
        headerTitle: `${data.seeProfile.name}의 프로필`,
      });
    }
  }, [data]);

  const goFollow = () => {
    if (data?.seeProfile?.id) {
      navigation.navigate("Follow", { id: data.seeProfile.id });
    }
  };

  return (
    <ScreenLayout loading={loading}>
      <UserProfileContainer>
        <Image
          resizeMode="cover"
          style={{ height: 150, width: 150, alignSelf: "center" }}
          source={{ uri: data?.seeProfile?.avatarURL || "" }}
        />
        <UserInfoBox>
          <Username>{data?.seeProfile?.username}</Username>
          <Name>{data?.seeProfile?.name}</Name>
          <Email>{data?.seeProfile?.email}</Email>
          {hasToken && (
            <FollowButton
              id={route.params.id}
              isFollowing={data?.seeProfile?.isFollowing}
            />
          )}
        </UserInfoBox>
        <FollowContainer>
          <FollowContentsBox
            onPress={goFollow}
            style={{ borderRightWidth: 1, borderStyle: "solid" }}
          >
            <FollowText>팔로워</FollowText>
            <FollowValue>{data?.seeProfile?.totalFollowers}</FollowValue>
          </FollowContentsBox>
          <FollowContentsBox onPress={goFollow}>
            <FollowText>팔로잉</FollowText>
            <FollowValue>{data?.seeProfile?.totalFollowing}</FollowValue>
          </FollowContentsBox>
        </FollowContainer>
      </UserProfileContainer>
    </ScreenLayout>
  );
};

export default Profile;
