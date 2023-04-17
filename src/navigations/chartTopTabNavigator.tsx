import { Box, Center, Pressable, ScrollView, Spinner, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ImageSourcePropType } from "react-native/types";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BackHandler } from "react-native";
import { firebase } from '@react-native-firebase/database';
import DataChart from "../components/dataChart";

type dataProps = {
    heartrate: number;
    oxygen: number;
    systolic: number;
    diastolic: number;
    temp: number;
    time: number;
};

export type ChartTopTabParams = {
    HeartRate: any;
    Oxygen: any;
    Blood: any;
    Temp: any;
    Test: any
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

    const [heartRate, setHeartRate] = useState<Array<number>>([0, 0, 0, 0, 0, 0]);
    const [oxygen, setOxygen] = useState<Array<number>>([0, 0, 0, 0, 0, 0]);
    const [systolic, setSystolic] = useState<Array<number>>([0, 0, 0, 0, 0, 0]);
    const [daistolic, setDiastolic] = useState<Array<number>>([0, 0, 0, 0, 0, 0]);
    const [temp, setTemp] = useState<Array<number>>([0, 0, 0, 0, 0, 0]);
    const [time, setTime] = useState<Array<string>>([
        '00:00',
        '00:00',
        '00:00',
        '00:00',
        '00:00',
        '00:00',
    ]);

    const [isLoading, setIsloading] = useState<boolean>(true)

    useEffect(() => {

        const retData = firebase
            .app()
            .database('https://telemedisin-aadf1-default-rtdb.asia-southeast1.firebasedatabase.app/')
            .ref(`/${route.params?.id}/Sensor`)
            .limitToLast(6)
            .on('value', snapshot => {

                if (snapshot.val() != null) {

                    const data = snapshot.val();
                    var dataArray: Array<dataProps> = [];
                    for (let id in data) {
                        dataArray.push(data[id]);
                    }

                    var heartRateArray: Array<number> = [];
                    var oxygenArray: Array<number> = [];
                    var systolicArray: Array<number> = [];
                    var diastolicArray: Array<number> = [];
                    var tempArray: Array<number> = [];
                    var timeArray: Array<string> = [];

                    for (let id in dataArray) {
                        heartRateArray.push(dataArray[id]?.heartrate);
                        oxygenArray.push(dataArray[id]?.oxygen);
                        systolicArray.push(dataArray[id]?.systolic);
                        diastolicArray.push(dataArray[id]?.diastolic);
                        tempArray.push(dataArray[id]?.temp);

                        var epoch = dataArray[id].time * 1000;
                        timeArray.push(
                            new Date(epoch).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        );
                    }

                    setHeartRate(oldVal => {
                        const copy = [...oldVal];

                        heartRateArray.map((val, i) => {
                            copy[i] = val;
                        });

                        return copy;
                    });

                    setOxygen(oldVal => {
                        const copy = [...oldVal];

                        oxygenArray.map((val, i) => {
                            copy[i] = val;
                        });

                        return copy;
                    });

                    setSystolic(oldVal => {
                        const copy = [...oldVal];

                        systolicArray.map((val, i) => {
                            copy[i] = val;
                        });

                        return copy;
                    });

                    setDiastolic(oldVal => {
                        const copy = [...oldVal];

                        diastolicArray.map((val, i) => {
                            copy[i] = val;
                        });

                        return copy;
                    });

                    setTemp(oldVal => {
                        const copy = [...oldVal];

                        tempArray.map((val, i) => {
                            copy[i] = val;
                        });

                        return copy;
                    });


                    setTime(oldVal => {
                        const copy = [...oldVal];

                        timeArray.map((val, i) => {
                            copy[i] = val;
                        });

                        return copy;
                    });

                    setIsloading(false)
                }

            })

        return () => firebase.app().database('https://telemedisin-aadf1-default-rtdb.asia-southeast1.firebasedatabase.app/').ref(`/${route.params?.id}/Sensor`).off('value', retData)
    }, []);

    const HeartRateChart = () => {
        return (
            <Box
                bg={WHITE_COLOR}
                w='100%'
                h='100%'
                px={5}
            >
                <Text ml={4} mb={50} mt={10} fontSize={20} >Grafik Heart Rate</Text>
                <Center>
                    <DataChart
                        key={1}
                        labels={time}
                        datasets={heartRate}
                        legend="Heart Rate"
                        suffix="bpm"
                    />
                </Center>
            </Box>
        )
    }

    const OxygenChart = () => {
        return (
            <Box
                bg={WHITE_COLOR}
                w='100%'
                h='100%'
                px={5}
            >
                <Text ml={4} mb={50} mt={10} fontSize={20} >Grafik Oxygen</Text>
                <Center>
                    <DataChart
                        key={2}
                        labels={time}
                        datasets={oxygen}
                        legend="Oxygen"
                        suffix="%"
                    />
                </Center>
            </Box>
        )
    }

    const BloodChart = () => {
        return (

            <Box
                bg={WHITE_COLOR}
                w='100%'
                h='100%'
                px={5}
            >
                <Text ml={4} mb={5} mt={5} fontSize={20} >Grafik Blood</Text>
                <Center>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <DataChart
                            key={3}
                            labels={time}
                            datasets={systolic}
                            legend="Systolic (mmHg)"
                            suffix=""
                        />

                        <DataChart
                            key={4}
                            labels={time}
                            datasets={daistolic}
                            legend="Diastolic (mmHg)"
                            suffix=""
                        />

                        <Box mt={100} />
                    </ScrollView>
                </Center>
            </Box>

        )
    }

    const TempChart = () => {
        return (
            <Box
                bg={WHITE_COLOR}
                w='100%'
                h='100%'
                px={5}
            >
                <Text ml={4} mb={50} mt={10} fontSize={20} >Grafik Temperature</Text>
                <Center>
                    <DataChart
                        key={5}
                        labels={time}
                        datasets={temp}
                        legend="Temperature"
                        suffix="°C"
                    />
                </Center>
            </Box>
        )
    }

    return (
        isLoading ?
            (
                <Box w='100%' h='100%' bg={WHITE_COLOR} alignItems={'center'} justifyContent={'center'}>
                    <Spinner size='lg' color={PRIMARY_COLOR} />
                </Box>
            ) :
            (
                <Tab.Navigator
                    tabBar={props => <MyTabBar {...props} />}
                    initialRouteName={route?.params?.initialRouteName ?? 'HeartRate'}
                >
                    <Tab.Screen name='HeartRate' initialParams={{
                        id: route?.params?.id ?? '',
                    }} component={HeartRateChart} />
                    <Tab.Screen name='Oxygen' initialParams={{
                        id: route?.params?.id ?? '',
                    }} component={OxygenChart} />
                    <Tab.Screen name='Blood' initialParams={{
                        id: route?.params?.id ?? '',
                    }} component={BloodChart} />
                    <Tab.Screen name='Temp' initialParams={{
                        id: route?.params?.id ?? '',
                    }} component={TempChart} />
                </Tab.Navigator>
            )
    )
}

export default ChartTopTabNavigator