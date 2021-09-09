import React from "react";
import Postcode from "@actbase/react-daum-postcode";
import {
  GestureResponderEvent,
  Platform,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { OnCompleteParams } from "@actbase/react-daum-postcode/lib/types";

const LayerBackGround = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: #25252599;
  z-index: 10;
  padding: 10px 0;
`;

interface PostcodeProps {
  setAddressResult: Function;
  closePostcode: (event: GestureResponderEvent) => void;
}

const DaumPostcode: React.FC<PostcodeProps> = ({
  setAddressResult,
  closePostcode,
}) => {
  const { width, height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const handleComplete = async (data: OnCompleteParams) => {
    // const { lat, lng } = await getLatLng(data.address);
    setAddressResult(data);
  };
  return (
    <LayerBackGround
      style={{
        width,
        height,
      }}
    >
      <Postcode
        onSelected={handleComplete}
        style={{
          ...(width < 900 && { width }),
          minHeight: 500,
          margin: "auto",
          marginTop: headerHeight,
          marginBottom: 50,
          zIndex: 30,
          flex: 1,
        }}
        onError={(error) => console.log(error)}
      />
    </LayerBackGround>
  );
};

export default DaumPostcode;
