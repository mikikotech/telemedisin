import { Avatar, Box, Center, HStack, Text, VStack } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import TextInput from "../components/textInput";
import LoginButton from "../components/loginButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import firestore from '@react-native-firebase/firestore';
import { BackHandler } from "react-native";

type Nav = NativeStackScreenProps<any>

const EditPatientAdditionalDataScreen = ({ navigation, route }: Nav) => {

    const [dataId, setDataId] = useState<string>('')
    const [data, setData] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [uri, setUri] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')
    const [firestoreData, setFirestoreData] = useState<any[]>([])

    useLayoutEffect(() => {
        const subscribe = firestore()
            .collection('patient')
            .doc(route.params?.id)
            .onSnapshot((data) => {
                setFirestoreData(data.data()?.data_tambahan)
                setId(data.data()?.id)
                setName(data.data()?.name)
                setUri(data.data()?.uri)
            })

        console.log('data id = ', route.params?.dataId);


        setDataId(route.params?.dataId)
        setData(route.params?.data)
        setValue(route.params?.value)
    }, [])

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

    const editDataHandle = () => {

        const newData = firestoreData.map((obj) => {
            if (obj.id == dataId) {
                return { ...obj, data: data, value: value }
            }

            return obj
        })

        firestore()
            .collection('patient')
            .doc(id)
            .update({
                data_tambahan: newData
            })
            .then(() => {
                navigation.replace("Trantitions", {
                    type: 'editdata',
                    screen: 'PatientAddionalDetail',
                    id: route.params?.id
                })
            })
            .catch((e) => { })
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
                <Avatar size='lg' source={{ uri: uri }} mr={19} ml={34} >
                    {id}
                </Avatar>
                <VStack>
                    <Text fontSize={15} color='#515A50' fontWeight={'bold'} >{name}</Text>
                    <Text fontSize={12} color='#6B6B6B' >patient {id}</Text>
                </VStack>
            </HStack>
            <Center mt={29} >
                <Box>
                    <TextInput h={65} label={`Data 1`} value={data} onChangeText={(val) => { setData(val) }} placeholder="data" type="text" />
                    <Box mb={2} />
                    <TextInput h={122} label='Keterangan' value={value} onChangeText={(val) => { setValue(val) }} placeholder="keterangan" type="text" />
                    <Box mb={38} />
                    <LoginButton bgcolor={WHITE_COLOR} name="Save" onPress={() => {
                        editDataHandle()
                    }} txtcolor={PRIMARY_COLOR} variant="outline" borderColor={PRIMARY_COLOR} />
                </Box>
            </Center>

        </Box>
    )
}

export default EditPatientAdditionalDataScreen