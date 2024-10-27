import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import ChatBubble from "./ChatBubble";

function ChatWindow({ messages }) {
  const chatEndRef = useRef(null); // Reference to the end of chat window
  const chatWindowRef = useRef(null); // Reference to the beginning of chat window
  const prevScrollTopRef = useRef(0); // Track the previous scroll position
  const [dummy, setDummy] = useState(0); // Dummy state to trigger scrolling
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true); // State to control auto-scroll
  const bottomThreshold = 50; // Threshold distance from the bottom to enable auto-scroll

  // Handle new messages and triggering auto-scrolling
  useEffect(() => {
    setShouldAutoScroll(true);
    triggerScroll();
  }, [messages]);

  // Scroll to bottom effect when dummy changes
  useEffect(() => {
    if (shouldAutoScroll && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dummy, shouldAutoScroll]); // Trigger when dummy or messages change, or when shouldAutoScroll is true

  // Function to increment dummy value, to be passed to ChatBubble
  const triggerScroll = () => {
    if (shouldAutoScroll) {
      setDummy((prev) => prev + 1);
    }
  };

  // Handle user scroll detection
  const handleScroll = () => {
    const chatWindow = chatWindowRef.current;
    if (!chatWindow) return;

    const currentScrollTop = chatWindow.scrollTop;
    const scrollHeight = chatWindow.scrollHeight;
    const clientHeight = chatWindow.clientHeight;

    // Check if user is scrolling up
    if (currentScrollTop < prevScrollTopRef.current) {
      setShouldAutoScroll(false); // Disable auto-scroll when scrolling up
    }

    // Check if the user is close to the bottom of the chat window
    const distanceToBottom = scrollHeight - (currentScrollTop + clientHeight);
    if (distanceToBottom <= bottomThreshold) {
      setShouldAutoScroll(true); // Enable auto-scroll when close to the bottom
    }

    // Update the previous scroll position
    prevScrollTopRef.current = currentScrollTop;
  };

  return (
    <Box
      ref={chatWindowRef}
      onScroll={handleScroll}
      flex={1}
      p={2}
      overflow="auto"
      bgcolor="grey.100"
      display="flex"
      flexDirection="column"
      sx={{
        borderRadius: "12px 12px 0 0",
        paddingLeft: {
          xs: 2, // Padding for extra-small screens (phones)
          sm: 12, // Padding for small screens (phones)
          md: 24, // Increased padding for medium screens (tablets)
          lg: 36, // Larger padding for large screens (laptops)
          xl: 48, // Even larger padding for extra-large screens (desktops)
        },
        paddingRight: {
          xs: 2, // Padding for extra-small screens (phones)
          sm: 12, // Padding for small screens (phones)
          md: 24, // Increased padding for medium screens (tablets)
          lg: 36, // Larger padding for large screens (laptops)
          xl: 48, // Even larger padding for extra-large screens (desktops)
        },
      }}
    >
      {messages.map((msg, index) => (
        <ChatBubble key={index} msg={msg} onCharacterTyped={triggerScroll} />
      ))}
      <div ref={chatEndRef} />
    </Box>
  );
}

export default ChatWindow;
