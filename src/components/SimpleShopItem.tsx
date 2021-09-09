import { NavigationProp, useNavigation } from "@react-navigation/core";
import React from "react";
import { useWindowDimensions } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";
import { searchCoffeeShopQuery_searchCoffeeShop_shops } from "../__generated__/searchCoffeeShopQuery";
import { Image } from "./shared";

const Shop = styled.View`
  max-width: 400px;
`;

const Touchable = styled.TouchableOpacity`
  border: 1px solid ${(props) => props.theme.bgColor};
`;

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
  const navigation = useNavigation<NavigationProp<RootSharedStackParamList>>();
  const { width } = useWindowDimensions();

  const goDetail = () => {
    navigation.navigate("Detail", { id });
  };

  return (
    <Shop>
      <Touchable onPress={goDetail}>
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
