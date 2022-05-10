import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { CustomContainer } from "./CustomContainer";
import { useWeb3Transfer } from "react-moralis";
import Moralis from "moralis";

export const Send = ({ user }) => {
  const amount = React.useRef(0);
  const [toAddress, setToAddress] = React.useState("");

  const toast = useToast();

  const { fetch, isFetching } = useWeb3Transfer({
    from: user.get("ethAddress"),
    amount: amount.current.value
      ? Moralis.Units.ETH(parseFloat(amount.current.value))
      : 0,
    receiver: toAddress,
    type: "native",
  });

  return (
    <CustomContainer>
      <h1>Send ETH</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          //    setAmount(parseFloat(e.target.value));
          let total = amount.current.value;
          console.log(total);
          await Moralis.enableWeb3();
          await fetch({
            onSuccess: () => {
              toast({
                title: "ETH successfully sent.",
                description: "Fresh ETH are showing up in receiver wallet.",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              amount.current.value = 0;
              setToAddress("");
            },
            onError: (error) => {
              toast({
                title: "Error.",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            },
          });
        }}
      >
        <FormControl mt="4">
          <FormLabel htmlFor="amount">Amount of ETH</FormLabel>
          <NumberInput step={0.001}>
            <NumberInputField
              id="amount"
              ref={amount}
              value={amount.current.value}
              // onChange={(e) => {
              //   onChange(e.target.value);
              //   console.log(amount);
              // }}
            />
            <NumberInputStepper
              onClick={(e) => {
                console.log(amount.current.value);

                // setAmount(parseFloat(e.target.value));
              }}
            >
              <NumberIncrementStepper
              // onClick={(e) => {
              //   setAmount(parseFloat(e.target.value));
              //   console.log(amount);
              // }}
              />
              <NumberDecrementStepper
              // onChange={(e) => {
              //   setAmount(parseFloat(e.target.value));
              //   console.log(amount);
              // }}
              />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel htmlFor="receiver">Receiver Address</FormLabel>
          <Input
            id="receiver"
            placeholder="0x..."
            onChange={(e) => setToAddress(e.target.value)}
          />

          <Button
            disabled={isFetching}
            type="submit"
            variantColor="teal"
            mt="4"
          >
            Send
          </Button>
        </FormControl>
      </form>
    </CustomContainer>
  );
};
