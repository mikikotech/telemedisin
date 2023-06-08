import { Box, Button, Center, HStack, Icon, Modal, Radio, ScrollView, Spinner, Text, TextArea, VStack } from "native-base";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReducerRootState } from "../redux/Reducer";
import firestore from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PatientHomeStackParams } from "../navigations/patientHomeStackNavigator";
import { BLUE_COLOR, FONT_ACTIVE, PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, PRIMARY_RED_COLOR, PURPLE_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import PatientDetails from "../components/patientDetails";
import AndroidToast from "../utils/AndroidToast";
import DataSensor from "../components/dataSensor";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextInput from "../components/textInput";
import LoginButton from "../components/loginButton";
import { BackHandler } from "react-native";
import { PERMISSIONS, request } from "react-native-permissions";
import AuthContext from "../navigations/authContext";
import auth from '@react-native-firebase/auth';

type Nav = NativeStackScreenProps<PatientHomeStackParams>

type dataProps = {
    heartrate: number;
    systolic: number;
    diastolic: number;
    oxygen: number;
    temp: number;
    time: number;
};

const PatientHomeScreen = ({ navigation }: Nav) => {

    const state = useSelector((state: ReducerRootState) => state.auth)

    const { SignOut } = useContext(AuthContext);
    const [showModal, setShowModal] = useState<boolean>(false)

    const [idKesehatan, setIdKesehatan] = useState<string>("")
    const [keluhan, setKeluhan] = useState<string>("")
    const [tanggapan, setTanggapan] = useState<string>("")
    const [statusKesehatan, setStatusKesehatan] = useState<string>("")
    const [laporanKesehatan, setLaporanKesehatan] = useState<Array<any>>([])

    const [patientList, setPatientList] = useState<any>({})
    const [isLoading, setIsloading] = useState<boolean>(true)

    const [sensorData, setSensorData] = useState<Array<dataProps>>([
        { "systolic": 0, "diastolic": 0, "heartrate": 0, "oxygen": 0, "temp": 0, "time": 61738964871 }
    ]);

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                setShowModal(true)
                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    useEffect(() => {
        request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
            console.log(result)
        });

        return () => { }
    }, [])

    useLayoutEffect(() => {
        const users = firestore()
            .collection('Users')
            .doc(state.email)
            .onSnapshot((val) => {
                console.log(val.data());

                if (val.data()?.id == 0) {
                    navigation.navigate('CreatePatient')
                } else {
                    firestore()
                        .collection('patient')
                        .doc(val.data()?.id)
                        .onSnapshot((data) => {
                            console.log('pasien details = ', data.data()?.laporan_kesehatan);
                            setPatientList(data.data())

                            if (data.data()?.laporan_kesehatan.length > 0) {
                                var _laporanKesehatan: Array<any> = data.data()?.laporan_kesehatan

                                console.log(_laporanKesehatan[_laporanKesehatan.length - 1]?.id);

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

                        })
                }
                setTimeout(() => {
                    setIsloading(false)
                }, 3000);
            })

        return () => users()
    }, [])

    const commentHandle = async () => {

        var _laporanKesehatan: Array<any> = laporanKesehatan

        if (keluhan != '' || tanggapan != '') {
            const db = await firestore()
                .collection('patient')
                .doc(patientList?.id)

            if (state.role == 'patient' && tanggapan == '' && statusKesehatan == '' && laporanKesehatan[laporanKesehatan.length - 1]?.id != idKesehatan) {
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
                            screen: 'Home',
                            id: patientList?.id
                        })
                    });
                console.log('1');

            } else if (state.role == 'patient' && statusKesehatan == '' && laporanKesehatan[laporanKesehatan.length - 1]?.id == idKesehatan) {

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
                            screen: 'Home',
                            id: patientList?.id
                        })
                    });
                console.log('2');
            } else if (state.role == 'patient' && tanggapan != '' && statusKesehatan == 'progress') {
                AndroidToast.toast("select done responding")

                console.log('3');
            }
            else if (state.role == 'patient' && statusKesehatan == 'selesai') {

                _laporanKesehatan[_laporanKesehatan.length - 1].status = 'selesai'

                db.update({
                    laporan_kesehatan: _laporanKesehatan
                })
                    .then(() => {
                        navigation.replace('Trantitions', {
                            type: 'comment',
                            screen: 'Home',
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
        isLoading && patientList.id != '' ?
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
                            <Box mb={38} />
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
                                onPressEdit={() => navigation.navigate("EditPatientDetail", { id: patientList?.id, })}
                            />

                            <Box mb={38} />

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

                            <Text fontSize={20} color='#515A50' fontWeight={'bold'} >Patient Complaint</Text>

                            <Box mt={-15} />

                            <TextInput
                                placeholder="complaint"
                                type="text"
                                value={keluhan}
                                h={74}
                                onChangeText={(val) => {
                                    state.role == 'patient' ? setKeluhan(val) : null
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
                                                AndroidToast.toast('no complaints yet!')
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
                                        statusKesehatan != '' ?
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
                        </Box>
                    </Center>
                    <Box mb={55} />

                    {/* modal */}

                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <Modal.Content maxWidth="400px">
                            {/* <Modal.CloseButton /> */}
                            <Modal.Header _text={{ fontSize: 18 }} >Back to Login User ?</Modal.Header>

                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button w={55} bg={PRIMARY_RED_COLOR} _pressed={{ backgroundColor: RED_COLOR }} onPress={() => {
                                        setShowModal(false);
                                    }}>
                                        No
                                    </Button>
                                    <Button w={55} bg={PRIMARY_COLOR} _pressed={{ backgroundColor: PRIMARY_COLOR_DISABLE }} onPress={async () => {
                                        setShowModal(false);
                                        await auth()
                                            .signOut()
                                            .then(() => SignOut());
                                    }}>
                                        Yes
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>

                </ScrollView>
            )
    )
}

export default PatientHomeScreen