import { Box, Button, Center, Modal, ScrollView, Text } from "native-base";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import PatientCard from "../components/patientCard";
import { PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, PRIMARY_RED_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DoctorHomeStackParams } from "../navigations/doctorHomeStackNavigator";
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { BackHandler } from "react-native";
import AuthContext from "../navigations/authContext";
import auth from '@react-native-firebase/auth';

type Nav = NativeStackScreenProps<DoctorHomeStackParams>;

const DoctorHomeScreen = ({ navigation }: Nav) => {

    const { SignOut } = useContext(AuthContext);

    const [patientList, setPatientList] = useState<Array<any>>([])
    const [showModal, setShowModal] = useState<boolean>(false)

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                setShowModal(true)
                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    useEffect(() => {
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
                // console.log('pasien data = ', data.docs);
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
            position={"absolute"}
            showsVerticalScrollIndicator={false}
        >
            <Center>
                <Box>
                    <Box mb={47} />

                    {patientList.map((data, i) => {
                        return (
                            <>
                                <PatientCard
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
                </Box>
            </Center>

            {/* modal */}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    {/* <Modal.CloseButton /> */}
                    <Modal.Header _text={{ fontSize: 18 }} >Back to Login User ?</Modal.Header>

                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button w={55} bg={PRIMARY_RED_COLOR} _pressed={{ backgroundColor: RED_COLOR }} onPress={() => {
                                setShowModal(false);
                            }}>
                                No
                            </Button>
                            <Button w={55} bg={PRIMARY_COLOR} _pressed={{ backgroundColor: PRIMARY_COLOR_DISABLE }} onPress={async () => {
                                setShowModal(false);
                                await auth()
                                    .signOut()
                                    .then(() => SignOut());
                            }}>
                                Yes
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <Box mb={50} />
        </ScrollView>
    )
}

export default DoctorHomeScreen