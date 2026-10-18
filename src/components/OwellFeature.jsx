import { motion } from 'framer-motion';
import { owell, physioRecovery } from '../data/builds';
import { Badge } from './ui';
import { useReveal, tagClassName } from './uiStyles';

const OwellFeature = () => {
  const reveal = useReveal();
  return (
    <section id="owell" aria-label="Featured work" className="px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl auto-rows-fr gap-6 md:grid-cols-2">
        {[owell, physioRecovery].map((build) => (
          <motion.article key={build.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#5fd0b0]/30 bg-[#0d1730]" {...reveal}>
            <img src={build.image} alt={build.imageAlt} width={build.imageWidth} height={build.imageHeight}
              className={`h-56 w-full border-b border-[#5fd0b0]/20 ${build.id === 'owell' ? 'object-cover' : 'object-contain'}`} loading="lazy" />
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[#9ca3af]">Featured · {build.id === 'owell' ? 'Company' : 'Wearable algorithms'}</p>
              <div><Badge status={build.status} /></div>
              <h2 className="mt-5 font-mono text-3xl text-[#f5f7fa] md:text-4xl">{build.name}{build.headline && <><br /><span className="text-sheen">{build.headline}</span></>}</h2>
              <p className="mt-5 text-lg leading-8 text-[#d5dae3]">{build.pitch}</p>
              <dl className="mt-5 font-mono text-xs uppercase leading-6 tracking-[0.15em] text-[#9ca3af]">
                <div><dt className="sr-only">Role</dt><dd>{build.role}</dd></div>
                {build.dates && <div><dt className="sr-only">Dates</dt><dd>{build.dates}</dd></div>}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">{build.stack.map((item) => <span key={item} className={tagClassName}>{item}</span>)}</div>
              <a href={build.href} className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.2em] text-[#5fd0b0] underline underline-offset-4">
                {build.id === 'owell' ? 'Meet Owell →' : 'PhysioRecovery details ↓'}
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default OwellFeature;
