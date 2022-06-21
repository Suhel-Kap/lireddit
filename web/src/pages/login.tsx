import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

export const login: React.FC<{}> = ({}) => {
    const [, login] = useLoginMutation();
    const router = useRouter();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        // user loggedin
                        router.push("/");
                    }
                }}
            >
                {({ values, handleChange, isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            label="Username"
                            placeholder="Username"
                            value={undefined}
                        />
                        <Box mt={6}>
                            <InputField
                                name="password"
                                label="Password"
                                placeholder="Password"
                                type={"password"}
                            />
                        </Box>
                        <Button
                            type="submit"
                            colorScheme={"messenger"}
                            isLoading={isSubmitting}
                            mt={4}
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(login);
