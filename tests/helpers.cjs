// Tests run the compiled rules, so a broken build cannot pass on healthy sources.
const fs = require('node:fs');
const path = require('node:path');

const read = filename => fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
const rulesIn = filename => read(filename).split('\n').filter(line => line.includes('#%#'));
const mainRules = () => rulesIn('original-language-adguard.txt');
const optionalRules = () => rulesIn('optional-social-originals.txt');

// Finds a compiled rule by a string only that module contains.
function compiled(marker) {
  const matches = [...mainRules(), ...optionalRules()].filter(rule => rule.includes(marker));
  if (matches.length !== 1) throw new Error(`Expected one rule containing ${marker}, found ${matches.length}`);
  return matches[0].split('#%#')[1];
}

const code = {
  search: () => compiled('__agOriginalGoogleSearchInstalled'),
  proxy: () => compiled('agKeepTranslation'),
  titles: () => compiled('__agOriginalTitlesInstalled'),
  audio: () => compiled('__agOriginalAudioInstalled'),
  details: () => compiled('__agOriginalDetailsInstalled'),
  social: () => compiled('__agSocialOriginalsInstalled'),
  reddit: () => compiled('__agOriginalRedditInstalled'),
};

module.exports = { read, mainRules, optionalRules, code };
