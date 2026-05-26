import { Modal, Form } from 'react-bootstrap';
import { useState } from 'react';

export const PasswordModal = ({ show, onHide, onSuccess }) => {
  const primaryTeal = "#2C7A7B";
  const lightBg = "#F4F7F9";
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem. Verifique e tente novamente.");
      return;
    }
    
    // Simula a chamada da API dando certo
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    onHide(); // Fecha o modal
    onSuccess(); // Dispara o Toast de sucesso
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="border-0 rounded-4 shadow-lg">
      <div style={{ backgroundColor: lightBg, borderRadius: "1rem", padding: "8px" }}>
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2" style={{ color: "#334155", fontSize: "1.2rem" }}>
            🔒 Alterar Senha
          </Modal.Title>
          <button onClick={onHide} className="btn-close shadow-none" style={{ fontSize: "0.8rem" }}></button>
        </Modal.Header>
        
        <Modal.Body className="pt-2 pb-3">
          <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
            Informe seu e-mail cadastrado para validação.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-dark small mb-1 d-flex align-items-center gap-1">
                ✉️ E-mail atual
              </Form.Label>
              <Form.Control 
                type="email" 
                placeholder="seu@email.com" 
                className="rounded-3 shadow-sm py-2"
                style={{ border: `1px solid ${primaryTeal}` }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-dark small mb-1">Nova senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Nova senha" 
                className="rounded-3 border-light shadow-sm py-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-dark small mb-1">Confirmar nova senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirmar senha" 
                className="rounded-3 border-light shadow-sm py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <button 
              type="submit" 
              className="btn w-100 text-white fw-bold rounded-3 shadow-sm py-2 mt-2" 
              style={{ backgroundColor: primaryTeal }}
            >
              Alterar Senha
            </button>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};