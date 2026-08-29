import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001', // URL del backend (ajusta si es necesario)
    headers: {
        'Content-Type': 'application/json' // Tipo de contenido para las solicitudes
    } 
})