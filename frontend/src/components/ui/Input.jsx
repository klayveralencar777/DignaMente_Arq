
import { Form } from 'react-bootstrap';

export const Input = ({ label, type = "text", placeholder, errorMessage = "Campo obrigatório.", ...props }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fs-6 fw-medium text-secondary">{label}</Form.Label>
      <Form.Control 
        type={type} 
        placeholder={placeholder} 
        size="lg"
        className="shadow-none border-2"
        {...props} 
      />
      {}
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};