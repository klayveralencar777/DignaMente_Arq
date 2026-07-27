# DignaMente
---

DignaMente é uma plataforma web focada em saúde mental, desenvolvida para gerenciar e otimizar o fluxo de atendimento entre psicólogos e pacientes. O projeto foi estruturado com foco em impacto social, aplicação no mundo real e integração com o Sistema Único de Saúde (SUS).

## Funcionalidades Principais
---

* **Gestão de Atendimentos:** Fluxo completo de interação entre profissionais de saúde mental e pacientes.
* **Agendamentos:** Sistema integrado para marcação e controle de consultas.
* **Teleconsultas:** Estrutura direcionada para a realização de atendimentos remotos.
* **Prontuário Eletrônico:** Registro e acompanhamento do histórico clínico e evolução dos pacientes.
* **Segurança e Conformidade:** Implementação de termos de uso e políticas de privacidade integrados ao fluxo.

## Tecnologias e Arquitetura
---

* **Front-end:** Aplicação cliente hospedada no Vercel.
* **Back-end:** Desenvolvido em Java.
* **Build e Dependências:** Maven.
* **Infraestrutura e Banco de Dados:** Railway.

## Aviso Importante: Fluxo de Execução
---

O front-end da aplicação está acessível através do link do Vercel presente no repositório, porém **ele não funcionará de forma independente**. Para que as telas carreguem, o login funcione e os dados sejam exibidos, é obrigatório que o back-end esteja ativo.

**Para testar ou rodar a aplicação localmente:**

1. **Subir o Back-end via Terminal:** 
É necessário compilar e executar a aplicação Java localmente utilizando o Maven. Abra o terminal na raiz do diretório do back-end e execute a inicialização do projeto. Exemplo de comandos:

```bash
mvn clean install
mvn spring-boot:run
