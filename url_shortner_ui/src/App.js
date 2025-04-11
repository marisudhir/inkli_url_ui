import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './homepage/login';
import RegistrationForm from './homepage/register';
import Home from './homepage/homepage';
import About from './homepage/about';
import DisplayBlog from './homepage/login/blogs/displayblog';
import Dashboard from './homepage/login/dashboard';
import CreateBlogs from './homepage/login/blogs/createblogpost';
import CreateUrl from './homepage/login/createurl';
import Profile from './homepage/login/profile';
import Pricing from './homepage/pricing';
import FullBlogPost from './homepage/login/blogs/FullyBlogPost';
import Settings from './homepage/login/settings';
import YourBlogs from './homepage/login/yourblogs';
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

    useEffect(() => {
        // Check for the token on initial load
        setIsAuthenticated(!!localStorage.getItem('authToken'));

        // Listen for changes in local storage (e.g., after login/logout)
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('authToken'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <Router>
            
            <Routes>
                <Route path="/" element={<Home />} /> {/* Your home page component */}
                <Route path="/blogs" element={<DisplayBlog />} /> {/* Your blogs component */}
                <Route path="/about" element={<About />} /> {/* Your about component */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/pricing" element={<Pricing/>}/>
                <Route path="/blog/:id" element={<FullBlogPost />} /> {/* Route for the full blog post */}
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/yourblog" element={<YourBlogs/>}/>
                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/createblog"
                    element={
                        <ProtectedRoute>
                            <CreateBlogs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/createurl"
                    element={
                        <ProtectedRoute>
                            <CreateUrl />
                        </ProtectedRoute>
                    }
                />

                  <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                    }
                />
                
            </Routes>
            
        </Router>
    );
}

export default App;