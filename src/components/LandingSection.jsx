import { motion } from 'framer-motion';

const LandingSection = () => {
  const scrollToAbout = () => {
    const next = document.getElementById('AboutSection');
    if (next) {
      next.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-0 top-[18%] h-px w-full bg-[linear-gradient(90deg,transparent,rgba(74,158,255,0.22),transparent)]" />
        <div className="absolute inset-x-[18%] top-[26%] h-28 rounded-full bg-[radial-gradient(circle,rgba(61,168,138,0.1),transparent_72%)] blur-3xl" />
        <svg
          className="absolute right-[8%] top-[14%] h-28 w-72 text-[#4a9eff]/10 md:h-36 md:w-[26rem]"
          viewBox="0 0 420 120"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 69C20 69 26 46 40 46C56 46 62 91 79 91C92 91 95 58 110 58C126 58 130 74 148 74C170 74 170 23 196 23C220 23 222 89 245 89C267 89 265 44 286 44C309 44 303 67 325 67C347 67 350 38 369 38C388 38 397 61 420 61"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <motion.div
        className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <p className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.38em] text-[#6b7280]">
          Embedded Systems Portfolio
        </p>
        <h1 className="font-mono text-5xl tracking-[0.08em] text-[#e8eaf0] sm:text-6xl md:text-7xl">
          Jordi Lopez
        </h1>
        <p className="mt-6 max-w-3xl font-sans text-lg text-[#9ca3af] sm:text-xl">
          Embedded Systems • Biosignal Processing • Applied Mathematics
        </p>
        <div className="mt-10 max-w-3xl space-y-5 font-sans text-base leading-8 text-[#c6ccd7] sm:text-lg">
          <p>
            Undergraduate researcher at UMass Lowell CACT working on IMU sensor
            calibration for motion tracking in wearable devices.
          </p>
          <p>
            Building recovery scoring systems, sensor fusion algorithms, and
            real-time embedded applications.
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToAbout}
          className="mt-16 inline-flex flex-col items-center gap-3 font-mono text-xs uppercase tracking-[0.32em] text-[#6b7280] transition-colors duration-300 hover:text-[#4a9eff]"
          aria-label="Scroll to about section"
        >
          <span>Scroll</span>
          <span className="text-xl leading-none">↓</span>
        </button>
      </motion.div>
    </section>
  );
};

export default LandingSection;
