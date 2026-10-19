const config = require('../config');

const isProduction = config.NODE_ENV === 'production';

// In production the frontend (Vercel) and the backend (Render) are on different sites,
// so the cookie must be SameSite=None and Secure. Locally 'lax' works on localhost.
const baseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

const refreshCookieOptions = {
  ...baseOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const viewCookieOptions = {
  ...baseOptions,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// clearCookie must use the same options as the cookie that was set
const clearCookieOptions = baseOptions;

module.exports = { refreshCookieOptions, viewCookieOptions, clearCookieOptions };