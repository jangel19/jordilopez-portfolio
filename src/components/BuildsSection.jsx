import { motion } from 'framer-motion';
import { builds } from '../data/builds';
import Spotlight from './Spotlight';
import { Badge, MaybeTodo, SectionHeading } from './ui';
import { useReveal, tagClassName } from './uiStyles';

const BuildCard = ({ build }) => {
  const reveal = useReveal();
  const external = !build.internal;
  return (
    <Spotlight
      className="h-full rounded-lg border border-[rgba(74,158,255,0.1)] bg-[rgba(255,255,255,0.02)] p-5 transition-colors duration-300 focus-within:border-[rgba(74,158,255,0.5)] hover:border-[rgba(74,158,255,0.34)] md:p-6"
      whileHover={{ y: -4 }}
      {...reveal}
    >
      <div>
        <Badge status={build.status} />
      </div>
      <h3 className="mt-4 font-mono text-2xl tracking-[0.04em] text-[#e8eaf0]">{build.name}</h3>
      <p className="mt-3 font-sans text-[0.95rem] leading-7 text-[#b8c0ce]">{build.pitch}</p>
      <dl className="mt-5 space-y-1 font-mono text-xs uppercase tracking-[0.18em] text-[#9ca3af]">
        <div className="flex gap-2">
          <dt className="sr-only">Role</dt>
          <dd>
            <MaybeTodo>{build.role}</MaybeTodo>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Dates</dt>
          <dd>
            <MaybeTodo>{build.dates}</MaybeTodo>
          </dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2">
        {build.stack.map((item) => (
          <span key={item} className={tagClassName}>
            <MaybeTodo>{item}</MaybeTodo>
          </span>
        ))}
      </div>
      {build.href && (
      <div className="mt-auto pt-6">
          <a
            href={build.href}
            aria-label={`View ${build.name}${build.linkLabel ? ` on ${build.linkLabel}` : ''}`}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center rounded-md border border-[rgba(74,158,255,0.2)] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#c6ccd7] transition-colors duration-300 hover:border-[rgba(74,158,255,0.5)] hover:text-[#e8eaf0]"
          >
            {build.id === 'owell'
              ? 'Owell page →'
              : build.id === 'coop'
                ? 'What I build →'
                : `${build.linkLabel ?? 'Visit'} ↗`}
          </a>
        </div>
      )}
    </Spotlight>
  );
};

const BuildsSection = () => {
  const reveal = useReveal();
  return (
  <section id="builds" className="scroll-mt-4 px-6 py-16 md:py-24">
    <div className="mx-auto max-w-6xl">
      <motion.div {...reveal}>
        <SectionHeading eyebrow="01 / Builds" title="Things in motion.">
          <p className="max-w-xl font-sans text-base leading-7 text-[#9ca3af]">
            What I&apos;m building, researching, or running right now, with an honest status on each.
          </p>
        </SectionHeading>
      </motion.div>
      <div className="mt-12 grid auto-rows-fr gap-6 md:grid-cols-2">
        {builds.map((build) => (
          <BuildCard key={build.id} build={build} />
        ))}
      </div>
    </div>
  </section>
  );
};

export default BuildsSection;
