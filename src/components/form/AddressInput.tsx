import { OnCompleteParams } from "@actbase/react-daum-postcode/lib/types";
import React, { useEffect, useState } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import styled from "styled-components/native";
import DaumPostcode from "../../kakao/postCode";
import Button from "./Button";
import { Input } from "./formShared";

const InputBox = styled.View`
  width: 100%;
`;

interface AddressInputProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  fullWidth?: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  register,
  setValue,
  watch,
  fullWidth = false,
}) => {
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

  useEffect(() => {
    register("location");
  }, [register]);

  return (
    <>
      <InputBox>
        <Input
          editable={false}
          selectTextOnFocus={false}
          placeholder="주소"
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
