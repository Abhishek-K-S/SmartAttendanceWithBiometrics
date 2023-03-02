import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

const LocationAcessComponent = ({ pull_loc }) => {
    // Device location specific code
    const [location, setLocation] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [isMapReady, setIsMapReady] = useState(false)

    useEffect(() => {
        ; (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied')
                return
            }

            let location = await Location.getCurrentPositionAsync({})
            setLocation(location)
        })()
    }, [])

    useEffect(() => {
        if (userLoc != null) {

            pull_loc(userLoc.coords.latitude, userLoc.coords.longitude)
        }
    }, [location])

    let loc
    if (errorMsg) {
        loc = errorMsg
    } else if (location) {
        loc = JSON.stringify(location)
    }

    let userLoc = null
    if (loc) {
        userLoc = JSON.parse(loc)
    }

    // console.log(userLoc)

    const onMapLayout = () => {
        setIsMapReady(true)
    }

    return (
        <View style={styles.container}>
            <MapView
                // mapType='satellite'
                onLayout={onMapLayout}
                initialRegion={
                    isMapReady
                        ? {
                            latitude: userLoc ? userLoc.coords.latitude : 37.78825,
                            longitude: userLoc ? userLoc.coords.longitude : -122.4324,
                            latitudeDelta: 0.01, //customised for better zoom
                            longitudeDelta: 0.01, //customised for better zoom
                        }
                        : undefined
                }
                region={
                    userLoc
                        ? {
                            latitude: userLoc.coords.latitude,
                            longitude: userLoc.coords.longitude,
                            latitudeDelta: 0.01, //customised for better zoom
                            longitudeDelta: 0.01, //customised for better zoom
                        }
                        : undefined
                }
                style={styles.map}>
                {userLoc && (
                    <Marker
                        coordinate={{
                            latitude: userLoc.coords.latitude,
                            longitude: userLoc.coords.longitude,
                        }}
                        title='Your Location'
                    />
                )}
            </MapView>

            {userLoc && (
                <Text>
                    {userLoc.coords.latitude}, {userLoc.coords.longitude}
                </Text>
            )}
        </View>
    )
}

export default LocationAcessComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#1E254D"
    },
    map: {
        width: '100%',
        height: '90%',
    },
})
