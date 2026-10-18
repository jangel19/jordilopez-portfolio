// Single source of truth for the builds section and the Owell featured card.

export const STATUS = {
  'in-testing': { label: 'In testing', tone: 'amber' },
  'personal-use': { label: 'In personal use', tone: 'blue' },
  active: { label: 'Active', tone: 'green' },
  research: { label: 'Research in progress', tone: 'blue' },
  ongoing: { label: 'Ongoing', tone: 'green' },
};

export const owell = {
  id: 'owell',
  name: 'Owell',
  headline: 'Farms that just run.',
  pitch:
    'A field device for pH sensing and water flow delivery, with nutrient and crop-treatment delivery planned.',
  role: 'Co-founder',
  dates: 'Jun 2026 – Present',
  status: 'in-testing',
  stack: ['Embedded firmware', 'Backend', 'iOS app'],
  href: '#/owell',
  image: '/owell.webp',
  imageAlt: 'Agricultural landscape',
  imageWidth: 612,
  imageHeight: 408,
};

export const physioRecovery = {
  id: 'physiorecovery',
  name: 'PhysioRecovery',
  pitch: 'A recovery scoring tool using HRV, Body Battery, and resting heart rate. I run it on my own watch and use it daily.',
  role: 'Developer',
  status: 'personal-use',
  stack: ['Monkey C', 'Fixed-point DSP', 'Sensor fusion', 'Garmin Connect IQ'],
  href: '#physiorecovery',
  image: '/recovery.webp',
  imageAlt: 'PhysioRecovery score on a Garmin watch',
  imageWidth: 800,
  imageHeight: 986,
};

export const builds = [
  {
    id: 'aim',
    name: 'A.I.M. Society',
    pitch:
      'A student-led AI organization with builder projects and opportunities to meet industry professionals.',
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
      'I work on test engineering and internal tooling, building software that removes manual steps from hardware work.',
    role: 'Hardware Engineer (co-op), Teradyne',
    dates: 'Jul 2026 – Present',
    status: 'ongoing',
    stack: ['C#', '.NET', 'ASP.NET', 'SQLite', 'xUnit', 'Python', 'FastAPI', 'React', 'openpyxl'],
  },
];
