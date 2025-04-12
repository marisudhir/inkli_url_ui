import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
    Paper,
} from "@mui/material";
import Header from "./header";
import Footer from "./footer";

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

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        fullName: "",
    });
    const [responseMessage, setResponseMessage] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://http://143.110.246.124//api/auth/register", { // Changed endpoint to /api/auth/register
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (res.ok) {
                setResponseMessage("Registration successful!");
                setError(false);
                console.log("Success:", result);
            } else {
                setResponseMessage(result.error || "Registration failed."); // Assuming backend sends an 'error' field on failure
                setError(true);
            }
        } catch (err) {
            setResponseMessage("Network error. Please try again.");
            setError(true);
            console.error("Error:", err);
        }
    };

    return (
        <MainLayout>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Register
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        {responseMessage && (
                            <Alert severity={error ? "error" : "success"}>{responseMessage}</Alert>
                        )}
                    </Box>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default RegistrationForm;