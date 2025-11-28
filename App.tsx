import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './components/views/Home';
import { ChatView } from './components/views/ChatView';
import { AdminView } from './components/views/AdminView';
import { VisionView } from './components/views/VisionView';
import { ImageGenView } from './components/views/ImageGenView';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';
import { SEOHead } from './components/seo/SEOHead';
import { AppMode } from './types';
import { PropertyProvider, useProperties } from './contexts/PropertyContext';

// Helper component to inject scripts from context
const PixelInjector: React.FC = () => {
    const { brokerProfile } = useProperties();
    
    useEffect(() => {
        // --- 1. Custom Scripts & Pixel Injection ---
        if (brokerProfile.pixelCode) {
            const scriptId = 'custom-pixel-script';
            if (!document.getElementById(scriptId)) {
                try {
                    const div = document.createElement('div');
                    div.innerHTML = brokerProfile.pixelCode;
                    
                    const scripts = div.getElementsByTagName('script');
                    
                    Array.from(scripts).forEach((script) => {
                        const newScript = document.createElement('script');
                        newScript.id = scriptId;
                        if (script.src) {
                            newScript.src = script.src;
                            newScript.async = true;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.head.appendChild(newScript);
                    });
                } catch (e) {
                    console.error("Failed to inject pixel scripts", e);
                }
            }
        }

        // --- 2. Google Analytics 4 Injection ---
        if (brokerProfile.googleAnalyticsId) {
            const gaId = brokerProfile.googleAnalyticsId;
            const scriptId = 'ga4-script';
            
            if (!document.getElementById(scriptId)) {
                try {
                    // Inject the async script tag
                    const scriptTag = document.createElement('script');
                    scriptTag.id = scriptId;
                    scriptTag.async = true;
                    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
                    document.head.appendChild(scriptTag);

                    // Inject the init code
                    const initScript = document.createElement('script');
                    initScript.textContent = `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaId}');
                    `;
                    document.head.appendChild(initScript);
                } catch(e) {
                     console.error("Failed to inject GA4", e);
                }
            }
        }

    }, [brokerProfile.pixelCode, brokerProfile.googleAnalyticsId]);

    return null;
};

const AppContent: React.FC = () => {
  // Initialize state based on current URL hash
  const [mode, setModeState] = useState<AppMode>(() => {
    const hash = window.location.hash.replace('#', '');
    switch(hash) {
      case 'admin': return AppMode.ADMIN;
      case 'chat': return AppMode.CHAT;
      case 'vision': return AppMode.VISION;
      case 'studio': return AppMode.IMAGE_GEN;
      case 'privacy': return AppMode.PRIVACY;
      default: return AppMode.HOME;
    }
  });

  // Wrapper to update both state and URL hash
  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    switch(newMode) {
      case AppMode.ADMIN: window.location.hash = 'admin'; break;
      case AppMode.CHAT: window.location.hash = 'chat'; break;
      case AppMode.VISION: window.location.hash = 'vision'; break;
      case AppMode.IMAGE_GEN: window.location.hash = 'studio'; break;
      case AppMode.PRIVACY: window.location.hash = 'privacy'; break;
      default: window.location.hash = ''; break;
    }
  };

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      switch(hash) {
        case 'admin': setModeState(AppMode.ADMIN); break;
        case 'chat': setModeState(AppMode.CHAT); break;
        case 'vision': setModeState(AppMode.VISION); break;
        case 'studio': setModeState(AppMode.IMAGE_GEN); break;
        case 'privacy': setModeState(AppMode.PRIVACY); break;
        default: setModeState(AppMode.HOME); break;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
      <main className="w-full min-h-screen bg-white text-slate-900 font-sans">
        <SEOHead />
        <PixelInjector />
        
        {mode === AppMode.HOME && <Home setMode={setMode} />}
        
        <AnimatePresence>
          {mode === AppMode.CHAT && (
            <ChatView goBack={() => setMode(AppMode.HOME)} />
          )}
          
          {mode === AppMode.ADMIN && (
            <motion.div 
               initial={{ opacity: 0, x: '100%' }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: '100%' }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-0 z-50 bg-[#09090b]"
            >
              <AdminView goBack={() => setMode(AppMode.HOME)} navigate={setMode} />
            </motion.div>
          )}

          {mode === AppMode.VISION && (
             <motion.div 
             initial={{ opacity: 0, y: '100%' }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: '100%' }}
             className="fixed inset-0 z-50 bg-[#09090b]"
             >
                <VisionView goBack={() => setMode(AppMode.ADMIN)} />
             </motion.div>
          )}

          {mode === AppMode.IMAGE_GEN && (
             <motion.div 
             initial={{ opacity: 0, y: '100%' }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: '100%' }}
             className="fixed inset-0 z-50 bg-[#09090b]"
             >
                <ImageGenView goBack={() => setMode(AppMode.ADMIN)} />
             </motion.div>
          )}

          {mode === AppMode.PRIVACY && (
             <motion.div 
             initial={{ opacity: 0, x: '100%' }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: '100%' }}
             className="fixed inset-0 z-50 bg-[#09090b] overflow-y-auto"
             >
                <PrivacyPolicyView goBack={() => setMode(AppMode.HOME)} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
  );
}

const App: React.FC = () => {
  return (
    <PropertyProvider>
        <AppContent />
    </PropertyProvider>
  );
};

export default App;