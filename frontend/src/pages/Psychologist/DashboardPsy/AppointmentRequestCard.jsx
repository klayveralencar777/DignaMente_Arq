import React, { useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Calendar, Clock, Check, X, Video } from 'lucide-react';
import { api } from '../../../services/api';

export const AppointmentRequestCard = ({ appointment, onRefresh }) => {
  const [loadingAction, setLoadingAction] = useState(null); // 'accept' ou 'reject'

  // Função para Aceitar a consulta (Gera o link do Meet)
  const handleAccept = async () => {
    setLoadingAction('accept');
    try {
      await api.post(`/appointments/${appointment.id}/meet`);
      alert('Consulta aceita e sala do Meet gerada com sucesso!');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      alert('Erro ao aceitar consulta.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Função para Recusar a consulta (Deleta/Cancela)
  const handleReject = async () => {
    if (!window.confirm('Tem certeza que deseja recusar este agendamento?')) return;
    
    setLoadingAction('reject');
    try {
      await api.delete(`/appointments/${appointment.id}`);
      alert('Consulta recusada com sucesso.');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      alert('Erro ao recusar consulta.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-3 rounded-3 bg-white">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            {/* Como o DTO do seu back retorna o objeto do paciente, pegamos o name de dentro dele */}
            <h6 className="fw-bold m-0 text-dark">
              {appointment.patient?.name || 'Paciente Anonimizado'}
            </h6>
            <span className="badge bg-warning text-dark rounded-pill small px-2 mt-1" style={{ fontSize: '0.75rem' }}>
              Pendente
            </span>
          </div>
        </div>

        <div className="d-flex flex-column gap-1 text-muted mb-3 small">
          <div className="d-flex align-items-center gap-2">
            <Calendar size={14} className="text-secondary" />
            <span>{appointment.date ? new Date(appointment.date).toLocaleDateString('pt-BR') : 'Sem data'}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Clock size={14} className="text-secondary" />
            <span>{appointment.time || 'Horário não definido'}</span>
          </div>
        </div>

        <div className="d-flex gap-2 pt-1">
          <Button 
            variant="success" 
            className="w-100 d-flex align-items-center justify-content-center gap-1 py-2 small fw-semibold text-white rounded-2"
            onClick={handleAccept}
            disabled={loadingAction !== null}
            style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}
          >
            {loadingAction === 'accept' ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <Check size={16} /> Aceitar
              </>
            )}
          </Button>

          <Button 
            variant="danger" 
            className="w-100 d-flex align-items-center justify-content-center gap-1 py-2 small fw-semibold text-white rounded-2"
            onClick={handleReject}
            disabled={loadingAction !== null}
            style={{ backgroundColor: '#C62828', borderColor: '#C62828' }}
          >
            {loadingAction === 'reject' ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <X size={16} /> Recusar
              </>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};