import { Box } from "native-base";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Nav = NativeStackScreenProps<any>;

const AnimatedTrantitions = ({ navigation, route }: Nav) => {

    const scaleUp = useRef(new Animated.Value(0)).current
    const opacity = useRef(new Animated.Value(1)).current

    useEffect(() => {
        Animated.timing(scaleUp, {
            toValue: 1,
            useNativeDriver: true,
            duration: 1000
        }).start()

        Animated.timing(opacity, {
            toValue: 0,
            useNativeDriver: true,
            duration: 3000,
        }).start(() => {
            navigation.replace('DataSend', {
                type: route?.params?.type,
                screen: route?.params?.screen,
                id: route?.params?.id,
            })
        })

    }, [])


    return (
        <Box w='100%' h='100%' bg={PRIMARY_COLOR} justifyContent={'center'} alignItems={'center'} >
            <Animated.View
                style={{ height: 1000, width: 1000, borderRadius: 1000, backgroundColor: WHITE_COLOR, justifyContent: 'center', alignItems: 'center', transform: [{ scale: scaleUp }] }}
            >
                <Animated.Image style={{ width: 130, height: 150.5, opacity: opacity }} source={require('./../assets/icons/wecare.png')} />
            </Animated.View>
        </Box>
    )
}

export default AnimatedTrantitions