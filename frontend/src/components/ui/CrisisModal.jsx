import { Modal, Card } from "react-bootstrap";
import { Heart, Phone, X } from "lucide-react";

export const CrisisModal = ({ show, onHide }) => {
  const primaryTeal = "#2C7A7B";
  const paleTeal = "#E8F3F3";

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header className="border-0 pb-0 d-flex justify-content-between align-items-start">
        <div>
          <Modal.Title className="fw-bold d-flex align-items-center gap-2 text-danger">
            <Heart size={24} /> Ajuda Urgente
          </Modal.Title>
          <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.95rem" }}>
            Se você está em crise ou precisa de ajuda imediata, ligue agora:
          </p>
        </div>
        {/* Usando o botão de fechar nativo do Bootstrap ou customizado */}
        <button 
          onClick={onHide} 
          className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border-0" 
          style={{ width: '32px', height: '32px' }}
        >
          <X size={18} className="text-muted" />
        </button>
      </Modal.Header>
      
      <Modal.Body className="pt-4 pb-4">
        {/* CARD CVV (188) */}
        <a href="tel:188" className="text-decoration-none">
          <Card 
            className="border-danger bg-danger bg-opacity-10 rounded-4 mb-3 transition-all" 
            style={{ cursor: "pointer" }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div 
                className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" 
                style={{ width: "54px", height: "54px" }}
              >
                <Phone size={26} />
              </div>
              <div>
                <h3 className="fw-bold text-dark m-0">188</h3>
                <p className="text-muted m-0 fw-medium" style={{ fontSize: "0.9rem" }}>
                  CVV — Centro de Valorização da Vida
                </p>
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  24h, gratuito, sigilo garantido
                </span>
              </div>
            </Card.Body>
          </Card>
        </a>

        {/* CARD SAMU (192) */}
        <a href="tel:192" className="text-decoration-none">
          <Card 
            className="border rounded-4 transition-all" 
            style={{ borderColor: primaryTeal, backgroundColor: paleTeal, cursor: "pointer" }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div 
                className="text-white rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" 
                style={{ width: "54px", height: "54px", backgroundColor: primaryTeal }}
              >
                <Phone size={26} />
              </div>
              <div>
                <h3 className="fw-bold text-dark m-0">192</h3>
                <p className="text-muted m-0 fw-medium" style={{ fontSize: "0.9rem" }}>
                  SAMU — Serviço de Atendimento Móvel
                </p>
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Emergências médicas 24h
                </span>
              </div>
            </Card.Body>
          </Card>
        </a>
      </Modal.Body>
    </Modal>
  );
};