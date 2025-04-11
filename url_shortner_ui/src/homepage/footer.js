import React from 'react';
import './styles/footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

function Footer() {
  return (
    <footer className="app-footer">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <p style={{ margin: 0 }}>
              Powered by{' '}
              <Link
                href="https://labs.inklidox.com"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
              >
                Inklidox Labs
              </Link>
            </p>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex' }}>
              <Link
                href="YOUR_INSTAGRAM_LINK_HERE"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ marginRight: '15px' }}
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </Link>
              <Link
                href="YOUR_LINKEDIN_LINK_HERE"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ marginRight: '15px' }}
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </Link>
              <Link
                href="YOUR_Facebook_LINK_HERE"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ marginRight: '15px' }}
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </Link>
              <Link
                href="YOUR_youtube_LINK_HERE"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </footer>
  );
}

export default Footer;