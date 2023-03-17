import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native';

const data=[
  {
    id:'a',
    photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTCbQ0NU2O-w5dmApL-61PdU8MZ2YCE4CmQ',
    empId:'1',
    name:'Ashay',
    loc:'Mangalore',
    attendanceStatus:'100%',
  },
  {
    id:'b',
    photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTCbQ0NU2O-w5dmApL-61PdU8MZ2YCE4CmQ',
    empId:'2',
    name:'Abhi',
    loc:'Mangalore',
    attendanceStatus:'100%',
  },
  {
    id:'c',
    photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTCbQ0NU2O-w5dmApL-61PdU8MZ2YCE4CmQ',
    empId:'3',
    name:'Dhar',
    loc:'Mangalore',
    attendanceStatus:'68%',
  },
  {
    id:'d',
    photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTCbQ0NU2O-w5dmApL-61PdU8MZ2YCE4CmQ',
    empId:'4',
    name:'Shrish',
    loc:'Mangalore',
    attendanceStatus:'25%',
  },
  {
    id:'e',
    photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTCbQ0NU2O-w5dmApL-61PdU8MZ2YCE4CmQ',
    empId:'5',
    name:'Athu',
    loc:'Mangalore',
    attendanceStatus:'75%',
  },
  {
    id:'f',
    photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTCbQ0NU2O-w5dmApL-61PdU8MZ2YCE4CmQ',
    empId:'6',
    name:'Sour',
    loc:'Mangalore',
    attendanceStatus:'90%',
  },
  {
    id:'g',
    photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTCbQ0NU2O-w5dmApL-61PdU8MZ2YCE4CmQ',
    empId:'7',
    name:'Soh',
    loc:'Mangalore',
    attendanceStatus:'80%',
  },
]

const AdminHomeScreen = ({navigation}) => {

  const [text, setText] = useState('');

  const goToUser = (id) =>{
    // console.log(id);
    navigation.navigate('UserView',{
      id:id,
    })
  }


  return (
    <SafeAreaView style={styles.coverContainer} >

      <TouchableOpacity style={styles.container}>
        <Ionicons name='search' size={24} color="gray" />
        <TextInput onChangeText={setText}
          value={text}
          style={styles.inputBox}
          placeholder="Search"
          keyboardType="text" />
      </TouchableOpacity>

      <FlatList
      style={{ marginTop:20 }}
        data={data}
        // numColumns={2}
        // key={2}
        horizontal={false}
        keyExtractor={item=>{item.id}}
        renderItem={({item})=>(
          <TouchableOpacity style={styles.cardContainer} onPress={()=>{goToUser(item.id)}} >

            <View style={styles.topContent} >
              <View style={styles.imgHolder}>
                <Image style={{height:'100%', width:'100%'}} source={{uri:item.photo}} />
              </View>
              <View style={styles.topRightContainer}>
                <View style={styles.topPrimaryDetailsCont}>
                <Text style={{fontSize:20}} >{item.name}</Text>
                <Text style={{fontSize:18, color:'black'}} >{item.empId}</Text>
                </View>
                

                <View style={styles.bottomContainer} >
              <View style={styles.iconContainer} >
              <Ionicons name='location' size={22} color="red"/>
              <Text>{item.loc}</Text>
              </View>
              <View style={styles.attendanceContainer}>
                {/* <Text>Attendace percentage: {item.attendanceStatus}</Text> */}
                <View style={styles.iconContainer}>
                  <Ionicons name='calendar' size={22} color="green"/>
                  <Text>{item.attendanceStatus}</Text>
                </View>
              </View>
            </View>

              </View>
            </View>

            
            
          </TouchableOpacity>
        )}
      />

    </SafeAreaView>
  )
}

export default AdminHomeScreen

const styles = StyleSheet.create({
  coverContainer: {
    // borderWidth: 2, 
    height:'100%',
    padding:9
  },
  container: {
    flexDirection: 'row',
    // borderWidth: 2,
    justifyContent: 'space-around',
    borderRadius:10,
    height:60,
    alignItems:'center',
    backgroundColor:'#E2E1E2',
    borderColor:'#E2E1E2',
  },
  inputBox: {
    width: '85%',
    justifyContent: 'center',
    paddingHorizontal: 9,
  },
  
  cardContainer:{
    borderWidth:2,
    width:'100%',
    // margin:5,
    height:115,
    padding:9,
    borderRadius:30,
    justifyContent:'space-between',
    backgroundColor:'#E2E1E2',
    borderColor:'gray',
    marginVertical:9,
  },


  topContent:{
    // borderWidth:2,
    flexDirection:'row',
    height:'100%',
    // justifyContent:'space-between'
    alignItems:'center'
  },
  imgHolder:{
    height:80,
    // borderWidth:2,
    width:80,
    overflow:'hidden',
    borderRadius:40,
    borderColor:'gray',
    marginHorizontal:10,
  },
  topPrimaryDetailsCont:{
    // borderWidth:2,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  topRightContainer:{
    width:'66%',
    // borderWidth:2,
    height:'90%',
    justifyContent:'center',
    alignContent:'space-between'
  },

  bottomContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  iconContainer:{
    flexDirection:'row',
    alignItems:'center'
  },

  attendanceContainer:{
    
  }

})