import { Button as BootstrapButton } from 'react-bootstrap';

export const Button = ({ children, variant = 'primary', ...props }) => {
  
  // Se for o botão principal, puxa a cor da nossa variável global
  const customStyle = variant === 'primary' 
    ? { backgroundColor: 'var(--cor-primaria)', borderColor: 'var(--cor-primaria)', fontWeight: 'bold', color: '#fff' } 
    : { fontWeight: 'bold' };

  return (
    <BootstrapButton 
      variant={variant === 'primary' ? '' : variant} // Tiramos o 'success' do bootstrap para a nossa cor brilhar
      size="lg" 
      style={customStyle}
      className="w-100 shadow-sm"
      {...props}
    >
      {children}
    </BootstrapButton>
  );
};