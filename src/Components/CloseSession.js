import React from 'react'
import '../Styles/closesession.css'
import { useNavigate } from 'react-router'
import signout from '../Images/signout.png'
import { signOut, getAuth } from "firebase/auth";

const CloseSession = () => {

const navigate = useNavigate()
const auth = getAuth()

  return (
    <div className='close-session-content'>
        <button onClick={() => {
            signOut(auth)
            localStorage.clear()
            sessionStorage.clear()
            setTimeout(() => {
                navigate('/')
            }, 1000)
        }}>
        <img src={signout} alt="signout"/>
        </button>
    </div>
   
  )
}

export default CloseSession