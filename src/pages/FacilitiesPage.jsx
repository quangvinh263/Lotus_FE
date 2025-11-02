import React, { useEffect } from 'react';
import '../styles/FacilitiesPage.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ImageFacilitiesPage from '../assets/images/ImageFacilitiesPage.jpg';
import ImageRestaurant from '../assets/images/ImageRestaurant.jpg';
import ImageSwimmingPool from '../assets/images/ImageSwimmingPool.jpg';
import ImageLaundry from '../assets/images/ImageLaundry.jpg';
import ImageTheGym from '../assets/images/ImageTheGym.jpg';

const FacilitiesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="facilities-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="facilities-hero">
        <img src={ImageFacilitiesPage} alt="Facilities" className="facilities-hero-image" />
        <div className="facilities-hero-overlay"></div>
      </div>

      {/* Facilities Title Section */}
      <div className="facilities-title-section">
        <h1 className="facilities-title">FACILITIES</h1>
        <p className="facilities-description">
          We want your stay at our lush hotel to be truly unforgettable. That is why we give special attention to all of your needs so that we can ensure an experience quite unique. Lotus hotels offers the perfect setting with stunning views for leisure and our modern luxury resort facilities will help you enjoy the best of all.
        </p>
      </div>

      {/* Facility Sections */}
      <div className="facilities-content">
        {/* The Gym - Image Left */}
        <div className="facility-section facility-left">
          <div className="facility-image">
            <img src={ImageTheGym} alt="The Gym" />
          </div>
          <div className="facility-description-box">
            <h2 className="facility-name">The Gym</h2>
            <p className="facility-text">
              Maintain your fitness routine at our state-of-the-art gym. Fully equipped with the latest cardio and weight-training equipment, it's the ideal space to recharge and focus on your well-being during your stay.
            </p>
          </div>
        </div>

        {/* Swimming Pool - Image Right */}
        <div className="facility-section facility-right">
          <div className="facility-description-box">
            <h2 className="facility-name">Swimming Pool</h2>
            <p className="facility-text">
              Immerse yourself in the cool, refreshing waters of our oasis pool. It is the perfect spot to relax under the sun, enjoy a moment of peace, or sip on a refreshing cocktail from the poolside bar.
            </p>
          </div>
          <div className="facility-image">
            <img src={ImageSwimmingPool} alt="Swimming Pool" />
          </div>
        </div>

        {/* Restaurant - Image Left */}
        <div className="facility-section facility-left">
          <div className="facility-image">
            <img src={ImageRestaurant} alt="Restaurant" />
          </div>
          <div className="facility-description-box">
            <h2 className="facility-name">Restaurant</h2>
            <p className="facility-text">
              Embark on an exquisite culinary journey at our signature restaurant. Indulge in a menu of diverse flavors, from authentic local specialties to masterfully prepared international dishes, all served in an elegant and inviting atmosphere.
            </p>
          </div>
        </div>

        {/* Laundry - Image Right */}
        <div className="facility-section facility-right">
          <div className="facility-description-box">
            <h2 className="facility-name">Laundry</h2>
            <p className="facility-text">
              Enjoy your stay to the fullest. Our prompt and professional laundry service ensures your attire is always fresh, clean, and ready for any occasion, allowing you to travel light and stay pristine.
            </p>
          </div>
          <div className="facility-image">
            <img src={ImageLaundry} alt="Laundry" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FacilitiesPage;
