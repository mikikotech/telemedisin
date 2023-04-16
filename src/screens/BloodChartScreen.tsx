import { Box, Center, ScrollView, Text } from "native-base";
import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { PRIMARY_COLOR_DISABLE, WHITE_COLOR } from "../utils/constant";

const BloodChartScreen = () => {
    return (
        <Box
            bg={WHITE_COLOR}
            w='100%'
            h='100%'
            px={5}
        >
            <Text ml={4} mb={5} mt={5} fontSize={20} >Grafik Blood</Text>
            <Center>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
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
                            legend: ['Systolic']
                        }}
                        width={330} // from react-native
                        height={220}
                        fromZero={true}
                        yAxisSuffix=" mmHg"
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
                            legend: ['Diastolic']
                        }}
                        width={330} // from react-native
                        height={220}
                        fromZero={true}
                        yAxisSuffix=" mmHg"
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

                    <Box mt={100} />
                </ScrollView>
            </Center>
        </Box>
    )
}

export default BloodChartScreen