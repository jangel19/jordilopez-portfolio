import LandingSection from './components/LandingSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import logVisitor from './components/logVisitor'
import { useEffect } from 'react'

function App() {
  // log visitor data on page load
  useEffect(() => {
    logVisitor();
  }, []);
  // main app component
  return (
    <div className="App">
      <LandingSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}

export default App