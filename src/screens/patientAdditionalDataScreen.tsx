import { Avatar, Box, Center, Fab, HStack, Icon, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import PatientAdditionalData from "../components/patientAdditionalData";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import firestore from '@react-native-firebase/firestore';
import AndroidToast from "../utils/AndroidToast";
import { useSelector } from "react-redux";
import { ReducerRootState } from "../redux/Reducer";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BackHandler } from "react-native";

type Nav = NativeStackScreenProps<any>

const PatientAdditionalDataScreen = ({ navigation, route }: Nav) => {

    const state = useSelector((state: ReducerRootState) => state.auth)

    const [data, setData] = useState<Array<any>>([])
    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [uri, setUri] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('PatientDetail')
                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    useLayoutEffect(() => {
        const subscribe = firestore()
            .collection('patient')
            .doc(route.params?.id)
            .onSnapshot((data) => {
                setData(data.data()?.data_tambahan)
                setId(data.data()?.id)
                setName(data.data()?.name)
                setUri(data.data()?.uri)
            })
    }, [])

    const editDataHandle = (dataId: string, data: string, value: string) => {

        navigation.navigate('EditPatientAddionalDetail', {
            id: route.params?.id,
            dataId: dataId,
            data: data,
            value: value,
        })
    }

    const deleteDataHandle = (dataId: string, data: string, value: string) => {
        firestore()
            .collection('patient')
            .doc(route.params?.id)
            .update({
                data_tambahan: firestore.FieldValue.arrayRemove({
                    id: dataId,
                    data: data,
                    value: value
                })
            }).catch(() => { })
    }

    return (
        <Box
            width='100%'
            height='100%'
            px={5}
            py={10}
            bg={WHITE_COLOR}
        >
            <Box mt={47} />
            <HStack alignItems={'center'} >
                <Avatar size='lg' mr={19} ml={34} source={{ uri: uri }} >
                    {id}
                </Avatar>
                <VStack>
                    <Text fontSize={15} color='#515A50' fontWeight={'bold'} >{name}</Text>
                    <Text fontSize={12} color='#6B6B6B' >patient {id}</Text>
                </VStack>
            </HStack>
            <Center mt={29} >
                <ScrollView
                    width='100%'
                    height='100%'
                    bg={WHITE_COLOR}
                    showsVerticalScrollIndicator={false}
                >
                    <Center >
                        {data.map((val, i) => {
                            return (
                                <>
                                    <PatientAdditionalData
                                        key={i + 1}
                                        nama={val.data}
                                        value={val.value}
                                        onEditPress={() => {
                                            editDataHandle(val.id, val.data, val.value)
                                        }}
                                        onRemovePress={() => {
                                            deleteDataHandle(val.id, val.data, val.value)
                                        }}
                                    />

                                    <Box mb={19} />
                                </>
                            )
                        })}
                    </Center>
                </ScrollView>
                <Box mb={140} />
            </Center>
            {state.role == 'nurse' ?
                (
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
                        onPress={() => {
                            navigation.navigate("AddPatientData", {
                                id: route.params?.id
                            })
                        }}
                    />
                ) : null
            }
        </Box>
    )
}

export default PatientAdditionalDataScreen