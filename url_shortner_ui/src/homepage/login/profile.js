import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Box,
    IconButton,
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import LoginHeader from './loginheader'; // Adjust path as needed
import Footer from '../footer';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_BASE_URL = process.env.REACT_APP_BASE_URL; // Or get from environment variables

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("API Response in Frontend:", data);
                    setUserData(data);
                    setLoading(false);
                } else if (response.status === 401) {
                    setError('Unauthorized. Please log in again.');
                    setLoading(false);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('username');
                    navigate('/login');
                } else if (response.status === 404) {
                    setError('User profile not found.');
                    setLoading(false);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to fetch profile data.');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('Failed to connect to the server.');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleViewArchived = () => {
        navigate('/archived-blogs'); // Navigate to the archived blogs page
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // Ensure the container takes at least the full viewport height
            }}
        >
            <LoginHeader />
            <Container maxWidth="md" sx={{ mt: 4, flexGrow: 1 }}> {/* flexGrow will push the footer down */}
                <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            Your Profile
                        </Typography>
                        <IconButton color="primary" onClick={handleViewArchived}>
                            <ArchiveIcon />
                        </IconButton>
                    </Box>

                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : userData?.user ? (
                        <>
                            <TextField
                                label="ID"
                                value={userData.user.id || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Username"
                                value={userData.user.username || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={userData.user.email || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Full Name"
                                value={userData.user.full_name || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                fullWidth
                            />
                            {/* If your API returns these, uncomment and adjust accordingly */}
                            {/* <TextField */}
                            {/* label="Created On" */}
                            {/* value={userData.user.created_at ? new Date(userData.user.created_at).toLocaleString() : 'N/A'} */}
                            {/* InputProps={{ */}
                            {/* readOnly: true, */}
                            {/* }} */}
                            {/* variant="outlined" */}
                            {/* fullWidth */}
                            {/* /> */}
                            {/* {userData.user.profile_picture_url && ( */}
                            {/* <TextField */}
                            {/* label="Profile Picture URL" */}
                            {/* value={userData.user.profile_picture_url} */}
                            {/* InputProps={{ */}
                            {/* readOnly: true, */}
                            {/* }} */}
                            {/* variant="outlined" */}
                            {/* fullWidth */}
                            {/* /> */}
                            {/* )} */}
                        </>
                    ) : (
                        <Typography>No profile data available.</Typography>
                    )}

                    <Button
                        variant="outlined"
                        onClick={() => navigate('/settings')} // Assuming you have a settings page
                        sx={{ mt: 2 }}
                    >
                        Edit Profile/Settings
                    </Button>
                </Paper>
            </Container>
            <Footer sx={{ mt: 'auto' }} /> {/* mt: 'auto' will push the footer to the bottom */}
        </Box>
    );
};

export default Profile;