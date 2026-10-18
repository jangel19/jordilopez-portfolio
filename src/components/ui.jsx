import { STATUS } from '../data/builds';

const TONES = {
  amber: 'border-[#f59e0b]/50 bg-[#f59e0b]/10 text-[#fbbf5a]',
  green: 'border-[#3da88a]/50 bg-[#3da88a]/10 text-[#5fd0b0]',
  blue: 'border-[#4a9eff]/50 bg-[#4a9eff]/10 text-[#7db8ff]',
  gray: 'border-[#6b7280]/50 bg-white/5 text-[#c6ccd7]',
};

export const Badge = ({ status, label, tone }) => {
  const preset = STATUS[status] ?? {};
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.2em] ${TONES[tone ?? preset.tone ?? 'gray']}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label ?? preset.label}
    </span>
  );
};

export const SectionHeading = ({ eyebrow, title, children }) => (
  <>
    <p className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#9ca3af]">
      {eyebrow}
    </p>
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <h2 className="max-w-3xl font-mono text-3xl tracking-[0.06em] text-[#e8eaf0] md:text-4xl">
        {title}
      </h2>
      {children}
    </div>
  </>
);
