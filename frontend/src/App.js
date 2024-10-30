import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { Container, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Generate unique ID for messages
const generateUniqueId = () => `_${Math.random().toString(36).substr(2, 9)}`;
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', Arial, sans-serif",
    body1: {
      fontSize: "16px",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "'Roboto', Arial, sans-serif",
        },
      },
    },
  },
});

function App() {
  // State to keep track of chat messages
  const [messages, setMessages] = useState([
    {
      id: "thinking",
      sender: "bot",
      text: "What can I help you with today?",
    },
  ]);

  // Function to handle sending a message
  const handleSendMessage = async (message) => {
    // Add the user's message to the chat
    const userMessage = {
      id: generateUniqueId(),
      sender: "user",
      text: message,
    };
    // Add a temporary "thinking" message for the bot
    const thinkingMessage = { id: "thinking", sender: "bot", text: "..." };
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      thinkingMessage,
    ]);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
          }),
        }
      );
      const data = await response.json();
      // Extract the response text from the data
      const botResponseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I didn't understand that.";

      const botResponse = {
        id: generateUniqueId(),
        sender: "bot",
        text: botResponseText,
      };
      // Replace the "thinking" message with the actual bot response
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.pop();
        return [...updatedMessages, botResponse];
      });
    } catch (error) {
      console.error("Error calling the Gemini API:", error);
      // Handle errors
      const errorMessage = {
        id: generateUniqueId(),
        sender: "bot",
        text: "Error: Unable to fetch response.",
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.pop(); // Remove the "thinking" message
        return [...updatedMessages, errorMessage];
      });
    }
  };

  return (
    <div translate="no">
      <ThemeProvider theme={theme}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
              backgroundColor: "grey.100",
            }}
          >
            <Container
              maxWidth={false}
              sx={{
                width: {
                  xs: "95%", // Full width on extra-small screens (phones)
                  sm: "95%", // Full width on small screens (phones)
                  md: "80%", // 80% width on medium screens (tablets)
                  lg: "80%", // 70% width on large screens (laptops)
                  xl: "80%", // 60% width on extra-large screens (desktops)
                },
                height: {
                  xs: "95vh", // Full height on phones
                  sm: "95vh", // Full height on phones
                  md: "80vh", // 80% height on tablets
                  lg: "80vh", // 70% height on laptops
                  xl: "80vh", // 60% height on desktops
                },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: 3,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: "white",
              }}
            >
              <ChatWindow messages={messages} />
              <ChatInput onSendMessage={handleSendMessage} />
            </Container>
          </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
