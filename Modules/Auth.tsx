import axios from 'axios';

// Cria uma instância do Axios com a URL base do back-end e permite envio de cookies.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIURL,  // URL do back-end, definida no arquivo .env.local
  withCredentials: true,  // Isso permite que os cookies sejam enviados com cada solicitação
});

// Interceptor para modificar ou adicionar lógica antes de enviar qualquer requisição
api.interceptors.request.use(config => {
  // Você pode modificar a configuração da requisição aqui (ex: adicionar cabeçalhos)
  return config;  // Passa a requisição para ser enviada sem modificações
}, error => {
  return Promise.reject(error);  // Lida com erros de requisição
});

// Interceptor para capturar a resposta de qualquer requisição feita
api.interceptors.response.use(response => {
  // Verifica se a resposta foi bem-sucedida (status 200)
  if (response.status === 200) {
    console.log('A solicitação foi bem-sucedida');
  }
  return response;  // Retorna a resposta para o código que fez a requisição
}, async error => {
  const originalRequest = error.config;

  // Se a resposta tiver o status 401 (não autorizado) e o token ainda não foi renovado
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;  // Marca a requisição para evitar loops infinitos
    try {
      // Tenta renovar o token usando o endpoint de refresh token
      const response = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'api/token/refresh/', {}, {
        withCredentials: true  // Envia os cookies junto com a solicitação de renovação
      });

      // Se a renovação do token foi bem-sucedida (status 200)
      if (response.status === 200) {
        console.log('Token atualizado');
        return api(originalRequest);  // Reenvia a requisição original com o novo token
      }
    } catch (refreshError) {
      // Se a renovação falhar (ex: token de refresh também expirou)
      if ((refreshError as any).response && (refreshError as any).response.status === 401) {
        console.log('Token expirado');
        // Redireciona o usuário para a página de login
        window.location.href = '/login';
      }
    }
  }

  return Promise.reject(error);  // Se outro erro ocorrer, rejeita a promessa com o erro
});

export default api;
