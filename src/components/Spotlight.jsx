import { motion } from 'framer-motion';

// Card wrapper with a soft highlight that follows the cursor.
const Spotlight = ({ className = '', children, ...rest }) => {
  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      className={`group relative overflow-hidden ${className}`}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(61,168,138,0.14), transparent 65%)',
        }}
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
};

export default Spotlight;
