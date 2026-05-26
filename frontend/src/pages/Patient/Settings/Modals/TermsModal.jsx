import { Modal } from 'react-bootstrap';

export const TermsModal = ({ show, onHide }) => {
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
            Termos de Uso
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
            <p><strong>1.</strong> O DignaMente é uma plataforma pública de teleconsulta em saúde mental integrada ao SUS.</p>
            <p><strong>2.</strong> O uso do sistema é gratuito para todos os usuários cadastrados.</p>
            <p><strong>3.</strong> As teleconsultas são realizadas exclusivamente por profissionais verificados e habilitados pelo CFP.</p>
            <p><strong>4.</strong> O paciente tem direito a cancelar consultas com até 24 horas de antecedência sem penalidade.</p>
            <p><strong>5.</strong> É proibido o uso do sistema para fins que não sejam relacionados ao cuidado em saúde mental.</p>
            <p><strong>6.</strong> O DignaMente reserva-se o direito de suspender contas que violem estes termos.</p>
            <p className="mb-0"><strong>7.</strong> Ao utilizar o sistema, o usuário concorda com todas as condições aqui descritas.</p>
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