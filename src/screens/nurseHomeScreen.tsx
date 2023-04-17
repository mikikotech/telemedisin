import { Box, Button, Center, Modal, ScrollView } from "native-base";
import React, { useLayoutEffect, useState, useEffect, useContext } from "react";
import PatientCard from "../components/patientCard";
import { PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, PRIMARY_RED_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NurseHomeStackParams } from "../navigations/nurseHomeStackNavigator";
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { request, PERMISSIONS } from 'react-native-permissions';
import { BackHandler } from "react-native";
import AuthContext from "../navigations/authContext";
import auth from '@react-native-firebase/auth';

type Nav = NativeStackScreenProps<NurseHomeStackParams>;

const NurseHomeScreen = ({ navigation }: Nav) => {

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

        </ScrollView>
    )
}

export default NurseHomeScreen