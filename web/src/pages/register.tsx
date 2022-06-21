import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface registerProps {}

export const register: React.FC<registerProps> = ({}) => {
    const [, register] = useRegisterMutation();
    const router = useRouter();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values);
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
                        // user created
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
                        <Box mt={9}>
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
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(register);
