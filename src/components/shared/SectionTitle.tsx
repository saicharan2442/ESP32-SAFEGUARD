import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function SectionTitle({ eyebrow, title, subtitle, children }: SectionTitleProps) {
  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-base text-gray-400"
        >
          {subtitle}
        </motion.p>
      )}
      {children}
    </div>
  );
}
