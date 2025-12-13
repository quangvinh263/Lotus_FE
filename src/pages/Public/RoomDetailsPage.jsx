import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/RoomDetailsPage.css';
import Navbar from '../../components/Public/NavBar';
import Footer from '../../components/Public/Footer';
import RoomDetailSection from '../../components/Public/RoomDetailSection';
import RoomSection from '../../components/Public/RoomSection'; // ✅ Import RoomSection
import ImageRoomDetailsPage from '../../assets/images/ImageRoomDetailsPage.jpg';
import { getRoomTypeById, getRoomOverview } from '../../api/roomTypeApi'; // ✅ Import getRoomOverview

const RoomDetailsPage = () => {
  const params = useParams();
  const id = params.id || params.roomTypeId;
  
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [relatedRooms, setRelatedRooms] = useState([]); // ✅ State cho phòng gợi ý
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      if (!id) {
        toast.error('Room ID is missing');
        navigate('/rooms');
        return;
      }

      setIsLoading(true);

      try {
        // 1. Fetch chi tiết phòng hiện tại
        console.log('🔍 Fetching details for room:', id);
        const detailResponse = await getRoomTypeById(id);
        
        if (detailResponse.success && detailResponse.roomType) {
          setRoom(detailResponse.roomType);
        } else {
          toast.error(detailResponse.message || 'Room not found');
          navigate('/rooms');
          return;
        }

        // 2. Fetch danh sách phòng để lấy gợi ý (You may also interested)
        const overviewResponse = await getRoomOverview();
        
        if (overviewResponse.success && Array.isArray(overviewResponse.overview)) {
          // Lọc bỏ phòng hiện tại
          const otherRooms = overviewResponse.overview.filter(r => r.roomTypeId !== id);
          
          // Xáo trộn ngẫu nhiên (Shuffle)
          const shuffled = otherRooms.sort(() => 0.5 - Math.random());
          
          // Lấy 2 phòng đầu tiên
          setRelatedRooms(shuffled.slice(0, 2));
        }

      } catch (error) {
        console.error('❌ Error fetching data:', error);
        toast.error('An error occurred while loading data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleBookRoom = (typeId) => {
    // Nếu typeId được truyền vào (từ related rooms) thì dùng nó, không thì dùng room hiện tại
    const targetId = typeId || room?.typeId;
    if (targetId) {
      console.log('Book room clicked:', targetId);
      navigate('/booking', { state: { roomTypeId: targetId } });
    }
  };

  const handleMoreInfo = (typeId) => {
    // Chuyển hướng sang trang chi tiết của phòng được gợi ý
    navigate(`/room-details/${typeId}`);
    window.scrollTo(0, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getAmenityByCategory = (category) => {
    if (!room?.amenities) return null;
    const amenity = room.amenities.find(a => a.category === category);
    return amenity ? amenity.name : null;
  };

  if (isLoading) {
    return (
      <div className="room-details-page">
        <Navbar />
        <div className="rooms-loading" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginLeft: '10px' }}>Loading room details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return null;
  }

  const mainImage = room.roomImages && room.roomImages.length > 0 
    ? room.roomImages[0].url 
    : null;

  const heroImage = room.roomImages && room.roomImages.length > 1 
    ? room.roomImages[1].url 
    : mainImage;

  const bedInfo = getAmenityByCategory('Bedding') || "1 King bed or 2 Single beds";
  const viewInfo = getAmenityByCategory('View') || room.viewing || "City view";
  const bathInfo = getAmenityByCategory('Bathroom') || "Private Bathroom";

  return (
    <div className="room-details-page">
      <Navbar />

      <div className="room-details-hero">
        <img 
          src={heroImage || ImageRoomDetailsPage} 
          alt={room.typeName || "Room Details"} 
          className="room-details-hero-image"
          onError={(e) => { e.target.src = ImageRoomDetailsPage }}
        />
        <div className="room-details-hero-overlay"></div>
      </div>

      <RoomDetailSection
        roomType={room.typeName} 
        price={formatPrice(room.basePrice)}
        description={room.description}
        roomSize={`${room.square} sqm`}
        maxOccupancy={`${room.capacity} pax`}
        imageUrl={mainImage}
        beds={bedInfo}
        view={viewInfo}
        bathroom={bathInfo}
        smoking={room.smoking ? "Allowed" : "Non-smoking"}
        onBookRoom={() => handleBookRoom(room.typeId)}
      />

      {/* ✅ Section: You may also be interested in */}
      {relatedRooms.length > 0 && (
        <div className="room-detail-related-rooms">
          <h1 className="room-detail-section-title">You may also be interested in</h1>
          
          <div className="rooms-grid">
            {relatedRooms.map((related) => (
              <RoomSection
                key={related.roomTypeId}
                roomType={related.roomTypeName}
                price={formatPrice(related.basePrice)}
                description={related.description}
                roomSize={`${related.square} sqm`}
                beds="1 King bed or 2 Single beds"
                maxOccupancy={`${related.capacity} pax`}
                view="City view"
                smoking="No"
                bathroom="Toilet, washbasin, and shower"
                imageUrl={related.urlImage}
                onBookRoom={() => handleBookRoom(related.roomTypeId)}
                onMoreInfo={() => handleMoreInfo(related.roomTypeId)}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RoomDetailsPage;
