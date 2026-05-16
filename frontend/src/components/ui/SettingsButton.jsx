import { useState } from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import { Settings } from 'lucide-react';

export const SettingsButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const primaryTeal = '#2C7A7B';

  return (
    <BootstrapButton 
      variant="light" 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="d-flex align-items-center justify-content-center p-0 border shadow-sm rounded-pill" 
      style={{ 
        height: '42px',
        width: isHovered ? '155px' : '42px', 
        backgroundColor: '#fff', 
        color: isHovered ? primaryTeal : '#4a5568',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
    >
      <Settings size={20} style={{ minWidth: '20px' }} />
      <span 
        className="fw-medium" 
        style={{ 
          opacity: isHovered ? 1 : 0, 
          width: isHovered ? 'auto' : 0,
          marginLeft: isHovered ? '8px' : '0',
          transition: 'opacity 0.2s ease-in-out',
          fontSize: '0.95rem'
        }}
      >
        Configurações
      </span>
    </BootstrapButton>
  );
};