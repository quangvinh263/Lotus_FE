import './BookingSummaryCard.css';

function BookingSummaryCard({ selectedRooms, totalGuests, totalRooms }) {
  return (
    <div className="booking-summary-card">
      <h2 className="summary-title">Tóm tắt đơn hàng</h2>

      {selectedRooms.length > 0 ? (
        <div className="summary-content">
          <p className="summary-section-label">Phòng đã chọn</p>
          
          <div className="summary-rooms-list">
            {selectedRooms.map((room, index) => (
              <div key={index} className="summary-room-item">
                <div className="summary-room-info">
                  <span className="summary-room-name">{room.roomType} x {room.numberOfRooms}</span>
                  <span className="summary-room-price">
                    {room.pricePerNight.toLocaleString('vi-VN')} VNĐ/đêm
                  </span>
                </div>
                <div className="summary-room-guests">
                  {room.guestsPerRoom} khách/phòng × {room.numberOfRooms} = {room.guestsPerRoom * room.numberOfRooms} người
                </div>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <div className="summary-total-row">
              <span className="summary-total-label">Tổng số phòng:</span>
              <span className="summary-total-value">{totalRooms} phòng</span>
            </div>
            <div className="summary-total-row">
              <span className="summary-total-label">Tổng số khách:</span>
              <span className="summary-total-value">{totalGuests} người</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="summary-empty">
          <p className="summary-empty-text">Chưa có phòng nào được chọn</p>
        </div>
      )}
    </div>
  );
}

export default BookingSummaryCard;
