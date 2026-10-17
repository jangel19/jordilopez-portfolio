import { motion } from 'framer-motion';

const linkClassName =
  'underline decoration-[#4a9eff]/60 decoration-2 underline-offset-4 transition-colors duration-300 hover:text-[#4a9eff] hover:decoration-[#4a9eff]';

const LandingSection = () => {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
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
        className="relative mx-auto flex w-full max-w-4xl flex-col items-start text-left"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#9ca3af]">
          Jordi Lopez
        </p>
        <h1 className="mt-6 font-mono text-3xl leading-snug tracking-[0.02em] text-[#e8eaf0] sm:text-4xl md:text-5xl md:leading-tight">
          I build embedded systems that sense, decide, and act. Right now that&apos;s{' '}
          <a href="#/owell" className={linkClassName}>
            Owell
          </a>
          , automation for farms, plus{' '}
          <a href="#builds" className={linkClassName}>
            everything else I&apos;m building
          </a>
          .
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-base leading-8 text-[#c6ccd7] sm:text-lg">
          CS and Applied Math at UMass Lowell, focused on embedded systems, sensor fusion, and
          applied math.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#/owell"
            className="inline-flex items-center rounded-md border border-[rgba(74,158,255,0.4)] bg-[rgba(74,158,255,0.14)] px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#e8eaf0] transition-colors duration-300 hover:bg-[rgba(74,158,255,0.24)]"
          >
            See Owell →
          </a>
          <a
            href="#builds"
            className="inline-flex items-center rounded-md border border-[rgba(74,158,255,0.25)] px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#c6ccd7] transition-colors duration-300 hover:border-[rgba(74,158,255,0.5)] hover:text-[#e8eaf0]"
          >
            All builds ↓
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingSection;
