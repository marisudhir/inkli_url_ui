import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './loginheader';
import { styled } from '@mui/material/styles';

// Styled Components
const BlogCard = styled(CardContent)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: 8,
  backgroundColor: '#fff',
  transition: 'transform 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const BlogCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.info.main,
  color: '#fff',
  padding: theme.spacing(2),
  '& .MuiTypography-h6': {
    fontSize: '1rem',
  },
}));

const BlogCardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .MuiTypography-body2': {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const BlogCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(1.5),
  justifyContent: 'flex-end',
}));

const YourBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');

    try {
      const rawToken = localStorage.getItem('authToken');
      if (!rawToken) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(rawToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setError('Your session has expired. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/blogs/me', {
        headers: { Authorization: `Bearer ${rawToken}` },
      });

      setBlogs(response.data);
    } catch (err) {
      console.error('Error fetching your blogs:', err);
      setError('Failed to fetch your blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blogId) => {
    navigate(`/edit/${blogId}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await axios.delete(`http://localhost:3000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete the blog. Please try again.');
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm('Do you want to archive this blog?')) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await axios.patch(`http://localhost:3000/api/blogs/archive/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchBlogs();
    } catch (err) {
      console.error('Error archiving blog:', err);
      setError('Failed to archive the blog. Please try again.');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <LoginHeader />
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Your Blogs</Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box m={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : blogs.length === 0 ? (
          <Typography>You haven't created any blogs yet.</Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 3,
              mt: 3,
              px: 2,
            }}
          >
            {blogs.map((post) => (
              <BlogCard key={post.id}>
                <BlogCardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }}>
                      {post.author?.[0]?.toUpperCase() || 'A'}
                    </Avatar>
                  }
                  titleTypographyProps={{ variant: 'h6' }}
                  title={post.title}
                  subheader={
                    post.created_at
                      ? new Date(post.created_at).toLocaleDateString()
                      : ''
                  }
                />
                <BlogCardContent>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    dangerouslySetInnerHTML={{
                      __html: post.content_preview || post.content,
                    }}
                  />
                </BlogCardContent>
                <BlogCardActions>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleEdit(post.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => handleArchive(post.id)}
                  >
                    Archive
                  </Button>
                </BlogCardActions>
              </BlogCard>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default YourBlogs;
