import React from 'react'
import { Link } from 'react-router-dom'
import '../Styles/login.css'
import google from '../Images/google.png'
import plus from '../Images/mas.png'

const Login: React.FC = () => {
  return (
    <div className='login-container'>
        <div className='login-links'>
            <div className='login-items'>
                <Link to="/signupwithcredential">
                    <img src={plus} alt="plus"/>    
                    <p>Ingresar con mi cuenta</p>
                </Link>
            </div>
            <div className='login-items'>
                <Link to="/signupwithgoogle">
                    <img src={google} alt="google" />
                    <p>Ingresar con Google</p>
                </Link>
            </div>
            
        </div>
        <div className='login-content'>

        </div>
    </div>
  )
}

export default Login