import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react'; 

export const Input = ({ label, error, isValid, type = "text", ...props }) => {
  // Estado para controlar se a senha está visível ou não
  const [showPassword, setShowPassword] = useState(false);
  
  // Verifica se este input é especificamente um campo de senha
  const isPasswordField = type === 'password';


  const hasValidationIcon = !!error || isValid;

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fs-6 fw-medium text-secondary">{label}</Form.Label>
      
      {}
      <div className="position-relative">
        <Form.Control 
          
          type={isPasswordField ? (showPassword ? "text" : "password") : type} 
          className="shadow-none border-2"
          isInvalid={!!error}
          isValid={isValid}
          style={{
            
            paddingRight: isPasswordField ? (hasValidationIcon ? '4.5rem' : '2.5rem') : undefined
          }}
          {...props} 
        />
        
        {}
        {isPasswordField && (
          <button
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="position-absolute border-0 bg-transparent text-secondary p-0"
            style={{
              top: '50%',
        
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