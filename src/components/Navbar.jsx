import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCloseMenu, useHighlightMenu } from '../assets/js/template';
import useUiStore from '../store/uiStore';

const Navbar = () => {
  const { menuOpen, toggleMenu, closeMenu } = useCloseMenu();
  const { selectedNavItem, highlightMenu } = useHighlightMenu();
  const { navbarOpacity, setNavbarOpacity }= useUiStore()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const opacity = Math.max(1 - scrollPosition / 50, 0);
      setNavbarOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleNavLinkClick = (event) => {
      const pageNo = event.target.dataset.no;
      highlightMenu(pageNo);
      closeMenu();
    };

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => link.addEventListener('click', handleNavLinkClick));

    return () => {
      navLinks.forEach((link) => link.removeEventListener('click', handleNavLinkClick));
    };
  }, []);

  return (
      <div className="container-fluid navbar-container" style={{opacity: navbarOpacity}}>
      <div className="row">
        <div className="col-xs-12" >
          <div className="cd-slider-nav">
            <nav className="navbar navbar-expand-lg" aria-current="page" id="tm-nav">
              <a className="navbar-brand tm-bg-dark-a px-4" href='/'>Presale Template</a>
              <button className="navbar-toggler tm-bg-dark-a" type="button" onClick={toggleMenu} data-bs-toggle="collapse" data-bs-target="#navbar-supported-content" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbar-supported-content">
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className={`nav-item ${selectedNavItem === '1' ? 'selected' : ''}`}>
                    <Link className="nav-link home tm-bg-dark-a px-4" to="/" data-no="1">Home</Link>
                    <div className="circle"></div>
                  </li>
                  <li className={`nav-item ${selectedNavItem === '2' ? 'selected' : ''}`}>
                    <Link className="nav-link tm-bg-dark-a px-4" to='/tokenomics' data-no="2">Tokenomics</Link>
                    <div className="circle"></div>
                  </li>
                  <li className={`nav-item ${selectedNavItem === '3' ? 'selected' : ''}`}>
                    <Link className="nav-link tm-bg-dark-a px-4" to="/about" data-no="3">About</Link>
                    <div className="circle"></div>
                  </li>
                  <li className={`nav-item ${selectedNavItem === '4' ? 'selected' : ''}`}>
                    <Link className="nav-link tm-bg-dark-a px-4" to="/presale" data-no="4">Presale</Link>
                    <div className="circle"></div>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>          
      </div>        
    </div>
    
  );
};

export default Navbar;