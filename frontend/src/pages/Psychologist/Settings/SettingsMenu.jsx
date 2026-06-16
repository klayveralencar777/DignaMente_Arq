import { useState } from 'react';
import { Offcanvas, Modal, Button as BootstrapButton, Form } from 'react-bootstrap';
import { Settings, FileText, Shield, Lock, Scale, LogOut } from 'lucide-react';

// --- Textos e Políticas ---
const TERMOS_DE_USO = [
  "1. Objetivo: O DignaMente é uma plataforma integrada ao Sistema Único de Saúde (SUS), oferecendo acesso totalmente gratuito a serviços de saúde mental para usuários cadastrados.",
  "2. Elegibilidade: O uso é restrito a cidadãos com número de CNS (Cartão Nacional de Saúde) válido e profissionais com CRP ativo.",
  "3. Cadastro e Veracidade: O usuário e o profissional são responsáveis pela veracidade das informações fornecidas no momento do cadastro.",
  "4. Uso Adequado: É estritamente proibido o uso da plataforma para fins ilícitos, comerciais não autorizados ou que violem a dignidade humana.",
  "5. Agendamentos e Faltas: O cancelamento de consultas deve ser realizado com antecedência mínima de 24 horas para otimização da agenda do SUS.",
  "6. Disponibilidade: O sistema busca garantir estabilidade 24/7, mas pode passar por manutenções programadas comunicadas previamente.",
  "7. Propriedade Intelectual: Todo o design, marca e código do DignaMente são protegidos por leis de direitos autorais."
];

const POLITICA_PRIVACIDADE = [
  "1. Coleta de Dados: Coletamos apenas os dados estritamente necessários para viabilizar o atendimento clínico e a identificação no SUS.",
  "2. Uso dos Dados: As informações são utilizadas exclusivamente para fins terapêuticos e de saúde pública, sem qualquer viés comercial.",
  "3. Conformidade com a LGPD: Todo o tratamento de dados respeita rigorosamente a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).",
  "4. Criptografia Ponta-a-Ponta: As sessões de teleconsulta e as mensagens de chat são protegidas por criptografia de ponta a ponta.",
  "5. Não Compartilhamento: O DignaMente não vende, aluga ou compartilha seus dados pessoais com empresas terceiras em nenhuma hipótese.",
  "6. Direitos do Usuário: Você tem o direito de acessar, corrigir, exportar ou solicitar a exclusão da sua conta e de seus dados a qualquer momento.",
  "7. Retenção de Prontuários: Prontuários psicológicos são retidos pelo tempo exigido pelo Conselho Federal de Psicologia (CFP) e legislações vigentes."
];

const CODIGO_ETICA = [
  "I. O psicólogo baseará o seu trabalho no respeito e na promoção da liberdade, da dignidade, da igualdade e da integridade do ser humano.",
  "II. O psicólogo trabalhará visando promover a saúde e a qualidade de vida das pessoas e das coletividades e contribuirá para a eliminação de quaisquer formas de negligência, discriminação, exploração, violência, crueldade e opressão.",
  "III. O psicólogo atuará com responsabilidade social, analisando crítica e historicamente a realidade política, econômica, social e cultural.",
  "IV. O psicólogo atuará com responsabilidade, por meio do contínuo aprimoramento profissional.",
  "V. O psicólogo contribuirá para promover a universalização do acesso da população às informações, ao conhecimento da ciência psicológica, aos serviços e aos padrões éticos da profissão.",
  "VI. O psicólogo zelará para que o exercício profissional seja efetuado com dignidade, rejeitando situações em que a Psicologia esteja sendo aviltada.",
  "VII. O psicólogo considerará as relações de poder nos contextos em que atua e os impactos dessas relações sobre as suas atividades profissionais."
];

