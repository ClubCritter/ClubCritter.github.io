import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import bgVideo from './assets/video/gfp-astro-timelapse.mp4';
import Home from './pages/Home';
import './App.css';
import ClientContextProvider from './wallet/providers/ClientContextProvider';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const [allAssetsLoaded, setAllAssetsLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const images = document.querySelectorAll('img');
    const totalAssets = images.length + 1; // +1 for the video

    let loadedAssets = 0;

    images.forEach((image) => {
      image.addEventListener('load', () => {
        loadedAssets++;
        if (loadedAssets === totalAssets) {
          setAllAssetsLoaded(true);
        }
      });
    });

    if (videoRef.current) {
      videoRef.current.addEventListener('canplaythrough', () => {
        loadedAssets++;
        if (loadedAssets === totalAssets) {
          setAllAssetsLoaded(true);
        }
      });

      videoRef.current.addEventListener('error', (error) => {
        console.error('Video load error:', error);
      });
    }
  }, [bgVideo]);

  useEffect(() => {
    if (allAssetsLoaded) {
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, 100);
    }
  }, [allAssetsLoaded]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        id="bg-video"
        src={bgVideo}
        type="video/mp4"
      />
      <div className="page-container">
        <ToastContainer />
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
  );
}

export default App;