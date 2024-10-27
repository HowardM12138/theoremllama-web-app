import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// Component for text input and send button
function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() !== "") {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    // Check if the Enter key is pressed without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline from being added to the input
      handleSend();
    }
    // Allow Shift + Enter for creating a new line
  };

  return (
    <Box
      display="flex"
      p={2}
      borderTop={1}
      borderColor="grey.300"
      bgcolor="white"
    >
      <TextField
        variant="outlined"
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={handleKeyDown}
        autoComplete="off"
        multiline
        maxRows={5} // Limit the TextField to a maximum of 5 rows
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "15px",
          },
          "& .MuiInputBase-root": {
            overflowY: "auto",
          },
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        sx={{
          marginLeft: 2,
          borderRadius: "15px",
        }}
      >
        <SendIcon
          sx={{
            borderRadius: "50%",
            transform: "rotate(-45deg)",
            padding: "4px",
          }}
        />
      </Button>
    </Box>
  );
}

export default ChatInput;
