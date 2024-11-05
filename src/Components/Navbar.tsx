import React from 'react'
import icon from '../Images/logoSales.png'
import '../Styles/navbar.css'


const Navbar: React.FC = () => {
  
  return (
    <div className='navbar-container'>
        <div className='navbar-content'>
            <img src={icon} alt="navbar-icon"/>
        </div>
    </div>
  )
}

export default Navbar