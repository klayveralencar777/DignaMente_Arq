import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react'; // Importamos os ícones do olho

export const Input = ({ label, error, isValid, type = "text", ...props }) => {
  // Estado para controlar se a senha está visível ou não
  const [showPassword, setShowPassword] = useState(false);
  
  // Verifica se este input é especificamente um campo de senha
  const isPasswordField = type === 'password';

  // Verifica se o Bootstrap vai injetar o ícone vermelho ou verde (para não encavalar os ícones)
  const hasValidationIcon = !!error || isValid;

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fs-6 fw-medium text-secondary">{label}</Form.Label>
      
      {/* Colocamos position-relative para o ícone do olho flutuar aqui dentro */}
      <div className="position-relative">
        <Form.Control 
          /* A mágica acontece aqui: alterna entre text e password */
          type={isPasswordField ? (showPassword ? "text" : "password") : type} 
          className="shadow-none border-2"
          isInvalid={!!error}
          isValid={isValid}
          style={{
            // Dá um espaço maior no canto direito se for senha, e ainda mais se tiver a validação do Bootstrap
            paddingRight: isPasswordField ? (hasValidationIcon ? '4.5rem' : '2.5rem') : undefined
          }}
          {...props} 
        />
        
        {/* Se for um campo de senha, renderiza o botão do olho */}
        {isPasswordField && (
          <button
            type="button" // Type button é crucial para não enviar o formulário ao clicar no olho
            onClick={() => setShowPassword(!showPassword)}
            className="position-absolute border-0 bg-transparent text-secondary p-0"
            style={{
              top: '50%',
              /* Empurra o olho mais para a esquerda se o Bootstrap colocar o 'X' vermelho ou 'V' verde */
              right: hasValidationIcon ? '40px' : '12px',
              transform: 'translateY(-50%)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        )}
      </div>

      <Form.Control.Feedback type="invalid" className="fw-bold">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};