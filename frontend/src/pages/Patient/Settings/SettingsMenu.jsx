import { Offcanvas, Toast, ToastContainer } from 'react-bootstrap';
import { Settings, FileText, Shield, Lock, LogOut, X } from 'lucide-react';
import { useState } from 'react';

import { TermsModal } from './Modals/TermsModal';
import { PrivacyModal } from './Modals/PrivacyModal';
import { PasswordModal } from './Modals/PasswordModal';

export const SettingsMenu = ({ show, onHide, onLogout }) => {
  const primaryTeal = "#2C7A7B";
  const paleTeal = "#E8F3F3";
  const borderTeal = "#C4E1E1";
  
  const [activeItem, setActiveItem] = useState(null);
  
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Estado para o Toast de Sucesso da Senha
  const [showPasswordToast, setShowPasswordToast] = useState(false);

  const menuItems = [
    { id: 'termos', icon: FileText, label: 'Termos de Uso' },
    { id: 'privacidade', icon: Shield, label: 'Política de Privacidade' },
    { id: 'senha', icon: Lock, label: 'Alterar Senha' },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
    if (id === 'termos') setShowTermsModal(true);
    if (id === 'privacidade') setShowPrivacyModal(true);
    if (id === 'senha') setShowPasswordModal(true);
  };

  return (
    <>
      {/* TOAST DE SUCESSO DA SENHA */}
      <ToastContainer position="top-end" className="p-4" style={{ zIndex: 1060, position: 'fixed' }}>
        <Toast 
          show={showPasswordToast} 
          onClose={() => setShowPasswordToast(false)} 
          delay={4000} 
          autohide
          className="border-0 shadow-sm rounded-3"
          style={{ backgroundColor: '#F8FAFC', border: `1px solid ${borderTeal}` }}
        >
          <Toast.Body className="fw-medium text-dark px-4 py-3" style={{ fontSize: "0.95rem" }}>
            Senha alterada com sucesso!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Offcanvas show={show} onHide={onHide} placement="end" style={{ fontFamily: "Inter, sans-serif", width: "350px" }}>
        
        <Offcanvas.Header className="border-bottom px-4 py-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 fw-bold" style={{ color: primaryTeal, fontSize: "1.15rem" }}>
            <Settings size={22} /> Configurações
          </div>
          <button onClick={onHide} className="btn btn-link p-0 text-secondary text-decoration-none d-flex align-items-center justify-content-center">
            <X size={24} style={{ color: "#64748B" }} />
          </button>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="d-flex flex-column p-0">
          <div className="flex-grow-1 p-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="d-flex align-items-center gap-3 p-3 mb-2 rounded-4 transition-all"
                style={{ cursor: 'pointer', backgroundColor: activeItem === item.id ? paleTeal : 'transparent' }}
                onMouseOver={(e) => { if (activeItem !== item.id) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseOut={(e) => { if (activeItem !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <item.icon size={20} style={{ color: primaryTeal }} />
                <span className="fw-medium" style={{ color: '#1E293B', fontSize: "0.95rem" }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="p-4 border-top">
            <button 
              onClick={onLogout}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 fw-bold text-white shadow-sm transition-all"
              style={{ backgroundColor: '#E11D48', border: 'none' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#BE123C'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E11D48'}
            >
              <LogOut size={18} /> Sair da Conta
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Modais */}
      <TermsModal show={showTermsModal} onHide={() => setShowTermsModal(false)} />
      <PrivacyModal show={showPrivacyModal} onHide={() => setShowPrivacyModal(false)} />
      <PasswordModal 
        show={showPasswordModal} 
        onHide={() => setShowPasswordModal(false)} 
        onSuccess={() => setShowPasswordToast(true)}
      />
    </>
  );
};