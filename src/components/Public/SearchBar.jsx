import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = () => {
  const [guests, setGuests] = useState('');
  const [dates, setDates] = useState('');

  const handleSearch = () => {
    console.log('Searching:', { guests, dates });
    // Add search logic here
  };

  return (
    <div className="search-bar">
      <div className="search-fields">
        {/* Guests Field */}
        <div className="search-field">
          <div className="field-content">
            <svg className="field-icon" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 11C18.43 11 19.96 9.47 19.96 7.5C19.96 5.53 18.43 4 16.5 4C14.57 4 13.04 5.53 13.04 7.5C13.04 9.47 14.57 11 16.5 11ZM8.5 11C10.43 11 11.96 9.47 11.96 7.5C11.96 5.53 10.43 4 8.5 4C6.57 4 5.04 5.53 5.04 7.5C5.04 9.47 6.57 11 8.5 11ZM8.5 13C5.83 13 0.5 14.34 0.5 17V19C0.5 19.55 0.95 20 1.5 20H15.5C16.05 20 16.5 19.55 16.5 19V17C16.5 14.34 11.17 13 8.5 13ZM16.5 13C16.23 13 15.93 13.02 15.62 13.05C16.81 13.89 17.5 15.02 17.5 17V19C17.5 19.35 17.42 19.69 17.29 20H23.5C24.05 20 24.5 19.55 24.5 19V17C24.5 14.34 19.17 13 16.5 13Z" fill="#608BC1"/>
            </svg>
            <div className="field-text">
              <div className="searchbar-field-label">GUESTS</div>
              <input 
                type="number" 
                className="field-input" 
                placeholder="Number of guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Dates Field */}
        <div className="search-field">
          <div className="field-content">
            <svg className="field-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 3.5H18.5V1.5H16.5V3.5H8.5V1.5H6.5V3.5H5.5C4.39 3.5 3.51 4.4 3.51 5.5L3.5 21.5C3.5 22.6 4.39 23.5 5.5 23.5H19.5C20.6 23.5 21.5 22.6 21.5 21.5V5.5C21.5 4.4 20.6 3.5 19.5 3.5ZM19.5 21.5H5.5V8.5H19.5V21.5ZM7.5 10.5H12.5V15.5H7.5V10.5Z" fill="#608BC1"/>
            </svg>
            <div className="field-text">
              <div className="searchbar-field-label">DATES</div>
              <input 
                type="text" 
                className="field-input" 
                placeholder="Add dates"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Find Rooms Button */}
      <button className="search-button" onClick={handleSearch}>
        <svg className="search-icon" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.0323 16.0573H17.0698L16.7198 15.7198C17.9573 14.2698 18.6948 12.3823 18.6948 10.3448C18.6948 5.79479 15.0198 2.11979 10.4698 2.11979C5.91979 2.11979 2.24479 5.79479 2.24479 10.3448C2.24479 14.8948 5.91979 18.5698 10.4698 18.5698C12.5073 18.5698 14.3948 17.8323 15.8448 16.5948L16.1823 16.9448V17.9073L22.1948 23.9073L24.0323 22.0698L18.0323 16.0573ZM10.4698 16.0573C7.29479 16.0573 4.74479 13.5073 4.74479 10.3448C4.74479 7.18229 7.29479 4.63229 10.4698 4.63229C13.6448 4.63229 16.1948 7.18229 16.1948 10.3448C16.1948 13.5073 13.6448 16.0573 10.4698 16.0573Z" fill="#133E87"/>
        </svg>
        <span className="search-text">Find Rooms</span>
      </button>
    </div>
  );
};

export default SearchBar;
