import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

// const LocationAcessComponent = () => {

//     //Devce location specific code
//     const [location, setLocation] = useState(null);
//     const [errorMsg, setErrorMsg] = useState(null);

//     useEffect(() => {
//         (async () => {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== "granted") {
//                 setErrorMsg("Permission to access location was denied");
//                 return;
//             }

//             let location = await Location.getCurrentPositionAsync({});
//             setLocation(location);
//         })();
//     }, []);

//     let loc;
//     if (errorMsg) {
//         loc = errorMsg;
//     } else if (location) {
//         loc = JSON.stringify(location);
//     }


//     let userLoc = JSON.parse(loc)
//     console.log(userLoc);


//     return (
//         <View style={styles.container}>
//             <MapView
//                 initialRegion={{
//                     latitude: 37.78825,
//                     longitude: -122.4324,
//                     latitudeDelta: 0.0922,
//                     longitudeDelta: 0.0421,
//                 }} style={styles.map} />

//             <Text>{userLoc.latitude}</Text>
//         </View>
//     )
// }

const LocationAcessComponent = () => {

    // Device location specific code
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let loc;
    if (errorMsg) {
        loc = errorMsg;
    } else if (location) {
        loc = JSON.stringify(location);
    }

    let userLoc = null;
    if (loc) {
        userLoc = JSON.parse(loc);
    }

    console.log(userLoc);

    return (
        <View style={styles.container}>
            <MapView
                initialRegion={{
                    // latitude: 12.8665684,
                    latitude: userLoc ? userLoc.coords.latitude : 37.78825,
                    // longitude: 74.9252824,
                    longitude: userLoc ? userLoc.coords.longitude : -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                region={{
                    latitude: userLoc ? userLoc.coords.latitude : 37.78825,
                    longitude: userLoc ? userLoc.coords.longitude : -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={styles.map} >
                {userLoc && (
                    <Marker
                        coordinate={{
                            latitude: userLoc.coords.latitude,
                            longitude: userLoc.coords.longitude,
                        }}
                        title="Your Location"
                    />
                )}
            </MapView>

            {userLoc && <Text>{userLoc.coords.latitude}, {userLoc.coords.longitude}</Text>}

        </View>
    )
}


export default LocationAcessComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
})