import React from 'react'
import ProductsList from '../Components/ProductsList'
import '../Styles/home.css'
import CloseSession from '../Components/CloseSession'

const Home = () => {
  return (
    <div className='home-container'>
      <ProductsList/>
      <CloseSession/>
    </div>
  )
}

export default Home