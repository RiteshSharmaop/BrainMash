import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", 
    "X-Title": "<YOUR_SITE_NAME>", 
  },
});

// helper: check if model supports vision
const supportsVision = (llm) => {
  return (
    llm.includes("vision") ||
    llm.includes("gpt-4o") ||
    llm.includes("gpt-4-vision")
  );
};

const agentResponseService = async (llm, prompt) => {
  const content = [{ type: "text", text: prompt }];

  if (supportsVision(llm)) {
    content.push({
      type: "image_url",
      image_url: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
      },
    });
  }

  const completion = await openai.chat.completions.create({
    model: llm,
    messages: [
      {
        role: "user",
        content,
      },
    ],
    max_tokens: 200,
  });
  
  const msg = completion.choices[0].message;
  return msg.content || msg // fallback if content is missing
};

export default agentResponseService;
