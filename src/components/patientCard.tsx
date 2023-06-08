import { Avatar, Box, Button, HStack, Icon, Text, VStack } from "native-base";
import React from "react";
import { PRIMARY_COLOR, PRIMARY_RED_COLOR, RED_COLOR, WHITE_COLOR } from "../utils/constant";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from "react-redux";
import { ReducerRootState } from "../redux/Reducer";

interface Props {
    name: string,
    id: string,
    uri: string,
    onPress: () => void
    onRemovePress?: () => void
}
const PatientCard = ({ name, id, uri, onPress, onRemovePress }: Props) => {

    const state = useSelector((state: ReducerRootState) => state.auth)

    return (
        <Box
            w={290}
            style={{
                elevation: 10,
                shadowColor: '#8a8a8a',
            }}
            borderRadius={25}
        >
            <Box
                borderTopRadius={10}
                bg={WHITE_COLOR}
                h={102}
                style={{
                    elevation: 20,
                    shadowColor: '#52006A',
                }}
            >
                <HStack
                    px={13}
                    py={21}
                >
                    <Avatar bg="indigo.500" alignSelf="center" size="lg" source={{
                        uri: uri
                    }}
                        mr={15}
                    >
                        {id}
                    </Avatar>
                    <VStack>
                        <Text fontSize={20} color='#515A50' maxW={130} numberOfLines={1} lineBreakMode="tail" fontWeight={'bold'} >{name}</Text>
                        <Text fontSize={16} color='#6B6B6B' maxW={40} numberOfLines={1} >patient {id}</Text>
                    </VStack>
                    {
                        state.role == 'admin' ?
                            (<Box
                                w={7}
                                h={7}
                                borderRadius={4}
                                bg={RED_COLOR}
                                position={'absolute'}
                                right={5}
                                top={5}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name='delete-outline'
                                    size={5}
                                    color={PRIMARY_RED_COLOR}
                                    onPress={onRemovePress}
                                />
                            </Box>) : null
                    }
                </HStack>
            </Box>
            <Button
                onPress={onPress}
                variant={'solid'}
                bg={PRIMARY_COLOR}
                width={290}
                height={53}
                borderBottomRadius={10}
                _pressed={{
                    backgroundColor: PRIMARY_COLOR,
                    opacity: 0.8
                }}
            >
                <Text color={WHITE_COLOR} fontSize={20} fontWeight={'bold'} letterSpacing={2}>Detail</Text>
            </Button>
        </Box>
    )
}
export default PatientCard