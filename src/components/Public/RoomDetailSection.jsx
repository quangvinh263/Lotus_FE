import React from 'react';
import './RoomDetailSection.css';
import RoomSection from './RoomSection';
import ImageRoom from '../assets/images/ImageRoom.jpg';
import ApartmentIcon from '../assets/icons/ApartmentIcon.png';
import PersonIcon from '../assets/icons/PersonIcon.svg';
import BedIcon from '../assets/icons/BedIcon.png';
import ImageIcon from '../assets/icons/ImageIcon.svg';
import SmokeIcon from '../assets/icons/SmokeIcon.png';
import BathIcon from '../assets/icons/BathIcon.svg';

const RoomDetailSection = ({
  roomType = "Superior Rooms",
  price = "USD200",
  imageUrl = ImageRoom,
  description = "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
  roomSize = "32 sqm",
  beds = "1 King bed or 2 Single beds",
  maxOccupancy = "2 pax",
  view = "City view",
  smoking = "No",
  bathroom = "Toilet, washbasin, and shower",
  onBookRoom,
  relatedRooms = []
}) => {
  return (
    <div className="room-detail-section">
      {/* Header with title and book button */}
      <div className="room-detail-header">
        <h1 className="room-detail-title">{roomType}</h1>
        <div className="room-detail-book-wrapper">
          <button className="room-detail-book-btn" onClick={onBookRoom}>
            Book a room
            <svg width="17.15" height="18.13" viewBox="0 0 18 19" fill="none">
              <path d="M9 5L13 9.5L9 14M13 9.5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="room-detail-main">
        {/* Left side - Image and details box */}
        <div className="room-detail-left">
          <img src={imageUrl} alt={roomType} className="room-detail-image" />
          
          <div className="room-detail-info-box">
            <div className="room-detail-price-desc">
              <p className="room-detail-price">Available from {price}</p>
              <p className="room-detail-description">{description}</p>
            </div>
            
            <div className="room-detail-specs">
              <div className="room-detail-spec-item">
                <img src={ApartmentIcon} alt="Room size" className="room-detail-icon" />
                <span>Room size: {roomSize}</span>
              </div>
              
              <div className="room-detail-spec-item">
                <img src={ImageIcon} alt="View" className="room-detail-icon" />
                <span>View: {view}</span>
              </div>
              
              <div className="room-detail-spec-item">
                <img src={BedIcon} alt="Beds" className="room-detail-icon" />
                <span>Beds: {beds}</span>
              </div>
              
              <div className="room-detail-spec-item">
                <img src={SmokeIcon} alt="Smoking" className="room-detail-icon" />
                <span>Smoking: {smoking}</span>
              </div>
              
              <div className="room-detail-spec-item">
                <img src={PersonIcon} alt="Occupancy" className="room-detail-icon" />
                <span>Max occupancy: {maxOccupancy}</span>
              </div>
              
              <div className="room-detail-spec-item">
                <img src={BathIcon} alt="Bathroom" className="room-detail-icon" />
                <span>Bathroom: {bathroom}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="room-detail-features-section">
        <h2 className="room-detail-section-title">Features</h2>
        <p className="room-detail-features-intro">{description}</p>
        <div className="room-detail-divider"></div>
        
        <div className="room-detail-features-grid">
          <div className="room-detail-feature-column">
            <h3>Highlights</h3>
            <ul>
              <li>Daily housekeeping</li>
              <li>Electronic safe deposit box</li>
            </ul>
          </div>
          
          <div className="room-detail-feature-column">
            <h3>Technology</h3>
            <ul>
              <li>43'' flat screen Internet TV</li>
              <li>IDD telephone</li>
              <li>FREE Highspeed Wireless internet access</li>
              <li>Refrigerator & Minibar</li>
              <li>Central air-conditioning with Digital individual climate control</li>
            </ul>
          </div>
          
          <div className="room-detail-feature-column">
            <h3>Bed & Bath</h3>
            <ul>
              <li>{beds}</li>
              <li>Shower</li>
              <li>Hair dryer</li>
              <li>Shaver outlet (220 volts)</li>
              <li>Deluxe toiletries</li>
              <li>Alarm clock</li>
            </ul>
          </div>
          
          <div className="room-detail-feature-column">
            <h3>Others</h3>
            <ul>
              <li>Welcome drinks</li>
              <li>Orientation map</li>
              <li>Tea bags & coffee making facilities</li>
              <li>Pets not allowed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Rooms Section */}
      <div className="room-detail-related-section">
        <h2 className="room-detail-section-title">You may also be interested</h2>
        <div className="room-detail-related-rooms">
          {relatedRooms.length > 0 ? (
            relatedRooms.map((room, index) => (
              <RoomSection
                key={index}
                roomType={room.roomType}
                price={room.price}
                imageUrl={room.imageUrl}
                description={room.description}
                roomSize={room.roomSize}
                beds={room.beds}
                maxOccupancy={room.maxOccupancy}
                view={room.view}
                smoking={room.smoking}
                bathroom={room.bathroom}
                onBookRoom={room.onBookRoom}
                onMoreInfo={room.onMoreInfo}
              />
            ))
          ) : (
            <>
              <RoomSection
                roomType="SUPERIOR ROOM"
                price="USD200"
                description="A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration."
                roomSize="32 sqm"
                beds="1 King bed or 2 Single beds"
                maxOccupancy="2 pax"
                view="City view"
                smoking="No"
                bathroom="Toilet, washbasin, and shower"
              />
              <RoomSection
                roomType="SUPERIOR ROOM"
                price="USD200"
                description="A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration."
                roomSize="32 sqm"
                beds="1 King bed or 2 Single beds"
                maxOccupancy="2 pax"
                view="City view"
                smoking="No"
                bathroom="Toilet, washbasin, and shower"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailSection;
