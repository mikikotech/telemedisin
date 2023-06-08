import { Box, Button, Center, Image, Modal, Pressable, Text } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import AdminCategories from "../components/adminCategories";
import { ORANGE_COLOR, PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, PRIMARY_RED_COLOR, PURPLE_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import AuthContext from "../navigations/authContext";
import { AdminHomeStackParams } from "../navigations/adminHomeStackNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import auth from '@react-native-firebase/auth';
import { request, PERMISSIONS } from 'react-native-permissions';
import { BackHandler } from "react-native";

type Nav = NativeStackScreenProps<AdminHomeStackParams>;

const AdminHomeScreen = ({ navigation }: Nav) => {

    const { SignOut } = useContext(AuthContext);
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

            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
                console.log(result)
            });
        });

        return () => { }
    }, [])

    return (
        <Box
            width='100%'
            height='100%'
            px={5}
            py={5}
            bg={WHITE_COLOR}
        >

            <Center>
                <Box>
                    <Box mt={30} justifyContent={'center'} alignItems={'center'}>
                        <Image
                            alt='image'
                            source={require('./../assets/icons/wecare.png')}
                            w={130}
                            h={150}
                        />
                        <Text mt={5} fontSize={16} color={PRIMARY_COLOR} >Admin Menu</Text>
                    </Box>

                    <Box mt={25} />
                    <Text color={'#515A50'} fontSize={18} fontWeight={'bold'} >Categories</Text>
                    <Box mt={21} />
                    <Pressable onPress={() => { navigation.navigate("CreateDoctor") }} >
                        <AdminCategories
                            bg={ORANGE_COLOR}
                            categories="Create Doctor"
                            icon={<Image source={require('./../assets/icons/doctor.png')} w={30} h={30} alt='doctor' />}
                        />
                    </Pressable>
                    <Box mt={23} />
                    <Pressable onPress={() => { navigation.navigate("CreateNurse") }}>
                        <AdminCategories
                            bg={RED_COLOR}
                            categories="Create Nurse"
                            icon={<Image source={require('./../assets/icons/nurse.png')} w={30} h={22} alt='nurse' />}
                        />
                    </Pressable>
                    <Box mt={23} />
                    <Pressable onPress={() => { navigation.navigate("PatientList") }}>
                        <AdminCategories
                            bg={PURPLE_COLOR}
                            categories="Patient List"
                            icon={<Image source={require('./../assets/icons/data.png')} w={25} h={30} alt='patient' />}
                        />
                    </Pressable>
                    <Button variant={"unstyled"} mt={5} onPress={async () => {
                        await auth()
                            .signOut()
                            .then(() => SignOut());

                    }} >
                        <Text fontSize={20} color={PRIMARY_COLOR} >Back to Login User</Text>
                    </Button>
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

        </Box>
    )
}

export default AdminHomeScreen