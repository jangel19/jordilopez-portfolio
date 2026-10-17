// Single source of truth for the builds section and the Owell featured card.
// Anything marked TODO is a placeholder that needs real details.

export const TODO = (what) => `TODO: ${what}`;

export const STATUS = {
  'in-development': { label: 'In development', tone: 'amber' },
  active: { label: 'Active', tone: 'green' },
  research: { label: 'Research in progress', tone: 'blue' },
  ongoing: { label: 'Ongoing', tone: 'green' },
};

export const owell = {
  id: 'owell',
  name: 'Owell',
  headline: 'Owell. Farms that just run.',
  pitch:
    'Sensors and automation that take over the watching, deciding, and doing a big field crew handles today.',
  role: 'Co-founder',
  dates: 'Jun 2026 – Present',
  status: 'in-development',
  stack: ['ESP32 firmware', 'Go backend', 'iOS app'],
  href: '#/owell',
};

export const builds = [
  { ...owell, internal: true },
  {
    id: 'aim',
    name: 'A.I.M. Society',
    pitch:
      'Artificial Intelligence Multidisciplinary Society: a student-led org turning students into builders and opening doors they will not find outside the club, including meeting industry builders in person.',
    role: 'VP and co-founder',
    dates: 'Mar 2026 – Present',
    status: 'active',
    stack: ['Builder community', 'Industry access', 'Student-led'],
    href: 'https://aimsociety.org',
  },
  {
    id: 'fault-sensitivity',
    name: 'Fault-sensitivity research',
    pitch:
      'Layer-wise fault sensitivity of an int8 quantized model: which layers break under single-bit faults on MCU-class hardware.',
    role: 'Undergraduate researcher, UMass Lowell',
    dates: 'Aug 2026 – Present',
    status: 'research',
    stack: ['MCUNet', 'PyTorchFI', 'INT8 quantization', 'TFLite', 'Python'],
    href: 'https://github.com/jangel19/mcunet-fault-sensitivity',
    linkLabel: 'GitHub',
  },
  {
    id: 'coop',
    name: 'Hardware engineering co-op',
    pitch:
      'I work on test engineering and internal tooling, building software that removes manual steps from hardware work. I also build hardware.',
    role: 'Hardware Engineer (co-op), Teradyne',
    dates: 'Jul 2026 – Present',
    status: 'ongoing',
    stack: ['C#', '.NET', 'ASP.NET', 'SQLite', 'xUnit', 'Python', 'FastAPI', 'React', 'openpyxl'],
  },
];
