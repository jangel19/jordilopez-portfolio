import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadFull } from 'tsparticles'

const LandingSection = () => {


  const particlesLoaded = useCallback((container) => {
  console.log('tsparticles container loaded:', container);
  // container.particles.array is the list of active particles
  console.log(
    'Particle count:',
    container.particles.count ?? container.particles.array.length
  );
  console.log('Link settings:', container.options.particles.links);
}, []);

  useEffect(() => {
    initParticlesEngine(async engine => {
      console.log('engine init', engine);// Log the engine to see if it's initialized correctly
      await loadFull(engine);
    });
  }, []);

const particlesConfig = {
  fullScreen: { enable: false },
  background: { color: { value: "transparent" } },  fpsLimit: 60,
  interactivity: {
    detectOn: "canvas",
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab:   { distance: 400, links: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse:{ distance: 200, duration: 0.4 },
      push:   { quantity: 4 },
      remove: { quantity: 2 },
    },
  },
  particles: {
    number:  { value: 200, density: { enable: true, area: 800 } },
    color:   { value: "#000000" },
    shape:   { type: "circle" },
    opacity: { value: 0.5, random: false },
    size:    { value: 3, random: true },
    links:   { enable: true, distance: 150, color: "#000000", opacity: 0.4, width: 1 },
    move: {
      enable: true, speed: 6, direction: "none", random: false,
      straight: false, outModes: { default: "out" }, bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
  },
  detectRetina: true,
};

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-300">
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={particlesConfig}
        className="absolute inset-0"
        canvasClassName="absolute inset-0 z-0"
        width="100%"
        height="100%"
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hi, I'm <span className="text-primary">Jordi!</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-black mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
            Aspiring Software Engineer | CS & Math Student at UMass Lowell Building smart, human-centered tech — one project at a time.        </motion.p>
        
       <motion.button
className="bg-white text-blue-950 border border-blue-950 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-950 hover:text-white transition-all duration-300 shadow-md"          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={() => {
            // 1. Find the element with id="AboutSection"
            const next = document.getElementById("AboutSection");
            // 2. If it exists, scroll to it smoothly
            if (next) next.scrollIntoView({ behavior: 'smooth' });
          }}
          >
          Get to Know Me
        </motion.button>
      </div>
    </section>
  )
}
export default LandingSection