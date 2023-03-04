import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HeaderMain = () => {
    return (
        <View style={{ height: "100%", padding: "2%" }}>
            <View style={styles.imgcontainer}>
                <Image source={{ uri: "https://cdn.pixabay.com/photo/2018/08/26/23/55/woman-3633737__480.jpg" }} style={{ height: '100%', width: "100%", resizeMode: "cover" }} />
            </View>
        </View>
    )
}

export default HeaderMain

const styles = StyleSheet.create({
    imgcontainer: {
        height: " 90%",
        width: "14%",
        // borderWidth: 2,
        borderRadius: 30,
        overflow: 'hidden'
    }
})