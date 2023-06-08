import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen';
import DoctorLoginScreen from '../screens/doctorLoginScreen';
import NurseLoginScreen from '../screens/nurseLoginScreen';
import AdminLoginScreen from '../screens/adminLoginScreen';
import SignUpScreen from '../screens/signUpScreen';
import AnimatedTrantitions from '../screens/animatedTrantitions';
import DataSendScreen from '../screens/dataSendScreen';

export type AuthStackParams = {
    Login: any;
    SignUp: any;
    Doctor: any;
    Nurse: any;
    Admin: any;
    Trantitions: any;
    DataSend: any;
};

const Stack = createNativeStackNavigator<AuthStackParams>();

const AuthStackNavigator = () => {

    const config = {
        animation: 'spring',
        config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
        },
    };

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
            <Stack.Screen name='Doctor' component={DoctorLoginScreen} />
            <Stack.Screen name='Nurse' component={NurseLoginScreen} />
            <Stack.Screen name='Admin' component={AdminLoginScreen} />
            <Stack.Screen name='Trantitions' component={AnimatedTrantitions} options={(navigation) => ({
                headerShown: false
            })} />
            <Stack.Screen name='DataSend' component={DataSendScreen} options={(navigation) => ({
                headerShown: false
            })} />
        </Stack.Navigator>
    )
}

export default AuthStackNavigator