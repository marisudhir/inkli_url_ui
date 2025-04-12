import React, { useState, useRef } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InputAdornment from '@mui/material/InputAdornment';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';

import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import LoginHeader from './loginheader'; // Import the LoginHeader

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4), // Adjusted margin
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: '70%',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

const StyledShortenedURLContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        width: '70%',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));

const StyledShortenedURL = styled(TextField)(({ theme }) => ({
    width: '100%',
}));

const StyledActionButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    flexWrap: 'wrap',
    width: '100%',
}));

function CreateUrl() { // Renamed component to CreateUrl to be more specific
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");
    const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);

    const shortenedUrlRef = useRef(null);
    const API_BASE_URL = "http://http://http://localhost:3000/";

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorSnackbarOpen(false);
        setInfoSnackbarOpen(false);
        setCopySnackbarOpen(false);
    };

    const handleShortenUrl = async () => {
        if (!longUrl.trim()) {
            setErrorMessage("Please enter a valid Long URL.");
            setErrorSnackbarOpen(true);
            return;
        }
        try {
            new URL(longUrl);
            if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
                throw new Error('Invalid protocol');
            }
        } catch (_) {
            setErrorMessage("Invalid URL format or protocol (must start with http:// or https://).");
            setErrorSnackbarOpen(true);
            return;
        }

        setIsLoading(true);
        setShortUrl("");
        setErrorSnackbarOpen(false);
        setInfoSnackbarOpen(false);

        const token = localStorage.getItem('authToken');
        const apiUrl = `${API_BASE_URL}/api/urls/shorten`;
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ url: longUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                setShortUrl(data.shortUrl);
                setInfoMessage(data.message || "Permanent URL created successfully!");
                setInfoSnackbarOpen(true);
                setLongUrl(""); // Clear input after successful shortening
            } else {
                setErrorMessage(data.error || `Request failed with status ${response.status}`);
                setErrorSnackbarOpen(true);
                if (response.status === 401 || response.status === 403) {
                    console.warn("Auth error:", data.error);
                    // Optionally redirect to login or show specific auth message
                }
            }
        } catch (error) {
            console.error("API Fetch Error:", error);
            setErrorMessage("Failed to connect to the server. Please check your connection and try again.");
            setErrorSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyClick = () => {
        if (shortUrl) {
            const fullShortUrl = `${API_BASE_URL}/${shortUrl}`;
            navigator.clipboard.writeText(fullShortUrl)
                .then(() => {
                    setCopySnackbarOpen(true);
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err);
                    setErrorMessage('Failed to copy link to clipboard.');
                    setErrorSnackbarOpen(true);
                });
        }
    };

    const handleOpenClick = () => {
        if (shortUrl) {
            window.open(`${API_BASE_URL}/${shortUrl}`, '_blank', 'noopener,noreferrer');
        }
    };

    const handleRefreshClick = () => {
        setLongUrl("");
        setShortUrl("");
        setErrorSnackbarOpen(false);
        setInfoSnackbarOpen(false);
    };

    return (
        <>
            <LoginHeader /> {/* Include the LoginHeader for navigation */}
            <StyledContainer>
                <Typography variant="h5" gutterBottom>
                    Create Permanent Short URL
                </Typography>

                <StyledTextField
                    fullWidth
                    id="long-url-input"
                    label="Enter the URL you want to shorten"
                    variant="outlined"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    disabled={isLoading}
                />
                <StyledButton
                    onClick={handleShortenUrl}
                    variant="contained"
                    startIcon={<AutoAwesomeIcon />}
                    disabled={isLoading}
                >
                    {isLoading ? "Shortening..." : "Shorten"}
                </StyledButton>

                {shortUrl && (
                    <StyledShortenedURLContainer>
                        <Typography variant="h6" gutterBottom>Your Permanent Shortened Link:</Typography>
                        <StyledShortenedURL
                            label="Shortened URL"
                            id="short-url-output"
                            value={`${API_BASE_URL}/${shortUrl}`}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AutoFixHighIcon />
                                    </InputAdornment>
                                ),
                                readOnly: true,
                            }}
                            variant="outlined"
                            inputRef={shortenedUrlRef}
                        />
                        <StyledActionButtons>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopyClick}
                                disabled={isLoading}
                            >
                                Copy
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<OpenInNewIcon />}
                                onClick={handleOpenClick}
                                disabled={isLoading}
                            >
                                Open
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<RefreshIcon />}
                                onClick={handleRefreshClick}
                                disabled={isLoading}
                            >
                                New URL
                            </Button>
                        </StyledActionButtons>
                    </StyledShortenedURLContainer>
                )}
            </StyledContainer>

            <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={infoSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    {infoMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={copySnackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Link copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    );
}

export default CreateUrl;