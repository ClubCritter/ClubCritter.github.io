import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useCloseMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleHtmlClick = (event) => {
      setMenuOpen(false);
    };

    document.addEventListener('click', handleHtmlClick);

    return () => {
      document.removeEventListener('click', handleHtmlClick);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return { menuOpen, closeMenu };
}

function useHighlightMenu() {
  const location = useLocation();
  const initialSelectedNavItem = (() => {
    switch (location.pathname) {
      case '/':
        return '1';
      case '/tokenomics':
        return '2';
      case '/about':
        return '3';
      case '/presale':
        return '4';
      default:
        return null;
    }
  })();

  const [selectedNavItem, setSelectedNavItem] = useState(initialSelectedNavItem);

  const highlightMenu = (no) => {
    setSelectedNavItem(no);
  };

  return { selectedNavItem, highlightMenu };
}

export { useCloseMenu, useHighlightMenu };