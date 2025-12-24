import { motion } from "framer-motion"
import { FaGithub } from 'react-icons/fa'


const ProjectsSection = () => {
  const getStatusFromRange = (status) => {
  const now = new Date();

  const endPart = status.split("-")[1]?.trim();

  if (!endPart || !/^[A-Za-z]+ \d{4}$/.test(endPart)) {
    return {
      label: status,
      className: "bg-blue-100 text-blue-800"
    };
  }

  const endDate = new Date(`${endPart} 01`);
  endDate.setMonth(endDate.getMonth() + 1);

  if (now > endDate) {
    return {
      label: status,
      className: "bg-green-100 text-green-800"
    };
  }

  return {
    label: status,
    className: "bg-yellow-100 text-yellow-800"
  };
};
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
      title: 'SecureDrop',
      description: `
        SecureDrop is a secure client–server file transfer system that enables
        authenticated users to exchange files with confidentiality and integrity guarantees.
        I worked as part of a team to design and implement the system, contributing to the TCP
        networking layer, encryption and integrity verification using OpenSSL, and containerizing
        the application with Docker to ensure consistent deployment, testing, and debugging across
        environments.
      `,
      status: 'Nov. 2025 - Dec. 2025',
      tech: ['C++', 'Python', 'OpenSSL', 'TCP Sockets', 'Linux', 'Docker'],
      github: 'https://github.com/jangel19/SecureDrop.git',
      image: '/securedropimg.png'
    },

    {
      id: 2,
      title: 'VITA Health',
      description: `
        Developed a wearable health-tech prototype using an ESP32 that collected heart rate and
        motion data to calculate steps, activity levels, and basic health metrics. Implemented
        firmware using Arduino-based C to handle sensor sampling, data processing, and BLE
        transmission. Designed a custom PCB integrating biometric sensors and a haptic motor
        for notifications and alarms, and built a simple web-based interface backed by
        Supabase to display and store collected data. Collaborated within a small team to
        validate end-to-end hardware-to-UI data flow.
      `,
      status: 'Feb. 2025 - Prototype',
      tech: ['C (Arduino', 'ESP32', 'BLE', 'Supabase', 'PCB Design', 'Git', 'Arduino IDE'],
      github: 'https://github.com/jangel19/VITA.git',
      image: '/prototype.png'
    },

    {
      id: 3,
      title: 'FutureFin',
      description: `
        I’m developing a web-based tool that analyzes historical stock data and
        visualizes trends using yfinance and Matplotlib. I implement moving averages and standard
        deviation bands to highlight momentum and volatility signals for basic trading insights.
        The architecture is modular, designed to support future integration of regression-based
        price prediction models.
      `,
      status: 'June 2025 - In Progress',
      tech: ['Python', 'pandas', 'yfinance', 'Matplotlib'],
      github: 'https://github.com/jangel19/futurefin.git',
      image: '/tempfuturefin.png'
    },


    {
      id: 4,
      title: 'NightSky',
      description: `
        This project is a web application that generates custom star maps based on a
        user’s selected date and location using astronomical libraries. It features a Python Flask
        backend for efficient data processing, reducing external API calls by 40% through local
        caching of star coordinates. The frontend is optimized for performance across desktop and
        mobile, with future updates planned to further improve speed and accuracy.
      `,
      status: 'May 2025 - Aug. 2025',
      tech: ['Python', 'JavaScript', 'Flask', 'AstroPy', 'Vercel', 'Git', 'HTML', 'CSS'],
      github: 'https://github.com/jangel19/NightSky.git',
      image: '/nightsky.png',
      demo: 'https://www.loom.com/share/2f59bafd54614a869edd8bd52c957cbd?sid=0a9cc181-7916-4dd6-a836-d9e094b9eaa4'
    },

    {
    id: 5,
    title: 'Ale’s Doc Filter',
    description:`
      Built an automation tool for my friend that extracts product-specific
      data from a master Word document and generates clean, shareable reports. Designed to streamline
      internal documentation workflows.
    `,
    status: 'July 2025 - July 2025',
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
          {projects.map(project => {
            const { label, className } = getStatusFromRange(project.status);

            return (
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
                <div className="flex items-center justify-between mb-3">
                 <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${className}`}
                >
                  {label}
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
          );
        })}
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsSection
