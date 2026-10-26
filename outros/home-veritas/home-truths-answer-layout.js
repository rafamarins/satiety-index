// Sentence boundaries preserve the source wording and its qualifications in every language.
export function answerBlocks(text, language='en') {
  if (!text) return [];
  if (typeof Intl.Segmenter !== 'function') return [text];
  const parts = [...new Intl.Segmenter(language, {granularity:'sentence'}).segment(text)]
    .map(part => part.segment.trim()).filter(Boolean);
  const brief = language.startsWith('zh') ? 16 : 55;
  if (parts.length > 1 && parts[0].length < brief) parts.splice(0, 2, parts[0] + (language.startsWith('zh') ? '' : ' ') + parts[1]);
  return parts;
}
