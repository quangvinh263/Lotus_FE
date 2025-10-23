import React from 'react';
import '../styles/HomePage.css';
import Navbar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';
import Footer from '../components/Footer';
import ImageHome1 from '../assets/images/ImageHome1.png';
import ImageHome2 from '../assets/images/ImageHome2.png';
import ImageHome3 from '../assets/images/ImageHome3.png';
import WifiIcon from '../assets/icons/WifiIcon.png';
import BedIcon from '../assets/icons/BedIcon.png';
import StarIcon from '../assets/icons/StarIcon.png';
import ShoppingIcon from '../assets/icons/ShoppingIcon.png';

const rooms = [
  {
    id: 1,
    title: "Superior Room",
    description: "A cozy retreat designed for comfort and simplicity, offering a peaceful space to unwind after a day of exploration."
  },
  {
    id: 2,
    title: "Deluxe Room",
    description: "An elevated experience with extra space and refined furnishings, blending modern style with sophisticated comfort."
  },
  {
    id: 3,
    title: "Executive Room",
    description: "Designed for the discerning traveler, offering premium amenities and exclusive access for a truly seamless stay."
  },
  {
    id: 4,
    title: "Grand Suite",
    description: "A spacious and opulent suite featuring a separate living area, offering an indulgent experience with breathtaking views."
  },
  {
    id: 5,
    title: "Lotus Suite",
    description: "The pinnacle of luxury at our hotel. An elegant suite with a spacious balcony, where we arrange outdoor seating for your private moments of relaxation."
  }
];

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="search-sticky" className="hero-section">
        <section className="search-section">
        <SearchBar />
      </section>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h3 className="hero-welcome">WELCOME TO</h3>
            <h1 className="hero-title">LOTUS</h1>
            <h2 className="hero-subtitle">HOTELS</h2>
            <p className="hero-description">
              Book your stay and enjoy Luxury<br />
              redefined at the most affordable rates.
            </p>
          </div>
        </div>
      </section>
      
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-text">
          <h2 className="welcome-title">
            <span className="welcome-to">Welcome to </span>
            <span className="welcome-hotel">Lotus Premium Saigon Hotel</span>
          </h2>
        </div>
      </section>

      {/* Description Section */}
      <section className="description-section">
        <p className="description-text">
          Discover a sanctuary of tranquility and refined luxury at Lotus Premium Saigon Hotel, where a one-of-a-kind experience awaits you in the heart of the city. Nestled in a prime location, our hotel offers a serene escape just moments away from iconic cultural landmarks, premier shopping districts, and vibrant culinary scenes. Our strategic position also ensures that the international airport is only a short drive away, making your arrival and departure seamless and convenient.
          <br /><br />
          Featuring over 100 elegantly designed rooms and suites, Lotus Hotel is the perfect haven for discerning travelers, whether you are visiting for a relaxing holiday or a crucial business engagement. Our world-class amenities include a signature restaurant with exquisite culinary creations, a tranquil spa to rejuvenate your body and soul, and a stunning rooftop Sky Lounge where you can unwind with a handcrafted cocktail while enjoying panoramic views of the city skyline.
          <br /><br />
          At Lotus Premium Saigon Hotel, our philosophy is built on a foundation of heartfelt hospitality. Our dedicated team of professionals is committed to delivering personalized and impeccable service, anticipating your every need to ensure your stay is nothing short of perfect. We pride ourselves on creating unforgettable experiences that define the art of hospitality. We invite you to immerse yourself in the unparalleled comfort and elegance of Lotus Hotel, and let us make your journey truly exceptional.
        </p>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-grid">
          <img src={ImageHome2} alt="Hotel view 1" className="gallery-img gallery-img-1" />
          <img src={ImageHome3} alt="Hotel view 2" className="gallery-img gallery-img-2" />
        </div>
      </section>

      {/* Rooms & Suites Section */}
      <section className="rooms-section">
        <div className="rooms-header">
          <h2 className="rooms-title">Rooms & Suites</h2>
        </div>
        <div className="rooms-list">
          {rooms.map((room) => (
            <div key={room.id} className="room-card-wrapper">
              <RoomCard
                title={room.title}
                description={room.description}
                onExplore={() => console.log(`Explore ${room.title}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner-section">
        <div className="banner-content">
          <div className="banner-text-content">
            <h2 className="banner-title">The best rates Are Always Here</h2>
            <p className="banner-description">
              Get the best prices plus free Wi-Fi when you become a Lotus Premium member.
            </p>
            <div className="banner-actions">
              <button className="banner-btn btn-join">Join for Free</button>
              <button className="banner-btn btn-signin-outline">Sign In</button>
            </div>
          </div>
          <div className="banner-features">
            <div className="feature-item">
              <img src={StarIcon} alt="Best Rate" className="feature-icon" />
              <span>BEST RATE GUARANTEE</span>
            </div>
            <div className="feature-item">
              <img src={BedIcon} alt="Free Night" className="feature-icon" />
              <span>EARN FREE NIGHT</span>
            </div>
            <div className="feature-item">
              <img src={WifiIcon} alt="Free WiFi" className="feature-icon" />
              <span>FREE WIFI</span>
            </div>
            <div className="feature-item">
              <img src={ShoppingIcon} alt="Member Rates" className="feature-icon" />
              <span>MEMBER RATES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
