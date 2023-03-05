import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const HeaderMain = () => {
    return (
        <View style={styles.container}>
            <View style={styles.imgcontainer}>
                <Image source={{ uri: "https://cdn.pixabay.com/photo/2018/08/26/23/55/woman-3633737__480.jpg" }} style={{ height: '100%', width: "100%", resizeMode: "cover" }} />
            </View>
            <View style={styles.logoContainer}>
                <Image style={{ height: '100%', width: '100%', resizeMode: 'cover' }} source={require('../../../assets/imdecomVector.png')} />
            </View>
            <View style={styles.iconContainer}>
                <Ionicons name='notifications' size={25} color="#1C2351" />
            </View>
        </View>
    )
}

export default HeaderMain

const styles = StyleSheet.create({
    container: {
        height: "100%",
        padding: "2%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imgcontainer: {
        height: " 65%",
        width: "10%",
        // borderWidth: 2,
        borderRadius: 30,
        overflow: 'hidden'
    },
    logoContainer: {
        height: "90%",
        width: "55%",
        // borderWidth: 2,
        overflow: 'hidden',
    }
})