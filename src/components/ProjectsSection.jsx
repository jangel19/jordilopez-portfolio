import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';

const featuredProjects = [
  {
    title: 'PhysioRecovery',
    badge: 'Production Garmin Connect IQ App',
    image: '/recovery.png',
    description:
      "Recovery scoring app for Garmin wearables built with fixed-point DSP and sensor fusion under tight memory and battery constraints. Implemented in Monkey C to benchmark HRV, Body Battery, and resting heart rate trends against Garmin's proprietary recovery signals while keeping the pipeline lightweight enough for on-device execution.",
    tech: ['Monkey C', 'Fixed-Point DSP', 'Garmin Connect IQ', 'Sensor Fusion'],
    github: 'https://github.com/jangel19/recoveryMaxxing',
    layout: '',
    imageHeight: 'h-48',
    badgeTone: 'text-[#4a9eff]',
  },
  {
    title: 'VITA Health',
    badge: 'Wearable Health Prototype',
    image: '/prototype.png',
    description:
      'Wearable health prototype using ESP32 for heart rate and motion tracking. Implemented C firmware for sensor sampling and BLE transmission. Designed a custom PCB with biometric sensors and haptic feedback.',
    tech: ['ESP32', 'BLE', 'C (Arduino)', 'PCB Design', 'Supabase', 'Git'],
    github: 'https://github.com/jangel19/VITA.git',
    imageHeight: 'h-48',
    badgeTone: 'text-[#3da88a]',
  },
  {
    title: 'Coal2Core',
    badge: 'Most Innovative Idea, Tufts Datathon',
    image: '/ml.png',
    description:
      'ML-first framework for ranking retiring U.S. coal plants for SMR conversion under rising AI energy demand. Built and validated a nested cross-validated RBF-SVR pipeline that achieved a 0.9652 out-of-fold R squared score, stress-tested top candidates with 1,000 Monte Carlo simulations, and identified sites capable of avoiding up to 29 million tons of CO2 annually.',
    tech: ['Machine Learning', 'Scikit-learn', 'RBF-SVR', 'Nested Cross-Validation', 'Monte Carlo', 'Energy Modeling'],
    github: 'https://github.com/jangel19/coal2core-ml-pipeline',
    live: 'https://coal-to-core.vercel.app/',
    imageHeight: 'h-48',
    badgeTone: 'text-[#3da88a]',
  },
];

const secondaryProjects = [
  {
    title: 'Sleepmaxxing',
    description:
      'Offline recovery intelligence engine for weekly summaries, recovery scoring, and short term HRV prediction. Designed for personal wearable data with explainable outputs and reliability tracking. Built as a local first C++ system using mlpack.',
    tech: ['C++', 'mlpack', 'Systems', 'Machine Learning'],
    github: 'https://github.com/jangel19/sleepmaxxing',
    badge: 'Offline ML Engine',
  },
  {
    title: 'SecureDrop',
    description:
      'Secure client-server file transfer with authenticated exchange, encryption, integrity verification, and containerized deployment for reproducible testing.',
    tech: ['C++', 'OpenSSL', 'TCP Sockets', 'Docker'],
    github: 'https://github.com/jangel19/SecureDrop.git',
  },
  {
    title: 'BeforeYouGo',
    description:
      'iOS health companion for Apple Health data review and appointment prep, built around HealthKit sync, conversational logging, and backend summary generation.',
    tech: ['Swift', 'HealthKit', 'Laravel', 'MySQL'],
    github: 'https://github.com/jangel19/beforeyougo',
    badge: '3rd Place, ViTAL Hacks 2026',
  },
  {
    title: 'NightSky',
    description:
      'Custom star-map generator with a Flask backend, local coordinate caching, and a frontend optimized for fast rendering across screen sizes.',
    tech: ['Python', 'Flask', 'AstroPy', 'JavaScript'],
    github: 'https://github.com/jangel19/NightSky.git',
  },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: 'easeOut' },
};

