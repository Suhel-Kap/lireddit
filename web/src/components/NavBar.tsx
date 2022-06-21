import { Box, Button, Flex, Heading, Link, Spacer } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "./DarkModeSwitch";
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  //   const [{ data: meData }] = useMeQuery();
  //   const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  //   const router = useRouter();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  //data is loading
  if (fetching) {
  } // user not logged in
  else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={3} color={"GrayText"}>
            Login
          </Link>
        </NextLink>
        <NextLink href={"/register"}>
          <Link color={"blackAlpha.700"}>Register</Link>
        </NextLink>
        {/* <DarkModeSwitch /> */}
      </>
    );
  } // user is logged in
  else {
    body = (
      <Flex>
        <Box mr={3}>{data.me.username}</Box>
        <Button variant={"link"}>Logout</Button>
        {/* <DarkModeSwitch /> */}
      </Flex>
    );
  }
  return (
    <Flex padding={4} bg={"burlywood"}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default NavBar;
