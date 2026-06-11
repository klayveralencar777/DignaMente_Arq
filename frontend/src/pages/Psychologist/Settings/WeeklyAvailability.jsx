import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { api } from '../../../services/api';
import { Save, Clock } from 'lucide-react';

export const WeeklyAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // CORRIGIDO: de thuesday para thursday para bater com o Java!
  const [availability, setAvailability] = useState({
    monday: { active: false, startTime: '08:00', endTime: '18:00' },
    tuesday: { active: false, startTime: '08:00', endTime: '18:00' },
    wednesday: { active: false, startTime: '08:00', endTime: '18:00' },
    thursday: { active: false, startTime: '08:00', endTime: '18:00' },
    friday: { active: false, startTime: '08:00', endTime: '18:00' },
  });

  // Carrega as configurações salvas no banco
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const response = await api.get('/psychologists/me/availability');
        if (response.data && Object.keys(response.data).length > 0) {
          setAvailability(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar horários cadastrados:", error);
      } finally {
        setFetching(false);
      }
    };
    loadAvailability();
  }, []);

  // Salva as mudanças de verdade na API
  const handleSaveAvailability = async () => {
    setLoading(true);
    try {
      await api.put('/psychologists/me/availability', availability);
      alert('Seus horários de atendimento foram salvos com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar sua disponibilidade no servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm rounded-3 bg-white p-4">
      <h5 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
        <Clock size={20} className="text-primary" /> Meus Horários de Atendimento
      </h5>
      <p className="text-muted small mb-4">Defina os dias e os intervalos de horários que você estará disponível para consultas.</p>

      {Object.keys(availability).map((day) => (
        <Row key={day} className="align-items-center mb-3 pb-2 border-bottom border-light">
          <Col xs={4} md={3}>
            <Form.Check 
              type="checkbox"
              id={`check-${day}`}
              label={
                day === 'monday' ? 'Segunda-feira' :
                day === 'tuesday' ? 'Terça-feira' :
                day === 'wednesday' ? 'Quarta-feira' :
                day === 'thursday' ? 'Quinta-feira' : 'Sexta-feira'
              }
              checked={availability[day].active}
              onChange={(e) => setAvailability({
                ...availability,
                [day]: { ...availability[day], active: e.target.checked }
              })}
              className="fw-semibold text-secondary"
            />
          </Col>
          <Col xs={4} md={3}>
            <Form.Control 
              type="time" 
              disabled={!availability[day].active}
              value={availability[day].startTime}
              onChange={(e) => setAvailability({
                ...availability,
                [day]: { ...availability[day], startTime: e.target.value }
              })}
            />
          </Col>
          <Col xs={4} md={3}>
            <Form.Control 
              type="time" 
              disabled={!availability[day].active}
              value={availability[day].endTime}
              onChange={(e) => setAvailability({
                ...availability,
                [day]: { ...availability[day], endTime: e.target.value }
              })}
            />
          </Col>
        </Row>
      ))}

      <div className="d-flex justify-content-end mt-4">
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold text-white rounded-2"
          onClick={handleSaveAvailability}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : <><Save size={18} /> Salvar Disponibilidade</>}
        </Button>
      </div>
    </Card>
  );
};