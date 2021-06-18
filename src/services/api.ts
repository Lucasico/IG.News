import axios from 'axios';
/**
 * Essa baseURL so foi possivel assim por que
 * por a url já existe da aplicação
 */
export const api = axios.create({
  baseURL: '/api'
})