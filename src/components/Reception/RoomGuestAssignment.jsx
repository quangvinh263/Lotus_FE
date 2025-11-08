import React, { useState, useEffect } from 'react';
import './RoomGuestAssignment.css';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import HouseIcon from '../../assets/icons/HouseIcon.svg';

const RoomGuestAssignment = ({ selectedRooms, guests, onAssignmentChange, maxGuestsPerRoom = {} }) => {
  // State: { roomId: [guestIndex1, guestIndex2, ...] }
  const [roomAssignments, setRoomAssignments] = useState({});

  // Tạo danh sách phẳng tất cả các phòng đã chọn
  const allRooms = Object.entries(selectedRooms).flatMap(([roomType, rooms]) =>
    rooms.map(room => ({ ...room, type: roomType }))
  );

  useEffect(() => {
    // Notify parent component về assignment changes
    onAssignmentChange(roomAssignments);
  }, [roomAssignments, onAssignmentChange]);

  const handleGuestToggle = (roomId, guestIndex) => {
    setRoomAssignments(prev => {
      const currentAssignments = prev[roomId] || [];
      const isAssigned = currentAssignments.includes(guestIndex);

      if (isAssigned) {
        // Remove guest from room
        return {
          ...prev,
          [roomId]: currentAssignments.filter(idx => idx !== guestIndex)
        };
      } else {
        // Add guest to room
        return {
          ...prev,
          [roomId]: [...currentAssignments, guestIndex]
        };
      }
    });
  };

  const isGuestAssigned = (guestIndex) => {
    // Check if guest is already assigned to any room
    return Object.values(roomAssignments).some(assignments => 
      assignments.includes(guestIndex)
    );
  };

  const getAssignedRoomForGuest = (guestIndex) => {
    for (const [roomId, assignments] of Object.entries(roomAssignments)) {
      if (assignments.includes(guestIndex)) {
        const room = allRooms.find(r => r.id === roomId);
        return room ? room.number : null;
      }
    }
    return null;
  };

  const getTotalAssignedGuests = () => {
    return new Set(Object.values(roomAssignments).flat()).size;
  };

  const getRoomCapacity = (room) => {
    return maxGuestsPerRoom[room.type] || 2; // Default 2 guests per room
  };

  if (allRooms.length === 0) {
    return (
      <div className="room-guest-assignment">
        <div className="rga-empty-state">
          <p>Vui lòng chọn phòng trước khi gán khách</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-guest-assignment">
      <div className="rga-header">
        <h3 className="rga-title">Gán khách vào từng phòng</h3>
        <p className="rga-subtitle">Click vào khách để chọn, click lại để bỏ chọn</p>
        <div className="rga-summary">
          <span className={`rga-badge ${getTotalAssignedGuests() === guests.length ? 'complete' : ''}`}>
            {getTotalAssignedGuests()}/{guests.length} khách đã gán
          </span>
        </div>
      </div>

      <div className="rga-content">
        {allRooms.map((room) => {
          const assignedGuests = roomAssignments[room.id] || [];
          const capacity = getRoomCapacity(room);
          const isFull = assignedGuests.length >= capacity;

          return (
            <div key={room.id} className="rga-room-card">
              <div className="rga-room-header">
                <div className="rga-room-info">
                  <img src={HouseIcon} alt="Room" className="rga-room-icon" />
                  <div className="rga-room-details">
                    <span className="rga-room-number">Phòng {room.number}</span>
                    <span className="rga-room-type">{room.type}</span>
                  </div>
                </div>
                <div className="rga-room-capacity">
                  <span className={`rga-capacity-badge ${isFull ? 'full' : ''}`}>
                    {assignedGuests.length}/{capacity} khách
                  </span>
                </div>
              </div>

              <div className="rga-room-body">
                <label className="rga-label">Chọn khách ở phòng này:</label>
                <div className="rga-guest-grid">
                  {guests.map((guest, guestIndex) => {
                    const isInThisRoom = assignedGuests.includes(guestIndex);
                    const isInOtherRoom = !isInThisRoom && isGuestAssigned(guestIndex);
                    const assignedRoom = getAssignedRoomForGuest(guestIndex);
                    const canSelect = isInThisRoom || (!isInOtherRoom && !isFull); // Cho phép bỏ chọn nếu đã chọn

                    return (
                      <button
                        key={guestIndex}
                        className={`rga-guest-btn ${isInThisRoom ? 'selected' : ''} ${isInOtherRoom ? 'disabled' : ''}`}
                        onClick={() => handleGuestToggle(room.id, guestIndex)}
                        disabled={isInOtherRoom || (!isInThisRoom && isFull)}
                        title={
                          isInThisRoom
                            ? 'Click để bỏ chọn'
                            : isInOtherRoom 
                            ? `Đã gán vào phòng ${assignedRoom}` 
                            : isFull && !isInThisRoom
                            ? 'Phòng đã đủ khách'
                            : 'Click để chọn'
                        }
                      >
                        <img src={PersonIcon} alt="Guest" className="rga-guest-icon" />
                        <div className="rga-guest-info">
                          <span className="rga-guest-name">
                            {guest.fullName || `Khách ${guestIndex + 1}`}
                            {guest.gender && (
                              <span className="rga-gender-tag">
                                {guest.gender === 'male' ? ' (Nam)' : guest.gender === 'female' ? ' (Nữ)' : ' (Khác)'}
                              </span>
                            )}
                          </span>
                          {guest.isPrimary && (
                            <span className="rga-primary-tag">Đại diện</span>
                          )}
                          {isInOtherRoom && (
                            <span className="rga-assigned-tag">P.{assignedRoom}</span>
                          )}
                        </div>
                        {isInThisRoom && (
                          <span className="rga-check-icon">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Show assigned guests in this room */}
                {assignedGuests.length > 0 && (
                  <div className="rga-assigned-list">
                    <span className="rga-assigned-label">Khách trong phòng:</span>
                    <div className="rga-assigned-tags">
                      {assignedGuests.map(guestIndex => (
                        <span key={guestIndex} className="rga-assigned-guest-tag">
                          {guests[guestIndex]?.fullName || `Khách ${guestIndex + 1}`}
                          {guests[guestIndex]?.isPrimary && ' (Đại diện)'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning if not all guests assigned */}
      {getTotalAssignedGuests() < guests.length && (
        <div className="rga-warning">
          <span className="rga-warning-icon">⚠️</span>
          <span className="rga-warning-text">
            Còn {guests.length - getTotalAssignedGuests()} khách chưa được gán phòng
          </span>
        </div>
      )}
    </div>
  );
};

export default RoomGuestAssignment;
