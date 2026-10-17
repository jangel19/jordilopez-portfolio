import { motion } from 'framer-motion';

const linkClassName =
  'underline decoration-[#4a9eff]/60 decoration-2 underline-offset-4 transition-colors duration-300 hover:text-[#4a9eff] hover:decoration-[#4a9eff]';

const LandingSection = () => {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
      <div
        className="pointer-events-none absolute right-[-12rem] top-1/2 h-[44rem] w-[44rem] -translate-y-1/2 md:right-[-4rem]"
        aria-hidden="true"
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="ping-ring absolute inset-0 rounded-full border border-[#3da88a]/40"
            style={{ animationDelay: `${i * 1.35}s` }}
          />
        ))}
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5fd0b0] shadow-[0_0_24px_6px_rgba(95,208,176,0.5)]" />
      </div>

      <motion.div
        className="relative mx-auto flex w-full max-w-5xl flex-col items-start text-left"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <p className="inline-flex flex-wrap items-center gap-3 rounded-full border border-[rgba(95,208,176,0.3)] bg-[rgba(61,168,138,0.08)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[#c6ccd7]">
          <span className="live-dot h-2 w-2 rounded-full bg-[#5fd0b0]" aria-hidden="true" />
          Jordi Lopez · Co-founder, Owell · In testing
        </p>
        <h1 className="mt-6 font-mono text-3xl leading-snug tracking-[0.02em] text-[#e8eaf0] sm:text-4xl md:text-6xl md:leading-[1.1]">
          I build embedded systems that sense, decide, and act. Right now that&apos;s{' '}
          <a href="#/owell" className={`${linkClassName} text-sheen`}>
            Owell
          </a>
          , automation for farms, plus{' '}
          <a href="#builds" className={linkClassName}>
            everything else I&apos;m building
          </a>
          .
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-base leading-8 text-[#c6ccd7] sm:text-lg">
          A builder first: hardware, firmware, and software. CS and Applied Math at UMass Lowell,
          focused on embedded systems, sensor fusion, and applied math.
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
