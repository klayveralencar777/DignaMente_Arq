import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
   
    console.log("Enviando para o Back-end:", { email, password });
    
   
    if (email.includes('admin')) window.location.href = '/admin';
    else if (email.includes('psicologo')) window.location.href = '/psicologo';
    else window.location.href = '/paciente';
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] p-8 flex flex-col justify-center">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-[#50C878]">DignaMente</h2>
        <p className="text-gray-500 text-lg">Acesse sua conta para continuar</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <Input 
          label="E-mail" 
          type="email" 
          placeholder="seu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <div className="flex flex-col gap-2">
          <Input 
            label="Senha" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="button" className="text-sm text-[#50C878] self-end font-medium">Esqueceu a senha?</button>
        </div>

        <Button type="submit">Entrar</Button>
        
        <div className="text-center mt-4">
          <p className="text-gray-600">Não tem uma conta?</p>
          <button type="button" className="text-[#50C878] font-bold text-lg">Criar Nova Conta</button>
        </div>
      </form>
    </div>
  );
};