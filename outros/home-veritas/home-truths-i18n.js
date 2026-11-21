import { formatMessage } from './home-truths-ui.js';
import { ui as hi } from './locales/hi.js';
import { ui as ko } from './locales/ko.js';
export * from './home-truths-ui.js';

export function translate(language,key,values={}){
  return formatMessage(language,key,values,{hi,ko}[language]);
}
