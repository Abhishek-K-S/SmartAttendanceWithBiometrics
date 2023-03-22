import React, { useState, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

import { userContext } from './assets/userContext';

import Login from './auth/login';

import Homepage from './Homepage';
import ViewUser from './ViewUser';

const RoutingHandler = () => {

    const context = useContext(userContext)

    if(!context || !context?.authUser){
        return (
            <Routes>
                <Route path='/login' element={<Login/>} />
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        )
    }

    return (
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/viewuser/:userID' element={<ViewUser />} />
          <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    )
}

export default RoutingHandler