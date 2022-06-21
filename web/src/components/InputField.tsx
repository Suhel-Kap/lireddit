import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { FieldInputProps, useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = FieldInputProps<any> & {
    name: string,
    label: string,
    placeholder: string
}

export const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
    const [field, { error }] = useField(props)
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} type={props.name} id={field.name} placeholder={props.placeholder} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}

export default InputField;