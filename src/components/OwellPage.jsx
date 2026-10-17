import { motion } from 'framer-motion';
import { owell } from '../data/builds';
import ContactSection from './ContactSection';
import { Badge } from './ui';
import { useReveal, tagClassName } from './uiStyles';

// Swap in a video file path (e.g. '/owell-demo.mp4') to replace the placeholder.
const DEMO_VIDEO_SRC = null;

const stages = [
  { title: 'Built', tone: 'text-[#5fd0b0]', line: 'The field device, the backend, and the app are built.' },
  { title: 'Now', tone: 'text-[#fbbf5a]', line: 'Testing everything end to end.' },
  { title: 'Later', tone: 'text-[#7db8ff]', line: 'Our first deployment, in Ecuador.' },
];

const Eyebrow = ({ children }) => (
  <p className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#5fd0b0]">
    {children}
  </p>
);

const OwellPage = () => {
  const reveal = useReveal();
  return (
  <>
    <header className="relative overflow-hidden px-6 pb-20 pt-8 md:pb-32">
      <img
        src="/owell.webp"
        alt=""
        width="612"
        height="408"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,39,0.55)_0%,#0a0e27_100%)]" />
      <div className="relative mx-auto max-w-5xl">
        <a
          href="#builds"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#c6ccd7] transition-colors hover:text-white"
        >
          ← All builds
        </a>
        <div className="mt-20 md:mt-28">
          <Badge status={owell.status} />
        </div>
        <h1 className="mt-6 font-mono text-5xl leading-[1.02] tracking-[0.02em] text-[#f5f7fa] md:text-7xl">
          Owell.
          <br />
          <span className="text-sheen">Farms that just run.</span>
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-xl leading-9 text-[#d5dae3] md:text-2xl">
          {owell.pitch}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c6ccd7]">
            {owell.role} · Founded {owell.dates.replace(' – Present', '')}
          </span>
          {owell.stack.map((item) => (
            <span key={item} className={`${tagClassName} bg-[rgba(10,14,39,0.6)]`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>

    <section className="px-6 py-16 md:py-24">
      <motion.div className="mx-auto max-w-5xl" {...reveal}>
        <Eyebrow>01 / The company</Eyebrow>
        <h2 className="font-mono text-3xl leading-snug tracking-[0.01em] text-[#f5f7fa] md:text-5xl md:leading-tight">
          Owell is building the farm that runs itself, so the people on it can focus on the work
          only people can do.
        </h2>
      </motion.div>
    </section>

    <section className="px-6 py-16 md:py-24">
      <motion.div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.1fr]" {...reveal}>
        <div>
          <Eyebrow>02 / The problem</Eyebrow>
          <h2 className="font-mono text-2xl leading-snug tracking-[0.03em] text-[#e8eaf0] md:text-3xl">
            A farm is a lot of people, and most of them are watching and reacting.
          </h2>
        </div>
        <div className="space-y-5 font-sans text-base leading-8 text-[#c6ccd7] md:text-lg">
          <p>
            Crews walk the fields, read the conditions, decide what needs attention, and then go
            do it. Much of that loop is watching and reacting.
          </p>
          <p>
            We&apos;re testing sensors and automation to take over the routine watching,
            deciding, and doing.
          </p>
        </div>
      </motion.div>
    </section>

    <section className="px-6 py-16 md:py-24">
      <motion.div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[rgba(95,208,176,0.25)] bg-[rgba(61,168,138,0.05)] p-8 md:p-14"
        {...reveal}
      >
        <Eyebrow>03 / Where we&apos;re headed</Eyebrow>
        <h2 className="font-mono text-3xl leading-tight tracking-[0.02em] text-[#f5f7fa] md:text-5xl">
          Our first deployment target is <span className="text-sheen">Ecuador</span>.
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <div>
            <p className="font-mono text-6xl tracking-[0.02em] text-[#5fd0b0] md:text-7xl">~3 in 10</p>
            <p className="mt-2 max-w-[16rem] font-sans text-sm leading-6 text-[#9ca3af]">
              Ecuadorian workers are employed in agriculture (about 30%, World Bank data, 2023).
            </p>
          </div>
          <p className="font-sans text-base leading-8 text-[#c6ccd7] md:text-lg">
            Farming is one of the biggest sources of work in the country, and bananas, cocoa,
            and flowers are among its leading exports. We have a vendor lined up for our first units, which gives us a path to put
            Owell in front of real farms.
          </p>
        </div>
      </motion.div>
    </section>

    <section className="px-6 py-16 md:py-24">
      <motion.div className="mx-auto max-w-5xl" {...reveal}>
        <Eyebrow>04 / Status</Eyebrow>
        <h2 className="font-mono text-2xl tracking-[0.04em] text-[#e8eaf0] md:text-3xl">
          Built, and now in testing.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {stages.map((stage, index) => (
            <div
              key={stage.title}
              className="rounded-lg border border-[rgba(74,158,255,0.12)] bg-[rgba(255,255,255,0.02)] p-6"
            >
              <p className={`font-mono text-sm uppercase tracking-[0.24em] ${stage.tone}`}>
                0{index + 1} · {stage.title}
              </p>
              <p className="mt-4 font-sans text-lg leading-7 text-[#d5dae3]">{stage.line}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>

    {/* Hidden until there is a real video: set DEMO_VIDEO_SRC above to show it. */}
    {DEMO_VIDEO_SRC && (
      <section className="px-6 py-16 md:py-24">
        <motion.div className="mx-auto max-w-5xl" {...reveal}>
          <Eyebrow>05 / Demo</Eyebrow>
          <video
            className="aspect-video w-full rounded-lg border border-[rgba(74,158,255,0.2)] bg-black"
            src={DEMO_VIDEO_SRC}
            controls
            preload="metadata"
          />
        </motion.div>
      </section>
    )}

    <ContactSection />
  </>
  );
};

export default OwellPage;
