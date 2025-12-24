import { motion } from 'framer-motion'
import { useForm, ValidationError } from '@formspree/react';


const ContactSection = () => {
  const [state, handleSubmit] = useForm("mkgzwaqz");

  // Social links data
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/jangel19', icon: <img src="/github-icon-1.svg" alt="GitHub" style={{ width: '40px', height: '40px' }}/> },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/jordi-lopez-cs', icon: <img src="/linkedin-icon-2.svg" alt="LinkedIn" style={{ width: '40px', height: '40px' }}/> },
    { name: 'Email', url: 'mailto:lopesjordi0@gmail.com', icon: <img src="/gmail-icon.svg" alt="Email" style={{ width: '40px', height: '40px' }}/> },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>

        <motion.p
          className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          I'm always open to discussing new opportunities, interesting projects,
          or just having a chat about technology.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send me a message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Your full name"
                />
                <ValidationError prefix="Name" field="name" errors={state.errors} />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="your.email@example.com"
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
                  placeholder="Tell me about your project, opportunity, or just say hello!"
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </div>

              <input type="text" name="_gotcha" style={{ display: 'none' }} />

              <button
                type="submit"
                disabled={state.submitting}
                className="w-full inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300 mb-8"
              >
                {state.submitting ? "Sending..." : "Send Message"}
              </button>

              {state.succeeded && (
                <p className="text-blue-950 font-medium mt-2">Thanks! I’ll be in touch soon.</p>
              )}
            </form>
          </motion.div>

          {/* Contact info and social links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Let's connect</h3>
              <p className="text-gray-600 mb-6">
                I’m currently exploring Summer 2026 opportunities in AI, machine learning, and data-driven development. I’m passionate about solving real-world problems through intelligent systems and thoughtful engineering. Whether you’re building innovative tech, researching new models, or interested in collaboration — I’d love to connect.
              </p>

              {/* Download resume button */}
              <a
                href="/Jordi Lopez SWE Resume.pdf"
                download
                className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300 mb-8"
              >
                Download Resume
              </a>
            </div>

            {/* Social links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Find me online</h4>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span className="font-medium text-gray-700">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
