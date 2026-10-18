import { motion } from 'framer-motion';
import { useReveal } from './uiStyles';

const work = [
  { name: 'PhysioRecovery', href: '#physiorecovery' },
  { name: 'VITA Health', detail: 'ESP32 wearable prototype for heart rate and motion tracking, with BLE transmission.', href: '#vita-health' },
  { name: 'Sleepmaxxing', detail: 'Local C++ models for recovery and HRV trends from personal wearable data.', href: '#sleepmaxxing' },
  { name: 'CACT IMU calibration', detail: 'BNO055 bias correction, Allan deviation analysis, and real-time sensor streaming for wearable motion tracking.', href: '#cact' },
];

export default function WearablesSection() {
  const reveal = useReveal();
  return (
    <section id="wearables" className="scroll-mt-6 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal}>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[#5fd0b0]">Specialty / Algorithms & sensor fusion</p>
          <h2 className="font-mono text-3xl text-[#e8eaf0] md:text-4xl">Wearables and biosignals</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {work.map((item) => (
              <a key={item.name} href={item.href} className="rounded-lg border border-[#4a9eff]/20 bg-white/[0.02] p-6 transition-colors hover:border-[#4a9eff]/60">
                <h3 className="font-mono text-xl text-[#e8eaf0]">{item.name} <span aria-hidden="true" className="text-[#5fd0b0]">↓</span></h3>
                {item.detail && <p className="mt-3 text-base leading-7 text-[#b8c0ce]">{item.detail}</p>}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
