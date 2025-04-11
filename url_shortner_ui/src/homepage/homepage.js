import React from 'react';
import Body from './body';
import './styles/HomePage.css'; // Import CSS for Homepage layout
import Header from './header';
import Footer from './footer';
function Homepage() {
  return (
     <>
     <Header/>
    <div className="homepage-container">
      
      <main className="main-content">
        <Body />
      </main>
     
    </div>
    <Footer />
    </>
  );
}

export default Homepage;