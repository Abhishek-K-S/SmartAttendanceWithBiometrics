import React,{useState, useEffect, useContext} from 'react'
import { userContext } from '../assets/userContext'
import { Server } from '../api/server'

const Login = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState('') 
  const uContext = useContext(userContext) 


  function submitHandler( e: React.FormEvent<HTMLFormElement> ){
    e.preventDefault()
    if(userName.length >0 && password.length >0){
      Server.post('/admin/login', {
        username: userName,
        password
      })
      .then(res =>{
        uContext?.setUser({authUser: true})
      })
      .catch(err=>{
        console.log(err)
      })
    }
  }

  return (
    <form className='m-auto w-25' onSubmit={submitHandler}>
      <h3 className="text-center">Login</h3>
      <div>
        <label htmlFor="Username" className='d-block'>Username:</label>
        <input id="Username" className='mb-3 p-2 w-auto' type='text' onChange={e=>setUserName(e.target.value)} value={userName}/>
      </div>

      <div>
        <label htmlFor='Password' className='d-block'>Password:</label>
        <input type="password" id='Password' className='mb-2 p-2 w-auto' onChange={e => setPassword(e.target.value)} value={password}/>
      </div>

      <div className="justify-center">
        <button type="submit" className="btn btn-primary"> Login </button>
      </div>
    </form>
  )
}

export default Login