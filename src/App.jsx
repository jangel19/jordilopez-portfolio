import { useEffect } from 'react';
import LandingSection from './components/LandingSection'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'

function App() {

  useEffect(() => {
    fetch('https://jordilopez-portfolio.onrender.com', {
      method: 'GET'
    });
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