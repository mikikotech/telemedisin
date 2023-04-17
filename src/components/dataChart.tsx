import React from "react";
import { LineChart } from "react-native-chart-kit";
import { PRIMARY_COLOR_DISABLE, WHITE_COLOR } from "../utils/constant";

interface Props {
    labels: Array<string>
    datasets: Array<number>
    legend: string
    suffix: string
    key: number;
}

const DataChart = ({ labels, datasets, legend, suffix, key }: Props) => {
    return (
        <LineChart
            key={key}
            data={{
                labels: labels,
                datasets: [
                    {
                        data: datasets
                    }
                ],
                legend: [legend]
            }}
            width={330} // from react-native
            height={220}
            fromZero={true}
            yAxisSuffix={` ${suffix}`}
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
    )
}

export default DataChart