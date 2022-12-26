const aposToLexForm = require("apos-to-lex-form");
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require("natural");
const SpellCorrector = require("spelling-corrector");
const stopword = require("stopword");

const tokenizer = new WordTokenizer();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

const getSentiment = async (str) => {
  if (!str.trim()) {
    return 0;
  }
  const lexed = aposToLexForm(str)
    .toLowerCase()
    .replace(/[^a-zA-Z\s]+/g, "");
  const tokenized = tokenizer.tokenize(lexed);
  const fixedSpelling = tokenized.map((word) => spellCorrector.correct(word));
  const stopWordsRemoved = stopword.removeStopwords(fixedSpelling);
  const analyzed = analyzer.getSentiment(stopWordsRemoved);
  console.log(stopWordsRemoved, analyzed);
  if (analyzed >= 1.1) return "Very Good";
  if (analyzed < 1 && analyzed >= 0.3) return "Good";
  if (analyzed < 0.3 && analyzed >= 0) return "Average";
  if (analyzed < 0 && analyzed > -2) return "No Bad";
  if (analyzed <= -2) return "Very Bad";
  // if (analyzed === 0) return 0;
  return "Neutral";
};
exports.getSentiment = getSentiment;
