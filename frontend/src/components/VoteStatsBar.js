import React from "react";
import { Box, Typography } from "@mui/material";

function VoteStatsBar({ leftVotes, rightVotes }) {
  // Calculate total votes and percentages
  const totalVotes = leftVotes + rightVotes;
  const leftPercentage = totalVotes === 0 ? 50 : (leftVotes / totalVotes) * 100;
  const rightPercentage = 100 - leftPercentage;

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        mb: 2,
        mt: { xs: 1, lg: 0 },
      }}
      width="100%"
    >
      {/* Left Vote Count */}
      <Typography
        variant="h6"
        sx={{
          mr: 1,
          pl: { xs: 1, lg: 0 },
        }}
      >
        {leftVotes}
      </Typography>

      {/* PK Bar */}
      <Box
        display="flex"
        flex={1}
        height="30px"
        borderRadius="15px"
        overflow="hidden"
      >
        {/* Left Portion of the Bar */}
        <Box
          width={`${leftPercentage}%`}
          bgcolor="#1976d2"
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          px={1}
          sx={{
            backgroundImage:
              "repeating-linear-gradient(60deg, #1976d2, #1976d2 10px, #1565c0 10px, #1565c0 20px)",
          }}
        >
          {leftVotes > 0 && (
            <Typography variant="body2" color="white">
              {Math.round(leftPercentage)}%
            </Typography>
          )}
        </Box>

        {/* Right Portion of the Bar */}
        <Box
          width={`${rightPercentage}%`}
          bgcolor="#e57373"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          px={1}
          sx={{
            backgroundImage:
              "repeating-linear-gradient(60deg, #e0e0e0, #e0e0e0 10px, #cccccc 10px, #cccccc 20px)",
          }}
        >
          {rightVotes > 0 && (
            <Typography variant="body2" color="black">
              {Math.round(rightPercentage)}%
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right Vote Count */}
      <Typography
        variant="h6"
        sx={{
          ml: 1,
          pr: { xs: 1, lg: 0 },
        }}
      >
        {rightVotes}
      </Typography>
    </Box>
  );
}

export default VoteStatsBar;
