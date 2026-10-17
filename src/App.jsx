import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import LandingSection from './components/LandingSection'
import OwellFeature from './components/OwellFeature'
import BuildsSection from './components/BuildsSection'
import CoopSection from './components/CoopSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import ExperienceSection from './components/ExperienceSection'
import ContactSection from './components/ContactSection'
import OwellPage from './components/OwellPage'
import PCBGate from './components/PCBGate';

const GATE_ENABLED = true;
const GATE_KEY = 'pcbGateCompleted';

// The intro only plays on desktop-sized screens, without reduced motion,
// and once per visitor. Any storage failure means "skip".
const shouldPlayGate = () => {
  try {
    if (!GATE_ENABLED) return false;
    if (window.innerWidth < 768) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (window.location.hash.startsWith('#/')) return false;
    return window.localStorage.getItem(GATE_KEY) !== 'true';
  } catch {
    return false;
  }
};

const readRoute = () => (window.location.hash.startsWith('#/owell') ? 'owell' : 'home');

function App() {
  const [showGate, setShowGate] = useState(shouldPlayGate);
  const [route, setRoute] = useState(readRoute);

  // Mark as seen as soon as it starts so a reload mid-intro never replays it.
  useEffect(() => {
    if (!showGate) return;
    try {
      window.localStorage.setItem(GATE_KEY, 'true');
    } catch {
      // Storage unavailable: the intro will be skipped next time anyway.
    }
  }, [showGate]);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Scroll to top on page change, or to an in-page anchor like #builds.
  useEffect(() => {
    if (showGate) return;
    const id = window.location.hash.slice(1);
    const target = route === 'home' && id ? document.getElementById(id) : null;
    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [route, showGate]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="App min-h-screen bg-[#0a0e27] text-[#e8eaf0]">
        <AnimatePresence mode="wait">
          {showGate ? (
            <PCBGate key="gate" onComplete={() => setShowGate(false)} />
          ) : (
            <motion.main
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              {route === 'owell' ? (
                <OwellPage />
              ) : (
                <>
                  <LandingSection />
                  <OwellFeature />
                  <BuildsSection />
                  <CoopSection />
                  <ProjectsSection />
                  <AboutSection />
                  <ExperienceSection />
                  <ContactSection />
                </>
              )}
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export default App
