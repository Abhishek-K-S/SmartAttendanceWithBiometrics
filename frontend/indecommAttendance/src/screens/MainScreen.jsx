import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderMain from '../components/MainScreen/HeaderMain'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import CharTab from '../MainScreenTabs/CharTab'
import Calendar from '../MainScreenTabs/Calendar'

const Tab = createMaterialTopTabNavigator();

const MainScreen = () => {
    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <HeaderMain />
            </View>

            <View style={styles.topContainer}>
                <Text style={styles.welcomeText}>Welcome Ashay!</Text>
                <Text style={styles.presenceText}>Your presence has been successfully recorded</Text>
                <View style={{ justifyContent: "center", alignItems: 'center', marginTop: "5%", height: '22%' }}>

                    <TouchableOpacity style={styles.logOutBtn}><Text style={styles.logOutBtnText}>Log out</Text></TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Tab.Navigator screenOptions={{ tabBarStyle: { backgroundColor: "#1C2351" }, tabBarLabelStyle: { color: "white" }, tabBarIndicatorStyle: { backgroundColor: "#25A7DB", height: '12%', borderRadius: 9 }, }}>
                    <Tab.Screen name='Chart' component={CharTab} />
                    <Tab.Screen name='Calendar' component={Calendar} />
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
    }
})