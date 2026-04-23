import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const RegisterPsychologist = () => {
  const [formData, setFormData] = useState({ crp: '', cpf: '', name: '', email: '', password: '' });

  const handleCRPChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 8) {
      
      value = value.replace(/^(\d{2})(\d)/, "$1/$2");
      setFormData({ ...formData, crp: value });
    }
  };

  const handleCPFChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      setFormData({ ...formData, cpf: value });
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Cadastro Profissional</h3>
      
      <div className="flex flex-col gap-5">
        <Input label="Nome Completo" placeholder="Ex: Dr. Rafael Santos" />
        <Input label="E-mail Profissional" type="email" placeholder="rafael@crp.com" />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="CRP" 
            placeholder="00/000000" 
            value={formData.crp} 
            onChange={handleCRPChange} 
          />
          <Input 
            label="CPF" 
            placeholder="000.000.000-00" 
            value={formData.cpf} 
            onChange={handleCPFChange} 
          />
        </div>

        <Input label="Criar Senha" type="password" />
        
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">
            Ao clicar em prosseguir, você concorda com nossos termos éticos de atendimento remoto.
          </p>
          <Button>Finalizar Cadastro</Button>
        </div>
      </div>
    </div>
  );
};