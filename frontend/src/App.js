import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import VoteBar from "./components/VoteBar";
import getGeminiResponse from "./utils/GeminiApi";
import { Container, Box, Grid2 } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Generate unique ID for messages
const generateUniqueId = () => `_${Math.random().toString(36).substr(2, 9)}`;

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
  const [messagesLeft, setMessagesLeft] = useState([
    {
      id: "thinking",
      sender: "bot",
      text: "What can I help you with today?",
    },
  ]);
  const [messagesRight, setMessagesRight] = useState([
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
    setMessagesLeft((prevMessages) => [
      ...prevMessages,
      userMessage,
      thinkingMessage,
    ]);
    setMessagesRight((prevMessages) => [
      ...prevMessages,
      userMessage,
      thinkingMessage,
    ]);

    // Fetch LEFT panel api response
    try {
      const botResponseText = await getGeminiResponse(messagesLeft, message);

      const botResponse = {
        id: generateUniqueId(),
        sender: "bot",
        text: botResponseText,
      };
      // Replace the "thinking" message with the actual bot response
      setMessagesLeft((prevMessages) => {
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

      setMessagesLeft((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.pop(); // Remove the "thinking" message
        return [...updatedMessages, errorMessage];
      });
    }
    // Fetch RIGHT panel api response
    try {
      const botResponseText = await getGeminiResponse(messagesRight, message);

      const botResponse = {
        id: generateUniqueId(),
        sender: "bot",
        text: botResponseText,
      };
      // Replace the "thinking" message with the actual bot response
      setMessagesRight((prevMessages) => {
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

      setMessagesRight((prevMessages) => {
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
                xs: "100%", // Full width on extra-small screens (phones)
                sm: "100%", // Full width on small screens (phones)
                md: "85%", // 80% width on medium screens (tablets)
                lg: "85%", // 70% width on large screens (laptops)
                xl: "85%", // 60% width on extra-large screens (desktops)
              },
              height: {
                xs: "100vh", // Full height on phones
                sm: "100vh", // Full height on phones
                md: "85vh", // 80% height on tablets
                lg: "85vh", // 70% height on laptops
                xl: "85vh", // 60% height on desktops
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: { xs: 0, lg: 2 },
              paddingX: { xs: 0, lg: 2 },
              border: 1,
              borderColor: "grey.300",
              borderRadius: { xs: 0, lg: 4 },
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <Grid2
                container
                spacing={2}
                direction={{ xs: "column", lg: "row" }}
                sx={{ flex: 1, height: "100%", overflow: "hidden" }}
              >
                <Grid2
                  item
                  xs={12}
                  md={6}
                  sx={{
                    flex: 1,
                    height: { xs: "50%", lg: "100%" },
                    overflow: "auto",
                  }}
                >
                  <ChatWindow messages={messagesLeft} />
                </Grid2>
                <Grid2
                  item
                  xs={12}
                  md={6}
                  sx={{
                    flex: 1,
                    height: { xs: "50%", lg: "100%" },
                    overflow: "auto",
                  }}
                >
                  <ChatWindow messages={messagesRight} />
                </Grid2>
              </Grid2>
            </Box>
            <Box sx={{ width: "100%", display: {lg: "block", xs: "none"} }}>
              <VoteBar></VoteBar>
            </Box>
            <Box sx={{ width: "100%" }}>
              <ChatInput onSendMessage={handleSendMessage} />
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
