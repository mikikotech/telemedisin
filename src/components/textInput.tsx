import { Box, FormControl, Input, Stack, Text, WarningOutlineIcon } from "native-base";
import React from "react";
import { WHITE_COLOR } from "../utils/constant";

interface Props {
    label?: string,
    placeholder: string,
    type: 'password' | 'text',
    value?: string,
    h: any,
    onChangeText: (val: string) => void,
    inputRightElement?: JSX.Element,
    keyboardType?: 'default' | 'numeric' | 'email-address',
    isInvalid?: boolean,
    isRequired?: boolean,
    errorMessage?: string
    onBlur?: (e: any) => void,
    ref?: (e: any) => void,
    returnKeyType?: 'next' | 'done',
    onSubmitEditing?: () => void
}

const TextInput = ({ label, placeholder, type, value, h, onChangeText, inputRightElement, keyboardType, isInvalid, isRequired, errorMessage, onBlur, ref, returnKeyType, onSubmitEditing }: Props) => {
    return (
        <FormControl
            isRequired={isRequired}
            isInvalid={isInvalid}
        >
            <FormControl.Label >
                <Text color='#515A50' ml={1} fontWeight={"bold"} fontSize={20}>{label}</Text>
            </FormControl.Label>
            <Box
                width={290}
                height={h}
                bg={WHITE_COLOR}
                borderRadius={10}
                style={{
                    elevation: 10,
                    shadowColor: '#8a8a8a',
                }}
            >
                <Input
                    ref={ref}
                    width={290}
                    height={h}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    InputRightElement={inputRightElement}
                    fontSize={16}
                    color='#C6C6C6'
                    borderWidth={0}
                    keyboardType={keyboardType}
                    _focus={{
                        bg: WHITE_COLOR
                    }}
                    onBlur={onBlur}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                />
            </Box>

            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    )
}

export default TextInput