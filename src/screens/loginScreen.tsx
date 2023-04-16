import { Box, Center, Image, Text } from "native-base";
import React from "react";
import LoginButton from "../components/loginButton";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams } from "../navigations/authStackNavigator";

type Nav = NativeStackScreenProps<AuthStackParams>;

const LoginScreen = ({ navigation }: Nav) => {
    return (
        <Box
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
                        <Text mt={5} fontSize={16} color={PRIMARY_COLOR} >login</Text>
                    </Box>

                    <Box mt={60} />

                    <LoginButton
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
                    />
                </Box>
            </Center>
        </Box>
    )
}

export default LoginScreen