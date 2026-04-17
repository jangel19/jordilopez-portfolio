import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/jangel19' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/jordi-lopez-cs' },
  { name: 'Email', url: 'mailto:lopesjordi0@gmail.com' },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: 'easeOut' },
};

const fieldClassName =
  'w-full rounded-lg border border-[rgba(74,158,255,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-3 font-sans text-[#e8eaf0] outline-none transition-colors duration-300 placeholder:text-[#6b7280] focus:border-[rgba(74,158,255,0.4)]';

const ContactSection = () => {
  const [state, handleSubmit] = useForm('mkgzwaqz');

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal}>
          <p className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.34em] text-[#6b7280]">
            Contact
          </p>
          <h2 className="font-mono text-3xl tracking-[0.06em] text-[#e8eaf0] md:text-4xl">
            Get In Touch
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="rounded-lg border border-[rgba(74,158,255,0.1)] bg-[rgba(255,255,255,0.02)] p-6 md:p-8"
            {...reveal}
          >
            <h3 className="font-mono text-lg tracking-[0.14em] text-[#e8eaf0]">
              Send a message
            </h3>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block font-sans text-sm text-[#c6ccd7]">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className={fieldClassName}
                  placeholder="Your full name"
                />
                <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-2 text-sm text-[#f59e0b]" />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block font-sans text-sm text-[#c6ccd7]">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className={fieldClassName}
                  placeholder="your.email@example.com"
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-2 text-sm text-[#f59e0b]" />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block font-sans text-sm text-[#c6ccd7]">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="6"
                  className={`${fieldClassName} resize-y`}
                  placeholder="Tell me about your project, team, or wearable problem space."
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-2 text-sm text-[#f59e0b]" />
              </div>

              <input type="text" name="_gotcha" style={{ display: 'none' }} />

              <button
                type="submit"
                disabled={state.submitting}
                className="inline-flex items-center justify-center rounded-md border border-[rgba(74,158,255,0.18)] bg-[rgba(74,158,255,0.1)] px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#e8eaf0] transition-colors duration-300 hover:border-[rgba(74,158,255,0.38)] hover:bg-[rgba(74,158,255,0.16)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {state.submitting ? 'Sending...' : 'Send Message'}
              </button>

              {state.succeeded && (
                <p className="font-sans text-sm text-[#3da88a]">
                  Thanks. I&apos;ll follow up soon.
                </p>
              )}
            </form>
          </motion.div>

          <motion.div className="flex flex-col justify-between gap-10" {...reveal}>
            <div>
              <h3 className="font-mono text-lg tracking-[0.14em] text-[#e8eaf0]">
                Current Focus
              </h3>
              <div className="mt-6 space-y-6 font-sans text-base leading-8 text-[#c6ccd7]">
                <p>
                  I&apos;m exploring Summer 2026 opportunities in wearable health technology,
                  embedded systems, and machine learning. I&apos;m passionate about building
                  systems that turn raw sensor data into insights that help people make
                  better decisions about their health.
                </p>
                <p>
                  Whether you&apos;re working on wearables, medical devices, or biosignal
                  processing, I&apos;d love to connect.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-sm tracking-[0.22em] text-[#6b7280]">
                Network
              </h4>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-[rgba(74,158,255,0.14)] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#c6ccd7] transition-colors duration-300 hover:border-[rgba(74,158,255,0.35)] hover:text-[#e8eaf0]"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.footer
          className="mt-16 flex flex-col gap-3 border-t border-[rgba(74,158,255,0.1)] pt-6 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[#6b7280] md:flex-row md:items-center md:justify-between"
          {...reveal}
        >
          <p>© 2026 Jordi Lopez • Built with React & Tailwind CSS</p>
          <div className="flex items-center gap-4">
            <a
              href="/Jordi_Lopez_Resume.pdf"
              className="transition-colors duration-300 hover:text-[#4a9eff]"
            >
              Resume
            </a>
            <span>v2.1.0</span>
          </div>
        </motion.footer>
      </div>
    </section>
  );
};

export default ContactSection;
