import './BookingStatsCards.css';

function BookingStatsCards({ stats, selectedStatus, onStatusClick }) {
  const cards = [
    { 
      key: 'all', 
      label: 'Tất cả', 
      value: stats.all, 
      gradient: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(243, 243, 224, 1) 100%)',
      color: '#133E87'
    },
    { 
      key: 'pending', 
      label: 'Chờ xác nhận', 
      value: stats.pending, 
      gradient: 'linear-gradient(135deg, rgba(254, 252, 232, 1) 0%, rgba(255, 255, 255, 1) 100%)',
      color: '#A65F00'
    },
    { 
      key: 'confirmed', 
      label: 'Đã xác nhận', 
      value: stats.confirmed, 
      gradient: 'linear-gradient(135deg, rgba(240, 253, 244, 1) 0%, rgba(255, 255, 255, 1) 100%)',
      color: '#008236'
    },
    { 
      key: 'checked-in', 
      label: 'Đang ở', 
      value: stats.checkedIn, 
      gradient: 'linear-gradient(135deg, rgba(239, 246, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
      color: '#1447E6'
    },
    { 
      key: 'completed', 
      label: 'Đã hoàn tất', 
      value: stats.completed, 
      gradient: 'linear-gradient(135deg, rgba(249, 250, 251, 1) 0%, rgba(255, 255, 255, 1) 100%)',
      color: '#364153'
    }
  ];

  return (
    <div className="bsc-container">
      {cards.map(card => (
        <div
          key={card.key}
          className={`bsc-card ${selectedStatus === card.key ? 'bsc-card-active' : ''}`}
          style={{ background: card.gradient }}
          onClick={() => onStatusClick(card.key)}
        >
          <div className="bsc-label" style={{ color: '#608BC1' }}>{card.label}</div>
          <div className="bsc-value" style={{ color: card.color }}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}

export default BookingStatsCards;
