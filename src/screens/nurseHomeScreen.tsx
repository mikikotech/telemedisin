import { Box, Center, ScrollView } from "native-base";
import React, { useLayoutEffect, useState, useEffect } from "react";
import PatientCard from "../components/patientCard";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NurseHomeStackParams } from "../navigations/nurseHomeStackNavigator";
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { request, PERMISSIONS } from 'react-native-permissions';

type Nav = NativeStackScreenProps<NurseHomeStackParams>;

const NurseHomeScreen = ({ navigation }: Nav) => {

    const [patientList, setPatientList] = useState<Array<any>>([])

    useEffect(() => {

        request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
            console.log(result)
        });

        messaging().onNotificationOpenedApp(remoteMessage => {

            console.log('message data = ', remoteMessage.data);

            navigation.navigate("PatientDetail", {
                id: remoteMessage.data?.id ?? ''
            });
        });

        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );

                    console.log('message data check = ', remoteMessage.data);
                    navigation.navigate("PatientDetail", {
                        id: remoteMessage.data?.id ?? ''
                    });
                }
            });

        return () => { }
    }, [])

    useLayoutEffect(() => {
        const subscribe = firestore()
            .collection('patient')
            .onSnapshot((data) => {
                console.log('pasien data = ', data.docs);
                setPatientList(data.docs)
            })

        return () => subscribe()
    }, [])

    return (
        <ScrollView
            width='100%'
            height='100%'
            px={5}
            py={5}
            bg={WHITE_COLOR}
            showsVerticalScrollIndicator={false}
        >
            <Center>
                <Box>
                    <Box mb={47} />

                    {patientList.map((data, i) => {
                        return (
                            <>
                                <PatientCard
                                    key={1}
                                    name={data?._data?.name}
                                    id={data._data?.id}
                                    uri={data._data?.uri}
                                    onPress={() => {
                                        navigation.navigate("PatientDetail", {
                                            id: data._data?.id
                                        })
                                    }}
                                />
                                <Box mb={27} />
                            </>
                        )
                    })}

                    {/* <Button variant={"unstyled"} mt={5} >
                        <Text fontSize={20} color={PRIMARY_COLOR} fontWeight={'bold'} >Back to Login User</Text>
                    </Button> */}
                </Box>
            </Center>
            <Box mb={50} />
        </ScrollView>
    )
}

export default NurseHomeScreen