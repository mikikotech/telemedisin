import { Box, Text } from "native-base";
import React, { useEffect } from "react";
import { WHITE_COLOR } from "../utils/constant";
import SplashScreen from "react-native-splash-screen";

const NoInternetConnectionScreen = () => {

    useEffect(() => {
        SplashScreen.hide()
    }, [])

    return (
        <Box
            width='100%'
            height='100%'
            px={5}
            py={5}
            bg={WHITE_COLOR}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Text fontSize={50} fontWeight={"bold"} >No Internet Connection</Text>
        </Box>
    )
}

export default NoInternetConnectionScreen