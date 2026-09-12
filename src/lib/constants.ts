const raw = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

export const APP_URL = (raw && raw.trim() !== '')
  ? (raw.startsWith('http') ? raw.trim().replace(/\/$/, '') : `https://${raw.trim().replace(/\/$/, '')}`)
  : 'https://doquest.vercel.app';
