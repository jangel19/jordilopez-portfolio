import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingSection from './components/LandingSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import ExperienceSection from './components/ExperienceSection'
import ContactSection from './components/ContactSection'
import PCBGate from './components/PCBGate';

const GATE_ENABLED = true;

const readGateCompletion = () => {
  try {
    return window.localStorage.getItem('pcbGateCompleted') === 'true';
  } catch {
    return true;
  }
};

function App() {
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (GATE_ENABLED) {
      setShowGate(!readGateCompletion());
    }
  }, []);

  return (
    <div className="App min-h-screen bg-[#0a0e27] text-[#e8eaf0]">
      <AnimatePresence mode="wait">
        {showGate ? (
          <PCBGate
            key="gate"
            onComplete={() => {
              try {
                window.localStorage.setItem('pcbGateCompleted', 'true');
              } catch {
                // Ignore storage failures and continue to portfolio.
              }
              setShowGate(false);
            }}
          />
        ) : (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <LandingSection />
            <AboutSection />
            <ProjectsSection />
            <ExperienceSection />
            <ContactSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App
