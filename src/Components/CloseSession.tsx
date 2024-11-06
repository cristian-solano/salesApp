import React from 'react';
import '../Styles/closesession.css'
import { useNavigate } from 'react-router'
import signout from '../Images/signout.png'
import { signOut, getAuth } from "firebase/auth";

const CloseSession: React.FC = () => {

const navigate = useNavigate()
const auth = getAuth()

const handleSignOut = () => {
  signOut(auth)
    try {
      localStorage.clear();
      sessionStorage.clear();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.log("Error signing out: ", error);
    }
};

  return (
    <div className='close-session-content'>
        <button onClick={handleSignOut}>
          <img src={signout} alt="signout"/>
        </button>
    </div>
   
  );
};

export default CloseSession