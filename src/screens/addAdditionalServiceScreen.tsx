import { Avatar, Box, Button, Center, CheckIcon, HStack, Pressable, ScrollView, Select, Text, VStack } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import TextInput from "../components/textInput";
import LoginButton from "../components/loginButton";
import { BackHandler, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import firestore from '@react-native-firebase/firestore';
import AndroidToast from "../utils/AndroidToast";

type Nav = NativeStackScreenProps<any>;

const AddAdditionalServiceScreen = ({ navigation, route }: Nav) => {

    const [service, setService] = useState<string>("");
    const [value, setValue] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [uri, setUri] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('AdditionalService', {
                    id: route.params?.id
                })
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

        if (service != '' || value != '') {
            firestore()
                .collection('patient')
                .doc(route.params?.id)
                .update({
                    tambahan_service: firestore.FieldValue.arrayUnion({
                        id: new Date().getTime(),
                        service: service != '' ? service : value,
                    })
                }).then(() => {
                    navigation.replace("Trantitions", {
                        type: 'adddata',
                        screen: 'AdditionalService',
                        id: route.params?.id
                    })
                })
                .catch(() => { })
        } else {
            AndroidToast.toast("Text field can't be empty!")
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
                    <Text fontSize={12} maxW={40} numberOfLines={1} color='#6B6B6B' >patient {route.params?.id}</Text>
                </VStack>
            </HStack>
            <Center mt={29} >

                <Box>
                    <Text fontSize={20} color='#515A50' fontWeight={'bold'} mb={23} >Choose Services</Text>

                    <Text color='#515A50' ml={1} fontWeight={"bold"} fontSize={20}>Services</Text>

                    <Box>
                        <Select selectedValue={service} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => {
                            setValue('')
                            setService(itemValue)
                        }}>
                            <Select.Item label="Oxytocin Massage" value="Oxytocin Massage" />
                            <Select.Item label="Wound Care" value="Wound Care" />
                            <Select.Item label="Vitamin Injections" value="Vitamin Injections" />
                            <Select.Item label="Minor Surgery" value="Minor Surgery" />
                            <Select.Item label="Installation of Breathing Tubes" value="Installation of Breathing Tubes" />
                        </Select>
                    </Box>
                    <Box mb={2} />
                    <TextInput h={122} label='Others' value={value} onChangeText={(val) => {
                        setValue(val)
                        setService('')
                    }} placeholder="others" type="text" />
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

export default AddAdditionalServiceScreen