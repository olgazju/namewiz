import axios from "axios";
import API_CONFIG from "../config";

import { checkRateLimit } from "./rateLimit";

const { endpoint, authHeader } = API_CONFIG;


const validateOptionalParameters = (optionalParameters) => {
  const { temperature, top_p, max_tokens, max_completion_tokens } =
    optionalParameters;

  if (temperature !== undefined && (temperature < 0 || temperature > 1)) {
    throw new Error("Temperature must be between 0 and 1");
  }

  if (top_p !== undefined && (top_p < 0 || top_p > 1)) {
    throw new Error("Top_p must be between 0 and 1");
  }

  if (max_tokens !== undefined && (max_tokens < 1 || max_tokens > 2048)) {
    throw new Error("Max_tokens must be between 1 and 2048");
  }

  if (
    max_completion_tokens !== undefined &&
    (max_completion_tokens < 1 || max_completion_tokens > 2048)
  ) {
    throw new Error("Max_completion_tokens must be between 1 and 2048");
  }
};

const generateNames = async (
  keywords,
  category,
  count,
  tone,
  lng,
  categoriesWithContexts,
  responseLngContexts,
  setNames,
  setLoading,
  setRateLimit,
  modelName = "gpt-4o",
  messageFormat,
  abortController = new AbortController(), // Use default AbortController if not provided
  t // translation function passed as an argument
) => {
  setLoading(true);
  console.log("[debug] generateNames request model:", modelName);
  try {
    const remainingRateLimit = await checkRateLimit(endpoint, authHeader);

    if (!remainingRateLimit.requests || !remainingRateLimit.tokens) {
      setNames(["Rate limit exceeded or authorization failed"]);
      setLoading(false);
      return;
    }

    const messages = [
      {
        role: messageFormat.role,
        content: messageFormat.content,
      },
      {
        role: "user",
        content: `Generate ${count} unique and ${tone} business names based on the combined keywords '${keywords}' in the '${category}' category. Context: ${categoriesWithContexts[category]}. Return answer in ${responseLngContexts[lng]}`,
      },
    ];

    validateOptionalParameters(messageFormat.optionalParameters);

    const response = await axios.post(
      `${endpoint}/chat/completions`,
      {
        messages,
        model: modelName,
        ...messageFormat.optionalParameters,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(authHeader || {}),
        },
        signal: abortController.signal // Pass the abort signal to axios
      }
    );
    const generatedNames = response.data.choices[0].message.content
      .split("\n")
      .filter((name) => name.trim() !== "");
    setNames(generatedNames);

    // Debugging: Log response data

    console.log(
      "[debug] response.data.choices[0].message:",
      response.data.choices[0].message
    );
    console.log(response.data.choices[0].message.content);
    // console.log(response.data.choices[1]?.message.content);
    // console.log(response.data.choices[2]?.message.content);

    // Extract rate limit information from response headers
    const rateLimitRequestsHeader =
      response.headers["x-ratelimit-remaining-requests"] ||
      response.headers["x-custom-rate-limit-requests"];
    const rateLimitTokensHeader =
      response.headers["x-ratelimit-remaining-tokens"] ||
      response.headers["x-custom-rate-limit-tokens"];
    if (rateLimitRequestsHeader && rateLimitTokensHeader) {
      const remainingRequests = parseInt(rateLimitRequestsHeader, 10);
      const remainingTokens = parseInt(rateLimitTokensHeader, 10);
      setRateLimit({ requests: remainingRequests, tokens: remainingTokens });
    }

    // Handle x-ms-error-code and x-ratelimit-timeremaining headers
    const errorCode = response.headers["x-ms-error-code"];
    const timeRemaining = response.headers["x-ratelimit-timeremaining"];
    if (errorCode === "RateLimitReached" && timeRemaining) {
      setNames([
        `Rate limit reached. Time remaining until reset: ${timeRemaining} seconds`,
      ]);
    }

    return response; // Return the response object for Footer stat component
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      setNames([t("Generation process was canceled")]);
    } else {
      console.error("Error generating names:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      setNames([`Error: ${error.response?.data?.error || error.message}`]);
    }
  } finally {
    setLoading(false);
  }
};

export { generateNames };
