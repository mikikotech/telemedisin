import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import DataSendScreen from '../screens/dataSendScreen';
import { HStack, Icon, Menu, Pressable, Text } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONT_INACTIVE, PRIMARY_COLOR, WHITE_COLOR } from '../utils/constant';
import AuthContext from './authContext';
import AdminHomeScreen from '../screens/adminHomeScreen';
import CreateDoctorScreen from '../screens/createDoctorScreen';
import CreateNurseScreen from '../screens/createNurseScreen';
import PatientListScreen from '../screens/patientListScreen';
import PatientDetailScreen from '../screens/patientDetailScreen';
import EditPatientDetailScreen from '../screens/editPatientDetailScreen';
import CreatePatientScreen from '../screens/createPatientScreen';
import AnimatedTrantitions from '../screens/animatedTrantitions';
import auth from '@react-native-firebase/auth';
import PatientReportScreen from '../screens/patientReportScreen';

export type AdminHomeStackParams = {
    Home: any;
    PatientDetail: any;
    PatientReport: any;
    EditPatientDetail: any;
    Trantitions: any;
    DataSend: any;
    CreateDoctor: any;
    CreateNurse: any;
    CreatePatient: any;
    PatientList: any;
};

const Stack = createNativeStackNavigator<AdminHomeStackParams>();

const AdminHomeStackNavigator = () => {

    const { SignOut } = useContext(AuthContext);

    return (
        <Stack.Navigator screenOptions={({ navigation }) => ({
            headerStyle: { backgroundColor: WHITE_COLOR },
            headerTransparent: true,
            headerTitleAlign: 'center',
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
                                <Text ml={2} >Logout</Text>
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
            <Stack.Screen name='Home' component={AdminHomeScreen} options={(navigation) => ({
                headerShown: false
            })} />
            <Stack.Screen name='CreateDoctor' component={CreateDoctorScreen} options={(navigation) => ({
                title: 'Create Account',
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
            <Stack.Screen name='CreateNurse' component={CreateNurseScreen} options={(navigation) => ({
                title: 'Create Account',
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
            <Stack.Screen name='CreatePatient' component={CreatePatientScreen} options={(navigation) => ({
                title: 'Create Patient',
                headerLeft: () => (
                    <Icon
                        as={MaterialCommunityIcons}
                        name={'chevron-left'}
                        size={8}
                        color={PRIMARY_COLOR}
                        onPress={() => { navigation.navigation.navigate('PatientList') }}
                    />
                ),
            })} />
            <Stack.Screen name='PatientList' component={PatientListScreen} options={(navigation) => ({
                title: 'Data Pasien',
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
            <Stack.Screen name='PatientDetail' component={PatientDetailScreen} options={(navigation) => ({
                title: 'Data Pasien',
                headerLeft: () => (
                    <Icon
                        as={MaterialCommunityIcons}
                        name={'chevron-left'}
                        size={8}
                        color={PRIMARY_COLOR}
                        onPress={() => { navigation.navigation.navigate('PatientList') }}
                    />
                ),
            })} />
            <Stack.Screen name='PatientReport' component={PatientReportScreen} options={(navigation) => ({
                title: 'Pasien Report',
                headerLeft: () => (
                    <Icon
                        as={MaterialCommunityIcons}
                        name={'chevron-left'}
                        size={8}
                        color={PRIMARY_COLOR}
                        onPress={() => { navigation.navigation.navigate('PatientDetail') }}
                    />
                ),
                orientation: 'landscape',
            })} />
            <Stack.Screen name='EditPatientDetail' component={EditPatientDetailScreen} options={(navigation) => ({
                title: 'Edit Profile',
                headerLeft: () => (
                    <Icon
                        as={MaterialCommunityIcons}
                        name={'chevron-left'}
                        size={8}
                        color={PRIMARY_COLOR}
                        onPress={() => {
                            navigation.navigation.navigate('PatientDetail', {
                                id: navigation.route?.params?.id
                            })
                        }}
                    />
                ),
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

export default AdminHomeStackNavigator


