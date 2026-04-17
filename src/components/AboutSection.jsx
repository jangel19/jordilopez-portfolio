import { motion } from 'framer-motion';

const skillColumns = [
  {
    title: 'EMBEDDED SYSTEMS',
    items: [
      'ESP32/nRF52 firmware',
      'I2C/SPI protocols',
      'BLE (GATT/GAP)',
      'Real-time constraints',
      'Power optimization',
    ],
  },
  {
    title: 'SIGNAL PROCESSING',
    items: [
      'IMU calibration (BNO055)',
      'HRV/RHR analysis',
      'Z-score normalization',
      'Adaptive baselines',
      'Allan deviation',
    ],
  },
  {
    title: 'LANGUAGES & TOOLS',
    items: [
      'C/C++ (primary)',
      'Python (analysis)',
      'Monkey C (Garmin)',
      'Git, Neovim, Debian',
    ],
  },
  {
    title: 'MATHEMATICS',
    items: [
      'Linear regression',
      'Stochastic processes',
      'Time series analysis',
      'Statistical modeling',
    ],
  },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: 'easeOut' },
};

const AboutSection = () => {
  return (
    <section id="AboutSection" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start"
          {...reveal}
        >
          <div>
            <p className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#6b7280]">
              About
            </p>
            <h2 className="max-w-2xl font-mono text-3xl tracking-[0.06em] text-[#e8eaf0] md:text-4xl">
              Embedded systems and biosignal work grounded in research.
            </h2>
            <div className="mt-8 space-y-6 font-sans text-base leading-8 text-[#c6ccd7] md:text-lg">
              <p>
                I'm a sophomore at UMass Lowell double-majoring in Computer Science
                and Applied Mathematics & Statistics. I build embedded
                systems for wearable health technology, from firmware on ESP32
                microcontrollers to recovery algorithms processing biosignal data.
              </p>
              <p>
                I conduct undergraduate research on IMU sensor calibration at the
                Center for Advanced Computation and Telecommunications, focusing on
                bias correction for motion tracking in wearable devices. I implement
                sensor fusion and adaptive baselines based on peer-reviewed research
                on athletic performance and overtraining syndrome.
              </p>
              <p>
                My work spans embedded firmware, statistical signal processing, and
                machine learning, building systems that turn raw sensor data into
                actionable insights.
              </p>
            </div>
          </div>

          <div className="lg:pt-14">
            <div className="overflow-hidden rounded-lg border border-[rgba(74,158,255,0.14)] bg-[rgba(255,255,255,0.02)]">
              <img
                src="/photo.jpeg"
                alt="Jordi Lopez"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-20 grid gap-10 md:grid-cols-2"
          {...reveal}
        >
          {skillColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 font-mono text-sm tracking-[0.28em] text-[#4a9eff]">
                {column.title}
              </h3>
              <ul className="space-y-3 font-sans text-[0.98rem] text-[#c6ccd7]">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#3da88a]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
