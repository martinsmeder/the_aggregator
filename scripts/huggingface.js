// https://huggingface.co/docs/api-inference/quicktour

const fetch = require("node-fetch");

const API_TOKEN = "???";

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}
query({
  inputs: `The company was founded in 2016 by French entrepreneurs Clément Delangue, Julien Chaumond, and Thomas Wolf in New York City, originally as a company that developed a chatbot app targeted at teenagers.[1] After open-sourcing the model behind the chatbot, the company pivoted to focus on being a platform for machine learning.

In March 2021, Hugging Face raised US$40 million in a Series B funding round.[2]

On April 28, 2021, the company launched the BigScience Research Workshop in collaboration with several other research groups to release an open large language model.[3] In 2022, the workshop concluded with the announcement of BLOOM, a multilingual large language model with 176 billion parameters.[4][5]

On December 21, 2021, the company announced its acquisition of Gradio, a software library used to make interactive browser demos of machine learning models.[6]

On May 5, 2022, the company announced its Series C funding round led by Coatue and Sequoia.[7] The company received a $2 billion valuation.

On May 13, 2022, the company introduced its Student Ambassador Program to help fulfill its mission to teach machine learning to 5 million people by 2023.[8]

On May 26, 2022, the company announced a partnership with Graphcore to optimize its Transformers library for the Graphcore IPU.[9][10]

On August 3, 2022, the company announced the Private Hub, an enterprise version of its public Hugging Face Hub that supports SaaS or on-premises deployment.[11]

In February 2023, the company announced partnership with Amazon Web Services (AWS) which would allow Hugging Face's products available to AWS customers to use them as the building blocks for their custom applications. The company also said the next generation of BLOOM will be run on Trainium, a proprietary machine learning chip created by AWS.[12][13][14]

In August 2023, the company announced that it raised $235 million in a Series D funding, at a $4.5 billion valuation. The funding was led by Salesforce, and notable participation came from Google, Amazon, Nvidia, AMD, Intel, IBM, and Qualcomm.[15]`,
}).then((response) => {
  console.log(JSON.stringify(response));
});
