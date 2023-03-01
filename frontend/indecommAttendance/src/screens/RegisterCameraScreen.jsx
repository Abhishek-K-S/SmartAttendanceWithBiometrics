import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera } from 'expo-camera'
import { Video } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { FAB } from 'react-native-elements';

const RegisterCameraScreen = ({ navigation }) => {

    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [record, setRecord] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [isModalVisible, setModalVisible] = useState(true);
    const [name, setName] = useState("");
    const [eid, seteid] = useState("")
    const [uData, setUData] = useState({})

    const nameRef = useRef(null)
    const inputRef = useRef(null)

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
            navigation.navigate('ViewScreen', {
                uri: record,
            });
        }
    }, [record, navigation]);

    useEffect(() => {
        console.log(uData);
    }, [uData])

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

    const toggleModal = () => {
        if (name !== "" && eid !== "") {
            console.log(name);
            console.log(eid);
            let data = {
                uname: name,
                ueid: eid,
            }
            setUData(data)
            setModalVisible(!isModalVisible);
            console.log(uData)
        } else {
            alert('Please enter your username and employee id')
            if (name == "") {
                nameRef.current.focus();
            } else if (eid == "") {
                inputRef.current.focus();
            } else {
                nameRef.current.focus();
            }
        }
    };


    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'4:3'} />
            </View>

            <Modal style={{ height: "50%", width: "90%", }} isVisible={isModalVisible}>
                <KeyboardAvoidingView style={styles.modalContainer}>
                    <FAB color='white' icon={{ name: 'close', color: '#1E254D' }} placement="right" style={{ top: -350, zIndex: 99 }} onPress={() => { navigation.replace('Home') }} />
                    <View style={styles.mainHolder}>
                        {/* <Text style={{ backgroundColor: "white" }}>Hello!</Text> */}
                        <TextInput autoFocus placeholder='Enter your name' placeholderTextColor="white" style={styles.formInput} onChangeText={(value) => { setName(value) }} ref={nameRef} onSubmitEditing={() => { inputRef.current.focus() }} />
                        <TextInput placeholder='Enter your employee id' placeholderTextColor="white" style={styles.formInput} ref={inputRef} onChangeText={(value) => { seteid(value) }} onSubmitEditing={() => { toggleModal() }} />
                        <TouchableOpacity style={{ backgroundColor: "white", width: "100%", height: "20%", justifyContent: "center", borderRadius: 15 }} onPress={() => toggleModal()} >
                            <Text style={{ textAlign: "center", color: "#1E254D" }}>Hello</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </Modal>

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
        flexDirection: 'row',
        height: "100%"
    },
    fixedRatio: {
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
        position: "absolute",
        bottom: 20,
        width: "80%",
        height: "20%",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"

    },
    btn1: {
        width: "60%"
    },
    btnText: {
        color: "white"
    },

    modalContainer: {
        // flex: 1,
        height: "90%",
        // borderWidth: 2,
        // borderColor: "white",
        top: 0,
        justifyContent: "center",
    },

    mainHolder: {
        borderWidth: 2,
        borderColor: "#1E254D",
        padding: "3%",
        height: "50%",
        justifyContent: "space-around",
        borderRadius: 10,
        backgroundColor: "#1E254D"
    },
    formInput: {
        // borderWidth: 2,
        // borderColor: "yellow",
        height: "15%",
        borderRadius: 15,
        backgroundColor: "gray",
        color: "white",
        paddingHorizontal: 10
    }
})