import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import { FlatList, Platform, useWindowDimensions } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootPhotoTabParamList } from "../navigators/PhotoNavi";

const Box = styled.View`
  width: 100%;
  height: 100%;
`;

const Touchable = styled.TouchableOpacity``;

const Image = styled.Image<ImageProps>`
  ${(props) =>
    props.selected ? `border: 5px solid ${props.theme.accent}` : ""}
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.accent};
  padding: 20px 0px;
  width: 100%;
`;

const ButtonText = styled.Text`
  width: 100%;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  color: white;
`;

interface ImageProps {
  selected: boolean;
}

interface SelectPhotoProps {
  navigation: NavigationProp<RootPhotoTabParamList, "SelectPhoto">;
  route: RouteProp<RootPhotoTabParamList, "SelectPhoto">;
}

const SelectPhoto: React.FC<SelectPhotoProps> = ({ navigation, route }) => {
  const numColumns = 3;
  const { width } = useWindowDimensions();
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [endPhoto, setEndPhoto] = useState<string>();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [chosenPhoto, setChosenPhoto] = useState<string[]>([]);

  const getPhotos = async () => {
    if (hasNext) {
      const {
        assets: photos,
        endCursor,
        hasNextPage,
      } = await MediaLibrary.getAssetsAsync({
        first: 15,
        ...(endPhoto && { after: endPhoto }),
      });
      setPhotos((prev) => [...prev, ...photos]);
      setChosenPhoto((prev) => {
        if (route.params.photoLimit > 1) {
          return [];
        } else if (prev.length === 0) {
          return [photos[0]?.uri];
        } else {
          return prev;
        }
      });
      setHasNext(hasNextPage);
      if (hasNextPage) {
        setEndPhoto(endCursor);
      }
    }
    console.log(photos);
  };

  const getPermissions = async () => {
    const { accessPrivileges, canAskAgain } =
      await MediaLibrary.getPermissionsAsync();
    if (accessPrivileges === "none" && canAskAgain) {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
      if (accessPrivileges !== "none") {
        getPhotos();
      }
    } else if (accessPrivileges !== "none") {
      getPhotos();
    }
  };

  const selectPhoto = (uri: string) => {
    const limit = route.params.photoLimit;
    if (limit === 1) {
      setChosenPhoto([uri]);
    } else {
      setChosenPhoto((prev) => {
        if (prev.length >= limit) {
          return prev;
        } else if (prev.includes(uri)) {
          return prev.filter((photoUri) => photoUri !== uri);
        } else {
          return [...prev, uri];
        }
      });
    }
  };

  const selection = () => {
    const screenName = route.params.callbackScreen;
    if (screenName === "SignUp" || screenName === "EditProfile") {
      navigation.navigate(screenName, {
        avatarUri: chosenPhoto[0],
      });
    } else {
      navigation.navigate(screenName, {
        images: chosenPhoto,
        id: route.params.id,
      });
    }
  };

  const renderItem = ({ item }: { item: MediaLibrary.Asset }) => {
    return (
      <Touchable onPress={() => selectPhoto(item.uri)}>
        <Image
          selected={chosenPhoto.includes(item.uri)}
          resizeMode="cover"
          source={{ uri: item.uri || "" }}
          style={{ width: width / numColumns, height: width / numColumns }}
        />
      </Touchable>
    );
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      getPermissions();
    }
  }, []);
  return (
    <ScreenLayout loading={false}>
      <Box>
        <FlatList
          numColumns={numColumns}
          style={{
            marginTop: 20,
            marginBottom: 20,
          }}
          onEndReachedThreshold={0.3}
          onEndReached={getPhotos}
          // showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={photos}
          keyExtractor={(photo) => photo?.id}
        />
        <Button onPress={selection}>
          <ButtonText>선택 완료</ButtonText>
        </Button>
      </Box>
    </ScreenLayout>
  );
};

export default SelectPhoto;
