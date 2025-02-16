import axios from 'axios';

const processImage = async (imageFile, endpoint, authHeader, modelName) => {
  if (!imageFile) {
    console.log("No image file to process.");
    return null;
  }

  try {
    // Convert image to base64
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    await new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
    });

    const base64String = reader.result.split(',')[1]; // Extract base64 part
    const imageFormat = imageFile.type.split('/')[1]; // Extract image format (jpeg, png, etc.)

    const requestData = {
      messages: [
        { role: "system", content: "You are a helpful assistant that describes images in details." },
        { role: "user", content: [
            { type: "text", text: "What's in this image?"},
            { type: "image_url", image_url: {
                url: `data:image/${imageFormat};base64,${base64String}`,
                detail: "low"  // or "high" depending on your needs and the model's capabilities
              }
            }
          ]
        }
      ],
      model: modelName
    };

    const response = await axios.post(`${endpoint}/chat/completions`, requestData, {
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
    });

    console.log("Image processing successful:", response.data);
    // Assuming the API returns a structured response with choices
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      console.warn("Unexpected API response format:", response.data);
      return null; // Or throw an error if the format is critical
    }

  } catch (error) {
    console.error("Image processing failed:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export default processImage;