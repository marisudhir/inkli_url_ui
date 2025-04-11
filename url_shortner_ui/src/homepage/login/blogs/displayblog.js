import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Avatar,
    IconButton,
    Typography,
    CardActions,
    Box,
    Menu,
    MenuItem,
} from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import Header from '../../header';
import Footer from '../../footer';
import { useNavigate } from 'react-router-dom';

function MainLayout({ children }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // Ensure the container takes at least the full viewport height
            }}
        >
            <Header />
            <Box sx={{ flexGrow: 1 }}>{children}</Box> {/* This will push the footer down */}
            <Footer />
        </Box>
    );
}

export default function DisplayBlog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const open = Boolean(anchorEl);

    const fetchBlogPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/blogs/list');
            setBlogPosts(response.data);
        } catch (error) {
            console.error('Error fetching blog posts:', error.response?.data?.error || error.message);
            setError('Failed to load blog posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const handleMenuOpen = (event, postId) => {
        setAnchorEl(event.currentTarget);
        setSelectedPostId(postId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPostId(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        if (selectedPostId) {
            navigate(`/edit-blog/${selectedPostId}`);
        }
    };

    const handleDelete = async () => {
        handleMenuClose();
        if (selectedPostId) {
            if (!token) {
                alert('You must be logged in to delete a blog post.');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.delete(`http://localhost:3000/api/blogs/${selectedPostId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Blog post deleted:', response.data);
                // Refresh the blog list after successful deletion
                fetchBlogPosts();
            } catch (error) {
                const errMsg = error.response?.data?.error || error.message;
                console.error('Error deleting blog post:', errMsg);
                alert(`Failed to delete blog post: ${errMsg}`);
            }
        }
    };

    const handleCardClick = (postId) => {
        navigate(`/blog/${postId}`);
    };

    return (
        <MainLayout>
            <Box sx={{ padding: '30px', backgroundColor: '#f9f9f9' }}>
                <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                    📚 Existing Blog Posts
                </Typography>

                {loading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">{error}</Typography>}
                {!loading && blogPosts.length === 0 && (
                    <Typography>No blog posts found.</Typography>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 4,
                    }}
                >
                    {blogPosts.map((post) => (
                        <Card
                            key={post.id}
                            sx={{ boxShadow: 3, borderRadius: 3, cursor: 'pointer' }}
                            onClick={() => handleCardClick(post.id)}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: red[500] }}>
                                        {post.author ? post.author[0].toUpperCase() : 'A'}
                                    </Avatar>
                                }
                                action={
                                    token && ( // Only show the menu if the user is logged in
                                        <IconButton aria-label="settings" onClick={(event) => {
                                            event.stopPropagation(); // Prevent card click when menu is opened
                                            handleMenuOpen(event, post.id);
                                        }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    )
                                }
                                title={post.title}
                                subheader={
                                    post.created_at
                                        ? new Date(post.created_at).toLocaleDateString()
                                        : ''
                                }
                            />

                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3, // Show only 3 lines of content
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </CardContent>

                            <CardActions sx={{ px: 2, pb: 2 }}>
                                {post.author && (
                                    <Typography variant="caption" color="text.secondary">
                                        ✍️ Author: {post.author}
                                    </Typography>
                                )}
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                {/* Add more options here if needed */}
            </Menu>
        </MainLayout>
    );
}