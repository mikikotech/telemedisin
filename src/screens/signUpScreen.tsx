import { Box, Center, HStack, Icon, Image, Pressable, ScrollView, Text } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import LoginButton from "../components/loginButton";
import { FONT_ACTIVE, PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams } from "../navigations/authStackNavigator";
import TextInput from "../components/textInput";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import AndroidToast from "../utils/AndroidToast";
import firestore from '@react-native-firebase/firestore';
import { BackHandler, LogBox } from "react-native";

type Nav = NativeStackScreenProps<AuthStackParams>;

interface user {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const SignUpScreen = ({ navigation }: Nav) => {

    const newUser: user = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    };

    const [passEye, setPassEye] = useState<boolean>(true)
    const [confirmPassEye, setConfirmPassEye] = useState<boolean>(true)

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('Login')
                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    const createAccount = async (val: user) => {

        await auth()
            .createUserWithEmailAndPassword(val.email, val.password)
            .then(async (userCredentials) => {

                const user = userCredentials.user

                if (user != null) {
                    await user.updateProfile({
                        displayName: val.username,
                    });

                    firestore()
                        .collection('Users')
                        .doc(val.email)
                        .set({
                            name: val.username,
                            email: val.email,
                            role: 'patient',
                            id: 0
                        })
                        .then(() => {
                            user
                                .sendEmailVerification()
                                .then(function () {
                                    // Email sent.
                                    // console.log('Email sent.');
                                })
                                .catch(function (error) {
                                    // An error happened.
                                    console.log(error);
                                });
                        })
                        .catch(() => { })
                }

                navigation.replace("Trantitions", {
                    type: 'acc',
                    screen: 'Login'
                })

            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    AndroidToast.toast('That email address is already in use!')
                }

                if (error.code === 'auth/unknown') {
                    AndroidToast.toast('Failed create account!')
                }

                if (error.code === 'auth/weak-password') {
                    AndroidToast.toast('Weak password')
                }
            });
    }

    const validSchema = yup.object({
        email: yup.string().email('invalid email').required('email is required!'),
        username: yup
            .string()
            .trim()
            .min(3, 'user name must be 3 - 12 characters!')
            .max(12, 'more than 12 characters')
            .required('user name is required!'),
        password: yup
            .string()
            .trim()
            .min(5, 'password too short')
            .required('password is required!'),
        confirmPassword: yup
            .string()
            .equals([yup.ref('password'), null], 'password does not match!'),
    });

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
                        {/* <Text fontSize={56} color={PRIMARY_COLOR} >WeCare</Text> */}
                        <HStack>
                            <Pressable onPress={() => {
                                navigation.navigate('Login')
                            }} >
                                <Text mt={5} fontSize={16} color={'gray.400'} >login</Text>
                            </Pressable>
                            <Text mt={5} fontSize={16} color={PRIMARY_COLOR} ml={5} >signup</Text>
                        </HStack>
                    </Box>

                    <Box mt={5} />

                    <Center>
                        <Formik
                            initialValues={newUser}
                            validationSchema={validSchema}
                            enableReinitialize={true}
                            onSubmit={(values, formikAction) => {
                                createAccount(values);
                                formikAction.resetForm();
                            }}>
                            {({ values, handleChange, handleBlur, errors, handleSubmit }) => {
                                const { email, username, password, confirmPassword } = values;

                                console.log('formik error log = ', errors);

                                return (
                                    <Box>
                                        <Box mt={47} />
                                        <TextInput
                                            label="Email ID"
                                            placeholder="email"
                                            type="text"
                                            value={email}
                                            keyboardType="email-address"
                                            onChangeText={handleChange('email')}
                                            h={65}
                                            isRequired={true}
                                            isInvalid={'email' in errors}
                                            onBlur={handleBlur('email')}
                                            errorMessage={errors.email}
                                        />
                                        <Box mb={15} />
                                        <TextInput
                                            label="Name"
                                            placeholder="name"
                                            type="text"
                                            value={username}
                                            onChangeText={handleChange('username')}
                                            h={65}
                                            isRequired={true}
                                            isInvalid={'username' in errors}
                                            onBlur={handleBlur('username')}
                                            errorMessage={errors.username}
                                        />
                                        <Box mb={15} />
                                        <TextInput
                                            label='Password'
                                            placeholder="password"
                                            type={passEye == true ? "password" : 'text'}
                                            value={password}
                                            h={65}
                                            onChangeText={handleChange('password')}
                                            isRequired={true}
                                            isInvalid={'password' in errors}
                                            onBlur={handleBlur('password')}
                                            errorMessage={errors.password}
                                            inputRightElement={
                                                <Box size="xs" rounded="none" w="1/6" h="full">
                                                    <Center flex={1} justifyContent="center" alignItems="center">
                                                        <Icon
                                                            as={MaterialCommunityIcons}
                                                            name={passEye == true ? 'eye-off' : 'eye'}
                                                            size={6}
                                                            color={FONT_ACTIVE}
                                                            onPress={() => { setPassEye((prev) => !prev) }}
                                                        />
                                                    </Center>
                                                </Box>
                                            }
                                        />

                                        <Box mb={15} />
                                        <TextInput
                                            label='Confirm Password'
                                            placeholder="password"
                                            type={confirmPassEye == true ? "password" : 'text'}
                                            value={confirmPassword}
                                            h={65}
                                            onChangeText={handleChange('confirmPassword')}
                                            isRequired={true}
                                            isInvalid={'confirmPassword' in errors}
                                            onBlur={handleBlur('confirmPassword')}
                                            errorMessage={errors.confirmPassword}
                                            inputRightElement={
                                                <Box size="xs" rounded="none" w="1/6" h="full">
                                                    <Center flex={1} justifyContent="center" alignItems="center">
                                                        <Icon
                                                            as={MaterialCommunityIcons}
                                                            name={confirmPassEye == true ? 'eye-off' : 'eye'}
                                                            size={6}
                                                            color={FONT_ACTIVE}
                                                            onPress={() => { setConfirmPassEye((prev) => !prev) }}
                                                        />
                                                    </Center>
                                                </Box>
                                            }
                                        />

                                        <Box mb={59} />
                                        <LoginButton
                                            onPress={() => {
                                                handleSubmit()
                                            }}
                                            name="Create Account"
                                            bgcolor={PRIMARY_COLOR}
                                            txtcolor={WHITE_COLOR}
                                            variant="solid"
                                        />
                                        <Box mb={85} />
                                    </Box>
                                )
                            }}
                        </Formik>
                    </Center>
                </Box>
            </Center>
        </ScrollView>
    )
}

export default SignUpScreen