import { Box, Circle, HStack, Image, Pressable, Text, VStack } from "native-base";
import React from "react";
import { ImageSourcePropType } from "react-native/types";

interface Props {
    name: 'Heart Rate' | 'Oxygen' | 'Blood' | 'Body Temp',
    value: string,
    prefix: 'bpm' | '%' | 'mmHg' | '°C',
    color: any,
    iconSource: ImageSourcePropType,
    onPress: () => void
}

const DataSensor = ({ name, value, prefix, iconSource, color, onPress }: Props) => {
    return (
        <Pressable
            onPress={onPress}
        >
            <Box
                bg={color}
                px={25}
                py={17}
                h={182}
                w={290}
                borderRadius={10}
                style={{
                    elevation: 10,
                    shadowColor: '#8a8a8a',
                }}
            >
                <VStack>
                    <Text fontSize={24} fontWeight={"bold"} >{name}</Text>
                    <HStack alignItems={'center'} justifyContent={'center'} mt={28}>
                        {/* prefix == 'mmHg' ? 40 : 55 */}
                        <Text maxWidth={155} numberOfLines={2} lineHeight={prefix == 'mmHg' ? 45 : null} fontSize={prefix == 'mmHg' ? 40 : value.length >= 3 && prefix == 'bpm' ? 30 : 55} >{value} <Text fontSize={25}>{prefix}</Text></Text>
                        <Image alt='image' ml={prefix == 'mmHg' ? 19 : prefix == '%' ? 65 : prefix == '°C' ? 55 : 35} w={20} h={20} resizeMode="contain" source={iconSource} />
                    </HStack>
                </VStack>
            </Box>
        </Pressable>
    )
}

export default DataSensor