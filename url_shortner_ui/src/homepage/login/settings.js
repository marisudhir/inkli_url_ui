import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import LoginHeader from './loginheader'; // Adjust path as needed
import Footer from '../footer';

const Settings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [deactivateConfirmation, setDeactivateConfirmation] = useState(false);
    const [deactivateError, setDeactivateError] = useState('');
    const [deactivateSuccess, setDeactivateSuccess] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
        // You might want to fetch user details here if you want to display current settings
        // For example, current email, etc.
    }, [navigate]);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setError('Please enter old password, new password, and confirm new password.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://http://143.110.246.124//api/user/profile/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (response.ok) {
                setSuccessMessage('Password updated successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else if (response.status === 401) {
                const errorData = await response.json();
                setError(errorData.error || 'Invalid old password.');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update password.');
            }
        } catch (err) {
            console.error('Error updating password:', err);
            setError('Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateAccount = async () => {
        if (!deactivateConfirmation) {
            setDeactivateError('Please confirm account deactivation.');
            return;
        }

        setLoading(true);
        setDeactivateError('');
        setDeactivateSuccess('');

        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://http://143.110.246.124//api/user/profile/deactivate', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setDeactivateSuccess('Account deactivated successfully. You will be logged out.');
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Redirect after a short delay
            } else {
                const errorData = await response.json();
                setDeactivateError(errorData.error || 'Failed to deactivate account.');
            }
        } catch (err) {
            console.error('Error deactivating account:', err);
            setDeactivateError('Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <LoginHeader />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Settings
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}

                    <Typography variant="h6">
                        Change Password
                    </Typography>
                    <TextField
                        label="Old Password"
                        type="password"
                        fullWidth
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Update Password'}
                    </Button>

                    <Typography variant="h6" sx={{ mt: 3 }}>
                        Deactivate Account
                    </Typography>
                    {deactivateError && <Alert severity="error">{deactivateError}</Alert>}
                    {deactivateSuccess && <Alert severity="success">{deactivateSuccess}</Alert>}
                    <Typography color="warning">
                        Warning: Deactivating your account will permanently disable it and may result in loss of data.
                        Are you sure you want to proceed?
                    </Typography>
                    <label>
                        <input
                            type="checkbox"
                            checked={deactivateConfirmation}
                            onChange={(e) => setDeactivateConfirmation(e.target.checked)}
                        />
                        I confirm that I want to deactivate my account.
                    </label>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeactivateAccount}
                        disabled={loading || !deactivateConfirmation}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Deactivate Account'}
                    </Button>
                </Paper>
            </Container>
            <br />
            <Footer />
        </>
    );
};

export default Settings;