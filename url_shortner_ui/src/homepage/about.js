// About.js

import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Link, Box } from '@mui/material';
import Header from './header';
import Footer from './footer';
import { styled, keyframes } from '@mui/material/styles';
import Slide from '@mui/material/Slide';

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  // Add any other styling for the main content area
}));

const PageLayout = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh', // Ensure the layout takes at least the full viewport height
});

const BetaBadge = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.warning.dark,
  color: theme.palette.warning.contrastText,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.8rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  display: 'inline-block',
}));

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedTypography = styled(Typography)`
  animation: ${fadeInUp} 0.8s ease-out forwards;
`;

const AnimatedListItem = styled(ListItem)`
  animation: ${fadeInUp} 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
  &:nth-child(4) { animation-delay: 0.6s; }
`;

function About() {
  return (
    <PageLayout>
      <Header />
      <MainContent>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Slide direction="down" in={true} timeout={500} mountOnEnter unmountOnExit>
            <BetaBadge>Beta Platforms - Inklidox Labs</BetaBadge>
          </Slide>
          <AnimatedTypography variant="h4" component="h1" gutterBottom>
            About Our Innovative Platform
          </AnimatedTypography>
          <AnimatedTypography variant="body1" paragraph>
            Welcome! We're more than just a URL shortener. This platform is designed to simplify your online sharing experience while also providing a space for you to showcase your writing skills.
          </AnimatedTypography>
          <AnimatedTypography variant="body1" paragraph>
            Not only can you transform long, cumbersome URLs into short, easy-to-remember links, but you can also leverage our platform as a blog sharing space. Share your thoughts, stories, insights, and expertise with our growing community.
          </AnimatedTypography>

          <AnimatedTypography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Key Features
          </AnimatedTypography>
          <List>
            <AnimatedListItem>
              <ListItemText primary="Effortless URL Shortening" secondary="Quickly generate shorter links for easy sharing." />
            </AnimatedListItem>
            <AnimatedListItem>
              <ListItemText primary="Blog Sharing Platform" secondary="Showcase your writing and connect with readers." />
            </AnimatedListItem>
            <AnimatedListItem>
              <ListItemText primary="Showcase Your Writing Skills" secondary="A dedicated space to highlight your unique voice and perspectives." />
            </AnimatedListItem>
            <AnimatedListItem>
              <ListItemText primary="Convenience and Shareability" secondary="Shortened links and blog posts are perfect for social media, emails, and more." />
            </AnimatedListItem>
            {/* You can keep or remove the future tracking mention */}
            {/* <AnimatedListItem>
              <ListItemText primary="Tracking (Future Feature)" secondary="We plan to introduce link tracking features in the future." />
            </AnimatedListItem> */}
            <AnimatedListItem>
              <ListItemText primary="Simple and Intuitive Interface" secondary="Easy to use for both URL shortening and blog sharing." />
            </AnimatedListItem>
          </List>

          <AnimatedTypography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Our Mission
          </AnimatedTypography>
          <AnimatedTypography variant="body1" paragraph>
            Our mission at Inklidox Labs is to provide a versatile and user-friendly platform that not only simplifies online sharing but also empowers individuals to share their written content with the world. We are committed to continuous improvement and value your feedback as we develop this beta platform.
          </AnimatedTypography>

          <AnimatedTypography variant="body2" sx={{ mt: 3 }}>
            As this is a beta platform developed by <Typography component="span" fontWeight="bold">Inklidox Labs</Typography>, we appreciate your patience and encourage you to <Link href="/contact" color="primary">contact us</Link> with any feedback or suggestions. Your input is invaluable in helping us shape the future of this platform.
          </AnimatedTypography>

          <AnimatedTypography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
            &copy; {new Date().getFullYear()} Shorten URL & Blog Platform by Inklidox Labs. All rights reserved.
          </AnimatedTypography>
        </Container>
      </MainContent>
      <Footer />
    </PageLayout>
  );
}

export default About;