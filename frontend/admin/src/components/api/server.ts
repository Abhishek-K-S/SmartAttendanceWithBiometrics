import axios, { Axios } from "axios";
import { OutgoingHttpHeaders } from "http2";

const headers: OutgoingHttpHeaders ={
    Accept: 'application/json'
} 

const URL = "http://localhost:9999"

const post = (url: string, data: Object)=>{
     return axios.post(`${URL}${url}`, data, {
        headers
    })
}

const get = (url: string)=>{
    return axios.get(`${URL}${url}`, {
       headers
   })
}

const geolocation = (lat: number, long: number)=>{
    let loc:string=""
    axios.get(`https://geocode.maps.co/reverse?${lat}&lon=${long}`).then(val=>{
        loc = val.data['display_name'] || ""
    })
    return loc
}

export const Server= {get, post, geolocation}