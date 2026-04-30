import { useState } from 'react';
import { Offcanvas, Button as BootstrapButton, Modal } from 'react-bootstrap';
import { Settings, FileText, Shield, Lock, LogOut, UserX, AlertTriangle } from 'lucide-react'; 

export const SettingsMenu = ({ show, onHide, onLogout }) => {
  const primaryGreen = '#50C878';
  
  // Estado para controlar a abertura/fechamento do Modal de Exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função que executa a exclusão de fato
  const handleDeleteAccount = () => {
    // Aqui entrará a requisição para a API (ex: api.delete('/users/me'))
    alert('Sua conta será excluída no banco de dados!');
    setShowDeleteModal(false);
    // onLogout(); // Recomendo chamar onLogout() logo após a exclusão com sucesso!
  };

  return (
    <>
      <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: '320px' }}>
        <Offcanvas.Header closeButton className="border-bottom pb-3 mt-2 px-4">
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold" style={{ color: '#2d3748' }}>
            <Settings size={22} style={{ color: primaryGreen }} /> Configurações
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="d-flex flex-column px-4 py-4">
          <div className="d-flex flex-column gap-3">
            
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }}>
               <FileText size={20} style={{ color: primaryGreen }} />
               {/* Atributo translate="no" blindará o texto contra o tradutor do Google Chrome */}
               <span className="fw-medium text-dark" translate="no">Termos de Uso</span>
            </div>
            
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }}>
               <Shield size={20} style={{ color: primaryGreen }} />
               <span className="fw-medium text-dark">Política de Privacidade</span>
            </div>
            
            <div className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light" style={{ cursor: 'pointer', transition: '0.2s' }}>
               <Lock size={20} className="text-warning" />
               <span className="fw-medium text-dark">Alterar Senha</span>
            </div>

            <hr className="text-secondary opacity-25 my-1" />

            {/* O clique agora apenas abre o Modal, sem o confirm nativo */}
            <div 
              className="d-flex align-items-center gap-3 p-2 rounded hover-bg-light text-danger" 
              style={{ cursor: 'pointer', transition: '0.2s' }}
              onClick={() => setShowDeleteModal(true)}
            >
               <UserX size={20} />
               <span className="fw-medium">Excluir Conta</span>
            </div>
          </div>

          <div className="mt-auto">
             <BootstrapButton 
               variant="danger" 
               onClick={onLogout}
               className="w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm" 
               style={{ backgroundColor: '#e84545' }}
             >
                <LogOut size={18} /> Sair da Conta
             </BootstrapButton>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        animation={true}
      >
        <Modal.Header closeButton className="border-0 pb-0" />
        
        <Modal.Body className="text-center px-4 pb-4">
          <div className="d-flex justify-content-center mb-3 text-danger">
            <AlertTriangle size={56} strokeWidth={1.5} />
          </div>
          
          <h4 className="fw-bold mb-3 text-dark">Excluir conta?</h4>
          
          <p className="fs-6 mb-2 text-dark px-3">
            Tem certeza que deseja excluir sua conta permanentemente?
          </p>
          
          <p className="text-muted mb-0 px-2" style={{ fontSize: '0.90rem' }}>
            Essa ação não poderá ser desfeita e todo seu histórico será removido.
          </p>
        </Modal.Body>

        <Modal.Footer className="border-0 px-4 pb-4 pt-0 d-flex gap-3 justify-content-center">
          <BootstrapButton 
            variant="light" 
            onClick={() => setShowDeleteModal(false)}
            className="fw-medium flex-grow-1 border shadow-sm text-secondary py-2"
          >
            Cancelar
          </BootstrapButton>
          
          <BootstrapButton 
            variant="danger" 
            onClick={handleDeleteAccount}
            className="fw-bold flex-grow-1 shadow-sm py-2"
          >
            Excluir Conta
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};