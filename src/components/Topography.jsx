import { motion, useScroll, useTransform } from 'framer-motion';

const W = 1600;
const H = 900;
const LINES = 14;

// Stacked contour lines built from summed sine waves, generated once.
const paths = Array.from({ length: LINES }, (_, i) => {
  const base = 60 + i * 62;
  const points = [];
  for (let x = 0; x <= W; x += 20) {
    const y =
      base +
      Math.sin(x * 0.004 + i * 0.7) * 46 +
      Math.sin(x * 0.011 + i * 1.9) * 18 +
      Math.cos(x * 0.0021 + i * 0.35) * 30;
    points.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
  }
  return points.join(' ');
});

const Topography = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-40 top-[10%] h-[34rem] w-[34rem] rounded-full bg-[#3da88a]/10 blur-[120px]" />
      <div className="absolute -right-40 top-[40%] h-[36rem] w-[36rem] rounded-full bg-[#4a9eff]/10 blur-[130px]" />
      <motion.svg
        style={{ y }}
        className="absolute inset-x-0 -top-10 h-[120%] w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            className="topo-line"
            style={{ '--d': `${16 + (i % 5) * 3}s`, animationDelay: `${-i * 1.3}s` }}
            stroke={i % 3 === 0 ? 'rgba(61,168,138,0.22)' : 'rgba(74,158,255,0.16)'}
            strokeWidth="1.2"
          />
        ))}
      </motion.svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0a0e27_100%)]" />
    </div>
  );
};

export default Topography;
