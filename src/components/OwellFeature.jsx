import { motion } from 'framer-motion';
import { owell } from '../data/builds';
import { Badge, MaybeTodo } from './ui';
import { reveal, tagClassName } from './uiStyles';

const OwellFeature = () => (
  <section id="owell" className="px-6 py-16 md:py-28">
    <div className="mx-auto max-w-6xl">
      <motion.a
        href={owell.href}
        className="group relative block overflow-hidden rounded-2xl border border-[rgba(95,208,176,0.3)] shadow-[0_30px_120px_rgba(61,168,138,0.12)] transition-all duration-500 hover:border-[rgba(95,208,176,0.6)] hover:shadow-[0_30px_140px_rgba(61,168,138,0.25)]"
        {...reveal}
      >
        <img
          src="/owell.webp"
          alt=""
          width="612"
          height="408"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#0a0e27_8%,rgba(10,14,39,0.88)_45%,rgba(10,14,39,0.35)_100%)]" />
        <div className="relative flex min-h-[28rem] flex-col justify-end p-6 md:min-h-[34rem] md:p-14">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#9ca3af]">
              Featured · Company
            </p>
            <Badge status={owell.status} />
          </div>
          <h2 className="mt-6 max-w-2xl font-mono text-4xl leading-[1.05] tracking-[0.02em] text-[#f5f7fa] md:text-7xl">
            Owell.
            <br />
            <span className="text-sheen">Farms that just run.</span>
          </h2>
          <p className="mt-6 max-w-xl font-sans text-lg leading-8 text-[#d5dae3] md:text-xl">
            {owell.pitch}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#c6ccd7]">
              <MaybeTodo>{owell.role}</MaybeTodo> · <MaybeTodo>{owell.dates}</MaybeTodo>
            </span>
            {owell.stack.map((item) => (
              <span key={item} className={`${tagClassName} bg-[rgba(10,14,39,0.6)]`}>
                {item}
              </span>
            ))}
          </div>
          <span className="mt-8 inline-flex items-center font-mono text-xs uppercase tracking-[0.2em] text-[#5fd0b0] transition-transform duration-300 group-hover:translate-x-2">
            Meet Owell →
          </span>
        </div>
      </motion.a>
    </div>
  </section>
);

export default OwellFeature;
