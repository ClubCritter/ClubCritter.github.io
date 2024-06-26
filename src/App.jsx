import React, { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import bgVideo from './assets/video/gfp-astro-timelapse.mp4'
import Home from './pages/Home'
import './App.css'
import { ClientContextProvider } from './wallet/providers/walletConnect/ClientContextProvider';

function App() {
    const [allAssetsLoaded, setAllAssetsLoaded] = useState(false);
  
    useEffect(() => {
      const images = document.querySelectorAll('img');
      const videos = document.querySelectorAll('video');
      const totalAssets = images.length + videos.length;
  
      let loadedAssets = 0;
  
      images.forEach((image) => {
        image.addEventListener('load', () => {
          loadedAssets++;
          if (loadedAssets === totalAssets) {
            setAllAssetsLoaded(true);
          }
        });
      });
  
      videos.forEach((video) => {
        video.addEventListener('loadeddata', () => {
          loadedAssets++;
          if (loadedAssets === totalAssets) {
            setAllAssetsLoaded(true);
          }
        });
      });
    }, []);
  
    useEffect(() => {
      if (allAssetsLoaded) {
        setTimeout(() => {
          document.body.classList.add('loaded');
        }, 700);
      }
    }, [allAssetsLoaded]);


  return(
    <>
      <video autoPlay muted loop id="bg-video"
         src={bgVideo} 
         type="video/mp4" />
      <div className='page-container'>
        <ClientContextProvider>
                <BrowserRouter>
                               <Home />
                </BrowserRouter>
        </ClientContextProvider>
      
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
