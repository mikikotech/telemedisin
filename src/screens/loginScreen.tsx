import { Box, Center, HStack, Icon, Image, Pressable, ScrollView, Text } from "native-base";
import React, { useContext, useState } from "react";
import LoginButton from "../components/loginButton";
import { FONT_ACTIVE, PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams } from "../navigations/authStackNavigator";
import TextInput from "../components/textInput";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from "../navigations/authContext";
import auth from '@react-native-firebase/auth';
import AndroidToast from "../utils/AndroidToast";
import firestore from '@react-native-firebase/firestore';
import { LogBox } from "react-native";

type Nav = NativeStackScreenProps<AuthStackParams>;

const LoginScreen = ({ navigation }: Nav) => {

    const { SignIn } = useContext(AuthContext);

    const [email, setEmail] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);
    // const [submit, submitSet] = useState<boolean>(false);

    const LoginHandle = async () => {

        if (email != '' && pass != '') {
            await auth()
                .signInWithEmailAndPassword(email, pass)
                .then(async (user: any) => {

                    console.log(user);


                    const users = await firestore().collection('Users').doc(user.user.email).get();

                    console.log(users.data());

                    SignIn({
                        email: users?.data()?.email,
                        nama: users?.data()?.name,
                        role: users?.data()?.role
                    })

                    // if (users?.data()?.role == 'admin') {

                    // } else if (users?.data()?.role == 'nurse') {
                    //     AndroidToast.toast('This account is nurse account!')
                    // } else {
                    //     AndroidToast.toast('This account is doctor account!')
                    // }
                })
                .catch(error => {
                    if (error.code === 'auth/user-not-found') {
                        AndroidToast.toast('Wrong email!');
                    }
                    if (error.code === 'auth/invalid-email') {
                        AndroidToast.toast('Invalid email!');
                    }
                    if (error.code === 'auth/wrong-password') {
                        AndroidToast.toast('Wrong password');
                    }
                    if (error.code == 'auth/too-many-requests') {
                        AndroidToast.toast('try another login method');
                    }
                });
        } else {
            AndroidToast.toast("email and password can't be empty");
        }
    }

    LogBox.ignoreAllLogs();

    return (
        <ScrollView
            width='100%'
            height='100%'
            px={5}
            py={10}
            bg={WHITE_COLOR}
        >
            <Center>
                <Box>
                    <Box mt={45} justifyContent={'center'} alignItems={'center'}>
                        <Image alt='image'
                            source={require('./../assets/icons/wecare.png')}
                            w={164}
                            h={190}
                        />
                        <HStack>
                            <Text mt={5} fontSize={16} color={PRIMARY_COLOR} >login</Text>
                            <Pressable onPress={() => {
                                navigation.navigate('SignUp')
                            }} >
                                <Text mt={5} fontSize={16} color={'gray.400'} ml={5} >signup</Text>
                            </Pressable>
                        </HStack>
                    </Box>

                    <Box mt={30} />

                    {/* <LoginButton
                        onPress={() => {
                            navigation.navigate("Doctor")
                        }}
                        name="Doctor Login"
                        bgcolor={WHITE_COLOR}
                        txtcolor={PRIMARY_COLOR}
                        variant="solid"
                        shadow={true}
                    />
                    <Box mb={5} />
                    <LoginButton
                        onPress={() => {
                            navigation.navigate("Nurse")
                        }}
                        name="Nurse Login"
                        bgcolor={WHITE_COLOR}
                        txtcolor={PRIMARY_COLOR}
                        variant="solid"
                        shadow={true}
                    />
                    <Box mb={5} />
                    <LoginButton
                        onPress={() => {
                            navigation.navigate("Admin")
                        }}
                        name="Admin Login"
                        bgcolor={WHITE_COLOR}
                        txtcolor={PRIMARY_COLOR}
                        variant="solid"
                        shadow={true}
                    /> */}
                    <Box>
                        <TextInput
                            label="Email ID"
                            placeholder="email"
                            type="text"
                            value={email}
                            keyboardType="email-address"
                            onChangeText={(val) => { setEmail(val) }}
                            h={65}
                        />
                        <Box mb={15} />
                        <TextInput
                            label='Password'
                            placeholder="password"
                            type={show ? 'text' : 'password'}
                            value={pass}
                            h={65}
                            onChangeText={(val) => {
                                setPass(val)
                            }}
                            inputRightElement={
                                <Box size="xs" rounded="none" w="1/6" h="full">
                                    <Center flex={1} justifyContent="center" alignItems="center">
                                        <Icon
                                            as={MaterialCommunityIcons}
                                            name={show ? 'eye' : 'eye-off'}
                                            size={6}
                                            color={FONT_ACTIVE}
                                            onPress={() => {
                                                setShow((prev) => !prev)
                                            }}
                                        />
                                    </Center>
                                </Box>
                            }
                        />
                    </Box>
                    <Box mb={49} />
                    <LoginButton
                        onPress={LoginHandle}
                        name="Login"
                        bgcolor={PRIMARY_COLOR}
                        txtcolor={WHITE_COLOR}
                        variant="solid"
                    />
                    <Box mb={5} />
                </Box>
            </Center>
            <Box mb={30} />
        </ScrollView>
    )
}

export default LoginScreen