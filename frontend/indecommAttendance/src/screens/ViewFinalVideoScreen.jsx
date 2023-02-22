import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { Video } from 'expo-av';

const ViewFinalVideoScreen = ({ route, navigation }) => {
    const video = React.useRef(null);
    const { uri } = route.params;
    return (
        <View>
            {/* <Text>{uri}</Text> */}
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: uri,
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
            // onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
        </View>
    )
}

export default ViewFinalVideoScreen

const styles = StyleSheet.create({
    video: {
        alignSelf: 'center',
        width: "100%",
        height: "100%",
    },
})