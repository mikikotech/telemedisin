import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import React, { useEffect } from 'react';
import { Text } from 'native-base';
import { BackHandler, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AndroidToast from '../utils/AndroidToast';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { ReducerRootState } from '../redux/Reducer';

type Nav = NativeStackScreenProps<any>;

const QrCodeScannerScreen = ({ navigation, route }: Nav) => {

    const state = useSelector((state: ReducerRootState) => state.auth)

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (state.role == 'nurse') {
                    navigation.navigate('PatientDetail', {
                        id: route.params?.id
                    })
                } else {
                    navigation.navigate('Home')
                }
                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    const onSuccess = async (e: any) => {
        console.log('An error occured', e?.data)

        const data = e?.data.split('&')
        if (data[1] == 'wecare') {

            await firestore()
                .collection('patient')
                .where('sensor_id', '==', data[0])
                .get()
                .then(async (val) => {

                    // console.log('where docs = ', val.docs[0].id);

                    if (val.empty) {
                        await firestore()
                            .collection('patient')
                            .doc(route.params?.id)
                            .update({
                                sensor_id: data[0],
                            })
                            .then(() => {
                                navigation.navigate('PatientDetail', {
                                    id: route.params?.id
                                })
                            })
                            .catch(() => { })
                    } else {
                        await firestore()
                            .collection('patient')
                            .doc(val.docs[0].id)
                            .update({
                                sensor_id: '',
                            })
                            .then(async () => {
                                await firestore()
                                    .collection('patient')
                                    .doc(route.params?.id)
                                    .update({
                                        sensor_id: data[0],
                                    })
                                    .then(() => {
                                        navigation.navigate('PatientDetail', {
                                            id: route.params?.id
                                        })
                                    })
                                    .catch(() => { })
                            })
                            .catch(() => { })
                    }
                })

        } else {
            AndroidToast.toast('Wrong QRcode!')
        }

    };

    return (
        <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.off}
            topContent={
                <Text>
                    WeCare App
                </Text>
            }
            bottomContent={
                <TouchableOpacity >
                    <Text >Get Barcode Device Scanned!</Text>
                </TouchableOpacity>
            }
            reactivate={true}
            reactivateTimeout={3000}
            showMarker={true}
            checkAndroid6Permissions={true}
            markerStyle={{
                borderColor: 'white',
                width: 170,
                height: 170,
            }}
        />
    )
}

export default QrCodeScannerScreen