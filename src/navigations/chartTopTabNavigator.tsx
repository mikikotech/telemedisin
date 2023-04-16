import { Box, Center, Image, Pressable, ScrollView, Text } from "native-base";
import React, { useEffect } from "react";
import { MaterialTopTabBarProps, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HeartRateChartScreen from "../screens/HeartRateChartScreen";
import OxygenChartScreen from "../screens/OxygenChartScreen";
import BloodChartScreen from "../screens/BloodChartScreen";
import TempChartScreen from "../screens/TempChartScreen";
import { ImageSourcePropType } from "react-native/types";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BackHandler } from "react-native";


export type ChartTopTabParams = {
    HeartRate: any;
    Oxygen: any;
    Blood: any;
    Temp: any;
}
const Tab = createMaterialTopTabNavigator<ChartTopTabParams>();

const MyTabBar = ({ state, descriptors, navigation, position }: any) => {
    return (
        <Box
            h={150}
            bg={WHITE_COLOR}
            justifyContent={'center'}
            alignItems="center" >
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {state.routes.map((route: any, index: any) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    var _label: string;
                    var _uri: ImageSourcePropType
                    console.log('top tab', label);


                    if (label == 'HeartRate') {
                        _label = 'HeartRate';
                        _uri = require('./../assets/icons/heart-rate.png')
                    } else if (label == 'Oxygen') {
                        _label = 'Oxygen';
                        _uri = require('./../assets/icons/oxygen.png')
                    } else if (label == 'Blood') {
                        _label = 'Blood';
                        _uri = require('./../assets/icons/blood.png')
                    } else {
                        _label = 'Temp';
                        _uri = require('./../assets/icons/temp.png')
                    }

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    return (
                        <Center>
                            <Pressable
                                justifyContent={'center'}
                                alignItems="center"
                                onPress={onPress}
                                mx={5}
                                p={2}
                                w={24}
                                h={24}
                                borderRadius={10}
                                bg={isFocused ? PRIMARY_COLOR : WHITE_COLOR}
                                style={{
                                    elevation: 5,
                                    shadowColor: '#8a8a8a',
                                }}
                            >
                                {/* <Image mr={12} resizeMode="contain" ml={50} source={_uri} w={10} h={10} /> */}
                                <Text mt={2} color={isFocused ? WHITE_COLOR : PRIMARY_COLOR} textAlign={'center'} >{_label}</Text>
                            </Pressable>
                        </Center>
                    );
                })}
            </ScrollView>
        </Box>
    );
};

type Nav = NativeStackScreenProps<any>;

const ChartTopTabNavigator = ({ route, navigation }: Nav) => {

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.goBack()
                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    return (
        <Tab.Navigator
            tabBar={props => <MyTabBar {...props} />}
            initialRouteName={route?.params?.initialRouteName ?? 'HeartRate'}
        >
            <Tab.Screen name='HeartRate' initialParams={{
                id: route?.params?.id ?? '',
            }} component={HeartRateChartScreen} />
            <Tab.Screen name='Oxygen' initialParams={{
                id: route?.params?.id ?? '',
            }} component={OxygenChartScreen} />
            <Tab.Screen name='Blood' initialParams={{
                id: route?.params?.id ?? '',
            }} component={BloodChartScreen} />
            <Tab.Screen name='Temp' initialParams={{
                id: route?.params?.id ?? '',
            }} component={TempChartScreen} />
        </Tab.Navigator>
    )
}

export default ChartTopTabNavigator