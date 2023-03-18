import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Error404 from './components/error404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route  path='*' element={<Error404/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
