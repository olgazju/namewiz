import deepseekIcon from '../assets/deepseek.svg';
import mistralIcon from '../assets/mistral.svg';
import openaiIcon from '../assets/openai.svg';
import microsoftIcon from '../assets/microsoft.svg';

export const cardsData = [
  {
    title: "GPT-4o",
    modelName: "gpt-4o",
    descriptionKey: "card_gpt4o_description",
    icon: openaiIcon,
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 150,
      },
    },
    isMultimodal: true,
  },
  {
    title: "O3-Mini",
    modelName: "o3-mini",
    descriptionKey: "card_o3mini_description",
    icon: microsoftIcon,
    messageFormat: {
      role: "developer",
      content: "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
         
      },
    },
    isMultimodal: true,
  },
  {
    title: "DeepSeek-R1",
    modelName: "DeepSeek-R1",
    descriptionKey: "card_deepseekr1_description",
    icon: deepseekIcon,
    messageFormat: {
      role: "assistant",
      content:
        "You are a creative business name generator. Do not expose reasoning! Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        max_tokens: 200,
      },
    },
    isMultimodal: true,
  },
  {
    title: "GPT-4o Mini",
    modelName: "gpt-4o-mini",
    descriptionKey: "card_gpt4omini_description",
    icon: openaiIcon,
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 150,
      },
    },
    isMultimodal: true,
  },
  {
    title: "Ministral 3B",
    modelName: "Ministral-3B",
    descriptionKey: "card_ministral3b_description",
    icon: mistralIcon,
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 0.9,
        top_p: 0.95,
        max_tokens: 100,
      },
    },
    isMultimodal: false,
  },
  {
    title: "Mistral Small",
    modelName: "Mistral-small",
    descriptionKey: "card_mistralsmall_description",
    icon: mistralIcon,
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 100,
      },
    },
    isMultimodal: false,
  },
  {
    title: "Phi-3.5-MoE instruct",
    modelName: "Phi-3.5-MoE-instruct",
    descriptionKey: "card_phi35moe_description",
    icon: microsoftIcon, // Updated to use Microsoft SVG
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 0.7,
        top_p: 0.85,
        max_tokens: 120,
      },
    },
    isMultimodal: true,
  },
  {
    title: "Phi-3.5-mini instruct",
    modelName: "Phi-3.5-mini-instruct",
    descriptionKey: "card_phi35mini_description",
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 0.6,
        top_p: 0.8,
        max_tokens: 100,
      },
    },
    isMultimodal: false,
  },
  {
    title: "Phi-3.5-vision instruct",
    modelName: "Phi-3.5-vision-instruct",
    descriptionKey: "card_phi35vision_description",
    icon: microsoftIcon,
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 150,
      },
    },
    isMultimodal: true,
  },
  {
    title: "Phi-3-mini instruct (128k)",
    modelName: "Phi-3-mini-128k-instruct",
    descriptionKey: "card_phi3mini128k_description",
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 0.7,
        top_p: 0.85,
        max_tokens: 120,
      },
    },
    isMultimodal: false,
  },
  {
    title: "Phi-3-mini instruct (4k)",
    modelName: "Phi-3-mini-4k-instruct",
    descriptionKey: "card_phi3mini4k_description",
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 0.6,
        top_p: 0.8,
        max_tokens: 100,
      },
    },
    isMultimodal: false,
  },
  {
    title: "Phi-4",
    modelName: "Phi-4",
    descriptionKey: "card_phi4_description",
    icon: microsoftIcon,
    messageFormat: {
      role: "system",
      content:
        "You are a creative business name generator. Only return a list of names without any descriptions or additional context.",
      optionalParameters: {
        temperature: 0.9,
        top_p: 0.95,
        max_tokens: 150,
      },
    },
    isMultimodal: false,
  },
];
