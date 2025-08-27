// controllers/chat.controller.js
import { getMultiLLMResult } from "./multiLLM.controller.js";
import {agentResponseService} from "../services/agentReply.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
// import {agentResponseService } from "../services/agent.service.js";
// import {getMultiLLMResult} from "../services/multi.service.js";



const handlePrompt = async (req, res) => {
  const { prompt, selectedLLMs , isMultiLLM} = req.body;
  console.log("Backend call");
  

  if (!prompt) {
    return res.status(400).json(new ApiError(400, "Prompt is required"));
  }
  console.log("Prompt received:", prompt);
  try {
    // --- Normal LLM responses ---
    const resultsArray = await Promise.all(
      selectedLLMs.map(async (llm) => {
        try {
          const response = await agentResponseService(llm, prompt);
          // const response = await agentResponseService(llm, prompt);
          return [llm, response];
        } catch (err) {
          console.error(`${llm} failed:`, err.response?.data || err.message);
          return [llm, `Error: ${err.message}`];
        }
      })
    );

    const results = Object.fromEntries(resultsArray);

    // --- MultiLLM consolidated response ---
    let multiLLMResponse = null;
    if (isMultiLLM) {
      multiLLMResponse = await getMultiLLMResult(results);

      return res
        .status(200)
        .json(new ApiResponse(200, { results , multiLLMResponse }, "Chat Successfully"));

    }

    return res
      .status(200)
      .json(new ApiResponse(200, { results }, "Chat Successfully"));
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json(new ApiError(500, "Chat Failed"));
  }
};


export { handlePrompt };
