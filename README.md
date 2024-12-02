
FRONT-END: Configuração Completa

# Configuração do Front-end

Este guia descreve como configurar e executar o projeto de front-end.

---

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/) (versão recomendada: 16 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

---

## Passo a Passo

### 1. Clonar o Repositório
Clone o repositório do projeto usando o comando abaixo:
```bash
git clone <url-do-repositorio-front-end>

2. Navegar para o Diretório do Projeto
Entre no diretório do projeto clonado:

bash
Copiar código

cd <nome-do-diretorio-clonado>

3. Instalar as Dependências
Instale todas as dependências necessárias para o projeto:
npm install


4. Configurar as Variáveis de Ambiente
Renomeie o arquivo .env.example para .env (se existir) e preencha as variáveis necessárias. Exemplo:
NEXT_PUBLIC_APIURL=http://localhost:8000


5. Rodar o Servidor de Desenvolvimento
Inicie o servidor de desenvolvimento com o comando:
npm run dev


Rodando Testes
6. Rodar Testes Automatizados
Para rodar os testes:
npm run test


7. Gerar Relatórios de Cobertura de Testes
Para gerar relatórios de cobertura:
npm run test -- --coverage


