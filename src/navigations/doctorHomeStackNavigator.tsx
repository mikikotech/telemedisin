import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import DoctorHomeScreen from '../screens/doctorHomeScreen';
import PatientDetailScreen from '../screens/patientDetailScreen';
import PatientAdditionalDataScreen from '../screens/patientAdditionalDataScreen';
import DataSendScreen from '../screens/dataSendScreen';
import { HStack, Icon, Menu, Pressable, Text } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONT_INACTIVE, PRIMARY_COLOR, WHITE_COLOR } from '../utils/constant';
import AuthContext from './authContext';
import AnimatedTrantitions from '../screens/animatedTrantitions';
import auth from '@react-native-firebase/auth';

export type DoctorHomeStackParams = {
    Home: any;
    PatientDetail: any;
    PatientAddionalDetail: any;
    DataSend: any;
    Trantitions: any;
};

type Nav = NativeStackScreenProps<any>;

const Stack = createNativeStackNavigator<DoctorHomeStackParams>();

const DoctorHomeStackNavigator = ({ route }: Nav) => {

    const { SignOut } = useContext(AuthContext);

    return (
        <Stack.Navigator screenOptions={({ navigation }) => ({
            headerStyle: { backgroundColor: WHITE_COLOR },
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerLeft: () => (
                <Icon
                    as={MaterialCommunityIcons}
                    name={'chevron-left'}
                    size={8}
                    color={PRIMARY_COLOR}
                    onPress={() => { navigation.goBack() }}
                />
            ),
            headerRight: () => (
                <Menu trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <Icon
                            as={MaterialCommunityIcons}
                            name={'account-outline'}
                            size={8}
                            color={PRIMARY_COLOR}
                        />
                    </Pressable>;
                }}>
                    <Menu.Item>
                        <Pressable onPress={async () => {
                            await auth()
                                .signOut()
                                .then(() => SignOut());
                        }}>
                            <HStack alignItems={'center'} >
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name={'logout-variant'}
                                    size={8}
                                    color={PRIMARY_COLOR}

                                />
                                <Text ml={2}>Logout</Text>
                            </HStack>
                        </Pressable>
                    </Menu.Item>
                    <Menu.Item isDisabled >
                        <Pressable>
                            <HStack alignItems={'center'}>
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name={'cog-outline'}
                                    size={8}
                                    color={FONT_INACTIVE}
                                />
                                <Text ml={2} color={FONT_INACTIVE}>Settings</Text>
                            </HStack>
                        </Pressable>
                    </Menu.Item>
                </Menu>
            ),
        })} >
            <Stack.Screen name='Home' component={DoctorHomeScreen} options={(navigation) => ({
                title: 'Daftar Pasien',
                headerLeft: () => (
                    <></>
                ),
            })} />
            <Stack.Screen name='PatientDetail' component={PatientDetailScreen} options={(navigation) => ({
                title: 'Kondisi Pasien',
                headerLeft: () => (
                    <Icon
                        as={MaterialCommunityIcons}
                        name={'chevron-left'}
                        size={8}
                        color={PRIMARY_COLOR}
                        onPress={() => { navigation.navigation.navigate('Home') }}
                    />
                ),
            })} />
            <Stack.Screen name='PatientAddionalDetail' component={PatientAdditionalDataScreen} options={(navigation) => ({
                title: 'Data Pasien',
            })} />
            <Stack.Screen name='Trantitions' component={AnimatedTrantitions} options={(navigation) => ({
                headerShown: false
            })} />
            <Stack.Screen name='DataSend' component={DataSendScreen} options={(navigation) => ({
                headerShown: false
            })} />
        </Stack.Navigator>
    )
}

export default DoctorHomeStackNavigator


