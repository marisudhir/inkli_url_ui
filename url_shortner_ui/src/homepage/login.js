import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming Header and Footer are components in your project structure
import Header from './header'; // Uncomment if needed
import Footer from './footer';  // Uncomment if needed
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Styled Components (Keep as they are or adjust as needed) ---
const StyledContainer = styled(Container)(({ theme }) => ({
    // Add minHeight and flex properties to work better with Header/Footer
    minHeight: 'calc(100vh - 128px)', // Adjust 128px based on Header/Footer height
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const StyledFormWrapper = styled(Box)(({ theme }) => ({
    width: '100%', // Ensure form takes full width of container
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center items within the form box
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1, 0, 1), // Adjusted margin slightly
    width: '100%', // Ensure text fields take full width
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
    width: '100%', // Ensure button takes full width
}));
// --- End Styled Components ---

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Define API base URL
    const API_BASE_URL = 'http://localhost:3000'; // Or get from environment variables

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors
        setLoading(true);

        // Basic frontend validation
        if (!username || !password) {
            setError('Username and password are required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, { // Use correct endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username.trim(), password }), // Send trimmed username
            });

            const data = await response.json(); // Try to parse JSON response

            if (response.ok) { // Status 200-299
                // --- Store authentication data ---
                localStorage.setItem('authToken', data.token); // Use 'authToken' key
                localStorage.setItem('userId', data.userId);     // Store userId
                localStorage.setItem('username', data.username); // Store username

                console.log('Login successful, token stored.');
                setLoading(false);

                // --- Redirect after successful login ---
                // Redirect to dashboard or maybe previous page if stored
                navigate('/dashboard'); // Or use navigate(-1) to go back

            } else {
                // Handle specific errors based on status code or backend message
                const errorMessage = data.error || `Login failed with status ${response.status}. Please try again.`;
                console.error('Login failed:', errorMessage);
                setError(errorMessage); // Display error from backend or a generic one
                setLoading(false);
            }
        } catch (error) {
            console.error('Login fetch error:', error);
            setError('Failed to connect to the server. Please check your connection.');
            setLoading(false);
        }
    };

    return (
        // Use Box for overall layout if needed with Header/Footer
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />  {/* Uncomment if you have a Header component */}
            <StyledContainer component="main" maxWidth="xs"> {/* component="main" is semantically better */}
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <StyledFormWrapper component="form" onSubmit={handleLogin} noValidate>
                    {/* Corrected Username Field */}
                    <StyledTextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="username" // Corrected ID
                        label="Username" // Corrected Label
                        name="username" // Corrected Name
                        autoComplete="username" // Corrected autoComplete
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                    {/* Password Field (looks okay) */}
                    <StyledTextField
                        variant="outlined"
                        margin="normal"
                        required
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <StyledButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </StyledButton>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 1 }}>
                            {error}
                        </Alert>
                    )}
                     {/* Optional: Add Link to Registration Page */}
                     {/* <Box textAlign="center" sx={{ mt: 2 }}>
                         <Link component={RouterLink} to="/register" variant="body2">
                            {"Don't have an account? Sign Up"}
                         </Link>
                     </Box> */}
                </StyledFormWrapper>
            </StyledContainer>
             <Footer />  {/* Uncomment if you have a Footer component */}
        </Box>
    );
};

export default Login;