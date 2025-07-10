import { useState } from 'react'
import { motion } from 'framer-motion'

const ContactSection = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  // Form validation errors
  const [errors, setErrors] = useState({})

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Basic form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    return newErrors
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    setFormData({ name: '', email: '', message: '' })
    setIsSubmitting(false)
    
    // Show success message (you could add a success state here)
    alert('Thank you for your message! I\'ll get back to you soon.')
  }

  // Social links data
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/yourusername', icon: '🐙' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: '💼' },
    { name: 'Twitter', url: 'https://twitter.com/yourusername', icon: '🐦' },
    { name: 'Email', url: 'mailto:your.email@example.com', icon: '✉️' }
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
              {/* Name field */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors duration-300 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors duration-300 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message field */}
              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors duration-300 resize-vertical ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell me about your project or just say hello!"
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-300 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-secondary'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
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
                I'm always excited to hear about new projects and opportunities. 
                Whether you're a company looking to hire, a fellow developer wanting 
                to collaborate, or someone with a cool idea, I'd love to hear from you!
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
