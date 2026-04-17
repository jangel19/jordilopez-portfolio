import { motion } from 'framer-motion';

const experiences = [
  {
    role: 'Vice President & Co-Founder',
    organization: 'Artificial Intelligence Multidisciplinary Society (AIM)',
    location: 'UMass Lowell',
    type: 'Leadership',
    dates: 'Mar 2026 - Present',
    description: [
      'Co-founded cross-disciplinary AI organization connecting students across CS, business, health sciences, and engineering to explore AI applications in their fields',
      'Lead technical workshops on AI applications in wearable health technology and organize speaker events with industry professionals',
      'Coordinate development of AI-powered course advisor tool for UMass Lowell students to optimize degree planning',
    ],
    tech: [],
  },
  {
    role: 'Undergraduate Research Assistant',
    organization: 'Center for Advanced Computation and Telecommunications',
    location: 'UMass Lowell',
    type: 'Research',
    dates: 'Feb 2026 - Present',
    description: [
      'Characterizing bias offset and drift in BNO055 IMU sensors over I2C on embedded Linux for motion tracking in wearable devices',
      'Implementing real-time rolling deque calibration in C++ and Python to compute per-axis bias coefficients and reduce position error',
      'Decomposing sensor error into systematic and stochastic components through Allan deviation analysis and noise characterization',
      'Building end-to-end data pipelines with TCP streaming, CSV logging, and live PyQtGraph visualization for multi-session validation',
    ],
    tech: ['C++', 'Python', 'I2C', 'Embedded Linux', 'TCP Sockets', 'Allan Deviation'],
  },
  {
    role: 'Cloud Software Engineering & AI Automation Intern',
    organization: 'X Agency',
    location: 'Remote',
    type: 'Internship',
    dates: 'Aug 2025 - Nov 2025',
    description: [
      'Developed automated testing frameworks for Python services in production environment',
      'Implemented structured logging, data validation, and regression testing with documented protocols',
      'Collaborated in Agile development with code reviews and version control management',
    ],
    tech: ['Python', 'AWS', 'AWS Lambda', 'Testing Frameworks'],
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

const ExperienceSection = () => {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div {...reveal}>
          <p className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#6b7280]">
            Professional Experience
          </p>
          <h2 className="font-mono text-3xl tracking-[0.06em] text-[#e8eaf0] md:text-4xl">
            Research, leadership, and industry work.
          </h2>
        </motion.div>

        <div className="relative mt-14">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-[rgba(74,158,255,0.16)]" />

          <div className="space-y-12">
            {experiences.map((experience) => (
              <motion.article
                key={`${experience.organization}-${experience.role}`}
                className="relative pl-10"
                {...reveal}
              >
                <div className="absolute left-0 top-2 h-4 w-4 rounded-full border border-[rgba(74,158,255,0.25)] bg-[#4a9eff]" />

                <p className="font-mono text-2xl tracking-[0.05em] text-[#e8eaf0]">
                  {experience.organization}
                </p>
                <p className="mt-2 font-sans text-lg text-[#9ca3af]">{experience.role}</p>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.24em] text-[#6b7280]">
                  <span>{experience.dates}</span>
                  <span>•</span>
                  <span>{experience.type}</span>
                  <span>•</span>
                  <span>{experience.location}</span>
                </div>

                <ul className="mt-6 space-y-3 font-sans text-base leading-relaxed text-[#b8c0ce]">
                  {experience.description.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-[#4a9eff]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {experience.tech.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {experience.tech.map((item) => (
                      <span key={item} className={tagClassName}>
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
