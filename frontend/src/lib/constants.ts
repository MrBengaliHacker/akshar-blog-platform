// Assets
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa6';

// Social profiles (used in the footer and on the Contact page)
export const SOCIAL_LINKS = [
  { href: 'https://facebook.com/ritam.mondal.470261', Icon: FaFacebook, label: 'Facebook' },
  { href: 'https://instagram.com/mr_bengali_hacker', Icon: FaInstagram, label: 'Instagram' },
  { href: 'https://x.com/MrBengaliHacker', Icon: FaXTwitter, label: 'X' },
  { href: 'https://linkedin.com/in/ritam-mondal-677944322', Icon: FaLinkedin, label: 'LinkedIn' },
  { href: 'https://youtube.com/@mr.bengali_hacker', Icon: FaYoutube, label: 'YouTube' },
] as const;

// Public email shown on the Contact page. Leave it empty to hide the email box.
export const CONTACT_EMAIL = '';