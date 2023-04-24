import { Box, Button, Center, Fab, Icon, ScrollView, Text } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import PatientCard from "../components/patientCard";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminHomeStackParams } from "../navigations/adminHomeStackNavigator";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { BackHandler, LogBox } from "react-native";
import AndroidToast from "../utils/AndroidToast";

type Nav = NativeStackScreenProps<AdminHomeStackParams>;

const PatientListScreen = ({ navigation }: Nav) => {

    const [patientList, setPatientList] = useState<Array<any>>([])

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('Home')
                return true
            }
        )

        return () => backHandle.remove()
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

    const removeHandle = async (id: string) => {
        await firestore()
            .collection('patient')
            .doc(id)
            .delete()
            .then(() => {
                AndroidToast.toast('Patient delete!')
            })
            .catch((err) => { })
    }

    LogBox.ignoreAllLogs()

    return (
        <Box>
            <ScrollView
                width='100%'
                height='100%'
                px={5}
                py={5}
                bg={WHITE_COLOR}
                position={"relative"}
                showsVerticalScrollIndicator={false}
            >
                <Center>
                    <Box>
                        <Box mb={47} />

                        {patientList.map((data, i) => {
                            return (
                                <>
                                    <PatientCard
                                        key={i + 1}
                                        name={data?._data?.name}
                                        id={data._data?.id}
                                        uri={data._data?.uri}
                                        onPress={() => {
                                            navigation.navigate("PatientDetail", {
                                                id: data._data?.id
                                            })
                                        }}
                                        onRemovePress={() => {
                                            removeHandle(data._data?.id)
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



                <Box mb={100} />
            </ScrollView>

            <Fab
                renderInPortal={false}
                bg={PRIMARY_COLOR}
                shadow={2}
                size="sm"
                _pressed={{
                    backgroundColor: PRIMARY_COLOR,
                    opacity: 0.8
                }}
                zIndex={1}
                icon={<Icon color="white" as={MaterialCommunityIcons} name="plus" size={4} />}
                onPress={() => { navigation.navigate("CreatePatient") }}
            />
        </Box>
    )
}

export default PatientListScreen