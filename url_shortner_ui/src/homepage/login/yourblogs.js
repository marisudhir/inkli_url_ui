import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

const YourBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

   // const navigate = useNavigate();

    const fetchBlogs = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/blogs/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBlogs(response.data);
        } catch (err) {
            console.error('Error fetching your blogs:', err);
            setError('Failed to fetch your blogs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (blog) => {
        setEditingBlogId(blog.id);
        setEditTitle(blog.title);
        setEditContent(blog.content);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:3000/api/blogs/${editingBlogId}`,
                { title: editTitle, content: editContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingBlogId(null);
            fetchBlogs();
        } catch (err) {
            console.error('Error updating blog:', err);
            setError('Failed to update the blog. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchBlogs();
            } catch (err) {
                console.error('Error deleting blog:', err);
                setError('Failed to delete the blog. Please try again.');
            }
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    if (loading) {
        return <div className="p-6">Loading your blogs...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Blogs</h2>
            {blogs.length === 0 ? (
                <p>You haven't created any blogs yet.</p>
            ) : (
                blogs.map((blog) => (
                    <div key={blog.id} className="border rounded p-4 mb-4 bg-white shadow">
                        {editingBlogId === blog.id ? (
                            <>
                                <input
                                    className="block w-full mb-2 p-2 border"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                                <textarea
                                    className="block w-full mb-2 p-2 border"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <div className="mt-2">
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setEditingBlogId(null)}
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold mb-1">{blog.title}</h3>
                                <p className="text-gray-700 mb-2">{blog.content}</p>
                                <div className="mt-2">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="bg-yellow-500 text-white px-4 py-1 mr-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default YourBlogs;