import { Avatar, Box, Button, HStack, Image, Pressable, Text, VStack } from "native-base";
import React from "react";
import { PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, WHITE_COLOR } from "../utils/constant";
import { useSelector } from "react-redux";
import { ReducerRootState } from "../redux/Reducer";

interface Props {
    nama: string,
    umur: string,
    alamat: string,
    pekerjaan: string,
    keluhan: string,
    diagnosa: string,
    panggilan: string,
    id: string,
    uri?: string,
    onPress?: () => void
    onPressEdit?: () => void
}

const PatientDetails = ({ nama, umur, alamat, pekerjaan, keluhan, diagnosa, panggilan, id, uri, onPress, onPressEdit }: Props) => {

    const state = useSelector((state: ReducerRootState) => state.auth)

    return (
        <Box
            bg={WHITE_COLOR}
            px={25}
            py={17}
            mt={15}
            w={290}
            style={{
                elevation: 10,
                shadowColor: '#8a8a8a',
            }}
            borderRadius={10}
        >
            <VStack>
                <HStack alignItems={'center'} justifyContent={'space-between'} >
                    <HStack>
                        <Avatar bg="indigo.500" alignSelf="center" size="lg" source={{
                            uri: uri
                        }}
                            mr={5} >{id}</Avatar>
                        <VStack>
                            <Text fontSize={20} maxW={130} numberOfLines={1} lineBreakMode="tail" color='#515A50' fontWeight={'bold'} >{panggilan}</Text>
                            <Text fontSize={15} maxW={100} numberOfLines={1} lineBreakMode="tail" color='#6B6B6B'>patient {id}</Text>
                        </VStack>
                    </HStack>
                    {
                        state.role == 'admin' ?
                            (<Pressable
                                onPress={onPressEdit}
                                h={37}
                                w={37}
                                borderRadius={5}
                                bg={PRIMARY_COLOR_DISABLE}
                                justifyContent={'center'} alignItems={'center'}
                            >
                                <Image alt="iamge" source={require('./../assets/icons/edit.png')} w={5} h={5} />
                            </Pressable>) : <></>
                    }
                </HStack>

                {/* nama lengkap */}
                <>
                    <Text
                        mt={9}
                        color='#C6C6C6'
                        fontSize={17}
                        numberOfLines={2}
                        lineBreakMode="tail"
                    >
                        Nama Lengkap : {' '}
                        <Text
                            color='#515A50'
                            fontSize={17}
                        >
                            {nama}
                        </Text>
                    </Text>
                </>

                {/* umur */}
                <>
                    <Text
                        mt={2}
                        color='#C6C6C6'
                        fontSize={17}
                        numberOfLines={1}
                        lineBreakMode="tail"
                    >
                        Umur : {' '}
                        <Text
                            color='#515A50'
                            fontSize={17}
                        >
                            {umur} Tahun
                        </Text>
                    </Text>
                </>

                {/* alamat */}
                <>
                    <Text
                        mt={2}
                        color='#C6C6C6'
                        fontSize={17}
                        numberOfLines={2}
                        lineBreakMode="tail"
                    >
                        Alamat : {' '}
                        <Text
                            color='#515A50'
                            fontSize={17}
                        >
                            {alamat}
                        </Text>
                    </Text>
                </>

                {/* pekerjaan */}
                <>
                    <Text
                        mt={2}
                        color='#C6C6C6'
                        fontSize={17}
                        numberOfLines={1}
                        lineBreakMode="tail"
                    >
                        Pekerjaan : {' '}
                        <Text
                            color='#515A50'
                            fontSize={17}
                        >
                            {pekerjaan}
                        </Text>
                    </Text>
                </>

                {/* keluhan */}
                <>
                    <Text
                        mt={2}
                        color='#C6C6C6'
                        fontSize={17}
                        numberOfLines={1}
                        lineBreakMode="tail"
                    >
                        Keluhan : {' '}
                        <Text
                            color='#515A50'
                            fontSize={17}
                        >
                            {keluhan}
                        </Text>
                    </Text>
                </>

                {/* diagnosa */}
                <>
                    <Text
                        mt={2}
                        color='#C6C6C6'
                        fontSize={17}
                        numberOfLines={1}
                        lineBreakMode="tail"
                    >
                        Diagnosa : {' '}
                        <Text
                            color='#515A50'
                            fontSize={17}
                        >
                            {diagnosa}
                        </Text>
                    </Text>
                </>

                <Button variant={"unstyled"} mt={5} onPress={onPress} >
                    <Text fontSize={20} color={PRIMARY_COLOR} fontWeight={'bold'} >{state.role == 'admin' ? 'Download Data Pasien' : 'Data Tambahan Pasien'}</Text>
                </Button>

            </VStack>
        </Box>
    )
}

export default PatientDetails