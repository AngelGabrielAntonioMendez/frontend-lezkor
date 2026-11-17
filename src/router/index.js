import { createRouter, createWebHistory } from 'vue-router'
import ProductosView from '../views/ProductosView.vue'
import VentasView from '../views/VentasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'productos', component: ProductosView },
    { path: '/ventas', name: 'ventas', component: VentasView },
  ],
})

export default router