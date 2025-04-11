import React, { useState, useRef, useEffect } from "react"; // Added useEffect
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
import LoginIcon from '@mui/icons-material/Login'; // Import LoginIcon
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material'; // Import Typography

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// --- Styled Components (Keep as they are) ---
const StyledContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(12),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(16),
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
        flexDirection: 'column', // Keep as column
        alignItems: 'flex-start',
    },
}));

const StyledShortenedURL = styled(TextField)(({ theme }) => ({
    width: '100%',
}));

const StyledActionButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1), // Reduced margin slightly
    flexWrap: 'wrap', // Allow buttons to wrap on small screens
    width: '100%',
}));
// --- End Styled Components ---


function ShortURLSample() {
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    // Client-side count is mainly for UX feedback, backend enforces the real limit
    const [anonShortenedCount, setAnonShortenedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    // Snackbar states
    const [limitSnackbarOpen, setLimitSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");
    const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);

    const shortenedUrlRef = useRef(null);
    const API_BASE_URL = "http://localhost:3000"; // Define base URL

    // --- Load anonymous count from local storage on mount ---
    useEffect(() => {
        const storedCount = localStorage.getItem('anonymousUrlCount');
        setAnonShortenedCount(storedCount ? parseInt(storedCount, 10) : 0);
    }, []);


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setLimitSnackbarOpen(false);
        setErrorSnackbarOpen(false);
        setInfoSnackbarOpen(false);
        setCopySnackbarOpen(false);
    };

    const handleShortenUrl = async () => {
        // --- Preliminary Client-Side Checks ---
        if (anonShortenedCount >= 5) {
            setLimitSnackbarOpen(true);
            return;
        }

        if (!longUrl.trim()) {
            setErrorMessage("Please enter a valid Long URL.");
            setErrorSnackbarOpen(true);
            return;
        }
        try {
            new URL(longUrl); // Basic URL format validation
            if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
                throw new Error('Invalid protocol');
            }
        } catch (_) {
            setErrorMessage("Invalid URL format or protocol (must start with http:// or https://).");
            setErrorSnackbarOpen(true);
            return;
        }


        setIsLoading(true); // Start loading indicator
        setShortUrl(""); // Clear previous short URL
        setErrorSnackbarOpen(false); // Clear previous errors
        setInfoSnackbarOpen(false);

        // --- API Endpoint for Anonymous Users ---
        const apiUrl = `${API_BASE_URL}/api/public/shorten`;

        const headers = {
            "Content-Type": "application/json",
        };

        // --- Make API Call ---
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ url: longUrl }),
            });

            const data = await response.json(); // Try to parse JSON regardless of status

            if (response.ok) { // Status 200-299
                setShortUrl(data.shortUrl);
                setInfoMessage(data.message || "URL shortened successfully!");
                setInfoSnackbarOpen(true);

                // Increment anonymous count and store it
                const newCount = anonShortenedCount + 1;
                setAnonShortenedCount(newCount);
                localStorage.setItem('anonymousUrlCount', newCount.toString());
                if (newCount >= 5) {
                    setLimitSnackbarOpen(true);
                }

            } else if (response.status === 429) { // Backend limit reached
                setErrorMessage(data.error || "You have reached the anonymous URL creation limit. Please create an account.");
                setErrorSnackbarOpen(true);
            }
             else {
                // Handle other error statuses
                setErrorMessage(data.error || `Request failed with status ${response.status}`);
                setErrorSnackbarOpen(true);
            }
        } catch (error) {
            console.error("API Fetch Error:", error);
            setErrorMessage("Failed to connect to the server. Please check your connection and try again.");
            setErrorSnackbarOpen(true);
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    // --- Action Handlers (Copy, Open, Refresh) ---
    const handleCopyClick = () => {
        if (shortUrl) {
            const fullShortUrl = `${API_BASE_URL}/${shortUrl}`; // Use base URL
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
        setErrorSnackbarOpen(false); // Clear errors on refresh
        setInfoSnackbarOpen(false);
    };

    // --- Render Component ---
    return (
        <>
            <StyledContainer>
                {/* Optional: Add a title */}


                <StyledTextField
                    fullWidth
                    id="long-url-input"
                    label="Enter your long URL (e.g., https://example.com)"
                    variant="outlined"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    disabled={isLoading || anonShortenedCount >= 5}
                />
                <StyledButton
                    onClick={handleShortenUrl}
                    variant="contained"
                    startIcon={<AutoAwesomeIcon />}
                    disabled={isLoading || anonShortenedCount >= 5} // Disable if loading or anon limit reached
                >
                    {isLoading ? "Shortening..." : "Shorten URL"}
                </StyledButton>

                {/* Display message if anonymous limit is reached */}
                {anonShortenedCount >= 5 && (
                    <Typography color="error" variant="caption">
                        Anonymous limit reached. <Button size="small" onClick={() => {/* Navigate to your registration page */ window.location.href = '/register'; }}>Create Account</Button> to create unlimited links.
                    </Typography>
                )}


                {shortUrl && (
                    <StyledShortenedURLContainer>
                        <Typography variant="h6" gutterBottom>Your Shortened Link:</Typography>
                        <StyledShortenedURL
                            label="Shortened URL"
                            id="short-url-output"
                            value={`${API_BASE_URL}/${shortUrl}`} // Display full URL
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
                            // Removed onClick to open, use dedicated button instead
                        />
                        <StyledActionButtons>
                            <Button
                                variant="outlined"
                                size="small" // Make buttons smaller
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

            {/* --- Snackbars for Feedback --- */}
            <Snackbar open={limitSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                    Anonymous limit of {anonShortenedCount}/5 short URLs reached. <Button color="inherit" size="small" startIcon={<LoginIcon />} onClick={() => { window.location.href = '/register'; }}>Create Account</Button> for unlimited usage!
                </Alert>
            </Snackbar>

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

export default ShortURLSample;