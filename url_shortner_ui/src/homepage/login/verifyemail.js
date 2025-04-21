import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Alert } from '@mui/material';
import Header from '../header';
import Footer from '../footer';
const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_BASE_URL; // Or get from environment variables

    useEffect(() => {
        if (token) {
            const verifyEmail = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`);
                    const data = await response.json();

                    if (response.ok) {
                        setMessage(data.message);
                        // Optionally redirect to login after a delay
                        setTimeout(() => {
                            navigate('/login');
                        }, 3000);
                    } else {
                        setError(data.error || 'Email verification failed.');
                    }
                } catch (err) {
                    setError('Network error. Please try again.');
                    console.error('Verification error:', err);
                }
            };

            verifyEmail();
        } else {
            setError('Verification token is missing from the URL.');
        }
    }, [token, navigate]);

    return (
        <>
        <Header/>
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Typography variant="h4" gutterBottom>Verify Email</Typography>
                {message && <Alert severity="success">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                {!message && !error && <Typography>Verifying your email...</Typography>}
            </Container>
        <Footer/>
            </>
    );
};

export default VerifyEmail;