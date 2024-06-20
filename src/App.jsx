import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Favicon from "react-favicon";
import favicon from '/favicon.ico'
import bgVideo from './assets/video/gfp-astro-timelapse.mp4'
import Home from './pages/Home'
import './App.css'

function App() {
  return(
    <>
      <Favicon url={favicon} />
      <video autoPlay muted loop id="bg-video"
         src={bgVideo} 
         type="video/mp4" />
      <div className='page-container'>
      <BrowserRouter>
             <Home />
      </BrowserRouter>
      </div>
      <div id="loader-wrapper">            
         <div id="loader"></div>
         <div className="loader-section section-left"></div>
         <div className="loader-section section-right"></div>
      </div>
    </>
  )
}

export default App
