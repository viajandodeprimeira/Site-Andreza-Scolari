import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './components/views/Home';
import { ChatView } from './components/views/ChatView';
import { AdminView } from './components/views/AdminView';
import { AppMode } from './types';
import { PropertyProvider } from './contexts/PropertyContext';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  return (
    <PropertyProvider>
      <main className="w-full min-h-screen bg-white text-slate-900 font-sans">
        <Home setMode={setMode} />
        
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
              <AdminView goBack={() => setMode(AppMode.HOME)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PropertyProvider>
  );
};

export default App;