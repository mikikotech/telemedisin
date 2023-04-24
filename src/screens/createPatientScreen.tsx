import { Avatar, Box, Button, Center, HStack, Icon, Image, Modal, Pressable, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, PRIMARY_RED_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import TextInput from "../components/textInput";
import LoginButton from "../components/loginButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminHomeStackParams } from "../navigations/adminHomeStackNavigator";
import firestore from '@react-native-firebase/firestore';
import AndroidToast from "../utils/AndroidToast";
import { BackHandler } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import PatientDetails from "../components/patientDetails";

type Nav = NativeStackScreenProps<AdminHomeStackParams>;

const CreatePatientScreen = ({ navigation }: Nav) => {

    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [job, setJob] = useState<string>('')
    const [keluhan, setKeluhan] = useState<string>('')
    const [diagnosa, setDiagnosa] = useState<string>('')
    const [uri, setUri] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')
    const [submit, setSubmit] = useState<boolean>(false)

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [newUserModel, setNewUserModal] = useState<boolean>(false);

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('PatientList')
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

    const createPatientHandle = async () => {

        setSubmit(true)

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
                    .set({
                        id: id,
                        name: name,
                        age: age,
                        address: address,
                        job: job,
                        uri: url,
                        data_tambahan: [],
                        keluhan: keluhan,
                        diagnosa: diagnosa,
                        sensor_id: '',
                        laporan_kesehatan: {
                            keluhan: '',
                            tanggapan: ''
                        }
                    })
                    .then(() => {
                        navigation.replace("Trantitions", {
                            type: 'acc',
                            screen: 'PatientList'
                        })

                        setSubmit(false)
                    })
                    .catch(() => { })
            }
        })
    }

    return (
        <ScrollView
            // safeArea
            width='100%'
            height='100%'
            px={5}
            py={5}
            bg={WHITE_COLOR}
            showsVerticalScrollIndicator={false}
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
                        h={65}
                    />

                    <TextInput
                        label="Name"
                        placeholder="name"
                        type="text"
                        value={name}
                        onChangeText={(val) => { setName(val) }}
                        h={65}
                    />

                    <TextInput
                        label='Age'
                        placeholder="age"
                        type="text"
                        value={age}
                        h={65}
                        keyboardType="numeric"
                        onChangeText={(val) => { setAge(val) }}
                    />

                    <TextInput
                        label='Address'
                        placeholder="address"
                        type="text"
                        value={address}
                        h={65}
                        onChangeText={(val) => { setAddress(val) }}
                    />

                    <TextInput
                        label='Job'
                        placeholder="job"
                        type="text"
                        value={job}
                        h={65}
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

                        if (id != '' && name != '' && age != '' && address != '' && job != '' && keluhan != '' && diagnosa != '') {

                            if (uri != 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png') {
                                setNewUserModal(true)
                            } else {
                                AndroidToast.toast("Patient photo can't be empty!")
                            }
                        } else {
                            AndroidToast.toast("Text field can't be empty!")
                        }
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
            <Box mb={50} />

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


            {/* modal new pasient */}

            <Modal isOpen={newUserModel} onClose={() => setNewUserModal(false)} safeAreaTop={true} size="lg">
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>New Patient</Modal.Header>
                    <Modal.Body>
                        <Center>
                            <Box
                                bg={WHITE_COLOR}
                                px={25}
                                py={17}
                                w={250}
                                style={{
                                    elevation: 10,
                                    shadowColor: '#8a8a8a',
                                }}
                                borderRadius={10}
                            >
                                <VStack>
                                    <HStack alignItems={'center'} justifyContent={'space-between'} >
                                        <HStack>
                                            <Avatar bg="indigo.500" alignSelf="center" size="lg" source={{
                                                uri: uri
                                            }}
                                                mr={5} >{id}</Avatar>
                                            <VStack>
                                                <Text fontSize={20} maxW={130} numberOfLines={1} lineBreakMode="tail" color='#515A50' fontWeight={'bold'} >{name}</Text>
                                                <Text fontSize={15} maxW={100} numberOfLines={1} lineBreakMode="tail" color='#6B6B6B'>patient {id}</Text>
                                            </VStack>
                                        </HStack>
                                    </HStack>

                                    {/* nama lengkap */}
                                    <>
                                        <Text
                                            mt={9}
                                            color='#C6C6C6'
                                            fontSize={17}
                                            numberOfLines={2}
                                            lineBreakMode="tail"
                                        >
                                            Nama Lengkap : {' '}
                                            <Text
                                                color='#515A50'
                                                fontSize={17}
                                            >
                                                {name}
                                            </Text>
                                        </Text>
                                    </>

                                    {/* umur */}
                                    <>
                                        <Text
                                            mt={2}
                                            color='#C6C6C6'
                                            fontSize={17}
                                            numberOfLines={1}
                                            lineBreakMode="tail"
                                        >
                                            Umur : {' '}
                                            <Text
                                                color='#515A50'
                                                fontSize={17}
                                            >
                                                {age} Tahun
                                            </Text>
                                        </Text>
                                    </>

                                    {/* alamat */}
                                    <>
                                        <Text
                                            mt={2}
                                            color='#C6C6C6'
                                            fontSize={17}
                                            numberOfLines={2}
                                            lineBreakMode="tail"
                                        >
                                            Alamat : {' '}
                                            <Text
                                                color='#515A50'
                                                fontSize={17}
                                            >
                                                {address}
                                            </Text>
                                        </Text>
                                    </>

                                    {/* pekerjaan */}
                                    <>
                                        <Text
                                            mt={2}
                                            color='#C6C6C6'
                                            fontSize={17}
                                            numberOfLines={1}
                                            lineBreakMode="tail"
                                        >
                                            Pekerjaan : {' '}
                                            <Text
                                                color='#515A50'
                                                fontSize={17}
                                            >
                                                {job}
                                            </Text>
                                        </Text>
                                    </>

                                    {/* keluhan */}
                                    <>
                                        <Text
                                            mt={2}
                                            color='#C6C6C6'
                                            fontSize={17}
                                            numberOfLines={1}
                                            lineBreakMode="tail"
                                        >
                                            Keluhan : {' '}
                                            <Text
                                                color='#515A50'
                                                fontSize={17}
                                            >
                                                {keluhan}
                                            </Text>
                                        </Text>
                                    </>

                                    {/* diagnosa */}
                                    <>
                                        <Text
                                            mt={2}
                                            color='#C6C6C6'
                                            fontSize={17}
                                            numberOfLines={1}
                                            lineBreakMode="tail"
                                        >
                                            Diagnosa : {' '}
                                            <Text
                                                color='#515A50'
                                                fontSize={17}
                                            >
                                                {diagnosa}
                                            </Text>
                                        </Text>
                                    </>

                                </VStack>
                            </Box>
                        </Center>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button w={75} bg={PRIMARY_RED_COLOR} _pressed={{ backgroundColor: RED_COLOR }} onPress={() => {
                                setNewUserModal(false);
                            }}>
                                Edit
                            </Button>
                            <Button w={75} bg={PRIMARY_COLOR} _pressed={{ backgroundColor: PRIMARY_COLOR_DISABLE }} onPress={async () => {
                                setNewUserModal(false);
                                createPatientHandle()
                            }}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

        </ScrollView>
    )
}

export default CreatePatientScreen