import React, { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from "../redux/ActionType";
import AuthContext, { AuthContextData } from "./authContext";
import { ReducerRootState } from "../redux/Reducer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./authStackNavigator";
import DoctorHomeStackNavigator from "./doctorHomeStackNavigator";
import NurseHomeStackNavigator from "./nurseHomeStackNavigator";
import AdminHomeStackNavigator from "./adminHomeStackNavigator";
import theme from "../utils/theme";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SplashScreen from 'react-native-splash-screen'
import { LogBox } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, { Importance } from "react-native-push-notification";

export type RouteNavigationParams = {
    Auth: any;
    DoctorHome: any;
    NurseHome: any;
    AdminHome: any;
}

const Stack = createNativeStackNavigator<RouteNavigationParams>();

const RouteNavigation = () => {

    LogBox.ignoreAllLogs()

    const state = useSelector((state: ReducerRootState) => state)

    const dispatch = useDispatch()

    const Auth = useMemo(
        () => ({
            SignIn: async (data: AuthContextData) => {
                try {
                    await AsyncStorage.setItem('user', JSON.stringify(data))

                    createNotification(data)

                    dispatch({ type: ActionType.LOGIN, payload: data });
                } catch (error) {

                }
            },
            SignOut: async () => {

                try {
                    await AsyncStorage.removeItem('user')

                    PushNotification.deleteChannel('urgent');

                    dispatch({ type: ActionType.LOGOUT });
                } catch (error) {

                }
            }
        }),
        [],
    );

    const createNotification = async (data: AuthContextData) => {

        console.log('create notif data = ', data);


        if (data.role == 'doctor' || data.role == 'nurse') {
            PushNotification.createChannel(
                {
                    channelId: 'urgent', // (required)
                    channelName: 'urgent', // (required)
                    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
                    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
                },
                (created: any) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
            );

            PushNotification.configure({
                // (optional) Called when Token is generated (iOS and Android)
                onRegister: function (token: any) {
                    // console.log("TOKEN:", token);

                    firestore()
                        .collection('fcmToken')
                        .doc('fcmToken')
                        .update({
                            fcm_token: firestore.FieldValue.arrayUnion(token?.token),
                        });
                },

                // (required) Called when a remote is received or opened, or local notification is opened
                onNotification: function (notification: any) {
                    // console.log("NOTIFICATION:", notification);

                    PushNotification.localNotification({
                        /* Android Only Properties */
                        channelId: 'urgent', // (optional) set whether this is an "ongoing" notification
                        subtitle: notification.title,
                        title: 'Mikiko App', // (optional)
                        message: notification.message,
                        smallIcon: 'ic_launcher',
                        largeIcon: 'ic_launcher',
                        bigLargeIcon: 'ic_launcher',
                        priority: 'high', // (optional) set notification priority, default: high
                        visibility: 'public',
                        playSound: true, // (optional) default: true
                        soundName: 'default', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
                        userInfo: notification.data,
                        action: ['Tanggapai']
                    });

                },
                onAction: function (notification: any) {
                    // console.log("ACTION:", notification.action);

                },
                onRegistrationError: function (err: any) {
                    console.error(err.message, err);
                    console.log('error')
                },
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
                popInitialNotification: true,
                requestPermissions: true,
            });
        } else {
            PushNotification.cancelAllLocalNotifications()
        }
    }

    const registerUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user')

            if (userData != null) {
                dispatch({ type: ActionType.LOGIN, payload: JSON.parse(userData) });
                createNotification(JSON.parse(userData))
                setTimeout(() => {
                    SplashScreen.hide()
                }, 500)
            } else {
                SplashScreen.hide()
            }
        } catch (error) {

        }
    }

    useEffect(() => {

        registerUser()

        // const subscribe = auth()
        //     .onAuthStateChanged(async (user) => {
        //         console.log('route user data ===', user?.email);

        //         if (user?.email != undefined && user?.email != null) {
        //             const users = await firestore().collection('Users').doc(user?.email).get();

        //             dispatch({
        //                 type: ActionType.LOGIN, payload: {
        //                     email: users?.data()?.email,
        //                     nama: users?.data()?.name,
        //                     role: users?.data()?.role
        //                 }
        //             });

        //             SplashScreen.hide();
        //         } else {
        //             dispatch({ type: ActionType.LOGOUT });

        //             SplashScreen.hide();
        //         }
        //     })

        // return () => subscribe()

        return () => { }

    }, [])

    return (
        <AuthContext.Provider value={Auth} >
            <NativeBaseProvider theme={theme} >
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }} >

                        {state.auth.role == '' ?
                            (<Stack.Screen name="Auth" component={AuthStackNavigator} />) :
                            state.auth.role == 'doctor' ?
                                (<Stack.Screen name="DoctorHome" component={DoctorHomeStackNavigator} />) :
                                state.auth.role == 'nurse' ?
                                    (<Stack.Screen name="NurseHome" component={NurseHomeStackNavigator} />) :
                                    (<Stack.Screen name="AdminHome" component={AdminHomeStackNavigator} />)
                        }

                    </Stack.Navigator>
                </NavigationContainer>

                {/* <AdminHomeScreen /> */}
                {/* <DoctorHomeScreen /> */}
                {/* <DataSendScreen /> */}
            </NativeBaseProvider>
        </AuthContext.Provider>
    )
}

export default RouteNavigation