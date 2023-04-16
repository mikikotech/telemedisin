import { Box, Center, Image, Text, VStack } from "native-base";
import React, { useEffect, useRef } from "react";
import { PRIMARY_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import LoginButton from "../components/loginButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Nav = NativeStackScreenProps<any>;

const DataSendScreen = ({ navigation, route }: Nav) => {

    return (
        <Box
            width='100%'
            height='100%'
            bg={WHITE_COLOR}
            px={5}
        >
            <VStack flex={1} alignItems={'center'} justifyContent={'center'} >
                {/* <Box w={202} h={76} mb={44} > */}
                <Image alt='img' w={290} h={288} resizeMode="contain" source={route.params?.type == 'acc' ?
                    require('./../assets/images/post.png') : require('./../assets/images/send.png')} />
                <Text
                    mt={23}
                    textAlign={'center'}
                    numberOfLines={2}
                    fontSize={36}
                    fontWeight={"extrabold"}
                    color={PRIMARY_COLOR}
                >
                    {
                        route.params?.type == 'acc' ?
                            'Akun Berhasil Dibuat !' : route.params?.type == 'adddata' ?
                                'Data Berhasil Ditambahkan !' : 'Data Berhasil Diperbaharui !'
                    }
                </Text>
                {/* </Box> */}
                <Box mt={25} />
                <LoginButton
                    name="Kembali"
                    variant="solid"
                    txtcolor={WHITE_COLOR}
                    bgcolor={PRIMARY_COLOR}
                    onPress={() => {
                        navigation.replace(route?.params?.screen, {
                            id: route?.params?.id,
                        })
                    }}
                />
            </VStack>

        </Box>
    )
}

export default DataSendScreen