import { Box, Button, Center, Icon, Image, ScrollView, Text } from "native-base";
import React, { useContext, useState } from "react";
import { FONT_ACTIVE, PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import LoginButton from "../components/loginButton";
import TextInput from "../components/textInput";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AuthContext from "../navigations/authContext";
import auth from '@react-native-firebase/auth';
import AndroidToast from "../utils/AndroidToast";
import firestore from '@react-native-firebase/firestore';
import { LogBox } from "react-native";

type Nav = NativeStackScreenProps<any>;

const AdminLoginScreen = ({ navigation }: Nav) => {

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


                    if (users?.data()?.role == 'admin') {
                        SignIn({
                            email: users?.data()?.email,
                            nama: users?.data()?.name,
                            role: users?.data()?.role
                        })
                    } else if (users?.data()?.role == 'nurse') {
                        AndroidToast.toast('This account is nurse account!')
                    } else {
                        AndroidToast.toast('This account is doctor account!')
                    }
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
            showsVerticalScrollIndicator={false}
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
                        <Text mt={5} fontSize={16} color={PRIMARY_COLOR} >login</Text>
                    </Box>

                    <Box mt={25} />
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
                <Button
                    variant={'unstyled'}
                    onPress={() => {
                        navigation.navigate('Login')
                    }}
                >
                    <Text
                        color={PRIMARY_COLOR}
                        fontSize={20}
                        letterSpacing={1}
                    >
                        Back To Login User
                    </Text>
                </Button>
            </Center>
            <Box mt={50} />
        </ScrollView>
    )
}

export default AdminLoginScreen