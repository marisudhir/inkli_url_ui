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
} from '@mui/material';
import { red } from '@mui/material/colors'; // Example color
import Header from '../../header';
import Footer from '../../footer';
import defaultImage from './default/blog_pic.jpg'; // Import the default image

function FullBlogPost() {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState([]); // State for related posts

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

        const fetchRelatedPosts = async () => {
            try {
                // Adjust the API endpoint and logic to fetch related posts
                const response = await axios.get('http://localhost:3000/api/blogs/list?limit=3'); // Example: Get latest 3
                setRelatedPosts(response.data.filter(post => post.id !== parseInt(id))); // Exclude current post
            } catch (error) {
                console.error('Error fetching related posts:', error.response?.data?.error || error.message);
            }
        };

        fetchBlogPost();
        fetchRelatedPosts(); // Fetch related posts on mount
    }, [id]);

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
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!blogPost) {
        return null;
    }

    // Extract the first few lines for a short description

    // const getFirstLines = (content, lineCount = 2) => {
    //     if (!content) return '';
    //     const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    //     const lines = plainText.split('\n').filter(line => line.trim() !== ''); // Split by lines and remove empty ones
    //     return lines.slice(0, lineCount).join('\n');
    // };

    // const shortDescription = getFirstLines(blogPost.content);

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

                        {/* Example: Author Information */}
                        {blogPost.author && (
                            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: red[500], mr: 2 }}>
                                    {blogPost.author[0].toUpperCase()}
                                </Avatar>
                                <Typography variant="subtitle2">About the Author: {blogPost.author.toUpperCase()}</Typography>
                                {/* You could fetch more author info here */}
                            </Box>
                        )}

                        {/* Example: Call to Action */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>Enjoyed this article?</Typography>
                            <Button variant="contained" color="primary">Subscribe for more!</Button>
                        </Box>
                    </Card>

                    {/* Attractive Related Blog Posts Section */}
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
                                                // Use relatedPost.image if it exists, otherwise use defaultImage
                                                image={relatedPost.image || defaultImage}
                                                alt={relatedPost.title}
                                                onError={(e) => {
                                                    // Optional: Handle image loading errors, e.g., set to default on error
                                                    e.target.onerror = null; // Prevent infinite loop
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
        </Box>
    );
}

export default FullBlogPost;