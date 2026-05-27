import { Modal } from 'react-bootstrap';

export const PrivacyModal = ({ show, onHide }) => {
  const primaryTeal = "#2C7A7B";
  const lightBg = "#F4F7F9";

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      contentClassName="border-0 rounded-4 shadow-lg"
    >
      <div style={{ backgroundColor: lightBg, borderRadius: "1rem", padding: "8px" }}>
        <Modal.Header className="border-0 pb-2">
          <Modal.Title className="fw-bold" style={{ color: "#334155", fontSize: "1.2rem" }}>
            Política de Privacidade
          </Modal.Title>
          <button 
            onClick={onHide} 
            className="btn-close shadow-none" 
            style={{ fontSize: "0.8rem" }}
          ></button>
        </Modal.Header>
        
        <Modal.Body className="pt-0 pb-2">
          <div 
            className="pe-3" 
            style={{ maxHeight: "300px", overflowY: "auto", color: "#64748B", fontSize: "0.95rem", lineHeight: "1.6" }}
          >
            <p><strong>1.</strong> Seus dados pessoais são protegidos conforme a LGPD (Lei 13.709/2018).</p>
            <p><strong>2.</strong> As teleconsultas são criptografadas ponta-a-ponta.</p>
            <p><strong>3.</strong> Nenhuma gravação será feita sem seu consentimento expresso.</p>
            <p><strong>4.</strong> Você pode solicitar a exclusão dos seus dados a qualquer momento.</p>
            <p><strong>5.</strong> Informações clínicas são acessíveis apenas ao seu profissional de saúde designado.</p>
            <p><strong>6.</strong> Dados de navegação podem ser coletados para melhoria do serviço, de forma anônima.</p>
            <p className="mb-0"><strong>7.</strong> O DignaMente não compartilha dados pessoais com terceiros sem consentimento.</p>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-3 pb-3">
          <button 
            onClick={onHide} 
            className="btn px-4 py-2 fw-bold text-white rounded-3 shadow-sm"
            style={{ backgroundColor: primaryTeal }}
          >
            Fechar
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};