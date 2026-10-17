import { motion } from 'framer-motion';
import { FaCalendarCheck, FaClipboardCheck, FaFileExcel, FaTable } from 'react-icons/fa';
import Spotlight from './Spotlight';
import { SectionHeading } from './ui';
import { reveal, tagClassName } from './uiStyles';

// IP-cleared copy. Do not edit wording, add detail, numbers, names, or links.
const COOP_INTRO_1 =
  'I work on test engineering and internal tooling, building software that removes manual steps from hardware work.';
const COOP_INTRO_2 =
  'I use AI coding tools and own the parts that matter: requirements, design decisions, testing, and catching what the tool gets wrong.';

// `lead` and `rest` are the cleared sentences, split only for emphasis.
const coopProjects = [
  {
    name: 'Test-result entry app',
    Icon: FaClipboardCheck,
    lead: 'Replaced spreadsheet forms with validated entry.',
    rest: 'A Windows desktop app with required-field and unit checks and offline-first storage. Prototype, about 47 automated tests passing.',
    stack: ['C#', '.NET', 'SQLite', 'xUnit'],
  },
  {
    name: 'Datasheet comparison tool',
    Icon: FaFileExcel,
    lead: 'Compares specs across component datasheets with source-page references and Excel export.',
    rest: 'Runs end to end on samples.',
    stack: ['Python', 'FastAPI', 'React'],
  },
  {
    name: 'Test-station scheduler',
    Icon: FaCalendarCheck,
    lead: 'A self-hosted web app for reserving shared equipment, with a small status agent.',
    rest: 'Working prototype.',
    stack: ['C#', 'ASP.NET', 'SQLite'],
  },
  {
    name: 'Data pipeline',
    Icon: FaTable,
    lead: 'Turned inconsistent Excel forms into one regenerable review workbook.',
    rest: '',
    stack: ['Python', 'openpyxl'],
  },
];

const CoopSection = () => (
  <section id="co-op" className="scroll-mt-4 px-6 py-16 md:py-24">
    <div className="mx-auto max-w-6xl">
      <motion.div {...reveal}>
        <SectionHeading eyebrow="02 / Co-op" title="Hardware engineering co-op" />
        <div className="mt-8 grid gap-6 border-l-2 border-[#5fd0b0] pl-6 md:max-w-4xl md:pl-8">
          <p className="font-mono text-xl leading-snug text-[#f5f7fa] md:text-3xl md:leading-snug">
            {COOP_INTRO_1}
          </p>
          <p className="font-sans text-base leading-8 text-[#c6ccd7] md:text-lg">{COOP_INTRO_2}</p>
        </div>
      </motion.div>
      <ul className="mt-14 grid auto-rows-fr gap-6 md:grid-cols-2">
        {coopProjects.map(({ name, Icon, lead, rest, stack }, index) => (
          <li key={name}>
            <Spotlight
              className="h-full rounded-xl border border-[rgba(74,158,255,0.14)] bg-[rgba(255,255,255,0.025)] p-6 transition-colors hover:border-[rgba(95,208,176,0.45)] md:p-8"
              whileHover={{ y: -4 }}
              {...reveal}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[rgba(95,208,176,0.35)] bg-[rgba(61,168,138,0.1)] text-xl text-[#5fd0b0]">
                  <Icon aria-hidden="true" />
                </span>
                <span className="font-mono text-sm tracking-[0.2em] text-[#6b7280]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-6 font-mono text-2xl tracking-[0.03em] text-[#f5f7fa]">{name}</h3>
              <p className="mt-4 font-sans text-lg leading-7 text-[#e1e5ec]">{lead}</p>
              {rest && (
                <p className="mt-2 font-sans text-[0.95rem] leading-7 text-[#aab3c2]">{rest}</p>
              )}
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {stack.map((item) => (
                  <span key={item} className={tagClassName}>
                    {item}
                  </span>
                ))}
              </div>
            </Spotlight>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default CoopSection;
