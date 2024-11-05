import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ChatBubble from "./ChatBubble";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

function ChatWindow({ messages, votes }) {
  const chatEndRef = useRef(null); // Reference to the end of chat window
  const chatWindowRef = useRef(null); // Reference to the beginning of chat window
  const prevScrollTopRef = useRef(0); // Track the previous scroll position
  const [dummy, setDummy] = useState(0); // Dummy state to trigger scrolling
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true); // State to control auto-scroll
  const [generating, setGenerating] = useState(false); // State to track if msg is generating
  const [showCheckmark, setShowCheckmark] = useState(false); // State to control checkmark visibility
  const [showIncorrectMark, setShowIncorrectMark] = useState(false); // State for incorrect mark
  const [fadeOut, setFadeOut] = useState(false); // Controls opacity transition
  const previousVotesRef = useRef(votes); // Store previous votes value

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

  const handleStopGeneration = () => {
    messages.at(-1).stop = true;
    setGenerating(false);
  };

  useEffect(() => {
    if (showCheckmark) {
      setFadeOut(false);
      setTimeout(() => setFadeOut(true), 10);
      setTimeout(() => {
        setFadeOut(false);
        setShowCheckmark(false);
      }, 2000);
    }
  }, [showCheckmark]);

  useEffect(() => {
    if (showIncorrectMark) {
      setFadeOut(false);
      setTimeout(() => setFadeOut(true), 10);
      setTimeout(() => {
        setFadeOut(false);
        setShowIncorrectMark(false);
      }, 2000);
    }
  }, [showIncorrectMark]);

  useEffect(() => {
    if (votes > previousVotesRef.current) {
      setShowCheckmark(true);
    } else if (votes < previousVotesRef.current) {
      setShowIncorrectMark(true);
    }
    previousVotesRef.current = votes;
  }, [votes]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      bgcolor="grey.100"
      sx={{
        borderRadius: "12px 12px 0 0",
        overflow: "auto",
        position: "relative",
      }}
    >
      <Box
        ref={chatWindowRef}
        onScroll={handleScroll}
        flex={1}
        overflow="auto"
        display="flex"
        flexDirection="column"
        sx={{
          height: "100%",
          maxHeight: "100%",
          p: 2,
        }}
      >
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            msg={msg}
            msgTextList={msg.text.split(" ")}
            onCharacterTyped={triggerScroll}
            setGenerating={setGenerating}
          />
        ))}
        <div ref={chatEndRef} />
      </Box>
      {showCheckmark && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255, 255, 255, 0.6)"
          sx={{
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 2s ease-in-out",
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 120,
              color: "green",
            }}
          />
        </Box>
      )}
      {showIncorrectMark && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255, 255, 255, 0.6)"
          sx={{
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 2s ease-in-out",
          }}
        >
          <CancelIcon
            sx={{
              fontSize: 120,
              color: "red",
            }}
          />
        </Box>
      )}
      {generating && (
        <Button
          variant="contained"
          onClick={handleStopGeneration}
          sx={{
            backgroundColor: "#e0e0e0",
            mb: 2,
            padding: "12px 16px",
            borderRadius: "12px",
            alignSelf: "center",
            minHeight: "48px",
            textTransform: "none",
          }}
        >
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: "#1976d2", // Green color for the square
              borderRadius: "4px",
              marginRight: "6px",
            }}
          />
          <Typography color="textPrimary">Stop generating…</Typography>
        </Button>
      )}
    </Box>
  );
}

export default ChatWindow;
