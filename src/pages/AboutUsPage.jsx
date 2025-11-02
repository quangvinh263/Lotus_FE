import React, { useEffect } from 'react';
import '../styles/AboutUsPage.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ImageAboutUsPage from '../assets/images/ImageAboutUsPage.jpg';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="aboutus-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="aboutus-hero">
        <img src={ImageAboutUsPage} alt="About Us" className="aboutus-hero-image" />
        <div className="aboutus-hero-overlay"></div>
      </div>

      {/* About Us Content */}
      <div className="aboutus-content">
        <div className="aboutus-container">
          <h1 className="aboutus-title">ABOUT US</h1>
          
          <div className="aboutus-text-section">
            <h2 className="aboutus-subtitle">Welcome to Lotus Premium Saigon Hotel</h2>
            <p className="aboutus-paragraph">
              Nestled in the heart of Saigon, Lotus Premium Hotel stands as a beacon of luxury and elegance. 
              Our hotel combines timeless sophistication with modern comfort, offering an unparalleled experience 
              for both leisure and business travelers.
            </p>
            
            <h2 className="aboutus-subtitle">Our Story</h2>
            <p className="aboutus-paragraph">
              Founded with a vision to redefine hospitality in Vietnam, Lotus Premium Hotel has been serving 
              discerning guests for years. Our commitment to excellence is reflected in every detail, from our 
              meticulously designed rooms to our world-class amenities and personalized service.
            </p>
            
            <h2 className="aboutus-subtitle">Our Mission</h2>
            <p className="aboutus-paragraph">
              We strive to create memorable experiences that exceed expectations. Our dedicated team works 
              tirelessly to ensure that every guest feels valued and cared for. Whether you're here for business 
              or pleasure, we aim to make your stay truly exceptional.
            </p>
            
            <h2 className="aboutus-subtitle">Why Choose Us</h2>
            <p className="aboutus-paragraph">
              At Lotus Premium Hotel, we offer more than just accommodation. Our prime location provides easy 
              access to the city's attractions, while our luxurious facilities—including a rooftop pool, 
              state-of-the-art gym, and exquisite dining options—ensure a comfortable and enriching stay. 
              Experience the perfect blend of Vietnamese hospitality and international standards.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
