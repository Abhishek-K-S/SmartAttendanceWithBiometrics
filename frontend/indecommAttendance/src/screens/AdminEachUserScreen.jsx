import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons'
import { Calendar } from "react-native-calendars";

const AdminEachUserScreen = ({ navigation, route }) => {
    const { id } = route.params;
    return (
        <View style={styles.container} >
            <View style={styles.cardContainer}>
                <View style={styles.topContent}>
                    <View style={styles.imgHolder}>

                        {/* --------------------ADD IMAGE URL HERE ----------------------------- */}
                        <Image
                            style={{ height: "100%", width: "100%" }}
                            // source={{ uri: item.photo }}
                            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTCbQ0NU2O-w5dmApL-61PdU8MZ2YCE4CmQ' }}
                        />
                    </View>

                    {/* -----------------------ADD NAME AND EMPID OF THE USER-------------------- */}
                    <View style={styles.topRightContainer}>
                        <View style={styles.topPrimaryDetailsCont}>
                            <Text style={{ fontSize: 20 }}>name</Text>
                            <Text style={{ fontSize: 18, color: "black" }}>empId</Text>
                        </View>

                        {/* ------------------ADD LOCATION AND ATTENDANCE PERCENTAGE HERE -------------------------- */}
                        <View style={styles.bottomContainer}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="location" size={22} color="red" />
                                <Text>lOCATION</Text>
                            </View>
                            <View style={styles.attendanceContainer}>
                                {/* <Text>Attendace percentage: {item.attendanceStatus}</Text> */}
                                <View style={styles.iconContainer}>
                                    <Ionicons name="calendar" size={22} color="green" />
                                    <Text>250%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ backgroundColor: "#E2E1E2", height: "60%" }}>
            <Text style={{ color: '#1E254D', fontSize: 18 }} >Calendar</Text>
            <Calendar
                // Initially visible month. Default = now
                initialDate={"2023-03-01"}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={"2012-05-10"}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={"2050-12-30"}
                markingType={"period"}
                // onDayPress={day => {
                //     showData(day.dateString);
                // }}
                // markedDates={attendanceList}
                style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    height: 350,
                    backgroundColor: '#E2E1E2',
                    borderRadius: 25
                }}
            enableSwipeMonths={true}

            />
            </View>
            <View style={styles.bottomViewcontainer}>
                <View style={styles.leftHolder}>
                    <Text style={{color:'white', fontSize:22}}>Presence status</Text>
                    <Text style={{color:'white', fontSize:40}}>90%</Text>
                </View>
                 <View style={styles.rightHolder}>
                    <Text style={{color:'white', fontSize:22}}>Presence status</Text>
                    <Text style={{color:'white', fontSize:40}}>30%</Text>
                </View>
            </View>
            
        </View>

    );
};

export default AdminEachUserScreen;

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        // // borderWidth: 2,
        // justifyContent: 'space-around',
        // borderRadius: 10,
        // height: 60,
        // alignItems: 'center',
        // backgroundColor: '#E2E1E2',
        // borderColor: '#E2E1E2',
        borderWidth:2,
        height:'100%',
        backgroundColor: '#E2E1E2',
        padding:9

    },
    inputBox: {
        width: '85%',
        justifyContent: 'center',
        paddingHorizontal: 9,
    },

    cardContainer: {
        // borderWidth:2,
        width: '100%',
        // margin:5,
        height: 115,
        padding: 9,
        borderRadius: 30,
        justifyContent: 'space-between',
        backgroundColor: '#E2E1E2',
        // borderColor:'gray',
        // marginVertical: 9,
    },


    topContent: {
        // borderWidth:2,
        flexDirection: 'row',
        height: '100%',
        // justifyContent:'space-between'
        alignItems: 'center'
    },
    imgHolder: {
        height: 80,
        // borderWidth:2,
        width: 80,
        overflow: 'hidden',
        borderRadius: 40,
        borderColor: 'gray',
        marginHorizontal: 10,
    },
    topPrimaryDetailsCont: {
        // borderWidth:2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    topRightContainer: {
        width: '66%',
        // borderWidth:2,
        height: '90%',
        justifyContent: 'center',
        alignContent: 'space-between'
    },

    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    attendanceContainer: {

    },
    bottomViewcontainer:{
        // borderWidth:2,
        height:'20%',
        width:'100%',
        marginTop:'1%',
        flexDirection:'row'
        
    },
    leftHolder:{
        // borderWidth:2,
        height:'100%',
        width:'50%',
        backgroundColor:'orange',
        // backgroundColor:'#27A9DA'
        borderRadius:30,
        // flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        padding:9,
        marginRight:5
        
    },
    rightHolder:{
        // borderWidth:2,
        height:'100%',
        width:'50%',
        backgroundColor:'red',
        // backgroundColor:'#27A9DA'
        borderRadius:30,
        // flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        padding:9,
        // marginLeft:5
        
    }
});
