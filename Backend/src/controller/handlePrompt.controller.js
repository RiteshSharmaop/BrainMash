import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import agentResponseService from "../services/agentReply.service.js";

const handlePrompt = asyncHandler(async (req, res) => {
  const { prompt, selectedLLMs } = req.body;
  if (!prompt || !selectedLLMs || !Array.isArray(selectedLLMs)) {
        return res
      .status(401)
      .json(new ApiError(401, "Either prompt or selectedLLMs is empty"));
  }
  try {
    // Run all LLM calls in parallel
    const resultsArray = await Promise.all(
      selectedLLMs.map(async (llm) => {
        try {
          const response = await agentResponseService(llm, prompt);
          return [llm, response];
        } catch (err) {
          console.error(`${llm} failed:`, err.response?.data || err.message);
          return [llm, `Error: ${err.message}`];
        }
      })
    );

    const results = Object.fromEntries(resultsArray);


    return res
      .status(200)
      .json(new ApiResponse(200, results, "Chat Successfully"));
  } catch (err) {
    console.error("Unexpected error:", err.response?.data || err.message);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Chat Failed"));
  }
});

export { handlePrompt };
