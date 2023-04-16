import { extendTheme } from 'native-base';

const fontConfig = {
    Poppins: {
        100: {
            normal: 'Poppins-Thin',
        },
        200: {
            normal: 'Poppins-Light',
        },
        300: {
            normal: 'Poppins-Regular',
        },
        400: {
            normal: 'Poppins-Medium',
        },
        500: {
            normal: 'Poppins-SemiBold',
        },
        600: {
            normal: 'Poppins-Bold',
        },
    },
};

const fonts = {
    heading: 'Poppins-Bold',
    body: 'Poppins-Medium',
    mono: 'Poppins-Light',
};

export default extendTheme({ fontConfig, fonts });