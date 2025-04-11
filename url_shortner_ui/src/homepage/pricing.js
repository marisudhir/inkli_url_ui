import React from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Container,
    styled,
    keyframes,
} from '@mui/material';
import Header from './header';
import Footer from './footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faStar, faRocket, faDiamond } from '@fortawesome/free-solid-svg-icons'; // Import faDiamond

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[5],
    },
    animation: `${fadeIn} 0.5s ease-out forwards`,
}));

const StyledFeatureList = styled(List)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(0.5, 0),
    animation: `${fadeIn} 0.7s ease-out forwards`,
    opacity: 0,
    '&:nth-child(odd)': {
        animationDelay: '0.1s',
    },
    '&:nth-child(even)': {
        animationDelay: '0.2s',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    animation: `${fadeIn} 0.9s ease-out forwards`,
    opacity: 0,
}));

const Pricing = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header />
            <Box sx={{ flexGrow: 1, py: 8, bgcolor: '#f4f6f8' }}>
                <Container maxWidth="lg"> {/* Increased maxWidth to accommodate the extra plan */}
                    <Typography variant="h4" align="center" gutterBottom sx={{ animation: `${fadeIn} 0.3s ease-out forwards`, opacity: 0 }}>
                        Choose Your Perfect Plan
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(280px, 1fr))' },
                            gap: 4,
                            mt: 4,
                            justifyContent: 'center', // Center the grid items if there's extra space
                        }}
                    >
                        {/* Basic Plan */}
                        <StyledPaper>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Basic
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                ₹99/month
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <FontAwesomeIcon icon={faCheck} className="mr-1" /> Great for starters
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <StyledFeatureList>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Core features</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Up to 5 projects</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Basic support</>} />
                                </StyledListItem>
                            </StyledFeatureList>
                            <StyledButton variant="contained" color="primary" fullWidth>
                                Buy Now
                            </StyledButton>
                        </StyledPaper>

                        {/* Standard Plan */}
                        <StyledPaper sx={{ animationDelay: '0.2s' }}>
                            <Typography variant="h6" color="secondary" gutterBottom>
                                Standard <FontAwesomeIcon icon={faStar} className="ml-1" color="#ffc107" />
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                ₹299/month
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <FontAwesomeIcon icon={faRocket} className="mr-1" /> For growing teams
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <StyledFeatureList>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> All basic features</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Unlimited projects</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Priority support</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Advanced analytics</>} />
                                </StyledListItem>
                            </StyledFeatureList>
                            <StyledButton variant="contained" color="secondary" fullWidth>
                                Buy Now
                            </StyledButton>
                        </StyledPaper>

                        {/* Premium Plan */}
                        <StyledPaper sx={{ animationDelay: '0.4s' }}>
                            <Typography variant="h6" color="success" gutterBottom>
                                Premium
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                ₹599/month
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <FontAwesomeIcon icon={faCheck} className="mr-1" /> Top-tier performance
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <StyledFeatureList>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> All standard features</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Dedicated support</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Custom integrations</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> White-labeling</>} />
                                </StyledListItem>
                            </StyledFeatureList>
                            <StyledButton variant="contained" color="success" fullWidth>
                                Buy Now
                            </StyledButton>
                        </StyledPaper>

                        {/* Enterprise Plan */}
                        <StyledPaper sx={{ animationDelay: '0.6s' }}>
                            <Typography variant="h6" color="info" gutterBottom>
                                Enterprise <FontAwesomeIcon icon={faDiamond} className="ml-1" color="#00bcd4" />
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                ₹999/month
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <FontAwesomeIcon icon={faCheck} className="mr-1" /> Scalable solutions
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <StyledFeatureList>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> All premium features</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Unlimited team members</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Enhanced security</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> Dedicated account manager</>} />
                                </StyledListItem>
                                <StyledListItem>
                                    <ListItemText primary={<><FontAwesomeIcon icon={faCheck} className="mr-2" color="success" /> SLA guarantee</>} />
                                </StyledListItem>
                            </StyledFeatureList>
                            <StyledButton variant="contained" color="info" fullWidth>
                                Contact Us
                            </StyledButton>
                        </StyledPaper>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Pricing;