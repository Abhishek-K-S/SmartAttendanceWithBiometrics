import React, { ReactPropTypes, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Server } from './api/server'
import './Homepage.css'

const ViewUser = () => {
    const {userID} = useParams()
    const month: Array<number> = new Array(31);

    const [user, setUser] = useState<any|null>(null)
    const [totalThisMonth, setTotalThisMonth] = useState<number>(0)

    useEffect(()=>{
        Server.get(`/admin/user/${userID}`).then(res=>{
            setUser(res.data)
        })
    }, [])

    useEffect(()=>{
        
        (async ()=>{
            let thisMonth: number = new Date().getMonth()
            await user?.attendancelog.forEach((day: any)=>{
                if(new Date(day['createdAt']).getMonth() == thisMonth){
                    month[new Date(day['createdAt']).getDate()] = 1
                }
            })
            setTotalThisMonth(month.filter(d => d!==0).length)

        })()

        // new Promise(()=>{
        //     user?.attendancelog.forEach((day: any)=>{
        //         if(new Date(day['createdAt']).getMonth() == thisMonth){
        //             month[new Date(day['createdAt']).getDate()] = 1
        //         }
        //     })
        //     return true;
        // }).then((val)=>{
        //     console.log(val, month.filter(d => d!==0).length)
        // })
        
        
    }, [user])

    function getDate(d: string){
        let date = new Date(d)
        let y = date.getFullYear()
        let m:any = date.getMonth()+1;
        if(m < 10) m = '0'+m

        let dt:any = date.getDate()
        if(dt < 10) dt = '0'+dt

        let h:any = date.getHours()
        if(h < 10) h = '0'+h

        let mn :any = date.getMinutes()
        if(mn <10) mn = '0'+mn

        return y+ "/"+m+"/"+dt+" "+h+":"+mn
    }

    return (
        <>
            <div className="row h3 p-3 bgGray my-3">User Details</div>
            <div className="row lowerBorder mb-3">
                <div className="col h1">{user?.name}</div>
                <div className="h4">
                    <span>Employee ID: {user?.employeeID}</span><br/>
                    <span className="greyText">Location: {user?.latitude}, {user?.longitude}</span>
                </div>
            </div>
            <div className="row">
                <div className="col-6 scroll relative">
                    <div className="h4 text-center my-2 sticky">Attendance Log</div>
                    <div className="row">
                        {user?.attendancelog.map((log:any)=>{
                            return(
                                <div key={log._id} className="col-12 btn btn-light lowerBorder p-2 py-3">
                                    <span>Login: {getDate(log.createdAt)}</span>
                                    <span className='ms-5'>Logout: {getDate(log.updatedAt)}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="col-6 d-flex justify-content-center align-items-center">
                    <span className='card btn btn-light bgGray'>
                        <div className="h-100 flexCenter">
                            <h1 className='text-center '><span className="bigText">{totalThisMonth}</span> Days</h1>
                            <div className="text-center">Attended in this month</div>
                        </div>
                    </span>
                </div>
            </div>
        </>
    )
}

export default ViewUser
