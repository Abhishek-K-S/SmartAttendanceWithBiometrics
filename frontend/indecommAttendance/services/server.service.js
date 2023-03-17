import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authRoutes = [
    '/login',
    '/attendance',
    '/logout'
]

const host = "http://192.168.202.167:9999";
// const host = "http://192.168.1.44:9999";

const router_get = (route, data) =>{
    return axios.get(host+route)
}

export const router_post = async (route, body, multipart) =>{
    //if employee id is already present, just store it in async storage
    if(multipart && body.getAll('employeeID').length > 0){
        AsyncStorage.setItem('employeeID', body.getAll('employeeID')[0])
    }
    //if not present, append the employee id to the request from the async storage only if it is an authorized reqeust
    else{
        authRoutes.forEach( async authRoute =>{
            if(authRoute.includes(route)){
                body['employeeID'] = await AsyncStorage.getItem('employeeID').catch(err => {
                    console.log("Employee id not found in localstorage")
                    return;
                });
            }
        })
    }

    await AsyncStorage.getItem('uid').then(value =>{
        if(value)
            body['uid'] = value;
    }).catch(err => console.log("uid value is not present in the async storage "))

    console.log(body);

    let headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
    }

    return axios.post(host+route, body, { headers: multipart ? headers: {}}).then(res =>{
        if(res && res.data && res.data['uid']){
            AsyncStorage.setItem('uid', res.data.uid)
            delete res.data.uid
        }

        if(route === '/logout'){
            AsyncStorage.removeItem('uid')
        }
        return res;
    }).catch(err=>{
        if(err.response && err.response.status == 401 && route === '/logout'){
            AsyncStorage.removeItem('uid')
        }
        throw err
    })
}