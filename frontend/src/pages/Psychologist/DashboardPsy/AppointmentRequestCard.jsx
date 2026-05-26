import { useState } from 'react';
import { Card, Button as BootstrapButton, Form, Spinner } from 'react-bootstrap';
import { Check, X } from 'lucide-react';

export const AppointmentRequestCard = ({ request, onAccept, onDecline }) => {
  // --- Estados: 'PENDING' ou 'DECLINING' (mostra o form) ---
  const [status, setStatus] = useState('PENDING');
  const [declineReason, setDeclineReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const primaryTeal = '#2C7A7B';
  const actionGreen = '#48BB78';
  const dangerRed = '#EF4444';

  const handleAcceptClick = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onAccept(request);
    } catch (error) {
      alert('Erro ao aceitar consulta.');
      setIsLoading(false);
    }
  };

  const handleConfirmDeclineClick = async () => {
    const finalReason = declineReason === 'outro' ? customReason.trim() : declineReason;
    
    // Validação premium: Se tiver vazio ou menos de 5 caracteres, dispara o Toaster de Erro no pai!
    if (!finalReason || finalReason.length < 5) {
      onDecline(null, null, true); // O terceiro parâmetro 'true' avisa que é um erro de validação
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Avisa o pai para remover o card e mostrar o Toaster de recusa confirmada
      onDecline(request.id, finalReason, false);
    } catch (error) {
      alert('Erro ao processar recusa.');
      setIsLoading(false);
    }
  };

  // --- Renderização ---

  // Visão: Formulário de Recusa
  if (status === 'DECLINING') {
    return (
      <Card className="border-0 rounded-4 shadow-sm mb-4 p-4" style={{ borderLeft: `6px solid ${dangerRed} !important` }}>
        <h6 className="fw-bold text-dark mb-2">Motivo da Recusa</h6>
        <p className="text-muted fs-6 mb-3">Selecione ou descreva o motivo para notificar o paciente.</p>
        
        <Form.Select 
          value={declineReason} 
          onChange={(e) => setDeclineReason(e.target.value)}
          className="mb-3 shadow-none fw-medium text-secondary"
        >
          <option value="">Selecione uma opção...</option>
          <option value="Choque de horários na agenda">Choque de horários na agenda</option>
          <option value="Emergência pessoal/médica">Emergência pessoal/médica</option>
          <option value="Perfil fora da minha especialidade">Perfil fora da minha especialidade</option>
          <option value="outro">Outro motivo (descrever)</option>
        </Form.Select>

        {declineReason === 'outro' && (
          <Form.Control 
            as="textarea" 
            rows={2} 
            placeholder="Descreva brevemente o motivo (mín. 5 caracteres)..." 
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="mb-3 shadow-none"
          />
        )}

        <div className="d-flex justify-content-end gap-2">
          <BootstrapButton variant="light" onClick={() => setStatus('PENDING')} disabled={isLoading} className="fw-medium text-secondary border">
            Cancelar
          </BootstrapButton>
          <BootstrapButton variant="danger" onClick={handleConfirmDeclineClick} disabled={isLoading} className="fw-bold d-flex align-items-center gap-2">
            {isLoading ? <Spinner size="sm" animation="border" /> : 'Confirmar Recusa'}
          </BootstrapButton>
        </div>
      </Card>
    );
  }

  // Visão Padrão: Pendente
  return (
    <Card className="border-0 rounded-4 shadow-sm p-4 mb-4 position-relative" style={{ borderLeft: `6px solid ${actionGreen} !important` }}>
      {isLoading && (
        <div className="position-absolute w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded-4" style={{ zIndex: 10 }}>
          <Spinner animation="border" style={{ color: primaryTeal }} />
        </div>
      )}
      <Card.Body className="p-0">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div>
            <h5 className="fw-bold m-0" style={{ color: '#2d3748' }}>{request.patientName}</h5>
            <p className="text-muted m-0 mt-1 fs-6">Solicitado em: {request.requestDate}</p>
            <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className="m-0 text-secondary" style={{ fontSize: '0.95rem' }}>
                <strong>Motivo da busca:</strong> {request.details}
              </p>
            </div>
          </div>
          <div className="d-flex flex-column gap-2 justify-content-center min-vw-25">
            <BootstrapButton onClick={handleAcceptClick} className="d-flex align-items-center justify-content-center gap-2 fw-bold border-0 py-2" style={{ backgroundColor: actionGreen }}>
              <Check size={18} /> Aceitar Consulta
            </BootstrapButton>
            <BootstrapButton variant="outline-danger" onClick={() => setStatus('DECLINING')} className="d-flex align-items-center justify-content-center gap-2 fw-bold py-2">
              <X size={18} /> Recusar
            </BootstrapButton>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};