import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Video } from 'expo-av';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons'
import LocationAcessComponent from '../components/LocationAcessComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from "@gorhom/bottom-sheet";
import { FAB } from 'react-native-elements';
import { router_post } from '../../services/server.service.js'

const ViewFinalVideoScreen = ({ route, navigation }) => {
    const video = React.useRef(null);
    const { uri, euData } = route.params;

    const [bottomSheetIndex, setbottomSheetIndex] = useState(0)
    const [userData, setUserData] = useState({})
    const [finalLocation, setFinalLocation] = useState({})
    const [loading, setLoading] = useState(false)

    const snapPoints = useMemo(() => ["10%", "60%", "100%"], []);


    useEffect(() => {
        setUserData({
            euData,
            uri,
            finalLocation
        })
    }, [euData, uri, finalLocation])

    const handleSheetChange = useCallback(
        (index) => {
            if (index === 0) {
                setbottomSheetIndex(0)
                // console.log("done");
            } else if (index !== 0 && bottomSheetIndex === 0) {
                setbottomSheetIndex(index)
            }
        },
        // [snapPoints]
        [snapPoints, navigation]
    );

    const pull_loc = (lat, long) => {
        // console.log(lat + " ");
        // console.log(long);
        setFinalLocation({
            latitude: lat,
            longitude: long,
        })

    }

    const sendData = () => {
        if (userData == {}) {
            setLoading(true);
            console.log(userData);
        }
        else {
            let formdata = new FormData();
            formdata.append('register', {
                uri: userData.uri,
                type: "video/mp4",
                name: userData.euData.ueid+'.mp4'
            });
            console.log(userData.uri)
            formdata.append('name', userData.euData.uname);
            formdata.append('employeeID', userData.euData.ueid)
            formdata.append('latitude', userData.finalLocation.latitude)
            formdata.append('longitude', userData.finalLocation.longitude)
            // console.log(formdata)
            router_post('/register', formdata, true).then(res =>console.log("response is", res.data)).catch(err =>{console.error(err.response)});
            setLoading(false)
        }
    }

    return (
        <SafeAreaProvider >
            <SafeAreaView style={{ flex: 1, backgroundColor: "#1E254D" }}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    {/* <Text>{uri}</Text> */}

                    <ActivityIndicator size={50} style={{ position: 'absolute', top: '40%', left: "40%", zIndex: 999 }} color='black' animating={loading} />


                    <View style={styles.videoTitleContainer}>
                        <Text style={{ color: "white", fontSize: 18 }}>Your Video</Text>
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

                    <TouchableOpacity style={styles.locationTitleContainer} onPress={() => { setbottomSheetIndex(1) }}  >
                        <View style={styles.confirmBtnContainer}>
                            <Ionicons name='location' size={25} color="red" />
                            <Text style={{ color: "black", fontSize: 18 }}>Confirm Location</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.videoControlBtns}>
                        {/* <Text>Hello</Text> */}
                        <TouchableOpacity style={styles.conditionBtn} onPress={() => { sendData() }}>
                            <Ionicons name='checkmark-circle' color="green" size={25} />
                            <Text style={{ color: "black" }}>Proceed</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.conditionBtn} onPress={() => { navigation.popToTop(); navigation.replace('Home') }} >
                            <Ionicons name='exit' size={25} color="red" />
                            <Text style={{ color: "black" }}>Exit</Text>
                        </TouchableOpacity>
                    </View>



                    <BottomSheet
                        index={bottomSheetIndex}
                        snapPoints={snapPoints}
                        // footerComponent={CustomFooter}
                        style={{ padding: 15 }}
                        onChange={handleSheetChange}
                    // backdropComponent={customBackdrop}
                    >
                        <LocationAcessComponent pull_loc={pull_loc} />
                        <FAB icon={{ name: 'close', color: "white" }} color='#1E254D' size={25} placement='right' style={{ top: '-80%' }} onPress={() => { setbottomSheetIndex(0) }} />
                    </BottomSheet>

                </GestureHandlerRootView>
            </SafeAreaView>
        </SafeAreaProvider >
    )
}

export default ViewFinalVideoScreen

const styles = StyleSheet.create({
    videoTitleContainer: {
        // borderWidth: 2,
        height: "5%",
        justifyContent: "center",
        paddingHorizontal: "3%",
    },
    video: {
        alignSelf: 'center',
        width: "100%",
        height: "70%",
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
        backgroundColor: "white",
        flexDirection: "row",
    },

    locationTitleContainer: {
        // borderWidth: 2,
        marginTop: '3%',
        height: "4%",
        justifyContent: "center",
        paddingHorizontal: "3%",
        alignItems: "center",
        // width: "25%"
    },
    confirmBtnContainer: {
        // borderWidth: 2,
        backgroundColor: "white",
        height: "100%",
        alignItems: "center",
        width: "50%",
        flexDirection: 'row',
        justifyContent: "space-around",
        borderRadius: 15
    },

    locationCompWidth: {
        // borderWidth: 2,
        height: "30%"
    },

    myContainer: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },



})