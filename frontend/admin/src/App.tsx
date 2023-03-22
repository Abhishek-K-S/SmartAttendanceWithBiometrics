import React, {useContext, useState} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { userContext } from './components/assets/userContext'; 
import RoutingHandler from './components/RoutingHandler';

function App() {
  const context = useContext(userContext)
  const [user, setUser] = useState({authUser: context?.authUser})
  
  return (
    <BrowserRouter>
      <userContext.Provider value={{authUser: user.authUser || false, user, setUser}}>
        <RoutingHandler/>
      </userContext.Provider>
    </BrowserRouter>
  )
}

export default App;
