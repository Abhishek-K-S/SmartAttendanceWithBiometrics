import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Server } from './api/server';
import './Homepage.css'

const Homepage = () => {
    const [userList, setUserList] = useState<Array<any>>([]);
    const navigation = useNavigate()

    useEffect(()=>{
        Server.get('/admin/users').then(res=>{
            setUserList([...userList, ...res.data.userlist])
        })
    }, [])

    const viewUser = (id: String) =>{
        navigation(`/viewuser/${id}`)
    }

    return (
        <>
            <h1 className='mb-5 mt-4'>Welcome Admin</h1>
            <div className="row bgGray">
                <div className="col-12 p-3 pl-2 h2 btn-primary align-center">
                    User List
                </div>
            </div>
            <div className="row">
                {userList.map(user =>{
                    return (
                        <button key={user._id} className="btn btn-light d-block p2 lowerBorder" onClick={e=>viewUser(user.employeeID)}>
                            <div className="h3 textLeft firstCap">{user.name}</div>
                            <div className="h6 textLeft greyText">{user.employeeID}</div>
                            <div className="d-flex firstCap">
                                <span className="h5">Location: {Server.geolocation(user.latitude, user.longitude)}</span>
                                <span className="h5 ms-auto"><span className="greyText">Role:</span> Dev</span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </>
    )
}

export default Homepage