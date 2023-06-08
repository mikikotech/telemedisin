import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, ScrollView, Text } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';
import { BackHandler } from "react-native";
import { useSelector } from "react-redux";
import { ReducerRootState } from "../redux/Reducer";
import { PRIMARY_COLOR_DISABLE, WHITE_COLOR } from "../utils/constant";
import { Col, Row, Grid } from "react-native-easy-grid";

type Nav = NativeStackScreenProps<any>;

const PatientReportScreen = ({ navigation, route }: Nav) => {

    const state = useSelector((state: ReducerRootState) => state.auth)

    const [laporanKesehatan, setLaporanKesehatan] = useState<Array<any>>([])

    useEffect(() => {
        const backHandle = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('PatientDetail')

                return true
            }
        )

        return () => backHandle.remove()
    }, [])

    useLayoutEffect(() => {
        const subscribe = firestore()
            .collection('patient')
            .doc(route?.params?.id)
            .onSnapshot((data) => {
                var _laporanKesehatan: Array<any> = data.data()?.laporan_kesehatan

                if (_laporanKesehatan != undefined) {
                    if (_laporanKesehatan[_laporanKesehatan.length - 1]?.status == 'selesai') {
                        setLaporanKesehatan(data.data()?.laporan_kesehatan)
                    } else {
                        setLaporanKesehatan(data.data()?.laporan_kesehatan)
                    }
                }
            })
    }, [])

    return (
        <ScrollView
            width='100%'
            height='100%'
            px={5}
            py={5}
            bg={WHITE_COLOR}
            showsVerticalScrollIndicator={false}
        >
            <Box mt={10} mb={10} >
                {/* <DataTable style={{ padding: 15, borderWidth: 1, borderRadius: 10 }} >
                    <DataTable.Header style={{ backgroundColor: PRIMARY_COLOR_DISABLE }} >
                        <DataTable.Title style={{ flex: 1 }}>No</DataTable.Title>
                        <DataTable.Title style={{ flex: 3 }}>keluhan</DataTable.Title>
                        <DataTable.Title style={{ flex: 3 }}>Tanggapan</DataTable.Title>
                        <DataTable.Title style={{ flex: 1 }}>status</DataTable.Title>
                    </DataTable.Header>

                    {
                        laporanKesehatan.map((val, i) => {
                            return (
                                <DataTable.Row>
                                    <DataTable.Cell style={{ flex: 1 }} >{i + 1}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 3 }}>{val.keluhan}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 3 }}>{val.tanggapan}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 1 }}>{val.status}</DataTable.Cell>
                                </DataTable.Row>
                            )
                        })
                    }
                </DataTable> */}

                <Grid>
                    <Col size={1} >
                        <Row style={{ borderBottomWidth: 1, borderRightWidth: 1, height: 65, justifyContent: 'center', alignItems: 'center', backgroundColor: PRIMARY_COLOR_DISABLE }}>
                            <Text>No</Text>
                        </Row>

                        {laporanKesehatan.map((val, i) => {
                            return (
                                <Row style={{ borderBottomWidth: 1, borderRightWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>{i + 1}</Text>
                                </Row>
                            )
                        })
                        }
                    </Col>
                    <Col style={{ width: 220 }}>
                        <Row style={{ borderBottomWidth: 1, borderRightWidth: 1, height: 65, justifyContent: 'center', alignItems: 'center', backgroundColor: PRIMARY_COLOR_DISABLE }}>
                            <Text>Complaint</Text>
                        </Row>

                        {laporanKesehatan.map((val, i) => {
                            return (
                                <Box borderBottomWidth={1} borderRightWidth={1} >
                                    <ScrollView horizontal={true} >
                                        <Row style={{ height: 45, alignItems: 'center' }}>
                                            <Text ml={5} mr={5} >{val.keluhan}</Text>
                                        </Row>
                                    </ScrollView>
                                </Box>
                            )
                        })
                        }
                    </Col>
                    <Col style={{ width: 270 }} >
                        <Row style={{ borderBottomWidth: 1, borderRightWidth: 1, height: 65, justifyContent: 'center', alignItems: 'center', backgroundColor: PRIMARY_COLOR_DISABLE }}>
                            <Text>Respone</Text>
                        </Row>

                        {laporanKesehatan.map((val, i) => {
                            return (
                                <Box borderBottomWidth={1}  >
                                    <ScrollView horizontal={true} >
                                        <Row style={{ height: 45, alignItems: 'center' }}>
                                            <Text ml={5} mr={5} >{val.tanggapan}</Text>
                                        </Row>
                                    </ScrollView>
                                </Box>
                            )
                        })
                        }
                    </Col>
                    <Col style={{ width: 100 }}>
                        <Row style={{ borderBottomWidth: 1, height: 65, justifyContent: 'center', alignItems: 'center', backgroundColor: PRIMARY_COLOR_DISABLE }}>
                            <Text>Status</Text>
                        </Row>

                        {laporanKesehatan.map((val, i) => {
                            return (
                                <Row style={{ borderBottomWidth: 1, borderLeftWidth: 1, alignItems: 'center' }}>
                                    <Text ml={5}>{val.status == 'selesai' ? 'Done' : val.status}</Text>
                                </Row>
                            )
                        })
                        }
                    </Col>
                </Grid>

            </Box>
        </ScrollView>
    )
}

export default PatientReportScreen