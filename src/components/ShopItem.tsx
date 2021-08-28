import React from "react";
import { useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { seeCoffeeShopsQuery_seeCoffeeShops_shops } from "../__generated__/seeCoffeeShopsQuery";
import { Image } from "./shared";

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

const CategoryItem = styled.Text`
  font-weight: bold;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  padding: 2px 15px;
  margin-right: 5px;
`;

interface ShopItemProps extends seeCoffeeShopsQuery_seeCoffeeShops_shops {
  numColumns: number;
}

const ShopItem: React.FC<ShopItemProps> = ({
  id,
  name,
  photos,
  user,
  categories,
  numColumns,
}) => {
  const [bigImgUrl, setBigImgUrl] = useState<string | undefined>(
    photos ? photos[0]?.url : "",
  );
  const { width } = useWindowDimensions();
  return (
    <Shop style={{ width: width / numColumns - 20 }}>
      <Touchable>
        <ShopMain>
          <ShopName>{name}</ShopName>
          <BigImg resizeMode="cover" source={{ uri: bigImgUrl }} />
        </ShopMain>
      </Touchable>
      <UserBox>
        <Image
          resizeMode="cover"
          style={{ height: 40, width: 40 }}
          source={{ uri: user?.avatarURL || "" }}
        />
        <Username>{user?.username}</Username>
      </UserBox>
      {/* {photos && photos?.length > 1 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={{ flexDirection: "row" }}
          style={{ marginTop: 5 }}
        >
          {photos?.map((photo) => (
            <ImageItem
              key={`photo${photo?.url}`}
              onPress={() => setBigImgUrl(photo?.url)}
            >
              <SmallImage source={{ uri: photo?.url }} resizeMode="cover" />
            </ImageItem>
          ))}
        </ScrollView>
      )} */}

      {categories && categories?.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={{ flexDirection: "row" }}
          style={{ marginTop: 5 }}
        >
          {categories?.map((category) => (
            <CategoryItem key={`category${category?.name}_${id}`}>
              {category?.name}
            </CategoryItem>
          ))}
        </ScrollView>
      )}
    </Shop>
  );
};

export default ShopItem;
