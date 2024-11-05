import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";

function VoteBar({ setLeftVotes, setRightVotes, messages }) {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [voteable, setVoteable] = useState(true);

  const handleLeftClick = () => {
    setLeftVotes((prev) => prev + 1);
    setRightVotes((prev) => prev - 1);
    setVoteable(false);
  };

  const handleRightClick = () => {
    setLeftVotes((prev) => prev - 1);
    setRightVotes((prev) => prev + 1);
    setVoteable(false);
  };

  useEffect(() => {
    setVoteable(true);
  }, [messages]);

  return (
    <Box
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      my={1}
    >
      <Button
        variant={hoveredButton === "left" ? "contained" : "outlined"}
        onMouseEnter={() => setHoveredButton("left")}
        onMouseLeave={() => setHoveredButton(null)}
        onClick={handleLeftClick}
        disabled={!voteable}
        sx={{
          width: "50%",
          color:
            hoveredButton === null
              ? "white"
              : hoveredButton === "left"
              ? "white"
              : "black",
          backgroundColor:
            hoveredButton === null
              ? "#1976d2"
              : hoveredButton === "left"
              ? "#1976d2"
              : "#e0e0e0",
          marginRight: 2,
        }}
      >
        {hoveredButton === null
          ? "VOTE"
          : hoveredButton === "left"
          ? "BETTER"
          : "WORSE"}
      </Button>
      <Button
        variant={hoveredButton === "right" ? "contained" : "outlined"}
        onMouseEnter={() => setHoveredButton("right")}
        onMouseLeave={() => setHoveredButton(null)}
        onClick={handleRightClick}
        disabled={!voteable}
        sx={{
          width: "50%",
          color:
            hoveredButton === null
              ? "white"
              : hoveredButton === "right"
              ? "white"
              : "black",
          backgroundColor:
            hoveredButton === null
              ? "#1976d2"
              : hoveredButton === "right"
              ? "#1976d2"
              : "#e0e0e0",
        }}
      >
        {hoveredButton === null
          ? "VOTE"
          : hoveredButton === "right"
          ? "BETTER"
          : "WORSE"}
      </Button>
    </Box>
  );
}

export default VoteBar;
