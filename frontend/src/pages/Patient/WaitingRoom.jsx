import { Container, Navbar, Button as BootstrapButton, Card } from 'react-bootstrap';
import { Settings, Video, Phone, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WaitingRoom = () => {
  const navigate = useNavigate();
  const primaryGreen = '#50C878';
  const lightBackground = '#f8f9fa';

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: lightBackground, color: '#333', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Cabeçalho */}
      <Navbar bg="white" expand="lg" className="px-4 py-2 border-bottom shadow-sm">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-0 fw-bold d-flex align-items-center gap-2">
              <span style={{ color: primaryGreen, fontSize: '1.4rem' }}>
                <Heart size={24} style={{ border: '2px solid', borderRadius: '5px', padding: '3px'}}/>
              </span>
              <span>DignaMente</span>
              <span className="text-muted fw-normal ms-2 d-none d-sm-inline"> — Sala de Espera</span>
            </h4>
          </div>
          <BootstrapButton variant="outline-secondary" className="d-flex align-items-center gap-2 text-capitalize px-3 py-1 fw-medium" style={{ fontSize: '0.9rem'}}>
            <Settings size={18} /> Configurações
          </BootstrapButton>
        </Container>
      </Navbar>

      {/* Conteúdo Centralizado */}
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <Card className="border-0 shadow-sm rounded-4 w-100" style={{ maxWidth: '650px' }}>
          <Card.Body className="p-4 p-md-5 text-center d-flex flex-column align-items-center">
            
            {/* Ícone de Câmera */}
            <div className="mb-4 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', backgroundColor: '#e6f8ec', borderRadius: '50%' }}>
              <Video size={36} style={{ color: primaryGreen }} />
            </div>

            {/* Textos Principais */}
            <h2 className="fw-bold mb-3" style={{ color: '#2d3748' }}>Você está na sala de espera 💚</h2>
            <p className="text-muted mb-5 px-md-4" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
              O profissional será notificado e iniciará sua chamada em instantes. Respire fundo, este é um espaço seguro.
            </p>

            {/* Caixa de Dicas */}
            <div className="bg-light w-100 rounded-4 p-4 text-start mb-5 border" style={{ borderColor: '#e2e8f0' }}>
              <h6 className="fw-bold text-muted mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>ENQUANTO AGUARDA</h6>
              
              <ul className="list-unstyled d-flex flex-column gap-3 m-0 text-muted" style={{ fontSize: '0.95rem' }}>
                <li className="d-flex align-items-center gap-3">
                  <span>🌿</span> Procure um lugar tranquilo e bem iluminado.
                </li>
                <li className="d-flex align-items-center gap-3">
                  <span>🎧</span> Use fones de ouvido se possível, para mais privacidade.
                </li>
                <li className="d-flex align-items-center gap-3">
                  <span>💧</span> Tenha um copo de água por perto.
                </li>
                <li className="d-flex align-items-center gap-3">
                  <span>💬</span> Não há respostas certas ou erradas — fale com calma.
                </li>
              </ul>
            </div>

            {/* Botões de Ação */}
            <div className="d-flex w-100 gap-3 flex-column flex-sm-row">
              <BootstrapButton 
                variant="outline-secondary" 
                className="py-2 px-4 fw-medium border-2"
                onClick={() => navigate('/paciente')}
              >
                Voltar ao Painel
              </BootstrapButton>
              
              <BootstrapButton 
                    className="py-2 flex-grow-1 fw-bold text-white d-flex align-items-center justify-content-center gap-2 border-0"
                    style={{ backgroundColor: primaryGreen }}
                    onClick={() => navigate('/teleconsulta')}
                  >
                    <Video size={18} /> Entrar na Chamada
              </BootstrapButton>
            </div>

          </Card.Body>
        </Card>
      </Container>

      {/* Botão Flutuante */}
      <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: '1000'}}>
         <BootstrapButton variant="danger" className="rounded-circle d-flex align-items-center justify-content-center shadow border-0" style={{ width: '56px', height: '56px', backgroundColor: '#e74c3c' }}>
             <Phone size={24} className="text-white"/>
         </BootstrapButton>
      </div>

    </div>
  );
};