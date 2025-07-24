import { motion } from "framer-motion"
import { FaGithub } from 'react-icons/fa'


const ProjectsSection = () => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }
 

  // animation for project cards
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  // project data
  const projects = [
    {
      id: 1,
      title: 'VITA Health',
      description: 'I’m developing a wearable health-tech platform featuring an iOS app built in Swift that streams real-time biometrics (SpO2, heart rate) from an ESP32 device via Bluetooth. I integrate Supabase for secure user data syncing and historical analytics. I lead a 6-person team, coordinating embedded sensor programming, BLE communication, UI/UX design, and cloud architecture for production readiness.',
      status: 'Feb 2025 - In Progress',
      tech: ['Swift', 'ESP32', 'BLE', 'Supabase', 'Xcode', 'Git', 'Figma', 'Arduino IDE'],
      github: 'https://github.com/jangel19/VITA.git',
      image: '/prototype.png'
    },
    {
      id: 2,
      title: 'FutureFin',
      description: 'I’m developing a web-based tool that analyzes historical stock data and visualizes trends using yfinance and Matplotlib. I implement moving averages and standard deviation bands to highlight momentum and volatility signals for basic trading insights. The architecture is modular, designed to support future integration of regression-based price prediction models.',
      status: 'June 2025 - In Progress',
      tech: ['Python', 'pandas', 'yfinance', 'Matplotlib'],
      github: 'https://github.com/jangel19/futurefin.git',
      image: '/tempfuturefin.png'
    },
    
    {
      id: 3,
      title: 'Mission Brute',
      description: 'I’m building a penetration testing simulation tool that performs password brute-force attack scenarios on local test environments using Python and Selenium. I incorporate secure credential handling, rate-limiting, and error detection to responsibly explore vulnerabilities. I apply ethical hacking principles to identify common password security flaws and recommend mitigation strategies.',
      status: 'June 2025 - In Progress',
      tech: ['Python', 'Hashlib', 'Requests', 'Selenium' ],
      github: 'https://github.com/jangel19/MissionBrute.git',
      image: '/tempmissionbrute.png'
    },
    {
      id: 4,
      title: 'NightSky',
      description: 'I’m engineering a web app that renders custom star maps based on user-provided date and location using astronomical libraries. I’ve implemented a Python Flask backend to handle data processing and reduce external API calls by 40% through local caching of star coordinates. On the front end, I optimize performance with lazy-loading and minimal asset bundles to ensure a smooth experience across desktop and mobile.',
      status: 'May 2025 - In Progress',
      tech: ['Python', 'JavaScript', 'Flask', 'AstroPy', 'Vercel', 'Git', 'HTML', 'CSS'],
      github: 'https://github.com/jangel19/NightSky.git',
      image: '/nightsky.png'
    },
    {
    id: 5,
    title: 'Ale’s Doc Filter',
    description: 'Built a Python automation tool for a roommate that extracts product-specific data from a master Word document and generates clean, shareable reports. Designed to streamline internal documentation workflows.',
    status: 'July 2025 - Completed',
    tech: ['Python', 'Docx', 'Git', 'VS Code'],
    github: 'https://github.com/jangel19/aleslightsensor.git',
    image: '/alesthing.png',
    demo: 'https://www.loom.com/share/55f04ccfbb164e228b05f8a1864a7880?sid=4acb2aa4-96b5-45c7-8461-603990de4d85'
    }
  ]


  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          My Projects
        </motion.h2>

        <motion.p
          className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Here are some of the projects I'm currently working on. Each one represents 
          a unique challenge and learning opportunity.
        </motion.p>

        {/* Projects grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map(project => (
            <motion.div
              key={project.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              variants={cardVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              {/* Project image */}
              <div className="h-48 w-full overflow-hidden">
                <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
              </div>

              {/* Project content */}
              <div className="p-6">
                {/* Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {project.status}
                  </span>
                </div>

                {/* Project title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {project.title}
                </h3>

                {/* Project description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                     <a
                        href={project.github}
                       target="_blank"
                        rel="noopener noreferrer"
                         className="flex items-center justify-center gap-2 flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}>
                     <FaGithub className="w-5 h-5" />
                       GitHub
                       </a>
                       {project.demo ? (
                          <a
                          href={project.demo}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center justify-center gap-2 flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
                             whileHover={{ scale: 1.05 }}>
                              Live Demo
                             </a>
                      ) : (
                     <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300">
                       Live Demo <span className="text-gray-500">(Coming Soon)</span>
                      </button>
                      )}
                  </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection