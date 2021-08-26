import React from "react";
import { useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { searchCoffeeShopQuery_searchCoffeeShop_shops } from "../__generated__/searchCoffeeShopQuery";
import { Image } from "./shared";

const Shop = styled.View`
  max-width: 400px;
  margin: 0 auto;
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
  max-width: 200px;
  min-height: 200px;
  background-color: black;
`;

interface SimpleShopItemProps
  extends searchCoffeeShopQuery_searchCoffeeShop_shops {
  numColumns: number;
}

const SimpleShopItem: React.FC<SimpleShopItemProps> = ({
  id,
  name,
  photos,
  numColumns,
}) => {
  const { width } = useWindowDimensions();
  return (
    <Shop>
      <Touchable>
        <ShopMain>
          <ShopName>{name}</ShopName>
          <BigImg
            resizeMode="cover"
            source={{ uri: photos ? photos[0]?.url : "" }}
            style={{ width: width / numColumns }}
          />
        </ShopMain>
      </Touchable>
    </Shop>
  );
};

export default SimpleShopItem;
