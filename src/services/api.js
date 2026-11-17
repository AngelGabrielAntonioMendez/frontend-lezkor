import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

export const productosApi = {
  listar: (nombre = '') => api.get('/productos', { params: nombre ? { nombre } : {} }),
  crear: (producto) => api.post('/productos', producto),
  actualizar: (id, producto) => api.put(`/productos/${id}`, producto),
  eliminar: (id) => api.delete(`/productos/${id}`),
}

export const ventasApi = {
  listar: () => api.get('/ventas'),
  registrar: (venta) => api.post('/ventas', venta),
  cancelar: (id) => api.delete(`/ventas/${id}`),
}

export function mensajeError(e) {
  return e.response?.data?.mensaje ?? 'No se pudo conectar con el servidor'
}