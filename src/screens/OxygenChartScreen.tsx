import { Box, Center, Text } from "native-base";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import { PRIMARY_COLOR_DISABLE, WHITE_COLOR } from "../utils/constant";

const OxygenChartScreen = () => {
    return (
        <Box
            bg={WHITE_COLOR}
            w='100%'
            h='100%'
            px={5}
        >
            <Text ml={4} mb={50} mt={10} fontSize={20} >Grafik Oxygen</Text>
            <Center>
                <LineChart
                    data={{
                        labels: ["11:10", "11:20", "11:30", "11:40", "11:50", "12:00"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ],
                        legend: ['Oxygen']
                    }}
                    width={330} // from react-native
                    height={220}
                    fromZero={true}
                    yAxisSuffix=" %"
                    verticalLabelRotation={-25}
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: WHITE_COLOR,
                        backgroundGradientFrom: WHITE_COLOR,
                        backgroundGradientTo: WHITE_COLOR,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        fillShadowGradient: PRIMARY_COLOR_DISABLE,
                        fillShadowGradientTo: PRIMARY_COLOR_DISABLE,
                        fillShadowGradientFrom: PRIMARY_COLOR_DISABLE,
                        fillShadowGradientOpacity: 1,
                        fillShadowGradientToOpacity: 1,
                        fillShadowGradientFromOpacity: 1,
                        color: (opacity = 1) => `rgba(84, 178, 71, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#54B247"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        elevation: 10,
                        shadowColor: '#8a8a8a',
                    }}
                />
            </Center>
        </Box>
    )
}

export default OxygenChartScreen