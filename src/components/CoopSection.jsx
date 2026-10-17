import { motion } from 'framer-motion';
import { SectionHeading } from './ui';
import { reveal, tagClassName } from './uiStyles';

// IP-cleared copy. Do not edit wording, add detail, numbers, names, or links.
const COOP_INTRO =
  'I work on test engineering and internal tooling, building software that removes manual steps from hardware work. I use AI coding tools and own the parts that matter: requirements, design decisions, testing, and catching what the tool gets wrong.';

const coopProjects = [
  {
    name: 'Test-result entry app',
    body: 'Replaced spreadsheet forms with validated entry. A Windows desktop app with required-field and unit checks and offline-first storage. Prototype, about 47 automated tests passing.',
    stack: ['C#', '.NET', 'SQLite', 'xUnit'],
  },
  {
    name: 'Datasheet comparison tool',
    body: 'Compares specs across component datasheets with source-page references and Excel export. Runs end to end on samples.',
    stack: ['Python', 'FastAPI', 'React'],
  },
  {
    name: 'Test-station scheduler',
    body: 'A self-hosted web app for reserving shared equipment, with a small status agent. Working prototype.',
    stack: ['C#', 'ASP.NET', 'SQLite'],
  },
  {
    name: 'Data pipeline',
    body: 'Turned inconsistent Excel forms into one regenerable review workbook.',
    stack: ['Python', 'openpyxl'],
  },
];

const CoopSection = () => (
  <section id="co-op" className="scroll-mt-4 px-6 py-16 md:py-24">
    <div className="mx-auto max-w-6xl">
      <motion.div {...reveal}>
        <SectionHeading eyebrow="Co-op" title="Hardware engineering co-op" />
        <p className="mt-6 max-w-3xl font-sans text-base leading-8 text-[#c6ccd7] md:text-lg">
          {COOP_INTRO}
        </p>
      </motion.div>
      <ul className="mt-12 grid auto-rows-fr gap-6 md:grid-cols-2">
        {coopProjects.map((project) => (
          <motion.li
            key={project.name}
            className="flex flex-col rounded-lg border border-[rgba(74,158,255,0.1)] bg-[rgba(255,255,255,0.02)] p-5 md:p-6"
            {...reveal}
          >
            <h3 className="font-mono text-xl tracking-[0.04em] text-[#e8eaf0]">{project.name}</h3>
            <p className="mt-3 font-sans text-[0.95rem] leading-7 text-[#b8c0ce]">{project.body}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              {project.stack.map((item) => (
                <span key={item} className={tagClassName}>
                  {item}
                </span>
              ))}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

export default CoopSection;
