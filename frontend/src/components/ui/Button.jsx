
  import { Button as BootstrapButton } from 'react-bootstrap';

  export const Button = ({ children, variant = 'primary', ...props }) => {

    const customStyle = variant === 'primary' 
      ? { backgroundColor: '#50C878', borderColor: '#50C878', fontWeight: 'bold' } 
      : { fontWeight: 'bold' };

    return (
      <BootstrapButton 
        variant={variant === 'primary' ? 'success' : variant} 
        size="lg" 
        style={customStyle}
        className="w-100 shadow-sm"
        {...props}
      >
        {children}
      </BootstrapButton>
    );
  };