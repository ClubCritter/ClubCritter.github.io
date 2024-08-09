import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Intro from '../components/Intro'
import Tokenomics from '../components/Tokenomics'
import About from '../components/About'
import Presale from '../components/Presale'
import useUiStore from '../store/uiStore'

const Home = () => {
  return (
    <>
     <Navbar />
      <div className="container-fluid app-container">
      <div className="cd-hero-slider mb-0 py-5">
        <Routes>
            <Route path='/' element={<Intro />} />
            <Route path='/tokenomics' element={<Tokenomics />} />
            <Route path='/about' element = {<About />} />
            <Route path='/presale' element = {<Presale />} />
        </Routes>
     </div>
     </div>
     <Footer />
    </>
  )
}

export default Home