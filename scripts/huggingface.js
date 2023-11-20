// https://huggingface.co/docs/api-inference/quicktour

const fetch = require("node-fetch");

const API_TOKEN = "";

// const llama2 =
//   "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf";
const bart =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

async function query(data) {
  const response = await fetch(bart, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}
query({
  inputs: `
  What are you?
  `,
  // parameters: {
  //   min_length: 50,
  //   max_length: 200,
  // },
}).then((response) => {
  console.log(JSON.stringify(response));
});
