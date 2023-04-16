import { Box, HStack, Icon, Image, Pressable, Text, VStack } from "native-base";
import React from "react";
import { PRIMARY_COLOR, PRIMARY_COLOR_DISABLE, PRIMARY_RED_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import { useSelector } from "react-redux";
import { ReducerRootState } from "../redux/Reducer";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageSourcePropType } from "react-native";

interface Props {
    nama: string,
    value: string,
    onEditPress?: () => void
    onRemovePress?: () => void
}
const PatientAdditionalData = ({ nama, value, onEditPress, onRemovePress }: Props) => {

    const state = useSelector((state: ReducerRootState) => state.auth)
    return (
        <Box
            bg={WHITE_COLOR}
            px={25}
            py={17}
            h={106}
            w={290}
            borderRadius={10}
            style={{
                elevation: 10,
                shadowColor: '#8a8a8a',
            }}
        >
            <HStack justifyContent={"space-between"} >
                <VStack>
                    <Text fontSize={20} color={PRIMARY_COLOR} fontWeight={'extrabold'} >{nama}</Text>
                    <Text fontSize={14} color='#C6C6C6' mt={3}  >{value}</Text>
                </VStack>
                {
                    state.role == 'nurse' ? (
                        <Box flexDir={"row"} >
                            <Pressable justifyContent={'center'} alignItems={'center'} mr={2} onPress={onEditPress} h={26} w={26} bg={PRIMARY_COLOR_DISABLE} borderRadius={5} >
                                <Image alt="iamge" source={require('./../assets/icons/edit.png')} w={4} h={4} />
                            </Pressable>
                            <Pressable justifyContent={'center'} alignItems={'center'} onPress={onRemovePress} h={26} w={26} bg={RED_COLOR} borderRadius={5} >
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name='delete-outline'
                                    size={5}
                                    color={PRIMARY_RED_COLOR}
                                />
                            </Pressable>
                        </Box>
                    ) : <></>
                }
            </HStack>
        </Box>
    )
}

export default PatientAdditionalData