export const SettingsMenu = ({ show, onHide, onLogout }) => {
  // --- Estados ---
  const [activeModal, setActiveModal] = useState(null); 

  // --- Cores ---
  const primaryTeal = '#2C7A7B';
  const dangerRed = '#EF4444';
  const lightBackground = '#F0F4F8';

  // --- Handlers ---
  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
    onHide(); 
  };

  const handleCloseModal = () => setActiveModal(null);

  // --- Renderização Dinâmica dos Modais ---
  const renderModalContent = () => {
    switch (activeModal) {
      case 'terms':
        return (
          <>
            <Modal.Header closeButton className="border-bottom-0 pb-0">
              <Modal.Title className="fw-bold" style={{ color: primaryTeal }}>Termos de Uso</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
              <p className="text-muted mb-4 fs-6">Atualizado em 18 de Abril de 2026</p>
              <div className="d-flex flex-column gap-3">
                {TERMOS_DE_USO.map((item, index) => (
                  <p key={index} className="m-0 text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{item}</p>
                ))}
              </div>
            </Modal.Body>
          </>
        );
      case 'privacy':
        return (
          <>
            <Modal.Header closeButton className="border-bottom-0 pb-0">
              <Modal.Title className="fw-bold" style={{ color: primaryTeal }}>Política de Privacidade</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
              <p className="text-muted mb-4 fs-6">Sua privacidade e segurança em primeiro lugar.</p>
              <div className="d-flex flex-column gap-3">
                {POLITICA_PRIVACIDADE.map((item, index) => (
                  <p key={index} className="m-0 text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{item}</p>
                ))}
              </div>
            </Modal.Body>
          </>
        );
      case 'ethics':
        return (
          <>
            <Modal.Header closeButton className="border-bottom-0 pb-0">
              <Modal.Title className="fw-bold" style={{ color: primaryTeal }}>Código de Ética</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
              <p className="text-muted mb-4 fs-6">Princípios Fundamentais (Resolução CFP nº 010/2005)</p>
              <div className="d-flex flex-column gap-3 p-3 rounded-3" style={{ backgroundColor: lightBackground }}>
                {CODIGO_ETICA.map((item, index) => (
                  <p key={index} className="m-0 text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{item}</p>
                ))}
              </div>
            </Modal.Body>
          </>
        );
      case 'password':
        return (
          <>
            <Modal.Header closeButton className="border-bottom-0 pb-0">
              <Modal.Title className="fw-bold" style={{ color: primaryTeal }}>Alterar Senha</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 pb-2">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary fw-medium">E-mail atual</Form.Label>
                  <Form.Control type="email" placeholder="Seu e-mail cadastrado" className="shadow-none py-2" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary fw-medium">Nova senha</Form.Label>
                  <Form.Control type="password" placeholder="Mínimo 8 caracteres" className="shadow-none py-2" />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="text-secondary fw-medium">Confirmar nova senha</Form.Label>
                  <Form.Control type="password" placeholder="Repita a nova senha" className="shadow-none py-2" />
                </Form.Group>
                <BootstrapButton className="w-100 fw-bold py-2 border-0" style={{ backgroundColor: primaryTeal }}>
                  Salvar Nova Senha
                </BootstrapButton>
              </Form>
            </Modal.Body>
          </>
        );
      default:
        return null;
    }
  };

  // --- Layout ---
  return (
    <>
      <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: '340px' }}>
        <Offcanvas.Header closeButton className="border-bottom pb-3 mt-2 px-4">
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold" style={{ color: '#2d3748' }}>
            <Settings size={22} style={{ color: primaryTeal }} /> Configurações
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="d-flex flex-column px-4 py-4">
          <div className="d-flex flex-column gap-2">
            
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => handleOpenModal('terms')}>
               <FileText size={20} style={{ color: primaryTeal }} />
               <span className="fw-medium text-dark" translate="no">Termos de Uso</span>
            </div>
            
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => handleOpenModal('privacy')}>
               <Shield size={20} style={{ color: primaryTeal }} />
               <span className="fw-medium text-dark">Política de Privacidade</span>
            </div>
            
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => handleOpenModal('ethics')}>
               <Scale size={20} style={{ color: primaryTeal }} />
               <span className="fw-medium text-dark">Código de Ética</span>
            </div>

            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => handleOpenModal('password')}>
               <Lock size={20} style={{ color: primaryTeal }} />
               <span className="fw-medium text-dark">Alterar Senha</span>
            </div>

          </div>

          <div className="mt-auto pt-4">
             <BootstrapButton 
                variant="danger" 
                onClick={onLogout}
               className="w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm rounded-3 transition-all" 
                style={{ backgroundColor: dangerRed }}
               onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
               onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
             >
                <LogOut size={20} /> Sair da Conta
             </BootstrapButton>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={!!activeModal} onHide={handleCloseModal} centered size="lg" scrollable>
        {renderModalContent()}
        <Modal.Footer className="border-top-0 pt-0 px-4 pb-4">
          <BootstrapButton variant="light" onClick={handleCloseModal} className="fw-bold px-4 py-2 text-secondary border shadow-sm w-100">
            Fechar
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};
