import { Avatar, Box, Button, Center, HStack, Pressable, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import TextInput from "../components/textInput";
import LoginButton from "../components/loginButton";
import { BackHandler, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import firestore from '@react-native-firebase/firestore';

type Nav = NativeStackScreenProps<any>;

const AddPatientAdditionalDataScreen = ({ navigation, route }: Nav) => {

    const [data, setData] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [uri, setUri] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('PatientAddionalDetail')
                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    useLayoutEffect(() => {
        const subscribe = firestore()
            .collection('patient')
            .doc(route?.params?.id)
            .onSnapshot((data) => {
                console.log('pasien details = ', data.data());
                setName(data.data()?.name)
                setUri(data.data()?.uri)
            })

        return () => subscribe()
    }, [])

    const saveDataHandle = () => {

        if (data != '' && value != '') {
            firestore()
                .collection('patient')
                .doc(route.params?.id)
                .update({
                    data_tambahan: firestore.FieldValue.arrayUnion({
                        id: new Date().getTime(),
                        data: data,
                        value: value
                    })
                }).then(() => {
                    navigation.replace("Trantitions", {
                        type: 'adddata',
                        screen: 'PatientAddionalDetail',
                        id: route.params?.id
                    })
                })
                .catch(() => { })
        }
    }

    return (
        <ScrollView
            width='100%'
            height='100%'
            px={5}
            py={10}
            bg={WHITE_COLOR}
        >
            <Box mt={30} />
            <HStack alignItems={'center'} >
                <Avatar size='lg' mr={19} source={{ uri: uri }} ml={34} >
                    {route.params?.id}
                </Avatar>
                <VStack>
                    <Text fontSize={15} color='#515A50' fontWeight={'bold'} >{name}</Text>
                    <Text fontSize={12} color='#6B6B6B' >patient {route.params?.id}</Text>
                </VStack>
            </HStack>
            <Center mt={29} >

                <Box>
                    <Text fontSize={20} color='#515A50' fontWeight={'bold'} mb={23} >Masukan Data</Text>
                    <View key={1} >
                        <TextInput h={65} label={'Data 1'} value={data} onChangeText={(val) => {
                            setData(val)
                        }} placeholder="data" type="text" />
                        <Box mb={2} />
                        <TextInput h={122} label='Keterangan' value={value} onChangeText={(val) => {
                            setValue(val)
                        }} placeholder="keterangan" type="text" />
                    </View>
                    <Box mt={65} />
                    <LoginButton bgcolor={WHITE_COLOR} name="Save" onPress={() => {
                        saveDataHandle()
                    }} txtcolor={PRIMARY_COLOR} variant="outline" borderColor={PRIMARY_COLOR} />
                </Box>
            </Center>

            <Box mb={70} />

        </ScrollView>
    )
}

export default AddPatientAdditionalDataScreen