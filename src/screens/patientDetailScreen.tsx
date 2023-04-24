import { Box, Center, HStack, Icon, ScrollView, Spinner, Text, TextArea } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BackHandler } from "react-native";
import { BLUE_COLOR, FONT_ACTIVE, PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, PURPLE_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import PatientDetails from "../components/patientDetails";
import DataSensor from "../components/dataSensor";
import TextInput from "../components/textInput";
import LoginButton from "../components/loginButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { ReducerRootState } from "../redux/Reducer";
import firestore from '@react-native-firebase/firestore';
import AndroidToast from "../utils/AndroidToast";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { firebase } from '@react-native-firebase/database';
import Share from 'react-native-share';
var XLSX = require("xlsx");
var RNFS = require('react-native-fs');

type Nav = NativeStackScreenProps<any>;

type dataProps = {
    heartrate: number;
    systolic: number;
    diastolic: number;
    oxygen: number;
    temp: number;
    time: number;
};

const PatientDetailScreen = ({ navigation, route }: Nav) => {

    const state = useSelector((state: ReducerRootState) => state.auth)

    const [keluhan, setKeluhan] = useState<string>("")
    const [tanggapan, setTanggapan] = useState<string>("")

    const [patientList, setPatientList] = useState<any>({})
    const [isLoading, setIsloading] = useState<boolean>(true)

    const [sensorData, setSensorData] = useState<Array<dataProps>>([
        { "systolic": 0, "diastolic": 0, "heartrate": 0, "oxygen": 0, "temp": 0, "time": 61738964871 }
    ]);

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (state.role == 'admin') {
                    navigation.navigate('PatientList')
                } else {
                    navigation.navigate('Home')
                }
                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    useEffect(() => {

        if (patientList?.sensor_id != '') {
            firebase
                .app()
                .database('https://telemedisin-7d0e9-default-rtdb.firebaseio.com/')
                .ref(`/${patientList?.sensor_id}/Sensor`)
                .limitToLast(1)
                .on('value', (value) => {
                    // console.log(value.val());

                    if (value.exists()) {
                        const data = value.val();
                        var dataArray: Array<dataProps> = [];
                        for (let id in data) {
                            dataArray.push(data[id]);
                        }

                        setSensorData(dataArray)
                    }

                })
        }
    }, [patientList])

    useLayoutEffect(() => {
        const subscribe = firestore()
            .collection('patient')
            .doc(route?.params?.id)
            .onSnapshot((data) => {
                // console.log('pasien details = ', data.data());
                setPatientList(data.data())
                setKeluhan(data.data()?.laporan_kesehatan?.keluhan)
                setTanggapan(data.data()?.laporan_kesehatan?.tanggapan)

                setIsloading(false)
            })

        return () => subscribe()
    }, [])

    const downloadPatientData = async () => {

        firebase
            .app()
            .database('https://telemedisin-7d0e9-default-rtdb.firebaseio.com/')
            .ref(`/${patientList?.sensor_id}/Sensor`)
            .once('value')
            .then(res => {
                const data = res.val();
                var dataArray: Array<any> = [];
                var dataNumber: number = 0

                for (let id in data) {
                    var epoch = data[id].time * 1000;
                    dataNumber += 1

                    dataArray.push({
                        No: dataNumber,
                        HeartRate: `${data[id].heartrate} bpm`,
                        Oxygen: `${data[id].oxygen} %`,
                        Blood: `${data[id].diastolic}/${data[id].systolic} mmHg`,
                        Temperature: `${data[id].temp} °C`,
                        Time: new Date(epoch).toLocaleString('en-GB'),
                    });
                }

                var data_tambahan: string = '';

                if (patientList?.data_tambahan.length > 0) {
                    patientList?.data_tambahan.map((data: any, i: any) => {
                        data_tambahan = data_tambahan + data.data + ' = ' + data.value + '\n'
                    })
                }

                // console.log('user data tambahan = ', data_tambahan);

                let patinet_data_to_export: Array<object> = [{
                    No: 1,
                    ID: patientList?.id,
                    Nama: patientList?.name,
                    Umur: patientList?.age,
                    Alamat: patientList?.address,
                    Pekerjaan: patientList?.job,
                    Keluhan: patientList?.keluhan,
                    Diagnosa: patientList?.diagnosa,
                    "Laporan Keluhan": patientList?.laporan_kesehatan?.keluhan,
                    "Laporan Tanggapan": patientList?.laporan_kesehatan?.tanggapan,
                    "Data Tambahan": data_tambahan
                }]

                // console.log(patinet_data_to_export);


                var wb = XLSX.utils.book_new();
                var sheet1 = XLSX.utils.json_to_sheet(patinet_data_to_export);
                var sheet2 = XLSX.utils.json_to_sheet(dataArray);
                XLSX.utils.book_append_sheet(wb, sheet1, 'Data Pasien', true);
                XLSX.utils.book_append_sheet(wb, sheet2, 'Data Sensor', true);

                const wbout = XLSX.write(wb, {
                    type: 'binary',
                    bookType: 'xlsx',
                });

                RNFS.writeFile(
                    `${RNFS.DownloadDirectoryPath}/${patientList.name}_${patientList.id}.xlsx`,
                    wbout,
                    'ascii',
                )
                    .then((r: any) => {
                        console.log('Success', r);
                        AndroidToast.toast('Done Downloading');
                        Share.open({
                            message: 'Data Pasien',
                            url: `file://${RNFS.DownloadDirectoryPath}/${patientList.name}_${patientList.id}.xlsx`
                        })
                            .then((res: any) => {

                            })
                            .catch((e: any) => { })
                    })
                    .catch((e: any) => {
                        console.log('Error', e);
                        AndroidToast.toast('Failed Downloading');
                    });
            })

    }

    const commentHandle = async () => {

        if (keluhan != '' || tanggapan != '') {
            const db = await firestore()
                .collection('patient')
                .doc(patientList?.id)

            if (state.role == 'nurse') {
                db.update({
                    "laporan_kesehatan.keluhan": `${keluhan}`,
                })
                    .then(() => {
                        navigation.replace('Trantitions', {
                            type: 'comment',
                            screen: 'PatientDetail',
                            id: patientList?.id
                        })
                    });
            } else {
                db.update({
                    "laporan_kesehatan.tanggapan": `${tanggapan}`,
                })
                    .then(() => {
                        navigation.replace('Trantitions', {
                            type: 'comment',
                            screen: 'PatientDetail',
                            id: patientList?.id
                        })
                    });
            }
        } else {
            AndroidToast.toast("Text field can't be empty!")
        }

        console.log('pressed');

    }

    return (
        isLoading ?
            (
                <Box w='100%' h='100%' bg={WHITE_COLOR} alignItems={'center'} justifyContent={'center'}>
                    <Spinner size='lg' color={PRIMARY_COLOR} />
                </Box>
            ) :
            (
                <ScrollView
                    width='100%'
                    height='100%'
                    px={5}
                    py={5}
                    bg={WHITE_COLOR}
                    showsVerticalScrollIndicator={false}
                >
                    <Center>
                        <Box>
                            <Box mt={47} />

                            {
                                state.role == 'admin' ?
                                    (<>
                                        <PatientDetails
                                            onPressEdit={() => navigation.navigate("EditPatientDetail", { id: patientList?.id, })}
                                            nama={patientList?.name}
                                            umur={patientList?.age}
                                            alamat={patientList?.address}
                                            pekerjaan={patientList?.job}
                                            keluhan={patientList?.keluhan}
                                            diagnosa={patientList?.diagnosa}
                                            panggilan={patientList?.name}
                                            id={patientList?.id}
                                            uri={patientList?.uri}
                                            onPress={() => {
                                                downloadPatientData()
                                            }}
                                        />

                                        <Box mb={58} />
                                    </>) :
                                    (
                                        <>
                                            <PatientDetails
                                                onPress={() => navigation.navigate("PatientAddionalDetail", { id: patientList?.id, })}
                                                nama={patientList?.name}
                                                umur={patientList?.age}
                                                alamat={patientList?.address}
                                                pekerjaan={patientList?.job}
                                                keluhan={patientList?.keluhan}
                                                diagnosa={patientList?.diagnosa}
                                                panggilan={patientList?.name}
                                                id={patientList?.id}
                                                uri={patientList?.uri}
                                            />

                                            <Box mb={38} />

                                            {state.role == 'nurse' ?
                                                (
                                                    <>
                                                        <HStack justifyContent={"space-between"} >
                                                            <Text fontSize={20} color='#515A50' fontWeight={'bold'} >Data Sensor</Text>
                                                            <Icon
                                                                as={MaterialCommunityIcons}
                                                                name={patientList?.sensor_id == '' ? 'plus-circle-outline' : 'minus-circle-outline'}
                                                                size={8}
                                                                color={FONT_ACTIVE}
                                                                onPress={() => {

                                                                    if (patientList?.sensor_id == '') {
                                                                        navigation.navigate('QRCode', {
                                                                            id: patientList?.id
                                                                        })
                                                                    } else {
                                                                        //hapus data
                                                                        firestore()
                                                                            .collection('patient')
                                                                            .doc(patientList?.id)
                                                                            .update({
                                                                                sensor_id: ''
                                                                            })
                                                                            .then(() => { })
                                                                            .catch((e) => { })
                                                                    }
                                                                }}
                                                            />
                                                        </HStack>
                                                        <Box mb={27} />
                                                        {
                                                            patientList?.sensor_id != '' ?
                                                                (
                                                                    <Box>
                                                                        <DataSensor
                                                                            name="Heart Rate"
                                                                            value={sensorData[0].heartrate.toString()}
                                                                            prefix="bpm"
                                                                            color={RED_COLOR}
                                                                            iconSource={require('./../assets/icons/heart-rate.png')}
                                                                            onPress={() => {
                                                                                navigation.navigate('Chart', {
                                                                                    initialRouteName: 'HeartRate',
                                                                                    id: patientList?.sensor_id
                                                                                })
                                                                            }}
                                                                        />

                                                                        <Box mb={19} />

                                                                        <DataSensor
                                                                            name="Oxygen"
                                                                            value={sensorData[0].oxygen.toString()}
                                                                            prefix="%"
                                                                            color={BLUE_COLOR}
                                                                            iconSource={require('./../assets/icons/oxygen.png')}
                                                                            onPress={() => {
                                                                                navigation.navigate('Chart', {
                                                                                    initialRouteName: 'Oxygen',
                                                                                    id: patientList?.sensor_id
                                                                                })
                                                                            }}
                                                                        />

                                                                        <Box mb={19} />

                                                                        <DataSensor
                                                                            name="Blood"
                                                                            value={`${sensorData[0].systolic.toString()}/${sensorData[0].diastolic.toString()}`}
                                                                            prefix="mmHg"
                                                                            color={PURPLE_COLOR}
                                                                            iconSource={require('./../assets/icons/blood.png')}
                                                                            onPress={() => {
                                                                                navigation.navigate('Chart', {
                                                                                    initialRouteName: 'Blood',
                                                                                    id: patientList?.sensor_id
                                                                                })
                                                                            }}
                                                                        />

                                                                        <Box mb={19} />

                                                                        <DataSensor
                                                                            name="Body Temp"
                                                                            value={sensorData[0].temp.toString()}
                                                                            prefix="°C"
                                                                            color={PRIMARY_COLOR_DISABLE}
                                                                            iconSource={require('./../assets/icons/temp.png')}
                                                                            onPress={() => {
                                                                                navigation.navigate('Chart', {
                                                                                    initialRouteName: 'Temp',
                                                                                    id: patientList?.sensor_id
                                                                                })
                                                                            }}
                                                                        />

                                                                        <Box mb={46} />
                                                                    </Box>
                                                                ) : null
                                                        }
                                                    </>
                                                ) : patientList?.sensor_id == '' && state.role == 'doctor' ?
                                                    (
                                                        <>
                                                        </>
                                                    ) :
                                                    (<Box>
                                                        <DataSensor
                                                            name="Heart Rate"
                                                            value={sensorData[0].heartrate.toString()}
                                                            prefix="bpm"
                                                            color={RED_COLOR}
                                                            iconSource={require('./../assets/icons/heart-rate.png')}
                                                            onPress={() => {
                                                                navigation.navigate('Chart', {
                                                                    initialRouteName: 'HeartRate',
                                                                    id: patientList?.sensor_id
                                                                })
                                                            }}
                                                        />

                                                        <Box mb={19} />

                                                        <DataSensor
                                                            name="Oxygen"
                                                            value={sensorData[0].oxygen.toString()}
                                                            prefix="%"
                                                            color={BLUE_COLOR}
                                                            iconSource={require('./../assets/icons/oxygen.png')}
                                                            onPress={() => {
                                                                navigation.navigate('Chart', {
                                                                    initialRouteName: 'Oxygen',
                                                                    id: patientList?.sensor_id
                                                                })
                                                            }}
                                                        />

                                                        <Box mb={19} />

                                                        <DataSensor
                                                            name="Blood"
                                                            value={`${sensorData[0].systolic.toString()}/${sensorData[0].diastolic.toString()}`}
                                                            prefix="mmHg"
                                                            color={PURPLE_COLOR}
                                                            iconSource={require('./../assets/icons/blood.png')}
                                                            onPress={() => {
                                                                navigation.navigate('Chart', {
                                                                    initialRouteName: 'Blood',
                                                                    id: patientList?.sensor_id
                                                                })
                                                            }}
                                                        />

                                                        <Box mb={19} />

                                                        <DataSensor
                                                            name="Body Temp"
                                                            value={sensorData[0].temp.toString()}
                                                            prefix="°C"
                                                            color={PRIMARY_COLOR_DISABLE}
                                                            iconSource={require('./../assets/icons/temp.png')}
                                                            onPress={() => {
                                                                navigation.navigate('Chart', {
                                                                    initialRouteName: 'Temp',
                                                                    id: patientList?.sensor_id
                                                                })
                                                            }}
                                                        />

                                                        <Box mb={46} />
                                                    </Box>)
                                            }


                                            {/* text input */}

                                            <Text fontSize={20} color='#515A50' fontWeight={'bold'} >Keluhan Pasien</Text>

                                            <Box mt={-15} />

                                            <TextInput
                                                placeholder="keluhan"
                                                type="text"
                                                value={keluhan}
                                                h={74}
                                                onChangeText={(val) => {
                                                    state.role == 'nurse' ? setKeluhan(val) : null
                                                }}
                                            />

                                            <Box mb={19} />

                                            <Text fontSize={20} color='#515A50' fontWeight={'bold'} >Tanggapan</Text>

                                            <Box mt={11} />

                                            <Box
                                                width={290}
                                                // height={206}
                                                bg={WHITE_COLOR}
                                                borderRadius={10}
                                                style={{
                                                    elevation: 5,
                                                    shadowColor: '#52006A',
                                                }}
                                            >
                                                <TextArea
                                                    autoCompleteType={null}
                                                    p={3}
                                                    width={290}
                                                    height={290}
                                                    placeholder={'tanggapan'}
                                                    value={tanggapan}
                                                    onChangeText={(val) => {
                                                        state.role == 'doctor' ? setTanggapan(val) : null
                                                    }}
                                                    fontSize={16}
                                                    color='#C6C6C6'
                                                    borderWidth={0}
                                                />
                                            </Box>

                                            <Box mb={35} />

                                            <LoginButton
                                                onPress={() => {
                                                    commentHandle()
                                                }}
                                                name="Kirim"
                                                bgcolor={PRIMARY_COLOR}
                                                txtcolor={WHITE_COLOR}
                                                variant="solid"
                                            />
                                        </>
                                    )
                            }

                        </Box>

                    </Center>

                    <Box mb={50} />
                </ScrollView>
            )
    )
}

export default PatientDetailScreen