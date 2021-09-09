import { NavigationProp, useNavigation } from "@react-navigation/core";
import React from "react";
import styled from "styled-components/native";
import { RootSharedStackParamList } from "../navigators/SharedStackNav";

const CategoryBox = styled.TouchableOpacity`
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.accent};
  padding: 2px 15px;
  margin-right: 5px;
`;

const CategoryText = styled.Text`
  font-weight: bold;
  color: ${(props) => props.theme.accent};
`;

interface CategoryItemProps {
  name: string;
  slug: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, slug }) => {
  const navigation = useNavigation<NavigationProp<RootSharedStackParamList>>();
  const goCategory = () => {
    navigation.navigate("Category", { name, slug });
  };
  return (
    <CategoryBox onPress={goCategory}>
      <CategoryText>{name}</CategoryText>
    </CategoryBox>
  );
};

export default CategoryItem;
