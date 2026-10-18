import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import LandingSection from './components/LandingSection'
import OwellFeature from './components/OwellFeature'
import WearablesSection from './components/WearablesSection'
import BuildsSection from './components/BuildsSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import ExperienceSection from './components/ExperienceSection'
import ContactSection from './components/ContactSection'
import OwellPage from './components/OwellPage'
import PCBGate from './components/PCBGate';
import Topography from './components/Topography';

const GATE_ENABLED = true;
const GATE_KEY = 'pcbGateCompleted';

// The intro only plays on desktop-sized screens, without reduced motion,
// and once per visitor. Any storage failure means "skip".
const shouldPlayGate = () => {
  try {
    if (!GATE_ENABLED) return false;
    if (window.innerWidth < 768) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (window.location.hash) return false;
    return window.localStorage.getItem(GATE_KEY) !== 'true';
  } catch {
    return false;
  }
};

const readHash = () => window.location.hash;

function App() {
  const [showGate, setShowGate] = useState(shouldPlayGate);
  const [hash, setHash] = useState(readHash);
  const route = hash === '#/owell' ? 'owell' : 'home';
  const reducedMotion = useReducedMotion();
  const completeGate = useCallback(() => setShowGate(false), []);

  // Mark as seen as soon as it starts so a reload mid-intro never replays it.
  useEffect(() => {
    if (!showGate) return;
    try {
      window.localStorage.setItem(GATE_KEY, 'true');
    } catch {
      // Readable storage can still reject writes (for example, a full quota).
      setShowGate(false);
    }
  }, [showGate]);

  useEffect(() => {
    const onHashChange = () => {
      setHash(readHash());
      setShowGate(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Scroll to top on page change, or to an in-page anchor like #builds.
  useLayoutEffect(() => {
    if (showGate) return;
    // Wait for the destination view to mount before moving scroll and focus.
    const frame = requestAnimationFrame(() => {
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { id = ''; }
      const target = route === 'home' && id ? document.getElementById(id) : null;
      const destination = target ?? document.querySelector('main h1');
      if (destination) {
        destination.tabIndex = -1;
        destination.focus({ preventScroll: true });
      }
      if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, route, showGate]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="App relative min-h-screen bg-[#0a0e27] text-[#e8eaf0]">
        {!showGate && <Topography />}
        {showGate ? (
          <PCBGate key="gate" onComplete={completeGate} />
        ) : (
          <>
            <a
              href="#main-content"
              className="skip-link"
              onClick={(event) => {
                event.preventDefault();
                const main = document.getElementById('main-content');
                main.focus({ preventScroll: true });
                main.scrollIntoView({ behavior: 'instant' });
              }}
            >
              Skip to content
            </a>
            <motion.main
              key={route}
              id="main-content"
              tabIndex={-1}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative z-10"
            >
              {route === 'owell' ? (
                <OwellPage />
              ) : (
                <>
                  <LandingSection />
                  <OwellFeature />
                  <WearablesSection />
                  <BuildsSection />
                  <ProjectsSection />
                  <AboutSection />
                  <ExperienceSection />
                  <ContactSection />
                </>
              )}
            </motion.main>
          </>
        )}
      </div>
    </MotionConfig>
  );
}

export default App
