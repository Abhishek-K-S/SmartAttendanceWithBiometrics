import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LineChart } from "react-native-chart-kit";

const CharTab = () => {
    return (
        <View style={{ backgroundColor: "#1C2351", height: "100%" }}>
            <Text style={{ color: "white", marginVertical: "3%", fontSize: 18 }}>
                Attendace Chart
            </Text>

            <LineChart
                data={{
                    labels: ["January", "February", "March", "April", "May", "June"],
                    datasets: [
                        {
                            data: [
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                            ],
                        },
                    ],
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                chartConfig={{
                    backgroundColor: "#F1A422",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />

            <View style={styles.chartBottomContainer}>
                <View style={styles.left}>
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.numText}>7</Text>
                    </View>
                    <View style={styles.bottomTextRight}>
                        <Text style={styles.bottomTextSent}>Total Absence recorded</Text>
                    </View>
                </View>
                <View style={styles.right}>
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.numText}>5</Text>
                    </View>
                    <View style={styles.bottomTextRight}>
                        <Text style={styles.bottomTextSent}>Remaining Leaves</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CharTab;

const styles = StyleSheet.create({
    chartBottomContainer: {
        // borderWidth: 2,
        height: "35%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "1%",
        padding: "2%",
    },
    left: {
        // borderWidth: 2,
        width: "48%",
        borderRadius: 20,
        backgroundColor: "#DB1F74",
        flexDirection: "row",
        padding: "2%",
    },
    bottomTextContainer: {
        // borderWidth: 2,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomTextRight: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    numText: {
        // borderWidth: 2,
        // height: "100%",
        fontSize: 80,
        textAlign: "center",
        color: "white",
    },
    bottomTextSent: {
        // borderWidth: 2,
        width: "100%",
        color: "white",
        lineHeight: 22,
    },
    right: {
        // borderWidth: 2,
        width: "48%",
        borderRadius: 20,
        backgroundColor: "#27A9DA",
        flexDirection: "row",
        padding: "2%",
    },
});
