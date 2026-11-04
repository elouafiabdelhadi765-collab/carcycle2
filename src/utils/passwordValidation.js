export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UPPERCASE_REGEX = /[A-Z]/;
const DIGIT_REGEX = /[0-9]/;
const SPECIAL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export function validatePassword(password) {
  if (!password || password.length < 8) return '8 caractères minimum';
  if (password.length > 24) return '24 caractères maximum';
  if (!UPPERCASE_REGEX.test(password) || !DIGIT_REGEX.test(password) || !SPECIAL_REGEX.test(password)) {
    return 'Doit contenir au moins 1 majuscule, 1 chiffre et 1 caractère spécial (!@#$%^&*)';
  }
  return null;
}
