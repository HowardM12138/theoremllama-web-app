const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

export default async function getGeminiResponse(messages, message) {
  const getContextWindow = () => {
    // Select the last few messages to form the context
    const MAX_CONTEXT_MESSAGES = 25;
    const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    return contextMessages.map((msg) => ({
      text: `${msg.sender}: ${msg.text}`,
    }));
  };

  // Include context in the API call by appending the last few messages
  const contextWindow = getContextWindow();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [...contextWindow, { text: `User: ${message}` }] }],
      }),
    }
  );
  const data = await response.json();
  // Extract the response text from the data
  const botResponseText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I didn't understand that.";

  return botResponseText;
}
