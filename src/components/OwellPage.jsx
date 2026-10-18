import { motion } from 'framer-motion';
import { owell } from '../data/builds';
import ContactSection from './ContactSection';
import { Badge } from './ui';
import { useReveal, tagClassName } from './uiStyles';

// Swap in a video file path (e.g. '/owell-demo.mp4') to replace the placeholder.
const DEMO_VIDEO_SRC = null;
// Set a local image path when a real device photo is available.
const DEVICE_PHOTO_SRC = null;
// Hidden by default in production; development retains the asset slots.
const SHOW_PLACEHOLDERS = import.meta.env.DEV === true;

const stages = [
  { title: 'Built', tone: 'text-[#5fd0b0]', line: 'The field device firmware and backend are complete. The iOS app UI and communication are finalized.' },
  { title: 'Testing now', tone: 'text-[#fbbf5a]', line: 'Water flow delivery is in end-to-end testing.' },
  { title: 'Next', tone: 'text-[#7db8ff]', line: 'Next: expanding what the device delivers and testing in the field.' },
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
          <span className="text-sheen">{owell.headline}</span>
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-xl leading-9 text-[#d5dae3] md:text-2xl">
          {owell.pitch}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c6ccd7]">
            {owell.role} · {owell.dates}
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
          We build field sensing and water delivery.
        </h2>
        <div className="mt-8 space-y-5 text-lg leading-8 text-[#c6ccd7]">
          <p>Owell combines a field device, backend, and iOS app for pH sensing and water flow delivery.
            Nutrient and crop-treatment delivery are planned. We’re starting with flowers, with plans to support other crops.</p>
          <p>I co-founded Owell with <strong className="text-[#e8eaf0]">Alejandro Granda</strong>.
            His background is in electrical engineering at UMass Lowell, with a master’s at Northeastern.</p>
          <div className="border-l-2 border-[#5fd0b0]/50 pl-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#5fd0b0]">Long-term goal</p>
            <p className="mt-3">Long term, we want farms where routine irrigation doesn’t need a crew.</p>
          </div>
          <div className="pt-6">
            <h3 className="font-mono text-2xl text-[#e8eaf0]">The problem</h3>
            <p className="mt-4">Irrigation currently depends on people checking conditions and setting water delivery by hand.
              Owell measures pH and delivers water through irrigation. Nutrient and crop-treatment delivery are planned.</p>
          </div>
        </div>
      </motion.div>
    </section>

    <section className="px-6 py-16 md:py-24">
      <motion.div className="mx-auto max-w-5xl" {...reveal}>
        <Eyebrow>02 / How it works</Eyebrow>
        <h2 className="font-mono text-2xl md:text-3xl">From field readings to the app.</h2>
        <ol aria-label="Owell system architecture" className="mt-8 grid gap-3 sm:grid-cols-3">
          {['Field device', 'Backend', 'iOS app'].map((part, index) => (
            <li key={part} className="rounded-lg border border-[#5fd0b0]/30 bg-[#3da88a]/5 p-5 font-mono text-sm">
              <span className="mb-3 block text-xs text-[#5fd0b0]">0{index + 1}</span>
              {part}{index < 2 && <span aria-hidden="true" className="ml-3 text-[#5fd0b0]">→</span>}
            </li>
          ))}
        </ol>
        <ul className="mt-8 space-y-5 text-base leading-8 text-[#c6ccd7]">
          <li><strong>Measurements:</strong> pH is measured to verify conditions during feeding. It monitors delivery and does not control it.</li>
          <li><strong>Delivery:</strong> water flow through irrigation. Nutrient and crop-treatment delivery are planned.</li>
          <li><strong>iOS app:</strong> UI and communication are finalized. The app communicates with the backend.</li>
        </ul>
      </motion.div>
    </section>

    <section className="px-6 py-16 md:py-24">
      <motion.div className="mx-auto max-w-5xl" {...reveal}>
        <Eyebrow>03 / Status</Eyebrow>
        <h2 className="font-mono text-2xl tracking-[0.04em] text-[#e8eaf0] md:text-3xl">
          Status
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

    <section className="px-6 py-16 md:py-24">
      <motion.div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[rgba(95,208,176,0.25)] bg-[rgba(61,168,138,0.05)] p-8 md:p-14"
        {...reveal}
      >
        <Eyebrow>04 / Where we&apos;re headed</Eyebrow>
        <h2 className="font-mono text-3xl leading-tight tracking-[0.02em] text-[#f5f7fa] md:text-5xl">
          Our first planned deployment is in <span className="text-sheen">Ecuador</span>.
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
          <div>
            <p className="font-mono text-6xl tracking-[0.02em] text-[#5fd0b0] md:text-7xl">32.5%</p>
            <p className="mt-2 max-w-[16rem] font-sans text-sm leading-6 text-[#9ca3af]">
              of total employment in Ecuador is in agriculture (2025 modeled ILO estimate).{' '}
              <a className="underline underline-offset-4 text-[#c6ccd7]" href="https://data.worldbank.org/indicator/SL.AGR.EMPL.ZS?locations=EC" target="_blank" rel="noopener noreferrer">World Bank source ↗</a>
            </p>
          </div>
          <p className="font-sans text-base leading-8 text-[#c6ccd7] md:text-lg">
            Ecuador is where we plan to take Owell into the field first, after system confirmation and field baseline collection.
          </p>
        </div>
      </motion.div>
    </section>

    {(DEVICE_PHOTO_SRC || DEMO_VIDEO_SRC || SHOW_PLACEHOLDERS) && <section className="px-6 py-16 md:py-24">
      <motion.div className="mx-auto max-w-5xl" {...reveal}>
        {(DEVICE_PHOTO_SRC || SHOW_PLACEHOLDERS) && <figure className="mb-12">
          {DEVICE_PHOTO_SRC ? (
            <img src={DEVICE_PHOTO_SRC} alt="Owell field device" className="aspect-[4/3] w-full rounded-lg border border-[#5fd0b0]/30 object-contain" loading="lazy" />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-[#5fd0b0]/40 bg-[#3da88a]/5 p-6 text-center">
              <p className="font-mono text-lg text-[#5fd0b0]">Device photo coming</p>
            </div>
          )}
          <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[#9ca3af]">Owell field device</figcaption>
        </figure>}
        {(DEMO_VIDEO_SRC || SHOW_PLACEHOLDERS) && <>
        <Eyebrow>05 / Demo</Eyebrow>
        {DEMO_VIDEO_SRC ? (
          <video className="aspect-video w-full rounded-lg border border-[#4a9eff]/20 bg-black"
            src={DEMO_VIDEO_SRC} controls preload="metadata" aria-label="Owell system demo" />
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[#5fd0b0]/40 bg-[#3da88a]/5 p-6 text-center">
            <p className="font-mono text-xl text-[#5fd0b0]">Demo coming</p>
            <p className="max-w-md text-sm leading-7 text-[#c6ccd7]">An end-to-end system recording is coming.</p>
          </div>
        )}
        </>}
      </motion.div>
    </section>}

    <ContactSection />
  </>
  );
};

export default OwellPage;
