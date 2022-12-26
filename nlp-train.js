const { NlpManager } = require("node-nlp");
const fs = require("fs");
let dataSet = [];

// fs.readFile("./emotions.json", "utf8", (err, jsonString) => {
//   if (err) {
//     console.log("File read failed:", err);
//     return;
//   }

//   dataSet = [...JSON.parse(jsonString)];
//   const manager = new NlpManager({ languages: ["en"], forceNER: true });
//   // Adds the utterances and intents for the NLP

//   function runLearner() {
//     dataSet.map((data, index) => {
//       // console.log(data, typeof data.text, index, typeof data);
//       if (data.label == 1) {
//         manager.addDocument("en", data.text + "", "emotion.satisfied");
//       } else {
//         manager.addDocument("en", data.text + "", "emotion.dissatisfied");
//       }
//     });
//   }
//   // runLearner();

//   // Train also the NLG
//   manager.addAnswer("en", "emotion.satisfied", "Satisfied!");
//   manager.addAnswer("en", "emotion.dissatisfied", "dissatisfied!");
//   manager.load("model.nlp");
//   // Train and save the model.
//   return (async () => {
//     await manager.train();
//     manager.save("emotions.nlp");
//     const response = await manager.process(
//       "en",
//       "Not so bad service. Good Food quality, Well Hospitality"
//     );
//     console.log(response);
//     return response;
//   })();
// });

const { getSentiment } = require("./text-analyzer");
fs.readFile("./csvjson.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }

  dataSet = [...JSON.parse(jsonString)];
  const manager = new NlpManager({ languages: ["en"], forceNER: true });
  // Adds the utterances and intents for the NLP

  function runLearner() {
    dataSet.map((data, index) => {
      // console.log(data, typeof data.text, index, typeof data);
      // manager.addDocument("en", data.comment + "", data.label);
      console.log(getSentiment(data.comment));
    });
  }
  runLearner();

  // Train also the NLG
  manager.addAnswer("en", "joy", "Satisfied!");
  manager.addAnswer("en", "sadness", "dissatisfied!");
  manager.addAnswer("en", "sadness1", "Sad!");
  // manager.load("model.nlp");
  // Train and save the model.
  return (async () => {
    // await manager.train();
    // manager.save("emotions2.nlp");
    const response = await manager.process("en", "Not bad service");
    console.log(response);
    return response;
  })();
});
