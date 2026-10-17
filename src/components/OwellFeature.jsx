import { motion } from 'framer-motion';
import { owell } from '../data/builds';
import { Badge, MaybeTodo } from './ui';
import { reveal, tagClassName } from './uiStyles';

const OwellFeature = () => (
  <section id="owell" className="px-6 py-16 md:py-24">
    <div className="mx-auto max-w-6xl">
      <motion.p
        className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#9ca3af]"
        {...reveal}
      >
        Featured build
      </motion.p>
      <motion.a
        href={owell.href}
        className="group grid overflow-hidden rounded-lg border border-[rgba(74,158,255,0.25)] bg-[rgba(255,255,255,0.02)] transition-colors duration-300 hover:border-[rgba(74,158,255,0.55)] lg:grid-cols-[1.15fr_0.85fr]"
        {...reveal}
      >
        <div className="flex flex-col p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge status={owell.status} />
          </div>
          <h2 className="mt-6 font-mono text-3xl tracking-[0.03em] text-[#e8eaf0] md:text-5xl">
            {owell.headline}
          </h2>
          <p className="mt-5 max-w-xl font-sans text-lg leading-8 text-[#c6ccd7]">{owell.pitch}</p>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-[#9ca3af]">
            <span>
              <MaybeTodo>{owell.role}</MaybeTodo>
            </span>
            <span>
              <MaybeTodo>{owell.dates}</MaybeTodo>
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {owell.stack.map((item) => (
              <span key={item} className={tagClassName}>
                {item}
              </span>
            ))}
          </div>
          <span className="mt-8 inline-flex items-center font-mono text-xs uppercase tracking-[0.2em] text-[#7db8ff] transition-transform duration-300 group-hover:translate-x-1">
            Read the Owell story →
          </span>
        </div>
        <div className="relative aspect-[3/2] lg:aspect-auto">
          <img
            src="/owell.webp"
            alt="A center-pivot irrigation rig watering a green crop field"
            width="612"
            height="408"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </motion.a>
    </div>
  </section>
);

export default OwellFeature;
