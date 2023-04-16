import { Box, Button, Text } from "native-base";
import { ColorType } from "native-base/lib/typescript/components/types";
import React from "react";
import { PRIMARY_COLOR } from "../utils/constant";

interface Props {
    name: string;
    onPress: () => void;
    variant?: 'outline' | 'solid'
    bgcolor: ColorType
    txtcolor: ColorType
    borderColor?: ColorType
    shadow?: boolean
}

const LoginButton = ({ name, onPress, variant, bgcolor, txtcolor, borderColor, shadow }: Props) => {
    return (
        <Box>
            <Button
                onPress={onPress}
                variant={variant}
                bg={bgcolor}
                width={290}
                height={60}
                borderRadius={10}
                borderColor={borderColor}
                _pressed={{
                    backgroundColor: bgcolor,
                    opacity: 0.8
                }}
                style={shadow ? {
                    elevation: 10,
                    shadowColor: '#8a8a8a',
                } : null}
            >
                <Text color={txtcolor} fontSize={20} fontWeight={'bold'} >{name}</Text>
            </Button>
        </Box>
    )
}

export default LoginButton