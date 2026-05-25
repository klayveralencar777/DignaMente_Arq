import { Modal, Form, Button as BootstrapButton } from 'react-bootstrap';

export const CancelModal = ({ show, onHide, cancelReason, setCancelReason, onConfirm }) => {
  const primaryGreen = '#50C878';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="p-4">
        <h4 className="fw-bold mb-3" style={{ color: '#404b5a' }}>Cancelar Consulta?</h4>
        <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
          Para nos ajudar a melhorar o serviço, selecione o motivo do cancelamento. Esta informação é obrigatória.
        </p>

        <Form className="d-flex flex-column gap-3 mb-4">
          {[
            'Problemas de saúde',
            'Esquecimento',
            'Falta de transporte/conexão',
            'Outros'
          ].map((motivo) => (
            <div 
              key={motivo}
              className={`p-3 border rounded-3 d-flex align-items-center gap-3 ${cancelReason === motivo ? 'border-success' : 'border-light-subtle'}`}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setCancelReason(motivo)}
            >
              <div 
                className={`rounded-circle border d-flex align-items-center justify-content-center`} 
                style={{ width: '20px', height: '20px', borderColor: cancelReason === motivo ? primaryGreen : '#ccc' }}
              >
                {cancelReason === motivo && <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: primaryGreen }}></div>}
              </div>
              <span style={{ color: '#333', fontWeight: '500' }}>{motivo}</span>
            </div>
          ))}
        </Form>

        <div className="d-flex gap-2">
          <BootstrapButton 
            variant="info" 
            className="w-50 text-white fw-bold py-2 border-0" 
            style={{ backgroundColor: '#3bbaf1' }}
            onClick={onHide}
          >
            Manter Consulta
          </BootstrapButton>
          <BootstrapButton 
            variant="danger" 
            className="w-50 text-white fw-bold py-2 border-0" 
            style={{ backgroundColor: '#e84545' }}
            onClick={onConfirm}
          >
            Confirmar Cancelamento
          </BootstrapButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};