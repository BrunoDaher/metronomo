import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export function useDevice(): DeviceInfo {
  const checkDevice = (): DeviceInfo => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    const agent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';

    // iPadOS 13+ reports as Macintosh with multi-touch points
    const isIpad =
      agent.includes('ipad') ||
      (agent.includes('macintosh') && typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 1);
    const isIphone = agent.includes('iphone');
    const isAndroid = agent.includes('android');
    const isLandscape = typeof window !== 'undefined' && window.matchMedia('(orientation: landscape)').matches;

    // Detect tablet: iPad or Android with larger screen, or touch device with screen width 600px - 1180px
    const minDim = Math.min(width, height);
    const hasTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0;
    const isTablet = isIpad || (isAndroid && minDim >= 600) || (hasTouch && width >= 600 && width <= 1180) || (!hasTouch && width >= 600 && width <= 1024);
    const isMobile = !isTablet && (isIphone || isAndroid || width < 600);
    const isDesktop = !isMobile && !isTablet;

    const deviceType: 'mobile' | 'tablet' | 'desktop' = isMobile
      ? 'mobile'
      : isTablet
      ? 'tablet'
      : 'desktop';

    return {
      isMobile,
      isTablet,
      isDesktop,
      isLandscape,
      isPortrait: !isLandscape,
      deviceType
    };
  };

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(checkDevice);

  useEffect(() => {
    const handleResize = () => setDeviceInfo(checkDevice());
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}

