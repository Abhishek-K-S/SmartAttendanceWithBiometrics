import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera } from 'expo-camera'
import { Video } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { FAB } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationAcessComponent from '../components/LocationAcessComponent';
import { router_post } from '../../services/server.service';
import * as Location from 'expo-location'

const LoginScreen = ({ navigation }) => {

    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null)
    const [camera, setCamera] = useState(null);
    const [record, setRecord] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.front);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [isModalVisible, setModalVisible] = useState(true);
    // const [name, setName] = useState("");
    const [eid, seteid] = useState("")
    const [uData, setUData] = useState({})
    const [finalLocation, setFinalLocation] = useState({})
    const inputRef = useRef(null)

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === "granted");

            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus.status === "granted");

            const { status } = await Location.requestForegroundPermissionsAsync()
            setHasLocationPermission(status === "granted")

            await AsyncStorage.getItem('employeeID').then( val =>{
                if(val){
                    seteid(val)
                }
            }).catch()

            let location = await Location.getLastKnownPositionAsync({})
            console.log(location)
            if(location && !location.mocked){
                setFinalLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                })
            }
            else{
                ToastAndroid.show('Location is unavailable. Unable location to proceed. Stop any of third party location providers', ToastAndroid.LONG)
                setTimeout(()=>{
                    navigation.popToTop();
                    navigation.replace('Home')
                }, 2000)
            }
        })();

    }, []);

    useEffect(()=>{
        if(hasAudioPermission===false || hasCameraPermission===false || hasLocationPermission===false){
            ToastAndroid.show('Location, camera and microphone permissions are required', ToastAndroid.LONG)
            navigation.popToTop();
            navigation.replace('Home')
        }
    },[hasAudioPermission, hasCameraPermission, hasLocationPermission])


    //Possible changes for async storage must be added to save user state.
    useEffect(() => {
        if (record && uData && finalLocation.latitude) {
            // navigation.popToTop();
            navigation.popToTop();
            navigation.replace('MainScreen',{
                uData,
                finalLocation,
                record, 
                doLogin: true
            })
            //change it to .replace if no back flow option needed **
            
        }
    }, [record, uData, finalLocation]);

    const takeVideo = async () => {
        if (camera) {
            let data = await camera.recordAsync({
                maxDuration: 2,
            });
            setRecord(data.uri);
            // console.log(data.uri);
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
    if(!hasLocationPermission){
        return <Text>Cannot access location</Text>
    }

    const toggleModal = () => {
        if (eid && eid.length !== 0) {
            // console.log(name);
            // console.log(eid);
            let data = {
                ueid: eid,
            }
            setUData(data)
            setModalVisible(!isModalVisible);
            // console.log(uData)
        } else {
            alert('employee id')
            inputRef.current.focus();
        }
    };

    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'4:3'}
                     />
            </View>
            <Modal style={{ height: "50%", width: "90%", }} isVisible={isModalVisible}>
                <KeyboardAvoidingView style={styles.modalContainer}>
                    <FAB color='white' icon={{ name: 'close', color: '#1E254D' }} placement="right" style={{ top: -350, zIndex: 99 }} onPress={() => { navigation.replace('Home') }} />
                    <View style={styles.mainHolder}>
                        <TextInput placeholder='Enter your employee id' placeholderTextColor="white" style={styles.formInput} ref={inputRef} onChangeText={(value) => { seteid(value) }} value={eid} onSubmitEditing={() => { toggleModal() }} />
                        <TouchableOpacity style={{ backgroundColor: "white", width: "100%", height: "20%", justifyContent: "center", borderRadius: 15 }} onPress={() => toggleModal()} >
                            <Text style={{ textAlign: "center", color: "#1E254D" }}>Continue</Text>
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

                    style={styles.btn}
                >
                    <Ionicons name='camera-reverse' size={50} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn1} onPress={() => takeVideo()} >

                    <Ionicons name='play-circle' size={70} color="white" />
                </TouchableOpacity>

                {/* stop video option */}
                {/* <TouchableOpacity style={styles.btn1} onPress={() => stopVideo()} >
                    <Text style={styles.btnText}>Stop Video</Text>
                </TouchableOpacity> */}
            </View>

        </View>
    )
}

export default LoginScreen;

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