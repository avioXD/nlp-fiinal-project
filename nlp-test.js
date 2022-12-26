const { NlpManager } = require("node-nlp");

const nlpRun = async (comment) => {
  const manager = new NlpManager({ languages: ["en"], forceNER: true });
  manager.load("model.nlp");
  // Train and save the model.
  const response = await manager.process("en", comment);
  console.log(response);
  return response;
};
exports.nlpRun = nlpRun;
