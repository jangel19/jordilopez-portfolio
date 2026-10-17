import { motion } from 'framer-motion';
import { owell, TODO } from '../data/builds';
import ContactSection from './ContactSection';
import { Badge, MaybeTodo } from './ui';
import { reveal, tagClassName } from './uiStyles';

// Swap in a video file path (e.g. '/owell-demo.mp4') to replace the placeholder.
const DEMO_VIDEO_SRC = null;

const architecture = [
  {
    name: 'Device',
    detail: 'ESP32-S3 firmware. Runs schedules offline and drives the valves.',
    built: true,
  },
  { name: 'MQTT', detail: 'AWS IoT Core carries messages both ways.', built: true, link: true },
  {
    name: 'Backend',
    detail: 'Go service on EC2 with a Postgres device registry and a scheduling endpoint.',
    built: true,
  },
  { name: 'App', detail: 'iOS app for pairing, valve control, and schedules.', built: false },
];

const roadmap = [
  {
    title: "What's built",
    tone: 'text-[#5fd0b0]',
    items: [
      'ESP32-S3 firmware with offline-first schedule execution',
      'NVS-persisted schedules, NTP sync with internal clock fallback',
      'Per-valve duration control',
      'Go backend on EC2 with MQTT over AWS IoT Core',
      'Postgres device registry and a custom scheduling endpoint',
      TODO('confirm this list matches what is actually working today'),
    ],
  },
  {
    title: 'Next',
    tone: 'text-[#fbbf5a]',
    items: [
      'iOS app: pairing, valve control, custom schedules',
      TODO('engineer-facing ops dashboard: confirm status (next / later)'),
      TODO('other near-term milestones'),
    ],
  },
  {
    title: 'Later',
    tone: 'text-[#7db8ff]',
    items: [
      'Deployment in Ecuador (current target)',
      TODO('sensing and automation beyond scheduled irrigation'),
    ],
  },
];

const Arrow = ({ label }) => (
  <div
    className="flex flex-none items-center justify-center py-1 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#7db8ff] md:px-1 md:py-0"
    aria-hidden="true"
  >
    <span className="rotate-90 text-xl md:rotate-0">{label ?? '→'}</span>
  </div>
);

const Architecture = () => (
  <ol
    className="mt-8 flex flex-col items-stretch md:flex-row"
    aria-label="Architecture: device to MQTT to backend to app"
  >
    {architecture.map((node, index) => (
      <li key={node.name} className="contents">
        {index > 0 && <Arrow />}
        <div
          className={`flex-1 rounded-lg border p-4 ${
            node.built
              ? 'border-[rgba(74,158,255,0.35)] bg-[rgba(74,158,255,0.06)]'
              : 'border-dashed border-[rgba(251,191,90,0.5)] bg-[rgba(255,255,255,0.02)]'
          }`}
        >
          <p className="font-mono text-lg tracking-[0.06em] text-[#e8eaf0]">{node.name}</p>
          <p className="mt-2 font-sans text-sm leading-6 text-[#b8c0ce]">{node.detail}</p>
          <p
            className={`mt-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] ${
              node.built ? 'text-[#5fd0b0]' : 'text-[#fbbf5a]'
            }`}
          >
            {node.built ? 'Built' : 'Next'}
          </p>
        </div>
      </li>
    ))}
  </ol>
);

const Eyebrow = ({ children }) => (
  <p className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#9ca3af]">
    {children}
  </p>
);

const OwellPage = () => (
  <>
    <header className="px-6 pb-12 pt-8 md:pb-20">
      <div className="mx-auto max-w-4xl">
        <a
          href="#builds"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#9ca3af] transition-colors hover:text-[#e8eaf0]"
        >
          ← All builds
        </a>
        <div className="mt-14">
          <Badge status={owell.status} />
        </div>
        <h1 className="mt-6 font-mono text-4xl leading-tight tracking-[0.03em] text-[#e8eaf0] md:text-6xl">
          {owell.headline}
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-lg leading-8 text-[#c6ccd7] md:text-xl">
          {owell.pitch}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {owell.stack.map((item) => (
            <span key={item} className={tagClassName}>
              {item}
            </span>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-[#9ca3af]">
          <MaybeTodo>{owell.role}</MaybeTodo> · <MaybeTodo>{owell.dates}</MaybeTodo>
        </p>
      </div>
    </header>

    <section className="px-6 py-12 md:py-16">
      <motion.div className="mx-auto max-w-4xl" {...reveal}>
        <Eyebrow>The problem</Eyebrow>
        <h2 className="font-mono text-2xl tracking-[0.04em] text-[#e8eaf0] md:text-3xl">
          Running a farm takes a lot of people, and much of it is watching and reacting.
        </h2>
        <p className="mt-6 max-w-3xl font-sans text-base leading-8 text-[#c6ccd7] md:text-lg">
          A crew walks the fields, checks conditions, decides what needs water, and then goes and
          does it. Most of that loop is attention, not skill. Owell moves the watching, the
          deciding, and the doing onto devices so people can spend their time on the work that
          needs them.
        </p>
        <p className="mt-4 font-sans text-sm leading-7 text-[#9ca3af]">
          <MaybeTodo>
            {TODO('add a sourced figure for how many people it takes to run a farm, or leave it out')}
          </MaybeTodo>
        </p>
      </motion.div>
    </section>

    <section className="px-6 py-12 md:py-16">
      <motion.div className="mx-auto max-w-5xl" {...reveal}>
        <Eyebrow>How it works</Eyebrow>
        <h2 className="font-mono text-2xl tracking-[0.04em] text-[#e8eaf0] md:text-3xl">
          Device → MQTT → backend → app
        </h2>
        <Architecture />
      </motion.div>
    </section>

    <section className="px-6 py-12 md:py-16">
      <motion.div className="mx-auto max-w-5xl" {...reveal}>
        <Eyebrow>Status</Eyebrow>
        <h2 className="font-mono text-2xl tracking-[0.04em] text-[#e8eaf0] md:text-3xl">
          Built, next, later.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {roadmap.map((column) => (
            <div
              key={column.title}
              className="rounded-lg border border-[rgba(74,158,255,0.1)] bg-[rgba(255,255,255,0.02)] p-5"
            >
              <h3 className={`font-mono text-sm uppercase tracking-[0.24em] ${column.tone}`}>
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3 font-sans text-[0.95rem] leading-6 text-[#b8c0ce]">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className={column.tone} aria-hidden="true">
                      •
                    </span>
                    <span>
                      <MaybeTodo>{item}</MaybeTodo>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </section>

    <section className="px-6 py-12 md:py-16">
      <motion.div className="mx-auto max-w-5xl" {...reveal}>
        <Eyebrow>Demo</Eyebrow>
        {DEMO_VIDEO_SRC ? (
          <video
            className="aspect-video w-full rounded-lg border border-[rgba(74,158,255,0.2)] bg-black"
            src={DEMO_VIDEO_SRC}
            controls
            preload="metadata"
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[rgba(74,158,255,0.3)] bg-[rgba(255,255,255,0.02)] p-6 text-center">
            <Badge label="Demo coming" tone="amber" />
            <p className="max-w-md font-sans text-sm leading-6 text-[#9ca3af]">
              A walkthrough video of the device and backend will live here.
            </p>
          </div>
        )}
      </motion.div>
    </section>

    <div id="contact">
      <ContactSection />
    </div>
  </>
);

export default OwellPage;
