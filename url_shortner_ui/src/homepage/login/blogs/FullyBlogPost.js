import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Card,
    Divider,
    Grid,
    Avatar,
    Button,
    CardMedia,
    CardContent,
    Modal,
    TextField,
    Snackbar, // Import Snackbar for success message
    Alert // Import Alert for error message
} from '@mui/material';
import { red } from '@mui/material/colors';
import Header from '../../header';
import Footer from '../../footer';
import defaultImage from './default/blog_pic.jpg';
const BASE_URL = process.env.REACT_APP_BASE_URL;

function FullBlogPost() {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState({ open: false, message: '', severity: 'success' }); // State for Snackbar

    useEffect(() => {
        const fetchBlogPost = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`${BASE_URL}/blogs/post/${id}`);
                setBlogPost(response.data);
            } catch (error) {
                console.error('Error fetching blog post:', error.response?.data?.error || error.message);
                setError('Failed to load blog post.');
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedPosts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/blogs/list?limit=3`);
                setRelatedPosts(response.data.filter(post => post.id !== parseInt(id)));
            } catch (error) {
                console.error('Error fetching related posts:', error.response?.data?.error || error.message);
            }
        };

        fetchBlogPost();
        fetchRelatedPosts();
    }, [id]);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEmail('');
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubscribe = async () => {
        try {
            // Basic email validation
            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                setSubscriptionStatus({ open: true, message: 'Invalid email format.', severity: 'error' });
                return;
            }

            const response = await axios.post(`${BASE_URL}/subscribe/subscribe/${blogPost.author_id}`, { email }); // Use author_id from blogPost
            setSubscriptionStatus({ open: true, message: response.data.message, severity: 'success' }); // Use message from response
            handleCloseModal();

        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to subscribe. Please try again later.';
            setError(errorMessage); // Set error state for error boundary
            setSubscriptionStatus({ open: true, message: errorMessage, severity: 'error' });
        }
    };

    const handleStatusClose = () => {
        setSubscriptionStatus({ ...subscriptionStatus, open: false });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!blogPost) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header />
            <Box sx={{ flexGrow: 1, py: 4, bgcolor: '#f9f9f9' }}>
                <Container maxWidth="md">
                    <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2, mb: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            {blogPost.title}
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            By {blogPost.author.toUpperCase() || 'Unknown'} | {new Date(blogPost.created_at).toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

                        {blogPost.author && (
                            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: red[500], mr: 2 }}>
                                    {blogPost.author[0].toUpperCase()}
                                </Avatar>
                                <Typography variant="subtitle2">About the Author: {blogPost.author.toUpperCase()}</Typography>
                            </Box>
                        )}

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>Enjoyed this article?</Typography>
                            <Button variant="contained" color="primary" onClick={handleOpenModal}>
                                Subscribe for more!
                            </Button>
                        </Box>
                    </Card>

                    {relatedPosts.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>You might also like:</Typography>
                            <Grid container spacing={3}>
                                {relatedPosts.map(relatedPost => (
                                    <Grid item xs={12} sm={6} md={4} key={relatedPost.id}>
                                        <Card
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                },
                                            }}
                                            component={Link}
                                            to={`/blog/${relatedPost.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={relatedPost.image || defaultImage}
                                                alt={relatedPost.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {relatedPost.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    By {relatedPost.author.toUpperCase() || 'Unknown'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {new Date(relatedPost.created_at).toLocaleDateString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </Box>
            <Footer />

            {/* Subscription Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="subscribe-modal-title"
                aria-describedby="subscribe-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="subscribe-modal-title" variant="h6" component="h2" gutterBottom>
                        Subscribe to our Newsletter
                    </Typography>
                    <Typography id="subscribe-modal-description" sx={{ mb: 2 }}>
                        Enter your email address to receive the latest updates and articles.
                    </Typography>
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={handleEmailChange}
                        margin="normal"
                        type="email"
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubscribe}>
                            Subscribe
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar
                open={subscriptionStatus.open}
                autoHideDuration={6000}
                onClose={handleStatusClose}
            >
                <Alert
                  onClose={handleStatusClose}
                  severity={subscriptionStatus.severity}
                  sx={{ width: '100%' }}
                >
                    {subscriptionStatus.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default FullBlogPost;
