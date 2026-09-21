import { Link } from 'react-router';
import { motion } from 'framer-motion';

// Components
const MotionLink = motion.create(Link);

// Assets
import LogoLight from '@/assets/logo-light.svg';
import LogoDark from '@/assets/logo-dark.svg';

export const Logo = () => {
  return (
    <MotionLink to='/' 
    className='text-primary text-lg font-semibold'
    whileHover={{scale: 1.05}}
    whileTap={{scale: 0.9}}
    viewTransition
    >
      <img src={LogoLight} width={124} height={44} className='hidden dark:block' />
      <img src={LogoDark} width={124} height={44} className='dark:hidden' />
    </MotionLink>
  );
}