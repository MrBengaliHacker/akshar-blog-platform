// Shared animation settings, so the whole site moves in the same way
import type { Variants } from 'motion/react';

// A list or a group: the children appear one after the other
export const stagger: Variants = {
  from: {},
  to: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Fade in and move up a little
export const fadeUp: Variants = {
  from: { opacity: 0, y: 16 },
  to: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Only fade in
export const fadeIn: Variants = {
  from: { opacity: 0 },
  to: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

// Section that appears when it scrolls into view (once)
export const revealOnScroll = {
  initial: 'from',
  whileInView: 'to',
  viewport: { once: true, margin: '-60px' },
} as const;