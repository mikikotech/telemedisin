import { Avatar, Box, Button, Center, HStack, Icon, Image, Modal, Pressable, ScrollView, Spinner, Text } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, PRIMARY_RED_COLOR, WHITE_COLOR } from "../utils/constant";
import TextInput from "../components/textInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminHomeStackParams } from "../navigations/adminHomeStackNavigator";
import firestore from '@react-native-firebase/firestore';
import AndroidToast from "../utils/AndroidToast";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import { BackHandler } from "react-native";

type Nav = NativeStackScreenProps<AdminHomeStackParams>;

const EditPatientDetailScreen = ({ navigation, route }: Nav) => {

    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [job, setJob] = useState<string>('')
    const [keluhan, setKeluhan] = useState<string>('')
    const [diagnosa, setDiagnosa] = useState<string>('')
    const [uri, setUri] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')
    const [downloadUrl, setDownloadUrl] = useState<string>('')
    const [submit, setSubmit] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState<boolean>(true)

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

    const libraryImageHandle = async () => {
        await launchImageLibrary({
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
        },
            (callback) => {
                console.log(callback?.assets);

                if (callback.didCancel == true && callback.errorCode != undefined) {
                    console.log(callback.errorMessage);
                } else {

                    if (callback?.assets != undefined) {
                        setUri(callback?.assets[0]?.uri ?? '')
                    }
                }


            })
    }

    const cameraPickerHandle = async () => {

        console.log('pressed');

        await launchCamera({
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 200,
            maxWidth: 200,
        },
            (callback) => {
                console.log(callback?.assets);

                if (callback.didCancel == true && callback.errorCode != undefined) {
                    console.log(callback.errorMessage);
                } else {

                    if (callback?.assets != undefined) {
                        setUri(callback?.assets[0]?.uri ?? '')
                    }
                }


            })
    }

    const editPatientHandle = async () => {

        if (id != '' && name != '' && age != '' && address != '' && job != '' && keluhan != '' && diagnosa != '' && uri != '') {

            setSubmit(true)

            if (downloadUrl != uri) {
                const fileExt = uri.split('.').pop()
                const fileName = `${uuid.v4()}.${fileExt}`

                const reference = storage().ref(`patient.photo/${fileName}`);

                const task = reference.putFile(uri)

                await task.on('state_changed', async (onSnapshot) => {

                    const url = await storage().ref(`patient.photo/${fileName}`).getDownloadURL();

                    if (onSnapshot.state == 'success') {
                        await firestore()
                            .collection('patient')
                            .doc(id)
                            .update({
                                id: id,
                                name: name,
                                age: age,
                                address: address,
                                job: job,
                                uri: url,
                                keluhan: keluhan,
                                diagnosa: diagnosa,
                            })
                            .then(() => {
                                navigation.replace("Trantitions", {
                                    type: 'editdata',
                                    screen: 'PatientList'
                                })

                                setSubmit(false)
                            })
                            .catch(() => { })
                    }
                })
            } else {
                await firestore()
                    .collection('patient')
                    .doc(id)
                    .update({
                        id: id,
                        name: name,
                        age: age,
                        address: address,
                        job: job,
                        keluhan: keluhan,
                        diagnosa: diagnosa,
                    })
                    .then(() => {

                        navigation.replace("Trantitions", {
                            type: 'accountPatient',
                            screen: 'PatientList',
                            id: route.params?.id,
                        })
                    })
                    .catch(() => { })
            }


        } else {
            AndroidToast.toast("Text field can't be empty!")
        }
    }

    useLayoutEffect(() => {

        const subscribe = firestore()
            .collection('patient')
            .doc(route.params?.id)
            .onSnapshot((data) => {
                // console.log('pasien details = ', data.data());

                setId(data.data()?.id)
                setName(data.data()?.name)
                setAge(data.data()?.age)
                setAddress(data.data()?.address)
                setJob(data.data()?.job)
                setKeluhan(data.data()?.keluhan)
                setDiagnosa(data.data()?.diagnosa)
                setUri(data.data()?.uri)
                setDownloadUrl(data.data()?.uri)

                setIsloading(false)
            })

        return () => subscribe()

    }, [])

    return (

        isLoading ?
            (<Box w='100%' h='100%' bg={WHITE_COLOR} alignItems={'center'} justifyContent={'center'} >
                <Spinner size='lg' color={PRIMARY_COLOR} />
            </Box >) :
            (
                <ScrollView
                    // safeArea
                    width='100%'
                    height='100%'
                    px={5}
                    py={5}
                    bg={WHITE_COLOR}

                >
                    <Center>
                        <Box alignItems={'center'} >
                            <Box mt={47} />

                            <Box position={'relative'} >
                                <Pressable
                                    onPress={() => {
                                        setModalVisible(true)
                                    }}
                                >
                                    <Avatar size='lg' source={{
                                        uri: uri
                                    }} >
                                        000
                                    </Avatar>

                                    <Box
                                        position={'absolute'}
                                        h={21}
                                        w={21}
                                        borderRadius={5}
                                        bg={PRIMARY_COLOR_DISABLE}
                                        bottom={-8}
                                        left={21}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                    >
                                        <Image alt="iamge" source={require('./../assets/icons/edit.png')} w={3} h={3} />
                                    </Box>
                                </Pressable>
                            </Box>

                            <Box mt={2} />

                            <TextInput
                                label="ID Number"
                                placeholder="id"
                                type="text"
                                value={id}
                                keyboardType="numeric"
                                onChangeText={(val) => { setId(val) }}
                                h={55}
                            />

                            <TextInput
                                label="Name"
                                placeholder="name"
                                type="text"
                                value={name}
                                onChangeText={(val) => { setName(val) }}
                                h={55}
                            />

                            <TextInput
                                label='Age'
                                placeholder="age"
                                type="text"
                                value={age}
                                h={55}
                                keyboardType="numeric"
                                onChangeText={(val) => { setAge(val) }}
                            />


                            <TextInput
                                label='Address'
                                placeholder="address"
                                type="text"
                                value={address}
                                h={55}
                                onChangeText={(val) => { setAddress(val) }}
                            />
                            <TextInput
                                label='Job'
                                placeholder="job"
                                type="text"
                                value={job}
                                h={55}
                                onChangeText={(val) => { setJob(val) }}
                            />

                            <TextInput
                                label='Keluhan'
                                placeholder="keluhan"
                                type="text"
                                value={keluhan}
                                h={65}
                                onChangeText={(val) => { setKeluhan(val) }}
                            />

                            <TextInput
                                label='Diagnosa'
                                placeholder="diagnosa"
                                type="text"
                                value={diagnosa}
                                h={65}
                                onChangeText={(val) => { setDiagnosa(val) }}
                            />
                        </Box>
                        <Box mb={23} />

                        <Button
                            isLoading={submit}
                            isLoadingText="Submitting"
                            onPress={() => {
                                editPatientHandle()
                            }}
                            bg={PRIMARY_COLOR}
                            width={290}
                            height={60}
                            borderRadius={10}
                            _pressed={{
                                backgroundColor: PRIMARY_COLOR,
                                opacity: 0.8
                            }}
                            style={{
                                elevation: 10,
                                shadowColor: '#8a8a8a',
                            }}
                        >
                            <Text color={WHITE_COLOR} fontSize={20} fontWeight={'bold'} >Save</Text>
                        </Button>

                        <Box mb={5} />
                    </Center>

                    {/* modal */}

                    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} safeAreaTop={true} size="lg">
                        <Modal.Content>
                            <Modal.CloseButton />
                            <Modal.Header>Patient Photo</Modal.Header>
                            <Modal.Body>
                                <HStack justifyContent={'space-around'} >
                                    <Icon
                                        as={MaterialCommunityIcons}
                                        name={'file-image'}
                                        size={12}
                                        color={PRIMARY_RED_COLOR}
                                        onPress={() => {
                                            libraryImageHandle()

                                            setModalVisible(false)
                                        }}
                                    />
                                    <Icon
                                        as={MaterialCommunityIcons}
                                        name={'camera'}
                                        size={12}
                                        color={PRIMARY_COLOR}
                                        onPress={() => {
                                            cameraPickerHandle()

                                            setModalVisible(false)
                                        }}
                                    />
                                </HStack>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>

                    <Box mb={50} />
                </ScrollView>
            )

    )
}

export default EditPatientDetailScreen

