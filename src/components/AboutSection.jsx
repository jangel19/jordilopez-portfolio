import { motion } from "framer-motion"


const AboutSection = () => {
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

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  // Skills data
  const skills = [
    { name: 'C/C++', icon: '/cpp.svg' },
    { name: 'Python', icon: '/python logo.svg' },
    { name: 'JavaScript', icon: '/JavaScript.svg' },
    { name: 'Supabase', icon: '/Supabase-Dark.svg' },
    { name: 'Flask', icon: '/flask.svg' },
    { name: 'Git', icon: '/git logo.svg' }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-150 to-blue-300">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>

        {/* Main content grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Photo column */}
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
          >
            <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/photo.jpeg" 
                alt="Profile photo"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Bio column */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              I’m currently pursuing a B.S. in Computer Science with a Mathematics minor at UMass Lowell, where I’m building a strong foundation in software engineering, AI, and cybersecurity. My academic journey hasn’t been easy—I faced serious family challenges during my first year, but I bounced back with a 4.0 GPA my second semester and never looked back.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              What drives me is more than just code. I’m passionate about building tools that make life better, whether it’s through health tech wearables, real estate automation, or smart digital systems. Along the way I've learned to use technology not just to impress, but to impact.

            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every project I take on is a chance to level up, learn something new, and help others in the process. Outside of tech, you’ll find me running and working out, binging tv shows, or doomscrolling.
            </p>
          </motion.div>
        </motion.div>

        {/* Skills section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Skills & Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="bg-gray-200 rounded-xl p-6 text-center hover:bg-gray-400 transition-colors duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
               <img
                    src={skill.icon}
                    alt={`${skill.name} logo`}
                    className="w-10 h-10 mx-auto mb-2 object-contain"
                />
                <div className="text-sm font-medium text-gray-700">{skill.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection