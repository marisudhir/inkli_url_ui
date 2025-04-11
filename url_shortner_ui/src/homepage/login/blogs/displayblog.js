import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Avatar,
    Typography,
    CardActions,
    Box,
    TextField,
    InputAdornment,
    Button,
} from '@mui/material';
import { red } from '@mui/material/colors';
import axios from 'axios';
import Header from '../../header';
import Footer from '../../footer';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Styled Components
const CenteredSearchBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 20,
        '& fieldset': {
            borderColor: theme.palette.primary.light,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.secondary.main,
            borderWidth: 2,
        },
        backgroundColor: theme.palette.background.paper,
    },
    width: '40%',
    maxWidth: 500,
    [theme.breakpoints.down('sm')]: {
        width: '80%',
    },
}));

const BlogCard = styled(Card)(({ theme }) => ({
    boxShadow: 3,
    borderRadius: 8,
    transition: 'transform 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 6,
    },
}));

const BlogCardHeader = styled(CardHeader)(({ theme }) => ({
    backgroundColor: theme.palette.info.main,
    color: '#fff',
    padding: theme.spacing(2),
    '& .MuiCardHeader-content': {
        overflow: 'visible',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
    },
    '& .MuiTypography-h6': {
        fontSize: '1rem',
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.95rem',
        },
    },
}));

const BlogCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(2),
    '& .MuiTypography-body2': {
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginBottom: theme.spacing(1),
    },
}));

const BlogCardActions = styled(CardActions)(({ theme }) => ({
    padding: theme.spacing(1.5),
    justifyContent: 'space-between',
}));

// DisplayBlog Component
function DisplayBlog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [filteredBlogPosts, setFilteredBlogPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    // Fetch blog posts
    const fetchBlogPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/blogs/list');
            setBlogPosts(response.data);
        } catch (err) {
            console.error('Error fetching blog posts:', err.message);
            setError('Failed to load blog posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    useEffect(() => {
        const filtered = blogPosts.filter(
            (post) =>
                post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBlogPosts(filtered);
    }, [searchTerm, blogPosts]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCardClick = (postId) => {
        navigate(`/blog/${postId}`);
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" align="center" sx={{ color: 'primary.main', mb: 4 }}>
                📚 Explore Our Thoughtful Blogs
            </Typography>

            <CenteredSearchBox>
                <SearchTextField
                    label="Search Blogs"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />
            </CenteredSearchBox>

            {loading && <Typography align="center">Loading blog posts...</Typography>}
            {error && <Typography align="center" color="error">{error}</Typography>}
            {!loading && filteredBlogPosts.length === 0 && (
                <Typography align="center">No blog posts found matching your search.</Typography>
            )}

            {!loading && filteredBlogPosts.length > 0 && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 3,
                        mt: 3,
                        px: 2,
                    }}
                >
                    {filteredBlogPosts.map((post) => (
                        <BlogCard key={post.id} onClick={() => handleCardClick(post.id)}>
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
                                    dangerouslySetInnerHTML={{ __html: post.content_preview || post.content }}
                                />
                            </BlogCardContent>
                            <BlogCardActions>
                                {post.author && (
                                    <Typography variant="caption" color="text.secondary">
                                        ✍️ By: {post.author.toUpperCase()}
                                    </Typography>
                                )}
                                <Button size="small" color="primary">
                                    Read More
                                </Button>
                            </BlogCardActions>
                        </BlogCard>
                    ))}
                </Box>
            )}
        </Box>
    );
}

// Layout Wrapper
function MainLayout({ children }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box sx={{ flexGrow: 1 }}>{children}</Box>
            <Footer />
        </Box>
    );
}

// Exported Component with Layout
export default function DisplayBlogWithLayout() {
    return (
        <MainLayout>
            <DisplayBlog />
        </MainLayout>
    );
}
