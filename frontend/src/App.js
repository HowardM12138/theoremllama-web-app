import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { Container, Box } from "@mui/material";

// Generate unique ID for messages
const generateUniqueId = () => `_${Math.random().toString(36).substr(2, 9)}`;

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
  const handleSendMessage = (message) => {
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

    // Here you would integrate with your LLM API
    setTimeout(() => {
      const botResponse = {
        id: generateUniqueId(),
        sender: "bot",
        text: `Echo: ${message}`,
      };

      // Replace the "thinking" message with the actual bot response
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.pop();
        return [...updatedMessages, botResponse];
      });
    }, 2000);
  };

  return (
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
  );
}

export default App;
