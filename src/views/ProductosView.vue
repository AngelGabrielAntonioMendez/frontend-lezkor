<script setup>
import { ref, onMounted } from 'vue'
import { productosApi, mensajeError } from '@/services/api'

const productos = ref([])
const busqueda = ref('')
const error = ref('')
const vacio = { id: null, nombre: '', descripcion: '', precio: 0, stock: 0 }
const form = ref({ ...vacio })

async function cargar() {
  try {
    const { data } = await productosApi.listar(busqueda.value)
    productos.value = data
  } catch (e) {
    error.value = mensajeError(e)
  }
}

async function guardar() {
  error.value = ''
  try {
    if (form.value.id) {
      await productosApi.actualizar(form.value.id, form.value)
    } else {
      await productosApi.crear(form.value)
    }
    limpiar()
    await cargar()
  } catch (e) {
    error.value = mensajeError(e)
  }
}

function editar(p) {
  form.value = { ...p } 
}

async function eliminar(p) {
  if (!confirm(`¿Eliminar "${p.nombre}"?`)) return
  try {
    await productosApi.eliminar(p.id)
    await cargar()
  } catch (e) {
    error.value = mensajeError(e)
  }
}

function limpiar() {
  form.value = { ...vacio }
  error.value = ''
}

onMounted(cargar) 
</script>

<template>
  <div class="card">
    <h2>{{ form.id ? 'Editar producto' : 'Nuevo producto' }}</h2>
    <form class="fila" @submit.prevent="guardar">
      <input v-model="form.nombre" placeholder="Nombre" required />
      <input v-model="form.descripcion" placeholder="Descripción" />
      <input v-model.number="form.precio" type="number" step="0.01" min="0" placeholder="Precio" />
      <input v-model.number="form.stock" type="number" min="0" placeholder="Stock" />
      <button type="submit">{{ form.id ? 'Actualizar' : 'Guardar' }}</button>
      <button type="button" class="secundario" @click="limpiar">Cancelar</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>

  <div class="card">
    <div class="fila">
      <input v-model="busqueda" placeholder="Buscar por nombre..." @keyup.enter="cargar" />
      <button @click="cargar">Buscar</button>
    </div>
    <table>
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="p in productos" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.nombre }}</td>
          <td>{{ p.descripcion }}</td>
          <td>${{ Number(p.precio).toFixed(2) }}</td>
          <td :style="{ color: p.stock < 5 ? 'red' : 'inherit' }">{{ p.stock }}</td>
          <td class="fila">
            <button class="secundario" @click="editar(p)">Editar</button>
            <button class="peligro" @click="eliminar(p)">Eliminar</button>
          </td>
        </tr>
        <tr v-if="productos.length === 0"><td colspan="6">No hay productos</td></tr>
      </tbody>
    </table>
  </div>
</template>