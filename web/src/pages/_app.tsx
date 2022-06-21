import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import { createClient, Provider } from "urql";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider resetCSS theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
