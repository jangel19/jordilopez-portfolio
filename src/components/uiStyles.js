export const tagClassName =
  'rounded-md border border-[rgba(74,158,255,0.16)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 font-mono text-[0.72rem] tracking-[0.08em] text-[#c6ccd7]';

export const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: 'easeOut' },
};
