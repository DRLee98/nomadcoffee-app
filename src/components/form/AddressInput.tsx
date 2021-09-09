import { OnCompleteParams } from "@actbase/react-daum-postcode/lib/types";
import { useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import styled from "styled-components/native";
import { darkModeVar } from "../../apollo";
import DaumPostcode from "../../kakao/postCode";
import { darkTheme, lightTheme } from "../../styles";
import Button from "./Button";
import { Input } from "./formShared";

const InputBox = styled.View`
  width: 100%;
`;

interface AddressInputProps {
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  fullWidth?: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  setValue,
  watch,
  fullWidth = false,
}) => {
  const darkMode = useReactiveVar(darkModeVar);
  const [postCodeLayer, setPostCodeLayer] = useState<boolean>(false);
  const [address, setAddress] = useState<OnCompleteParams>();

  const closePostcode = () => {
    setPostCodeLayer(false);
  };

  const searchAddress = () => {
    setPostCodeLayer(true);
  };

  const setAddressResult = (data: OnCompleteParams) => {
    setAddress(data);
  };

  useEffect(() => {
    if (address) {
      setValue("location", address.address);
    }
    setPostCodeLayer(false);
  }, [address]);

  return (
    <>
      <InputBox>
        <Input
          editable={false}
          selectTextOnFocus={false}
          placeholder="주소"
          placeholderTextColor={
            darkMode
              ? darkTheme.placeholderTextColor
              : lightTheme.placeholderTextColor
          }
          value={watch("location") || ""}
        />
        <Button onPress={searchAddress} text={"주소 찾기"} />
      </InputBox>
      {postCodeLayer && (
        <DaumPostcode
          setAddressResult={setAddressResult}
          closePostcode={closePostcode}
        />
      )}
    </>
  );
};

export default AddressInput;
