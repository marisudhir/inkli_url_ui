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
} from '@mui/material';
import LoginHeader from './loginheader'; // Adjust path as needed
import Footer from '../footer';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                const response = await fetch('http://http://http://localhost:3000//api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("API Response in Frontend:", data); // Log the response
                    setUserData(data); // The entire response object
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

    return (
        <>
            <LoginHeader />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Your Profile
                    </Typography>

                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : userData?.user ? ( // Access the 'user' property
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
                            {/* The 'created_at' and 'profile_picture_url' are not in the response you provided */}
                            {/* If your API returns these, you would access them like: */}
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
            <br></br>
            <Footer/>
        </>
    );
};

export default Profile;