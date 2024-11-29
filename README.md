Passo a Passo - Front-end
1. Pré-requisitos
Certifique-se de ter os seguintes itens instalados:

Node.js (versão recomendada: 16 ou superior)
npm ou Yarn (gerenciador de pacotes)
2. Clonar o repositório
Abra o terminal e clone o repositório do front-end:

bash
Copiar código
git clone <url-do-repositorio-front-end>
Substitua <url-do-repositorio-front-end> pela URL do repositório no GitHub.

3. Navegar até o diretório do projeto
bash
Copiar código
cd <nome-do-diretorio-clonado>
4. Instalar as dependências
Execute o seguinte comando para instalar todas as dependências necessárias:

bash
Copiar código
npm install
Esse comando irá baixar e configurar todas as bibliotecas especificadas no arquivo package.json.

5. Configurar variáveis de ambiente
Verifique se há um arquivo .env.example. Se sim, renomeie-o para .env e configure as variáveis necessárias, como por exemplo:

env
Copiar código
NEXT_PUBLIC_APIURL=http://localhost:8000
Se não houver, crie um arquivo .env com as variáveis de ambiente adequadas.

6. Rodar o projeto
Para iniciar o servidor de desenvolvimento:

bash
Copiar código
npm run dev
A aplicação estará disponível no navegador em:

arduino
Copiar código
http://localhost:3000
7. Executar testes
Se desejar rodar os testes:

bash
Copiar código
npm run test
8. Gerar relatório de cobertura de testes
Para gerar o relatório de cobertura:

bash
Copiar código
npm run test -- --coverage
Os relatórios serão gerados na pasta coverage/.
