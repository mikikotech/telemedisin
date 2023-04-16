import { ToastAndroid } from 'react-native';

class Android {
    toast(message: string) {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            10,
            10,
        );
    }
}

export default new Android();