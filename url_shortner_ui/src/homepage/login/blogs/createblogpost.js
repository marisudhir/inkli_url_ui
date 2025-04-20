import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../loginheader';
import TextEditor from './texteditor';

function CreateBlogs() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiUses, setAiUses] = useState(() => {
    const savedUses = localStorage.getItem('aiUses');
    return savedUses ? parseInt(savedUses, 10) : 0;
  });
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken'); 
  const geminiApiKey = 'AIzaSyD--0KBT8ljqO_mjKeP-MSGQlXxB3ts2Nc';
  const maxAiUses = 5;

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
        'http://localhost:3000/api/blogs/create',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Blog post created:', response.data);

      setTitle('');
      setContent('');
      setPrompt('');
      setRefresh((prev) => !prev);
      setAiUses(0);
      localStorage.setItem('aiUses', '0');

      alert('Blog post created successfully!');
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message;
      console.error('Error creating blog post:', errMsg);
      alert(`Failed to create blog post: ${errMsg}`);
    }
  };

  const handleGenerateContent = async () => {
    if (aiUses >= maxAiUses) {
      setShowUpgradePopup(true);
      return;
    }

    if (!prompt.trim()) {
      alert('Please enter a prompt to generate content.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      console.log('Generated content:', generatedText);

      setContent(generatedText);
      setAiUses((prev) => {
        const newCount = prev + 1;
        localStorage.setItem('aiUses', newCount);
        return newCount;
      });
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginHeader />

      <div
        className="create-blogs-container"
        style={{
          maxWidth: '800px',
          margin: '40px auto',
          padding: '30px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          fontFamily: 'Segoe UI, sans-serif',
          position: 'relative',
        }}
      >
        <h2 style={{ fontSize: '28px', marginBottom: '25px', color: '#1a1a1a' }}>
          ✨ Create a New Blog Post
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px',
              outlineColor: '#007bff',
            }}
            placeholder="e.g. 5 Tips to Master React"
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Content</label>
          <TextEditor content={content} setContent={setContent} />
        </div>

        <button
          onClick={handleCreatePost}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '30px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0062cc')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          🚀 Publish Post
        </button>

        {/* AI Generation Section */}
        <div>
          <div style={{ marginBottom: '8px', fontWeight: '500', color: '#555' }}>
            AI Uses: {Math.min(aiUses, maxAiUses)}/{maxAiUses}
          </div>

          <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Generate Content using AI
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="3"
            disabled={aiUses >= maxAiUses}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              resize: 'vertical',
              fontSize: '15px',
              marginBottom: '12px',
              outlineColor: '#28a745',
              filter: aiUses >= maxAiUses ? 'blur(2px)' : 'none',
              backgroundColor: aiUses >= maxAiUses ? '#f5f5f5' : 'white',
              cursor: aiUses >= maxAiUses ? 'not-allowed' : 'text',
            }}
            placeholder="e.g. Explain how useState works in React"
          />

          <button
            onClick={handleGenerateContent}
            disabled={aiUses >= maxAiUses}
            style={{
              padding: '10px 18px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              cursor: aiUses >= maxAiUses ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              opacity: aiUses >= maxAiUses ? 0.6 : 1,
            }}
          >
            ✨ Generate with AI
          </button>

          {loading && (
            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#333' }}>
              <div className="spinner" />
              <span>Generating content...</span>
            </div>
          )}

          <div style={{ fontSize: '12px', marginTop: '8px', color: '#888' }}>
            Powered by Gemini
          </div>
        </div>
      </div>

      {/* Upgrade Popup Modal */}
      {showUpgradePopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>AI Limit Reached</h3>
            <p style={{ fontSize: '15px', marginBottom: '24px' }}>
              You’ve used your 5 free AI generations. Upgrade to Premium for unlimited content generation.
            </p>
            <button
              onClick={() => setShowUpgradePopup(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Spinner styles */}
      <style>
        {`
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #28a745;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            animation: spin 0.9s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}

export default CreateBlogs;
