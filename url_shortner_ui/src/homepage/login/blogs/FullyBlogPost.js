import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Container, CircularProgress, Card, Divider } from '@mui/material';
import Header from '../../header';
import Footer from '../../footer';

function FullBlogPost() {
    const { id } = useParams(); // Get the blog post ID from the URL params
    const [blogPost, setBlogPost] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogPost = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:3000/api/blogs/${id}`);
                setBlogPost(response.data);
            } catch (error) {
                console.error('Error fetching blog post:', error.response?.data?.error || error.message);
                setError('Failed to load blog post.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPost();
    }, [id]); // Re-fetch if the ID in the URL changes

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
                    {loading && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                        <CircularProgress />
                    </Box>}
                    {error && <Typography color="error">{error}</Typography>}
                    {blogPost && (
                        <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
                            <Typography variant="h4" gutterBottom>
                                {blogPost.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                By {blogPost.author || 'Unknown'} | {blogPost.created_at ? new Date(blogPost.created_at).toLocaleDateString() : 'Unknown Date'}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                        </Card>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}

export default FullBlogPost;