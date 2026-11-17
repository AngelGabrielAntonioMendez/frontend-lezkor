# Lezkorp — Frontend de la Tienda

Aplicación web desarrollada con **Vue 3** que consume el microservicio [backend-ms-tienda](https://github.com/AngelGabrielAntonioMendez/backend-ms-tienda) (Spring Boot).

## Funcionalidades

**Productos**
- Ver el catálogo de productos
- Buscar por nombre
- Crear, editar y eliminar productos
- Resaltado en rojo del stock bajo (menos de 5 unidades)

**Ventas**
- Armar un carrito con varios productos y ver el total en tiempo real
- Registrar la venta (el stock se descuenta automáticamente)
- Consultar el historial y el detalle de cada venta
- Cancelar una venta (el stock se devuelve)

Los errores del backend (stock insuficiente, validaciones, etc.) se muestran al usuario.

## Tecnologías

| Tecnología | Uso |
|---|---|
| Vue 3 (Composition API) | Framework de interfaz |
| Vite | Servidor de desarrollo y compilación |
| Vue Router | Navegación entre vistas (SPA) |
| Axios | Consumo de la API REST |

## Requisitos previos

- Node.js 20 o superior
- El backend [backend-ms-tienda](https://github.com/AngelGabrielAntonioMendez/backend-ms-tienda) en ejecución en `http://localhost:8080`

## Instalación y ejecución

```bash
git clone https://github.com/AngelGabrielAntonioMendez/frontend-lezkor.git
cd frontend-lezkor
npm install
npm run dev
```

Abre **http://localhost:5173** en el navegador.

### Compilar para producción
```bash
npm run build
```
Los archivos quedan en la carpeta `dist/`.

## Configuración

La URL del backend se define en `src/services/api.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})
```

Si el backend corre en otro puerto o servidor, cambia este valor.

## Estructura del proyecto

```
src/
├── main.js                 # Punto de entrada
├── App.vue                 # Layout y menú de navegación
├── assets/main.css         # Estilos globales
├── router/index.js         # Rutas
├── services/api.js         # Todas las llamadas HTTP al backend
└── views/
    ├── ProductosView.vue   # CRUD de productos
    └── VentasView.vue      # Carrito, historial y cancelación
```

## Rutas

| Ruta | Vista |
|---|---|
| `/` | Productos |
| `/ventas` | Ventas |

## Consumo de la API

| Función (`api.js`) | Petición |
|---|---|
| `productosApi.listar(nombre)` | `GET /api/productos?nombre=` |
| `productosApi.crear(p)` | `POST /api/productos` |
| `productosApi.actualizar(id, p)` | `PUT /api/productos/{id}` |
| `productosApi.eliminar(id)` | `DELETE /api/productos/{id}` |
| `ventasApi.listar()` | `GET /api/ventas` |
| `ventasApi.registrar(v)` | `POST /api/ventas` |
| `ventasApi.cancelar(id)` | `DELETE /api/ventas/{id}` |

## Solución de problemas

| Problema | Causa y solución |
|---|---|
| «No se pudo conectar con el servidor» | El backend no está corriendo. Inícialo en el puerto 8080. |
| Error «blocked by CORS policy» en la consola | El backend no permite el origen `http://localhost:5173`. Revisa `CorsConfig` en el backend. |
| La tabla aparece vacía | Revisa que la base de datos tenga datos y que el backend responda en `http://localhost:8080/api/productos`. |

## Capturas

<!-- Agrega aquí capturas de las vistas, por ejemplo: -->
<!-- ![Productos](docs/productos.png) -->
<!-- ![Ventas](docs/ventas.png) -->

## Autor

**Antonio Mendez Angel Gabriel**
Ingeniería en Sistemas Computacionales — Instituto Tecnológico de Oaxaca
Materia: Desarrollo de Servicios Web
