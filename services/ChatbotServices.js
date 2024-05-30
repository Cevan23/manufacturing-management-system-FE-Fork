import axios from 'axios';
import { TOKEN_KEY } from '@env'; // Importing the API token from environment variables

// Author: Pham Van Cao
// Function to interact with the OpenAI Chat API
export const Chatbot = async (data) => {
  const url = 'https://api.openai.com/v1/chat/completions'; // API endpoint
  const token = TOKEN_KEY; // API token obtained from environment variables

  // Request body containing the parameters for the chat completion
  const requestBody = {
    "model": "gpt-3.5-turbo-16k", // Model to use for the chat (GPT-3.5 turbo 16k)
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": data // Input text from the user
          }
        ]
      }
    ],
    "temperature": 1, // Controls the randomness of the generated response
    "max_tokens": 256, // Maximum number of tokens in the response
    "top_p": 1, // Controls the diversity of the generated response
    "frequency_penalty": 0, // Penalizes frequently used tokens
    "presence_penalty": 0 // Penalizes tokens already present in the context
  };

  console.log("req: ", requestBody); // Log the request body
  console.log("message: ", requestBody.messages[0].content[0].text); // Log the user's message

  try {
    // Send a POST request to the OpenAI Chat API with the request body and authorization token
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}` // Include the authorization token in the request headers
      }
    });
    
    console.log("res 3: ", response); // Log the response from the API
    const content = response.data.choices[0].message.content; // Extract the content of the response
    return content; // Return the response content
  } catch (error) {
    console.error("Chat bot error: ", error); // Log any errors that occur during the request
  }
};
