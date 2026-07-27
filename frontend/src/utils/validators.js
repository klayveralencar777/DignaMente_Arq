export const validateNome = (value) => {
  if (!value) return "O nome é obrigatório.";
  if (!/^[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+.*$/.test(value.trim())) return "Insira pelo menos nome e sobrenome.";
  return null;
};

export const validateData = (value) => {
  if (!value) { 
  return "A data de nascimento é obrigatória.";
};
const year = parseInt(value.split('-')[0], 10);
  const currentYear = new Date().getFullYear();

 
  if (year < 1900) {
    return "Insira um ano válido (maior que 1900).";
  }
  
  if (year > currentYear) {
    return "A data de nascimento não pode estar no futuro.";
  }


  return null; 
};

export const validateEmail = (value) => {
  if (!value) return "O e-mail é obrigatório.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Insira um e-mail válido (deve conter '@' e domínio).";
  return null;
};

export const validateSenha = (value) => {
  if (!value) return "A senha é obrigatória.";
  if (!/(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(value)) {
    return "Mínimo 8 caracteres, 1 maiúscula, 1 número e 1 símbolo.";
  }
  return null;
};

export const validateCPF = (value) => {
  if (!value) return "O CPF é obrigatório.";
  const numeros = value.replace(/\D/g, '');
  

  if (numeros.length !== 11) return "O CPF deve ter exatamente 11 dígitos.";
  if (/^(\d)\1+$/.test(numeros)) return "CPF inválido (números repetidos).";

  return null;
};

export const validateSUS = (value) => {
  if (!value) return "O número do SUS é obrigatório.";
  const numeros = value.replace(/\D/g, '');
  if (numeros.length !== 15) return "O cartão SUS deve conter exatamente 15 números.";
  return null;
};

export const validateCRP = (value) => {
  if (!value) return "O CRP é obrigatório.";
  if (!/^CRP-\d{2}\/\d{5}$/i.test(value)) return "Siga o padrão: CRP-XX/XXXXX";
  return null;
};
