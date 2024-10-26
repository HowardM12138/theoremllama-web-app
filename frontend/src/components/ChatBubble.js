import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy';

function ChatBubble({ msg, onCharacterTyped }) {
    const [displayedText, setDisplayedText] = useState(''); // The current portion of displayed text
    const [currentIndex, setCurrentIndex] = useState(0); // Index to keep track of characters to be typed
    const typingInterval = 5; // Time interval in milliseconds

    // Effect to handle typing animation
    useEffect(() => {
        // Only start typing effect if it's a bot message
        if (msg.sender === 'bot' && currentIndex < msg.text.length) {
            // Set timeout for typing effect
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + msg.text[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
                if (onCharacterTyped) {
                    onCharacterTyped();
                }
            }, typingInterval);

            // Cleanup the timeout if the component unmounts or msg changes
            return () => clearTimeout(timeout);
        } else if (msg.sender !== 'bot') {
            // Directly set the message for user input
            setDisplayedText(msg.text);
        }
    }, [currentIndex, msg]); // Depend on `currentIndex` and `msg` for effect

    return (
        <Box
            display="flex"
            justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            my={1}
        >
            {msg.sender === 'bot' && (
                <SmartToyIcon
                    sx={{ marginRight: 1, color: '#FF6F61', alignSelf: 'flex-end' }}
                />
            )}

            <Box
                display="flex"
                alignItems="center"
                bgcolor={msg.sender === 'user' ? '#6C63FF' : '#FFD166'}
                color={msg.sender === 'user' ? '#FFFFFF' : '#333333'}
                p={1}
                borderRadius={msg.sender === 'user' ? '15px 15px 0px 15px' : '15px 15px 15px 0px'}
                maxWidth="75%"
            >
                <Typography sx={{ whiteSpace: 'pre-wrap' }}> {displayedText} </Typography>
            </Box>

            {msg.sender === 'user' && (
                <AccountCircleIcon
                    sx={{ marginLeft: 1, color: '#6C63FF', alignSelf: 'flex-end' }}
                />
            )}
        </Box>
    );
}

export default ChatBubble;