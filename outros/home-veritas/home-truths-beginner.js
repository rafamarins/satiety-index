import { formatBeginnerContent } from './home-truths-journey.js';
import { beginner as hi } from './locales/hi.js';
import { beginner as ko } from './locales/ko.js';

export function beginnerContent(language = 'en') {
  return formatBeginnerContent(language, {hi,ko}[language]);
}
