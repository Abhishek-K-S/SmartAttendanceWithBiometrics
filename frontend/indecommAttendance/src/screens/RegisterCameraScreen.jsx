import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera } from 'expo-camera'
import { Video } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons'

const RegisterCameraScreen = ({ navigation }) => {

    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [record, setRecord] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === "granted");

            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus.status === "granted");
        })();
    }, []);

    useEffect(() => {
        if (record) {
            navigation.popToTop();
            navigation.navigate('ViewScreen');
        }
    }, [record, navigation]);

    const takeVideo = async () => {
        if (camera) {
            const data = await camera.recordAsync({
                maxDuration: 2,
            });
            setRecord(data.uri);
            console.log(data.uri);
        }
    };

    const stopVideo = async () => {
        camera.stopRecording();
    };

    if (hasCameraPermission === null || hasAudioPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasAudioPermission === false) {
        return <Text>No access to camera</Text>;
    }


    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'4:3'} />
            </View>
            {/* <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: record,
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            /> */}
            {/* <View style={styles.buttons}>
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                />
            </View> */}

            <View style={styles.btnContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                        );
                    }}
                    // style={{ borderWidth: 2, backgroundColor: "#1E254D" }}
                    style={styles.btn}
                >
                    {/* <Text style={styles.btnText}>Flip Video</Text> */}
                    <Ionicons name='camera-reverse' size={50} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn1} onPress={() => takeVideo()} >
                    {/* <Text style={styles.btnText}>Take Video</Text> */}
                    <Ionicons name='play-circle' size={70} color="white" />
                </TouchableOpacity>

                {/* stop video option */}
                {/* <TouchableOpacity style={styles.btn1} onPress={() => stopVideo()} >
                    <Text style={styles.btnText}>Stop Video</Text>
                </TouchableOpacity> */}
            </View>


        </View>
    );
}

export default RegisterCameraScreen;

const styles = StyleSheet.create({
    cameraContainer: {
        // flex: 1,
        // borderWidth: 2,
        flexDirection: 'row',
        height: "100%"
    },
    fixedRatio: {
        // flex: 1,
        aspectRatio: 1
    },
    video: {
        alignSelf: 'center',
        width: 350,
        height: 220,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnContainer: {
        // borderWidth: 2,
        // borderColor: "red",
        position: "absolute",
        bottom: 20,
        width: "80%",
        height: "20%",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"

    },
    btn1: {
        // backgroundColor: "#1E254D",
        // height: "40%"
        // borderWidth: 2,
        // borderColor: "white",
        width: "60%"
        // flex: 1
    },
    btn: {
        // backgroundColor: "#1E254D",
        // height: "40%"
        // borderWidth: 2,
        // borderColor: "white",
        // flex: 1
    },
    btnText: {
        color: "white"
    }
})