import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons'
import LocationAcessComponent from '../components/LocationAcessComponent';

const ViewFinalVideoScreen = ({ route, navigation }) => {
    const video = React.useRef(null);
    const { uri } = route.params;
    return (
        <SafeAreaView>
            {/* <Text>{uri}</Text> */}
            <View style={styles.videoTitleContainer}>
                <Text style={{ color: "blue", fontSize: 18 }}>Your Video</Text>
            </View>
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: uri,
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                shouldPlay
            // onPlaybackStatusUpdate={status => setStatus(() => status)}
            />

            <View style={styles.locationTitleContainer}>
                <Text style={{ color: "blue", fontSize: 18 }}>Confirm Location</Text>
            </View>
            <View style={styles.locationCompWidth}>
                <LocationAcessComponent />
            </View>
            <View style={styles.videoControlBtns}>
                {/* <Text>Hello</Text> */}
                <TouchableOpacity style={styles.conditionBtn}>
                    <Ionicons name='checkmark-circle' color="green" size={25} />
                    <Text style={{ color: "white" }}>Proceed</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.retakeBtn} >
                    <Ionicons name='refresh-circle' size={25} color="white" />
                    <Text style={{ color: "white" }}>Retake</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.conditionBtn} >
                    <Ionicons name='exit' size={25} color="red" />
                    <Text style={{ color: "white" }}>Exit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ViewFinalVideoScreen

const styles = StyleSheet.create({
    videoTitleContainer: {
        // borderWidth: 2,
        height: "5%",
        justifyContent: "center",
        paddingHorizontal: "3%"
    },
    video: {
        alignSelf: 'center',
        width: "100%",
        height: "50%",
    },

    videoControlBtns: {
        // borderWidth: 2,
        height: "10%",
        width: "100%",
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center",
    },

    conditionBtn: {
        // borderWidth: 2,
        width: "30%",
        height: "50%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        backgroundColor: "#1E254D",
        flexDirection: "row",
    },

    locationTitleContainer: {
        // borderWidth: 2,
        height: "5%",
        justifyContent: "center",
        paddingHorizontal: "3%"
    },

    locationCompWidth: {
        // borderWidth: 2,
        height: "30%"
    }

})