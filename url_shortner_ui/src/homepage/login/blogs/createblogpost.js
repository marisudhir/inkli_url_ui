import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import LoginHeader from '../loginheader';
import TextEditor from './texteditor';
// import DisplayBlog from './displayblog';

function CreateBlogs() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken'); // Updated token key

  const handleCreatePost = async () => {
    if (!token) {
      alert('You must be logged in to create a blog post.');
      navigate('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('Both title and content are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/blogs/create', // Updated API endpoint
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Blog post created:', response.data);

      // Clear form
      setTitle('');
      setContent('');
      setRefresh((prev) => !prev); // Toggle to refresh DisplayBlog

      alert('Blog post created successfully!');
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message;
      console.error('Error creating blog post:', errMsg);
      alert(`Failed to create blog post: ${errMsg}`);
    }
  };

  return (
    <>
      <LoginHeader />

      <div className="create-blogs-container" style={{ padding: '20px' }}>

        <section style={{ marginBottom: '30px' }}>
          <h2>Create New Post</h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              placeholder="Enter blog title"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Content:</label>
            <TextEditor content={content} setContent={setContent} />
          </div>

          <button
            onClick={handleCreatePost}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Publish Post
          </button>
        </section>

        {/* <hr /> */}

        {/* <DisplayBlog key={refresh} /> */}
      </div>
    </>
  );
}

export default CreateBlogs;