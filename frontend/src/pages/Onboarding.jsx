import { useState } from 'react';
import { Button } from '../components/ui/Button';

const steps = [
  { title: "Bem-vindo ao DignaMente", desc: "Sua saúde mental com a qualidade e gratuidade do SUS.", icon: "🌱" },
  { title: "Privacidade e Sigilo", desc: "Tudo o que for dito em consulta é protegido por lei e ética profissional.", icon: "🔒" },
  { title: "Atendimento Online", desc: "Faça suas sessões de onde estiver, sem precisar se deslocar.", icon: "📱" }
];

export const Onboarding = ({ onFinish }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-between p-8">
      <button onClick={onFinish} className="self-end text-gray-400 text-lg">Pular</button>
      
      <div className="text-center animate-fade-in">
        <span className="text-8xl mb-8 block">{steps[current].icon}</span>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{steps[current].title}</h1>
        <p className="text-xl text-gray-600 leading-relaxed">{steps[current].desc}</p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i === current ? 'bg-[#50C878] w-6' : 'bg-gray-300'} transition-all`} />
          ))}
        </div>
        
        {current < steps.length - 1 ? (
          <Button onClick={() => setCurrent(c => c + 1)}>Próximo</Button>
        ) : (
          <Button onClick={onFinish}>Começar Agora</Button>
        )}
      </div>
    </div>
  );
};