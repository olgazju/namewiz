import { http, HttpResponse } from "msw";
import API_CONFIG from "../api/config";

function delay(ms, signal) {
  return Promise.race([
      new Promise((resolve) => setTimeout(resolve, ms)),
      new Promise((_, reject) =>
          signal.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")), { once: true }
          )
      ),
  ]);
}

export const handlers = [
  http.get("https://example.com/user", () => {
    return HttpResponse.json({
      id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
      firstName: "John",
      lastName: "Maverick",
    });
  }),

  http.post(
    `${API_CONFIG.endpoint}/chat/completions`,
    async ({ request, params, body }) => {
      const requestBody = await request.json();
  
      console.log("[debug] Raw request.body:", requestBody);
      const { content } = requestBody.messages[1]
        ? requestBody.messages[1]
        : requestBody.messages[0];
      const { model, max_tokens } = requestBody;
      console.log("[debug] model, max_tokens:", model, max_tokens);
  
      // Check if the request body contains an image encoded as base64
      let containsImage;
      if (Array.isArray(content)) {
        try {
          containsImage = content.some(item =>
            item?.type === "image_url" && item?.image_url?.url?.startsWith("data:image/")
          );
        } catch (error) {
          console.error("[debug] Error checking containsImage, defaulting to false:", error);
          containsImage = false;
        }
      } else {
        console.warn("[debug] content is not an array:", content);
        containsImage = false;
      }
      
      console.log("[debug] containsImage:", containsImage);
  
      if (containsImage) {
        return HttpResponse.json(
          {
            "choices": [
              {
                "content_filter_results": {
                  "hate": {
                    "filtered": false,
                    "severity": "safe"
                  },
                  "protected_material_code": {
                    "filtered": false,
                    "detected": false
                  },
                  "protected_material_text": {
                    "filtered": false,
                    "detected": false
                  },
                  "self_harm": {
                    "filtered": false,
                    "severity": "safe"
                  },
                  "sexual": {
                    "filtered": false,
                    "severity": "safe"
                  },
                  "violence": {
                    "filtered": false,
                    "severity": "safe"
                  }
                },
                "finish_reason": "stop",
                "index": 0,
                "logprobs": null,
                "message": {
                  "content": "This image shows a user interface for a web-based tool called \"NameWiz,\" designed to generate creative names for startups, businesses, or projects. The top section features the NameWiz logo, styled with a rocket icon, and brightly colored text.\n\nBelow the header, there are step-by-step input fields:\n\n1. **Enter one or more keywords**: A text box where users can type keywords (with an example provided: \"table fashion cats\").\n2. **Select a category**: A dropdown menu, currently showing \"General\" as the selected option.\n3. **Number of names to generate**: A slider allowing users to select a numerical value. In this example, the slider is set to \"5,\" with the range spanning from 1 to 10.\n4. **Advanced Settings**: A toggle or menu (closed in this image) for fine-tuning additional parameters.\n   \nAt the bottom of the interface is a button labeled **Generate Names**, which likely initiates the naming process.\n\nThe interface has a clean and minimalistic design, combining clear fonts and subtle visuals to make it user-friendly.",
                  "refusal": null,
                  "role": "assistant"
                }
              }
            ],
            "created": 1739461938,
            "id": "chatcmpl-B0VneGvPjOd6lCAh4WOYjuVHlhLcY",
            "model": "gpt-4o-2024-11-20",
            "object": "chat.completion",
            "prompt_filter_results": [
              {
                "prompt_index": 0,
                "content_filter_result": {
                  "jailbreak": {
                    "filtered": false,
                    "detected": false
                  },
                  "custom_blocklists": {
                    "filtered": false,
                    "details": []
                  }
                }
              },
              {
                "prompt_index": 1,
                "content_filter_result": {
                  "sexual": {
                    "filtered": false,
                    "severity": "safe"
                  },
                  "violence": {
                    "filtered": false,
                    "severity": "safe"
                  },
                  "hate": {
                    "filtered": false,
                    "severity": "safe"
                  },
                  "self_harm": {
                    "filtered": false,
                    "severity": "safe"
                  },
                  "custom_blocklists": {
                    "filtered": false,
                    "details": []
                  }
                }
              }
            ],
            "system_fingerprint": "fp_f1927ca00b",
            "usage": {
              "completion_tokens": 226,
              "completion_tokens_details": {
                "accepted_prediction_tokens": 0,
                "audio_tokens": 0,
                "reasoning_tokens": 0,
                "rejected_prediction_tokens": 0
              },
              "prompt_tokens": 93,
              "prompt_tokens_details": {
                "audio_tokens": 0,
                "cached_tokens": 0
              },
              "total_tokens": 319
            }
          },
          {
            status: 200,
            headers: {
              "x-ratelimit-remaining-requests": "9995",
              "x-ratelimit-remaining-tokens": "9957517",
            },
          }
        );
      }
  
      if (!containsImage) {
        // Simulate network delay with a 5 second countdown
        console.log("[debug] Starting 5 second network delay...");
        for (let i = 5; i >= 1; i--) {
          try {
            await delay(1000, request.signal);
          } catch (error) {
            console.log("[debug] Request aborted during delay");
            return Promise.reject(error);
          }
          console.log(i);
        }
  
        // Match the number of names to generate from request body using namesNumsRegex
        const namesNumsRegex = content.match(/Generate (\d+) unique/);
        const namesnums = namesNumsRegex ? parseInt(namesNumsRegex[1]) : 1;
        console.log("[debug] namesNumsRegex:", JSON.stringify(namesnums));
  
        // Generate mocked business names
        const businessNames = [
          "Adaptive Edge Solutions Inc",
          "Versalynk Innovations",
          "Crescendo Strategies",
          "PivotPoint Collective",
          "Dynamic Nexus Group",
          "Quantum Reach Labs",
          "Synergy Spark Systems",
          "Vertex Ventures Co",
          "Nimbus Networks Inc",
          "Prism Peak Partners",
        ];
  
        const lines = businessNames
          .slice(0, namesnums)
          .map((name, i) => `${i + 1}. ${name}  `);
  
        return HttpResponse.json(
          {
            choices: [
              {
                content_filter_results: {
                  hate: { filtered: false, severity: "safe" },
                  protected_material_code: { filtered: false, detected: false },
                  protected_material_text: { filtered: false, detected: false },
                  self_harm: { filtered: false, severity: "safe" },
                  sexual: { filtered: false, severity: "safe" },
                  violence: { filtered: false, severity: "safe" },
                },
                finish_reason: "stop",
                index: 0,
                logprobs: null,
                message: {
                  content: lines.join("\n"),
                  refusal: null,
                  role: "assistant",
                },
              },
            ],
            created: 1738501112,
            id: `chatcmpl-${model}`,
            model: model,
            object: "chat.completion",
            prompt_filter_results: [
              {
                prompt_index: 0,
                content_filter_results: {
                  hate: { filtered: false, severity: "safe" },
                  jailbreak: { filtered: false, detected: false },
                  self_harm: { filtered: false, severity: "safe" },
                  sexual: { filtered: false, severity: "safe" },
                  violence: { filtered: false, severity: "safe" },
                },
              },
            ],
            system_fingerprint: "fp_7158049bc2",
            usage: {
              completion_tokens: 2,
              completion_tokens_details: {
                accepted_prediction_tokens: 0,
                audio_tokens: 0,
                reasoning_tokens: 0,
                rejected_prediction_tokens: 0,
              },
              prompt_tokens: 35,
              prompt_tokens_details: {
                audio_tokens: 0,
                cached_tokens: 0,
              },
              total_tokens: 37,
            },
          },
          {
            status: 200,
            headers: {
              "x-ratelimit-remaining-requests": "9995",
              "x-ratelimit-remaining-tokens": "9957517",
            },
          }
        );
      }
    }
  ),
];
