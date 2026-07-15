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
      'C/C++',
      'Python',
      'Monkey C (Garmin)',
      'Git, Neovim, Debian',
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
              ML systems and embedded software grounded in real deployment.
            </h2>
            <div className="mt-8 space-y-6 font-sans text-base leading-8 text-[#c6ccd7] md:text-lg">
              <p>
                I'm a junior at UMass Lowell double-majoring in Computer Science
      and Applied Mathematics & Statistics. Currently on a Hardware Engineering co-op at Teradyne.
              </p>
      <p>
      Developed a graduate advising intelligence platform for UMass Lowell's Kennedy College of Sciences, risk scoring, cohort anomaly detection, and advisor behavior modeling on top of live student data.
      </p>
              <p>
                Previously built bias correction pipelines and real-time TCP streaming systems for IMU sensor calibration at CACT, supporting wearable motion tracking research.
              </p>
              <p>
                My work spans embedded firmware, ML deployment, and statistical signal processing, building systems that go from raw sensor data to production.
              </p>
            </div>
          </div>

          <div className="lg:pt-14">
            <div className="overflow-hidden rounded-lg border border-[rgba(74,158,255,0.14)] bg-[rgba(255,255,255,0.02)]">
              <img
                src="/newphoto.jpeg"
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
