import { Avatar, Box, Center, Fab, HStack, Icon, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { PRIMARY_COLOR, WHITE_COLOR } from "../utils/constant";
import PatientAdditionalData from "../components/patientAdditionalData";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import firestore from '@react-native-firebase/firestore';
import { useSelector } from "react-redux";
import { ReducerRootState } from "../redux/Reducer";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BackHandler } from "react-native";
import AdditionalService from "../components/additionalService";

type Nav = NativeStackScreenProps<any>;

const AdditionalServiceScreen = ({ navigation, route }: Nav) => {

    const state = useSelector((state: ReducerRootState) => state.auth)

    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [uri, setUri] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')

    const [services, setServices] = useState<Array<any>>([])

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

    useEffect(() => {
        const subscribe = firestore()
            .collection('patient')
            .doc(route?.params?.id)
            .onSnapshot((data) => {
                setServices(data.data()?.tambahan_service)
                setId(data.data()?.id)
                setName(data.data()?.name)
                setUri(data.data()?.uri)
            })
    }, [])

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
                <Avatar size='lg' mr={19} ml={34} source={{ uri: uri }} >
                    {id}
                </Avatar>
                <VStack>
                    <Text fontSize={15} color='#515A50' fontWeight={'bold'} >{name}</Text>
                    <Text fontSize={12} color='#6B6B6B' maxW={40} numberOfLines={1}  >patient {id}</Text>
                </VStack>
            </HStack>
            <Center mt={29} >
                <ScrollView
                    width='100%'
                    height='100%'
                    bg={WHITE_COLOR}
                    showsVerticalScrollIndicator={false}
                >
                    <Center >
                        {services.map((val, i) => {
                            return (
                                <>
                                    <AdditionalService
                                        key={i + 1}
                                        nama={`${i + 1}`}
                                        value={val.service}
                                    />

                                    <Box mb={19} />
                                </>
                            )
                        })}
                    </Center>
                    <Box mb={19} />
                </ScrollView>
                <Box mb={140} />
            </Center>
            {state.role == 'nurse' ?
                (
                    <Fab
                        renderInPortal={false}
                        bg={PRIMARY_COLOR}
                        shadow={2}
                        size="sm"
                        _pressed={{
                            backgroundColor: PRIMARY_COLOR,
                            opacity: 0.8
                        }}
                        zIndex={1}
                        icon={<Icon color="white" as={MaterialCommunityIcons} name="plus" size={4} />}
                        onPress={() => {
                            navigation.navigate("AddAdditionalService", {
                                id: route.params?.id
                            })
                        }}
                    />
                ) : null
            }
        </Box>
    )
}

export default AdditionalServiceScreen