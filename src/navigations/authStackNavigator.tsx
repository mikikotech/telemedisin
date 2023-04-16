import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen';
import DoctorLoginScreen from '../screens/doctorLoginScreen';
import NurseLoginScreen from '../screens/nurseLoginScreen';
import AdminLoginScreen from '../screens/adminLoginScreen';
import { PRIMARY_COLOR } from '../utils/constant';

export type AuthStackParams = {
    Login: any;
    Doctor: any;
    Nurse: any;
    Admin: any;
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
            <Stack.Screen name='Doctor' component={DoctorLoginScreen} />
            <Stack.Screen name='Nurse' component={NurseLoginScreen} />
            <Stack.Screen name='Admin' component={AdminLoginScreen} />
        </Stack.Navigator>
    )
}

export default AuthStackNavigator