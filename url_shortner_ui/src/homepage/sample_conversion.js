import React, { useState, useRef, useEffect } from "react";
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
import LoginIcon from '@mui/icons-material/Login';
import QrCodeIcon from '@mui/icons-material/QrCode'; // Import QR Code Icon
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { saveAs } from 'file-saver'; // Import file-saver

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
    marginTop: theme.spacing(1),
    flexWrap: 'wrap',
    width: '100%',
}));
// --- End Styled Components ---


function ShortURLSample() {
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [anonShortenedCount, setAnonShortenedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [limitSnackbarOpen, setLimitSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");
    const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);
    const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false); // State for QR dialog
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');  // State to store the QR code data URL

    const shortenedUrlRef = useRef(null);
    const API_BASE_URL = process.env.REACT_APP_BASE_URL;
    const API_BASE_URL_PLAIN = process.env.REACT_APP_BASE_URL_PLAIN;

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

        const apiUrl = `${API_BASE_URL}/public/shorten`;
        const headers = {
            "Content-Type": "application/json",
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ url: longUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                setShortUrl(data.shortUrl);
                setInfoMessage(data.message || "URL shortened successfully!");
                setInfoSnackbarOpen(true);

                const newCount = anonShortenedCount + 1;
                setAnonShortenedCount(newCount);
                localStorage.setItem('anonymousUrlCount', newCount.toString());
                if (newCount >= 5) {
                    setLimitSnackbarOpen(true);
                }

            } else if (response.status === 429) {
                setErrorMessage(data.error || "You have reached the anonymous URL creation limit. Please create an account.");
                setErrorSnackbarOpen(true);
            }
            else {
                setErrorMessage(data.error || `Request failed with status ${response.status}`);
                setErrorSnackbarOpen(true);
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
            const fullShortUrl = `${API_BASE_URL_PLAIN}/${shortUrl}`;
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

    // --- QR Code Handlers ---
    const handleGenerateQrCode = async () => {
        if (!shortUrl) return;

        setIsLoading(true);
        const qrCodeUrl = `${API_BASE_URL}/qrcode?url=${encodeURIComponent(`${API_BASE_URL_PLAIN}/${shortUrl}`)}`; // Corrected URL

        try {
            const response = await fetch(qrCodeUrl);
            const data = await response.json();
            if(response.ok){
              setQrCodeDataUrl(data.qrCode);
              setQrCodeDialogOpen(true);
            }
            else{
              setErrorMessage("Failed to generate QR Code");
              setErrorSnackbarOpen(true);
            }

        } catch (error) {
            console.error("QR Code Fetch Error:", error);
            setErrorMessage("Failed to generate QR code. Please check your connection.");
            setErrorSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseQrCodeDialog = () => {
        setQrCodeDialogOpen(false);
        setQrCodeDataUrl('');
    };

    const handleDownloadQrCode = () => {
        if (qrCodeDataUrl) {
            // Extract the base64 data
            const base64Data = qrCodeDataUrl.split(',')[1];
            // Decode base64
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            // Create a Blob
            const blob = new Blob([byteArray], { type: 'image/png' }); // Or 'image/jpeg', etc.
            // Use file-saver to download
            saveAs(blob, `shorturl_qrcode_${shortUrl}.png`);
        }
    };

    const handleCopyQrCode = () => {
        if (qrCodeDataUrl) {
            // Convert base64 to a Blob (required for clipboard)
              const base64Data = qrCodeDataUrl.split(',')[1];
              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'image/png' });
            // Use the Clipboard API to copy the image
            const data = [new ClipboardItem({
                'image/png': blob
            })];
            navigator.clipboard.write(data).then(() => {
                setCopySnackbarOpen(true);
            }).catch(err => {
                console.error('Failed to copy image: ', err);
                setErrorMessage('Failed to copy QR code image.');
                setErrorSnackbarOpen(true);
            });
        }
    };

    // --- Render Component ---
    return (
        <>
            <StyledContainer>
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
                    disabled={isLoading || anonShortenedCount >= 5}
                >
                    {isLoading ? "Shortening..." : "Shorten URL"}
                </StyledButton>

                {anonShortenedCount >= 5 && (
                    <Typography color="error" variant="caption">
                        Anonymous limit reached. <Button size="small" onClick={() => { window.location.href = '/register'; }}>Create Account</Button> to create unlimited links.
                    </Typography>
                )}

                {shortUrl && (
                    <StyledShortenedURLContainer>
                        <Typography variant="h6" gutterBottom>Your Shortened Link:</Typography>
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
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<QrCodeIcon />}
                                onClick={handleGenerateQrCode}
                                disabled={isLoading}
                            >
                                QR Code
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

            {/* --- QR Code Dialog --- */}
            <Dialog open={qrCodeDialogOpen} onClose={handleCloseQrCodeDialog}>
                <DialogTitle>QR Code for Shortened URL</DialogTitle>
                <DialogContent>
                    {qrCodeDataUrl && (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                            <img src={qrCodeDataUrl} alt="QR Code" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                            <StyledActionButtons>
                                <Button variant="contained" onClick={handleCopyQrCode} disabled={isLoading}>
                                    Copy QR Code
                                </Button>
                                <Button variant="contained" onClick={handleDownloadQrCode} disabled={isLoading}>
                                    Download QR Code
                                </Button>
                            </StyledActionButtons>
                        </Box>

                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ShortURLSample;