import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Select,
  Stack,
  Text,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postUserAddress, postUserPersonalDetails } from "../../Redux/action";

function CustomRadio(props) {
  const { ele, ...radioProps } = props;

  const { state, getInputProps, getRadioProps, htmlProps, getLabelProps } =
    useRadio(radioProps);

  return (
    <label {...htmlProps} cursor="pointer">
      <input {...getInputProps({})} hidden />

      <Box
        // bg="white"
        bg={state.isChecked ? "yellow.400" : "white"}
        color="grey"
        borderRadius={"10px"}
        // w="90%"
        _hover={{ cursor: "pointer" }}
        m="auto"
        p="10px"
      >
        <Text color="black">{ele.name}</Text>
        <Text>{ele.email}</Text>
        <Text>phone no: {ele.number}</Text>
        <Flex gap="5%">
          {" "}
          <Text>address: {ele.address}</Text>
          <Text>{ele.pincode}</Text>
        </Flex>
      </Box>
    </label>
  );
}

const PersonalInfo = ({ setSelectedBox }) => {
  const [addressFormData, setAddressFormData] = useState({
    addline1: "",
    addline2: "",
    city: "",
    pinCode: "",
    state: "",
  });
  const [personalFormData, setPersonalFormData] = useState({
    dob: "",
    gender: "",
    phoneNumber: "",
  });
  const dispatch = useDispatch();

  // function formatDate(dateString) {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // }

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setAddressFormData({
      addline1: "",
      addline2: "",
      city: "",
      pinCode: "",
      state: "",
    });
    setPersonalFormData({
      dob: "",
      gender: "",
      phoneNumber: "",
    });
    dispatch(postUserAddress(addressFormData));
    dispatch(postUserPersonalDetails(personalFormData));
  };

  const savedAddress = useSelector((store) => store.userReducer.address);
  const savedPersonalDetails = useSelector(
    (store) => store.userReducer.personalDetails
  );
  const AddressArray = useSelector((store) => {
    return store.paymentReducer.AddressData;
  });

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: "Kevin",
  });

  return (
    <Box p={4} w="90%" m="auto" color={"white"} textAlign={"left"}>
      <form onSubmit={handleFormSubmit}>
        <Text fontSize="xl" fontWeight="bold" mt={10} mb={4} color="white">
          DELIVERY ADDRESS & DETAILS
        </Text>
        <Stack spacing={4} w="102%">
          <FormControl>
            <Input
              type="text"
              placeholder="Address Line 1"
              focusBorderColor="yellow.500"
              name="addline1"
              value={addressFormData.addline1}
              onChange={handleAddressChange}
              required
            />
          </FormControl>
          <FormControl>
            <Input
              type="text"
              placeholder="Address Line 2"
              focusBorderColor="yellow.500"
              name="addline2"
              value={addressFormData.addline2}
              onChange={handleAddressChange}
              required
            />
          </FormControl>
          <Flex>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter your City"
                focusBorderColor="yellow.500"
                name="city"
                value={addressFormData.city}
                onChange={handleAddressChange}
                required
              />
            </FormControl>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter your pincode"
                focusBorderColor="yellow.500"
                name="pinCode"
                value={addressFormData.pinCode}
                min={100000}
                max={999999}
                onChange={handleAddressChange}
                required
              />
            </FormControl>
          </Flex>
        </Stack>
        <Stack my={"15px"} spacing={4}>
          <Flex>
            <FormControl>
              <Input
                type="text"
                placeholder="State"
                name="state"
                focusBorderColor="yellow.500"
                value={addressFormData.state}
                onChange={handleAddressChange}
                required
              />
            </FormControl>
            <FormControl>
              <Input
                type="date"
                marginLeft={15}
                placeholder="DOB"
                name="dob"
                focusBorderColor="yellow.500"
                value={personalFormData.dob}
                onChange={handlePersonalChange}
                required
              />
            </FormControl>
          </Flex>
        </Stack>
        <Stack spacing={4}>
          <Flex>
            <FormControl>
              <Input
                type="tel"
                placeholder="Enter your mobile number"
                name="phoneNumber"
                focusBorderColor="yellow.500"
                value={personalFormData.phoneNumber}
                onChange={handlePersonalChange}
                required
              />
            </FormControl>
            <FormControl>
              <Select
                placeholder="Select your gender"
                marginLeft={15}
                focusBorderColor="yellow.500"
                name="gender"
                value={personalFormData.gender}
                onChange={handlePersonalChange}
                required
              >
                <option style={{ color: "black" }} value="Male">
                  Male
                </option>
                <option style={{ color: "black" }} value="Female">
                  Female
                </option>
                <option style={{ color: "black" }} value="Other">
                  Other
                </option>
              </Select>
            </FormControl>
          </Flex>
        </Stack>

        <Button colorScheme="red" mt={6} color="white" p={6} type="submit">
          UPDATE ADDRESS
        </Button>
      </form>

      {/* Saved Address */}
      {(Object.keys(savedAddress).length === 0) ? (
        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={4}
          paddingTop={10}
          color="white"
        >
          NO SAVED ADDRESS
        </Text>
      ) : (
        <Box>
          <Text
            fontSize="xl"
            fontWeight="bold"
            mb={4}
            paddingTop={10}
            color="white"
          >
            SAVED ADDRESS
          </Text>
          <Flex direction={"column"} gap="10px">
            <div id="savedaddressdiv">
              <p>
                <span>Address Line 1: </span>
                {savedAddress.addline1}
              </p>
              <p>
                <span>Address Line 2: </span>
                {savedAddress.addline2}
              </p>
              <p>
                <span>City: </span>
                {savedAddress.city}
              </p>
              <p>
                <span>Pin Code: </span>
                {savedAddress.pinCode}
              </p>
              <p>
                <span>State: </span>
                {savedAddress.state}
              </p>
            </div>
            <Button
              colorScheme="red"
              mt={6}
              color="white"
              p={6}
              alignSelf={"center"}
              onClick={() => setSelectedBox(1)}
            >
              MAKE PAYMENT
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default PersonalInfo;
