import { Box, Button, Center, HStack, Icon, Radio, ScrollView, Spinner, Text, TextArea, VStack } from "native-base";
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

    const [idKesehatan, setIdKesehatan] = useState<string>("")
    const [keluhan, setKeluhan] = useState<string>("")
    const [tanggapan, setTanggapan] = useState<string>("")
    const [statusKesehatan, setStatusKesehatan] = useState<string>("")
    const [laporanKesehatan, setLaporanKesehatan] = useState<Array<any>>([])
    const [serviceTambahan, setServiceTambahan] = useState<Array<any>>([])

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

                setPatientList(data.data())

                if (data.data()?.laporan_kesehatan.length > 0) {
                    var _laporanKesehatan: Array<any> = data.data()?.laporan_kesehatan

                    setServiceTambahan(data.data()?.tambahan_service)

                    if (_laporanKesehatan[_laporanKesehatan.length - 1].status == 'selesai') {
                        setLaporanKesehatan(data.data()?.laporan_kesehatan)

                        setKeluhan('')
                        setTanggapan('')
                        setStatusKesehatan('')
                    } else {
                        setLaporanKesehatan(data.data()?.laporan_kesehatan)

                        setIdKesehatan(_laporanKesehatan[_laporanKesehatan.length - 1]?.id ?? '')
                        setKeluhan(_laporanKesehatan[_laporanKesehatan.length - 1]?.keluhan ?? '')
                        setTanggapan(_laporanKesehatan[_laporanKesehatan.length - 1]?.tanggapan ?? '')
                        setStatusKesehatan(_laporanKesehatan[_laporanKesehatan.length - 1]?.status ?? '')
                    }
                }

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

                var _laporanKesehatan: Array<any> = [];

                laporanKesehatan.map((val, i) => {

                    _laporanKesehatan.push({
                        No: i + 1,
                        Complaint: val.keluhan,
                        Respone: val.tanggapan,
                        Status: val.status,
                        Time: new Date(val.id).toLocaleString('en-GB'),
                    });
                })

                var _serviceTambahan: Array<any> = [];

                serviceTambahan.map((val, i) => {

                    _serviceTambahan.push({
                        No: i + 1,
                        Services: val.service,
                        Time: new Date(val.id).toLocaleString('en-GB'),
                    });
                })

                let patinet_data_to_export: Array<object> = [{
                    No: 1,
                    ID: patientList?.id,
                    Name: patientList?.name,
                    Age: patientList?.age,
                    Address: patientList?.address,
                    Job: patientList?.job,
                    Complaint: patientList?.keluhan,
                    Diagnosis: patientList?.diagnosa,
                    "Additional Data": data_tambahan
                }]

                // console.log(patinet_data_to_export);

                var wb = XLSX.utils.book_new();
                var sheet1 = XLSX.utils.json_to_sheet(patinet_data_to_export);
                var sheet2 = XLSX.utils.json_to_sheet(_laporanKesehatan);
                var sheet3 = XLSX.utils.json_to_sheet(_serviceTambahan);
                var sheet4 = XLSX.utils.json_to_sheet(dataArray);
                XLSX.utils.book_append_sheet(wb, sheet1, 'Patient Data', true);
                XLSX.utils.book_append_sheet(wb, sheet2, 'Health Report', true);
                XLSX.utils.book_append_sheet(wb, sheet3, 'Additional Service', true);
                XLSX.utils.book_append_sheet(wb, sheet4, 'Sensor Data', true);

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

        var _laporanKesehatan: Array<any> = laporanKesehatan

        if (keluhan != '' || tanggapan != '') {
            const db = await firestore()
                .collection('patient')
                .doc(patientList?.id)

            if (state.role == 'nurse' && tanggapan == '' && statusKesehatan == '' && laporanKesehatan[laporanKesehatan.length - 1]?.id != idKesehatan) {
                db.update({
                    laporan_kesehatan: firestore.FieldValue.arrayUnion({
                        id: new Date().getTime(),
                        keluhan: keluhan,
                        tanggapan: '',
                        status: ''
                    })
                })
                    .then(() => {
                        navigation.replace('Trantitions', {
                            type: 'comment',
                            screen: 'PatientDetail',
                            id: patientList?.id
                        })
                    });
                console.log('1');

            } else if (state.role == 'nurse' && statusKesehatan == '' && laporanKesehatan[laporanKesehatan.length - 1]?.id == idKesehatan) {

                const updateData = laporanKesehatan.findIndex(obj => obj.id == idKesehatan)

                laporanKesehatan[updateData].keluhan = keluhan

                db.set({
                    laporan_kesehatan: laporanKesehatan
                },
                    { merge: true }
                )
                    .then(() => {
                        navigation.replace('Trantitions', {
                            type: 'comment',
                            screen: 'PatientDetail',
                            id: patientList?.id
                        })
                    });
                console.log('2');
            } else if (state.role == 'nurse' && tanggapan != '' && statusKesehatan == 'progress') {
                AndroidToast.toast("Select done responding")

                console.log('3');
            }
            else if (state.role == 'nurse' && statusKesehatan == 'selesai') {

                _laporanKesehatan[_laporanKesehatan.length - 1].status = 'selesai'

                db.update({
                    laporan_kesehatan: _laporanKesehatan
                })
                    .then(() => {
                        navigation.replace('Trantitions', {
                            type: 'comment',
                            screen: 'PatientDetail',
                            id: patientList?.id
                        })
                    });
            } else if (state.role == 'doctor' && tanggapan != '') {

                _laporanKesehatan[_laporanKesehatan.length - 1].tanggapan = tanggapan
                _laporanKesehatan[_laporanKesehatan.length - 1].status = 'progress'

                db.update({
                    laporan_kesehatan: _laporanKesehatan
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

                                        <Box mb={18} />

                                        <LoginButton
                                            onPress={() => {
                                                navigation.navigate('PatientReport', { id: patientList?.id })
                                            }}
                                            name="Patient Report"
                                            bgcolor={PRIMARY_COLOR}
                                            txtcolor={WHITE_COLOR}
                                            variant="solid"
                                        />

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
                                                onPressEdit={() => {
                                                    navigation.navigate("AdditionalService", { id: patientList?.id, })
                                                }}
                                            />

                                            <Box mb={38} />

                                            {state.role == 'nurse' ?
                                                (
                                                    <>
                                                        <HStack justifyContent={"space-between"} >
                                                            <Text fontSize={20} color='#515A50' fontWeight={'bold'} >Sensor Data</Text>
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

                                            <Text fontSize={20} color='#515A50' fontWeight={'bold'} >Patient Complaint</Text>

                                            <Box mt={-15} />

                                            <TextInput
                                                placeholder="complaint"
                                                type="text"
                                                value={keluhan}
                                                h={74}
                                                onChangeText={(val) => {
                                                    state.role == 'nurse' ? setKeluhan(val) : null
                                                }}
                                            />

                                            <Box mb={19} />

                                            <Text fontSize={20} color='#515A50' fontWeight={'bold'} >Respone</Text>

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
                                                <VStack>
                                                    <TextArea
                                                        autoCompleteType={null}
                                                        p={3}
                                                        width={290}
                                                        height={290}
                                                        placeholder={'respone'}
                                                        value={tanggapan}
                                                        onChangeText={(val) => {

                                                            if (state.role == 'doctor' && keluhan == '') {
                                                                AndroidToast.toast('No complaints yet!')
                                                            } else if (state.role == 'doctor' && keluhan != '') {
                                                                setTanggapan(val)
                                                            }
                                                            // state.role == 'doctor' ? setTanggapan(val) : null
                                                        }}
                                                        fontSize={16}
                                                        color='#C6C6C6'
                                                        borderWidth={0}
                                                    />
                                                    {
                                                        state.role == 'nurse' && statusKesehatan != '' ?
                                                            (
                                                                <>
                                                                    <Radio.Group name="myRadioGroup"
                                                                        value={statusKesehatan}
                                                                        onChange={nextValue => {
                                                                            setStatusKesehatan(nextValue)
                                                                        }}>
                                                                        <HStack >
                                                                            <Box ml={7} />
                                                                            <Radio colorScheme="emerald" value="progress" my={1}>
                                                                                On Progress
                                                                            </Radio>
                                                                            <Box ml={10} />
                                                                            <Radio colorScheme="emerald" value="selesai" my={1}>
                                                                                Done
                                                                            </Radio>
                                                                        </HStack>
                                                                    </Radio.Group>
                                                                    <Box mt={3} />
                                                                </>
                                                            ) : null
                                                    }
                                                </VStack>
                                            </Box>

                                            <Box mb={35} />

                                            <LoginButton
                                                onPress={() => {
                                                    commentHandle()
                                                }}
                                                name="Send"
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