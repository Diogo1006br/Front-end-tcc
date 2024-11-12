import axios from 'axios';

// Crie uma instância do axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIURL,
  withCredentials: true, // Permite envio automático de cookies com cada solicitação
});

// Adicione o cabeçalho Accept globalmente
api.defaults.headers.common['Accept'] = 'application/json';

// Interceptor de solicitação para configurar o token de autenticação
api.interceptors.request.use(config => {
  // Verifique se o token JWT está disponível e adicione-o ao cabeçalho Authorization
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor de resposta para lidar com tokens expirados e renovação de tokens
api.interceptors.response.use(response => {
  if (response.status === 200) {
    console.log('A solicitação foi bem-sucedida');
  }
  return response;
}, async error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}api/token/refresh/`, {}, {
        withCredentials: true
      });

      if (response.status === 200) {
        const newToken = response.data.accessToken;
        // Armazene o novo token para futuras requisições
        localStorage.setItem('accessToken', newToken);
        // Atualize o cabeçalho Authorization da instância do axios
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    } catch (refreshError) {
      if ((refreshError as any).response && (refreshError as any).response.status === 401) {
        console.log('Token expirado');
        // Redirecionar para a página de login
        window.location.href = '/login';
      }
    }
  }

  return Promise.reject(error);
});

export default api;
