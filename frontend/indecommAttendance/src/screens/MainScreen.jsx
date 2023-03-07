import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderMain from '../components/MainScreen/HeaderMain'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import CharTab from '../MainScreenTabs/CharTab'
import CalendarTab from '../MainScreenTabs/CalendarTab'
import { router_post } from '../../services/server.service'
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();

const MainScreen = ({navigation, route}) => {
    const { uData, finalLocation, record, doLogin } = route.params
    const [name, setName] = useState("<User>")
    const [ showLoader, setShowLoader ] = useState(true);

    useEffect( () =>{
        (async ()=>{
            if(doLogin){
                let formdata = new FormData();
                formdata.append('verify', {
                    uri: record,
                    type: "video/mp4",
                    name: uData.ueid + '.mp4'
                });
                // console.log(uData.ueid)
                formdata.append('employeeID', uData.ueid)
                formdata.append('latitude', finalLocation.latitude)
                formdata.append('longitude', finalLocation.longitude)
                // console.log(formdata)
                router_post('/login', formdata, true).then(res =>{
                    // console.log("response is", res.data)
                    setName(res.data['name'])
                    AsyncStorage.setItem('name', res.data['name']);
                    setShowLoader(false)
                })
                .catch(err => { 
                    // console.error(err.response.data.message)
                    ToastAndroid.show("Couldn't verify the user. Try again", ToastAndroid.LONG)
                    // navigation.popToTop();
                    navigation.replace('Home')
                });
            }
            else{
                await AsyncStorage.getItem('name').then((val)=>{
                    // console.log(val)
                    setName(val)
                    setShowLoader(false)
                })
                .catch(err =>{
                    // navigation.popToTop();
                    navigation.replace('Home')
                })
            }
        })()

        function getAttendance(){
            router_post('/attendance', {}).then(res =>{
                console.log(res.data.attendanceList); 
                setAttendanceList(res.data.attendanceList)
            })
        }
    },[])

    const logout = () =>{
        router_post('/logout', {}).then(res =>{
            ToastAndroid.show('Logout successful', ToastAndroid.LONG)
        }).catch(err =>{
            console.log("err is "+err)
            ToastAndroid.show('Error while loging out, force loging out', ToastAndroid.LONG)
        }).finally(()=>{
            // navigation.popToTop();
            navigation.replace('Home')
        })
    }

    if(showLoader){
        return <View style={styles.loader}>
            <Text style={styles.welcomeText}>Loading...</Text>
        </View>
    }

    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <HeaderMain />
            </View>

            <View style={styles.topContainer}>
                <Text style={styles.welcomeText}>Welcome {name}</Text>
                <Text style={styles.presenceText}>Your presence has been successfully recorded</Text>
                <View style={{ justifyContent: "center", alignItems: 'center', marginTop: "5%", height: '22%' }}>

                    <TouchableOpacity style={styles.logOutBtn} onPress={logout}><Text style={styles.logOutBtnText}>Log out</Text></TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Tab.Navigator screenOptions={{ tabBarStyle: { backgroundColor: "#1C2351" }, tabBarLabelStyle: { color: "white" }, tabBarIndicatorStyle: { backgroundColor: "#25A7DB", height: '12%', borderRadius: 9 }, }}>
                    <Tab.Screen name='Chart' component={CharTab} />
                    <Tab.Screen name='Calendar' component={CalendarTab} />
                </Tab.Navigator>

            </View>
        </SafeAreaView>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    headerContainer: {
        height: "10%"
    },
    topContainer: {
        // borderWidth: 2,
        height: "25%",
        padding: "5%"
    },
    welcomeText: {
        fontSize: 35,
        color: "#DE741E",

    },
    presenceText: {
        marginTop: "2%",
        color: "#1C2351",
        fontSize: 19,
    },
    bottomContainer: {
        // borderWidth: 2,
        // borderColor: "red",
        height: "65%",
        backgroundColor: "#1C2351",
        borderTopStartRadius: 44,
        borderTopEndRadius: 44,
        paddingHorizontal: "3%",
        paddingTop: "4%",

        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: -20,
        // },
        // shadowOpacity: 0.58,
        // shadowRadius: 16.00,

        elevation: 24,
    },
    logOutBtn: {
        width: "50%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: '#1C2351',
    },
    logOutBtnText: {
        color: "white",
        fontSize: 18,
        elevation: 22
    },
    loader: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
    }
})