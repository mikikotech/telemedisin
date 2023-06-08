import { Box, HStack, Text } from "native-base";
import React from "react";
import { WHITE_COLOR } from "../utils/constant";
import { ColorType } from "native-base/lib/typescript/components/types";

interface Props {
    categories: 'Create Doctor' | 'Create Nurse' | 'Patient List',
    bg: ColorType,
    icon: JSX.Element
}

const AdminCategories = ({ categories, bg, icon }: Props) => {
    return (
        <Box
            bg={WHITE_COLOR}
            px={17}
            py={15}
            h={87}
            w={290}
            borderRadius={10}
            style={{
                elevation: 10,
                shadowColor: '#8a8a8a',
            }}
        >
            <HStack alignItems={'center'} >
                <Box
                    w={55}
                    h={55}
                    borderRadius={10}
                    bg={bg}
                    mr={21}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    {icon}
                </Box>
                <Text color={'#515A50'} fontSize={20} fontWeight={'bold'} >{categories}</Text>
            </HStack>
        </Box>
    )
}

export default AdminCategories