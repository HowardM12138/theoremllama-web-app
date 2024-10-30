import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, styled } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import ReactMarkdown from "react-markdown";

// Create a styled Typography component
const MarkdownContainer = styled(Typography)({
  "& *": {
    margin: 0, // This applies margin: 0 to all child elements
  },
});

function ChatBubble({ msg, msgTextList, onCharacterTyped, setGenerating }) {
  const [displayedText, setDisplayedText] = useState(""); // The current portion of displayed text
  const [currentIndex, setCurrentIndex] = useState(0); // Index to keep track of characters to be typed
  const typingInterval = 20; // Time interval in milliseconds

  // Effect to clear react useState cache when finished thinking
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    if (msg.sender === "bot" && msg.id !== "thinking") setGenerating(true);
  }, [msg.id]);

  // Effect to handle typing animation
  useEffect(() => {
    if (msg.stop) {
      return;
    }
    // Only start typing effect if it's a bot message
    if (msg.sender === "bot" && currentIndex < msgTextList.length) {
      // Set timeout for typing effect
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + " " + msgTextList[currentIndex]);
        if (onCharacterTyped) {
          onCharacterTyped();
        }
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, typingInterval);

      // Cleanup the timeout if the component unmounts or msg changes
      return () => clearTimeout(timeout);
    } else if (msg.sender !== "bot") {
      // Directly set the message for user input
      setDisplayedText(msg.text);
    } else if (msg.id !== "thinking") {
      setGenerating(false);
    }
  }, [currentIndex, msg, msg.stop]); // Depend on `currentIndex` and `msg` for effect

  const handleCopyClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(displayedText).catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    } else {
      console.warn("Clipboard API not supported");
    }
  };

  const handleShareClick = () => {
    alert(
      "This is a sharing functionality and will be implemented in the future."
    );
  };

  return (
    <Box
      display="flex"
      justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}
      my={1}
      position="relative"
    >
      {msg.sender === "bot" && (
        <SmartToyIcon
          sx={{ marginRight: 1, color: "#bdbdbd", alignSelf: "flex-end" }}
        />
      )}

      <Box
        display="flex"
        alignItems="center"
        bgcolor={msg.sender === "user" ? "#1976d2" : "#e0e0e0"}
        color={msg.sender === "user" ? "#FFFFFF" : "#333333"}
        p={1}
        borderRadius={
          msg.sender === "user" ? "15px 15px 0px 15px" : "15px 15px 15px 0px"
        }
        maxWidth="75%"
        position="relative"
      >
        <MarkdownContainer
          component="div"
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          <ReactMarkdown
            components={{
              ul: ({ node, ...props }) => (
                <ul style={{ whiteSpace: "normal" }} {...props} />
              ),
              li: ({ node, ...props }) => (
                <li style={{ whiteSpace: "normal" }} {...props} />
              ),
            }}
          >
            {displayedText}
          </ReactMarkdown>
        </MarkdownContainer>

        {msg.sender === "bot" && (
          <Box
            position="absolute"
            top={0}
            right={-25}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={0}
          >
            <IconButton
              size="small"
              sx={{ padding: 0.2 }}
              onClick={handleCopyClick}
            >
              <ContentCopyIcon fontSize="inherit" sx={{ fontSize: "1.1rem" }} />
            </IconButton>
            <IconButton
              size="small"
              sx={{ padding: 0.2 }}
              onClick={handleShareClick}
            >
              <ShareIcon fontSize="inherit" sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {msg.sender === "user" && (
        <AccountCircleIcon
          sx={{ marginLeft: 1, color: "#1976d2", alignSelf: "flex-end" }}
        />
      )}
    </Box>
  );
}

export default ChatBubble;
