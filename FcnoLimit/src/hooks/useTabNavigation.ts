import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { isMobileApp } from '../utils/platformDetection';

interface TabNavigationHook {
  navigateToTab: (path: string) => void;
  isCurrentTab: (path: string) => boolean;
  isMobile: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useTabNavigation = (): TabNavigationHook => {
  const history = useHistory();
  const location = useLocation();
  const isMobile = isMobileApp();
  const [activeTab, setActiveTab] = useState<string>('inicio');

  const navigateToTab = (path: string) => {
    if (isMobile) {
      // En móvil, usar navegación optimizada
      history.push(path);
    } else {
      // En web, navegación normal
      history.push(path);
    }
  };

  const isCurrentTab = (path: string) => {
    if (path === '/inicio' || path === '/home') {
      return location.pathname === '/' || location.pathname === '/inicio' || location.pathname === '/home';
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return {
    navigateToTab,
    isCurrentTab,
    isMobile,
    activeTab,
    setActiveTab
  };
};
