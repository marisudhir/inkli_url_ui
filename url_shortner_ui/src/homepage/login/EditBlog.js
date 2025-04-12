import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import LoginHeader from './loginheader';
import TextEditor from './blogs/texteditor';

const EditBlog = () => {
    const { postId } = useParams(); // Correct param name
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true; // to track if the component is still mounted

        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await axios.get(`http://http://143.110.246.124//api/blogs/post/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (isMounted) {
                    setTitle(res.data.title);
                    setContent(res.data.content);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error fetching blog');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchBlog();

        // Cleanup function to prevent setting state if the component unmounts
        return () => {
            isMounted = false;
        };
    }, [postId]);

    const handleUpdate = async () => {
        if (!window.confirm('Are you sure you want to save changes?')) return;

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `http://http://143.110.246.124//api/blogs/${postId}`,
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/yourblog');
        } catch (err) {
            setError('Failed to update blog');
        }
    };

    if (loading) return <CircularProgress />; // Show loading spinner
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <>
            <LoginHeader />
            <Container maxWidth="md">
                <Box mt={4}>
                    <Typography variant="h5" mb={2}>Edit Blog</Typography>

                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="normal"
                    />

                    <Box mt={3}>
                        <Typography variant="body1" mb={1}>Content</Typography>
                        <TextEditor
                            content={content}    // Pass content instead of value
                            setContent={setContent}  // Pass setContent instead of onChange
                        />
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        sx={{ mt: 3 }}
                    >
                        Save
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default EditBlog;