const tagClassName =
  'rounded-md border border-[rgba(74,158,255,0.16)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 font-mono text-[0.72rem] tracking-[0.08em] text-[#c6ccd7]';

const ProjectCard = ({ project }) => (
  <motion.article
    className={`group flex h-full flex-col rounded-lg border border-[rgba(74,158,255,0.1)] bg-[rgba(255,255,255,0.02)] transition-colors duration-300 hover:border-[rgba(74,158,255,0.34)] ${project.layout ?? ''}`}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.22, ease: 'easeOut' }}
  >
    <div className={`overflow-hidden border-b border-[rgba(74,158,255,0.1)] ${project.imageHeight}`}>
      <img
        src={project.image}
        alt={project.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
    <div className="flex flex-1 flex-col p-5 md:p-6">
      <p className={`font-mono text-[0.68rem] uppercase tracking-[0.28em] ${project.badgeTone}`}>
        {project.badge}
      </p>
      <h3 className="mt-4 font-mono text-2xl tracking-[0.04em] text-[#e8eaf0]">
        {project.title}
      </h3>
      <p className="mt-4 font-sans text-[0.95rem] leading-7 text-[#b8c0ce]">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <span key={item} className={tagClassName}>
            {item}
          </span>
        ))}
      </div>
      {(project.github || project.live) && (
        <div className="mt-auto flex items-center gap-3 pt-6">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[rgba(74,158,255,0.1)] bg-[rgba(74,158,255,0.08)] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#e8eaf0] transition-colors duration-300 hover:border-[rgba(74,158,255,0.35)] hover:bg-[rgba(74,158,255,0.14)]"
            >
              Live Site
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[rgba(74,158,255,0.14)] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#c6ccd7] transition-colors duration-300 hover:border-[rgba(74,158,255,0.35)] hover:text-[#e8eaf0]"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      )}
    </div>
  </motion.article>
);

const CompactProjectCard = ({ project }) => (
  <motion.article
    className="flex h-full flex-col rounded-lg border border-[rgba(74,158,255,0.1)] bg-[rgba(255,255,255,0.02)] p-5 transition-colors duration-300 hover:border-[rgba(74,158,255,0.34)]"
    whileHover={{ y: -3 }}
    transition={{ duration: 0.22, ease: 'easeOut' }}
  >
    {project.badge && (
      <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[#3da88a]">
        {project.badge}
      </p>
    )}
    <h3 className="font-mono text-xl tracking-[0.04em] text-[#e8eaf0]">{project.title}</h3>
    <p className="mt-4 font-sans text-[0.95rem] leading-7 text-[#b8c0ce]">{project.description}</p>
    <div className="mt-5 flex flex-wrap gap-2">
      {project.tech.map((item) => (
        <span key={item} className={tagClassName}>
          {item}
        </span>
      ))}
    </div>
    {(project.github || project.live) && (
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[rgba(74,158,255,0.1)] bg-[rgba(74,158,255,0.08)] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#e8eaf0] transition-colors duration-300 hover:border-[rgba(74,158,255,0.35)] hover:bg-[rgba(74,158,255,0.14)]"
            >
              Live Site
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[rgba(74,158,255,0.14)] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#c6ccd7] transition-colors duration-300 hover:border-[rgba(74,158,255,0.35)] hover:text-[#e8eaf0]"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    )}
  </motion.article>
);

const ProjectsSection = () => {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal}>
          <p className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#6b7280]">
            Selected Work
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-3xl font-mono text-3xl tracking-[0.06em] text-[#e8eaf0] md:text-4xl">
              Projects weighted by technical depth, not by template symmetry.
            </h2>
            <p className="max-w-xl font-sans text-base leading-7 text-[#9ca3af]">
              Embedded prototypes, wearable recovery systems, and data-intensive tools
              presented with the same hierarchy I would use in an engineering review.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-14 grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3"
          {...reveal}
        >
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>

        <motion.div
          className="mt-6 grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3"
          {...reveal}
        >
          {secondaryProjects.map((project) => (
            <CompactProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
