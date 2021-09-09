import React from "react";
import { useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { seeCoffeeShopsQuery_seeCoffeeShops } from "../__generated__/seeCoffeeShopsQuery";
import { Image } from "./shared";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import useMe from "../hooks/useMe";
import CategoryItem from "./CategoryItem";

const Shop = styled.View`
  max-width: 400px;
  margin: 0 auto;
  padding: 5px;
  border: 1px solid ${(props) => props.theme.grayColor};
`;

const Touchable = styled.TouchableOpacity``;

const ShopMain = styled.View`
  position: relative;
`;

const ShopName = styled.Text`
  font-weight: bold;
  position: absolute;
  left: 0;
  right: 0;
  top: 20px;
  text-align: center;
  padding: 10px;
  background-color: #ffffff4d;
  z-index: 5;
`;

const BigImg = styled.Image`
  max-width: 400px;
  min-height: 400px;
  background-color: black;
`;

const UserBox = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  background-color: ${(props) => props.theme.hoverColor};
`;

const Username = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-left: 8px;
  color: ${(props) => props.theme.fontColor};
`;

const ImageItem = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  margin-right: 5px;
`;

const SmallImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Box = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CountText = styled.Text`
  margin-left: 2px;
  color: ${(props) => props.theme.fontColor};
`;

const IconBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #ffffff4d;
  border-radius: 15px;
  z-index: 5;
`;

const Icon = styled(Ionicons)``;

interface ShopItemProps extends seeCoffeeShopsQuery_seeCoffeeShops {
  numColumns: number;
}

const ShopItem: React.FC<ShopItemProps> = ({
  id,
  name,
  photos,
  user,
  categories,
  isLiked,
  totalLikes,
  totalComments,
  numColumns,
}) => {
  const navigation = useNavigation<NavigationProp<RootSharedStackParamList>>();
  const { data: meData } = useMe();
  const [bigImgUrl, setBigImgUrl] = useState<string | undefined>(
    photos ? photos[0]?.url : "",
  );
  const { width } = useWindowDimensions();

  const goProfile = () => {
    if (user.isMe) {
      navigation.navigate("MyProfile");
    } else {
      navigation.navigate("Profile", { id: user.id });
    }
  };

  const goDetail = () => {
    navigation.navigate("Detail", { id });
  };

  return (
    <Shop style={{ width: width / numColumns - 20 }}>
      <Touchable onPress={goDetail}>
        <ShopMain>
          <ShopName>{name}</ShopName>
          <BigImg resizeMode="cover" source={{ uri: bigImgUrl || "" }} />
          <IconBox style={{ marginTop: 5 }}>
            <Box style={{ marginRight: 8 }}>
              <Icon
                name={isLiked ? "heart" : "heart-outline"}
                color={isLiked ? "red" : "black"}
                size={22}
              />
              <CountText>{totalLikes}</CountText>
            </Box>
            <Box>
              <Icon
                name={"chatbubble-ellipses-outline"}
                color={"black"}
                size={22}
              />
              <CountText>{totalComments}</CountText>
            </Box>
          </IconBox>
        </ShopMain>
      </Touchable>
      <UserBox onPress={goProfile}>
        <Image
          resizeMode="cover"
          style={{ height: 40, width: 40 }}
          source={{ uri: user?.avatarURL || "" }}
        />
        <Username>{user?.username}</Username>
      </UserBox>
      {categories && categories?.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={{ flexDirection: "row" }}
          style={{ marginTop: 5 }}
        >
          {categories?.map((category) => (
            <CategoryItem
              {...category}
              key={`category${category?.name}_${id}`}
            />
          ))}
        </ScrollView>
      )}
    </Shop>
  );
};

export default ShopItem;
