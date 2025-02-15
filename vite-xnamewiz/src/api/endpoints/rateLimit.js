import axios from 'axios';
import API_CONFIG from '../config';

const { endpoint, authHeader } = API_CONFIG;

const checkRateLimit = async () => {
  console.log("[debug] checkRateLimit called with url:", endpoint);
  console.log("[debug] checkRateLimit called with authHeader:", authHeader);
  try {
    const response = await axios.post(
      `${endpoint}/chat/completions`,
      {
        messages: [
          {
            role: "system",
            content: "Rate limit check",
          },
        ],
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 10,
        model: "gpt-4o",
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(authHeader || {}),
        },
      }
    );

    console.log("[debug] checkRateLimit response status:", response.status);
    console.log("[debug] checkRateLimit response headers:", response.headers);
    console.log("[debug] checkRateLimit response data:", response.data);

    // Try both original and custom headers
    const rateLimitRequestsHeader =
      response.headers["x-ratelimit-remaining-requests"] ||
      response.headers["x-custom-rate-limit-requests"];
    const rateLimitTokensHeader =
      response.headers["x-ratelimit-remaining-tokens"] ||
      response.headers["x-custom-rate-limit-tokens"];
    console.log(
      "[debug] x-ratelimit-remaining-requests:",
      rateLimitRequestsHeader
    );
    console.log(
      "[debug] x-ratelimit-remaining-tokens:",
      rateLimitTokensHeader
    );
    if (rateLimitRequestsHeader && rateLimitTokensHeader) {
      const remainingRequests = parseInt(rateLimitRequestsHeader, 10);
      const remainingTokens = parseInt(rateLimitTokensHeader, 10);
      console.log("[debug] parsed remaining requests:", remainingRequests);
      console.log("[debug] parsed remaining tokens:", remainingTokens);
      return { requests: remainingRequests, tokens: remainingTokens };
    }
    return { requests: false, tokens: false };
  } catch (error) {
    console.error("[debug] checkRateLimit error:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return { requests: false, tokens: false };
  }
};

const fetchRateLimit = async (setRateLimit, setIsAllowed) => {
  console.log(
    "[debug] fetching rate limit with url:",
    endpoint,
    "and authHeader:",
    authHeader
  );
  const result = await checkRateLimit();
  console.log("[debug] fetchRateLimit result:", result);
  setRateLimit(result);
  setIsAllowed(result.requests !== false);
};

export { fetchRateLimit, checkRateLimit };
