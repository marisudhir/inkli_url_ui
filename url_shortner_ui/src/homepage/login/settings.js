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
import LoginHeader from '../components/LoginHeader'; // Adjust path as needed

const Settings = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updatedFullName, setUpdatedFullName] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');

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
                const response = await fetch('http://localhost:3000/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setUpdatedFullName(data.full_name || '');
                    setUpdatedEmail(data.email || '');
                    setLoading(false);
                } else if (response.status === 401) {
                    setError('Unauthorized. Please log in again.');
                    setLoading(false);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('username');
                    navigate('/login');
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

    const handleFullNameChange = (event) => {
        setUpdatedFullName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setUpdatedEmail(event.target.value);
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ full_name: updatedFullName, email: updatedEmail }),
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                setUpdatedFullName(data.full_name || '');
                setUpdatedEmail(data.email || '');
                setSuccessMessage('Profile updated successfully!');
                setLoading(false);
            } else if (response.status === 401) {
                setError('Unauthorized. Please log in again.');
                setLoading(false);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                navigate('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update profile.');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to connect to the server.');
            setLoading(false);
        }
    };

    return (
        <>
            <LoginHeader />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Edit Your Profile
                    </Typography>

                    {loading && <CircularProgress />}
                    {error && <Alert severity="error">{error}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}

                    {userData && (
                        <>
                            <TextField
                                label="Username"
                                value={userData.username || 'N/A'}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Full Name"
                                value={updatedFullName}
                                onChange={handleFullNameChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={updatedEmail}
                                onChange={handleEmailChange}
                                variant="outlined"
                                fullWidth
                            />
                            {/* You can add more editable fields here */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateProfile}
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                Update Profile
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/profile')}
                                sx={{ mt: 1 }}
                            >
                                Back to Profile
                            </Button>
                        </>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default Settings;