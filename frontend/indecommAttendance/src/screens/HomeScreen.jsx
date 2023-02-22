import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.imgHolder}>
                    <Image source={require('../../assets/Indecomm-Logo.png')} />
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.centerContainer}>
                    <Text style={styles.welcomeText}>Hi Welcome!</Text>

                    <TouchableOpacity style={styles.loginBtn}>
                        <Text style={styles.loginBtnText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate('Register') }} style={styles.loginBtn}>
                        <Text style={styles.loginBtnText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        // borderWidth: 2,
        // borderColor: "yellow",
        height: "100%",
        backgroundColor: "white"
    },

    topContainer: {
        // borderWidth: 2,
        // borderColor: "red",
        height: "50%"
    },
    imgHolder: {
        backgroundColor: "white",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },


    bottomContainer: {
        // borderWidth: 2,
        height: "50%",
        backgroundColor: "#1E254D",
        borderTopRightRadius: 90,
        justifyContent: "center",
        alignItems: "center"
    },
    centerContainer: {
        // borderWidth: 2,
        // borderColor: "white",
        height: "55%",
        width: "70%",
        alignItems: "center",
        justifyContent: "space-around"
    },
    welcomeText: {
        color: "white",
        fontSize: 28,
        textAlign: "center"
    },
    loginBtn: {
        borderWidth: 2,
        borderColor: "white",
        width: "80%",
        height: "20%",
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: "white"
    },
    loginBtnText: {
        // borderWidth: 2,
        textAlign: "center",
        fontSize: 18,
        // height: "100%",
    },

})