<script setup>
import { ref, computed, onMounted } from 'vue'
import { productosApi, ventasApi, mensajeError } from '@/services/api'

const productos = ref([])
const ventas = ref([])
const cliente = ref('')
const productoId = ref('')
const cantidad = ref(1)
const carrito = ref([])
const error = ref('')
const exito = ref('')
const ventaAbierta = ref(null)


const total = computed(() =>
  carrito.value.reduce((suma, i) => suma + i.precio * i.cantidad, 0)
)

async function cargar() {
  try {
    const [resP, resV] = await Promise.all([productosApi.listar(), ventasApi.listar()])
    productos.value = resP.data
    ventas.value = resV.data
  } catch (e) {
    error.value = mensajeError(e)
  }
}

function agregar() {
  const p = productos.value.find((x) => x.id === productoId.value)
  if (!p || cantidad.value < 1) return
  const existente = carrito.value.find((i) => i.productoId === p.id)
  if (existente) {
    existente.cantidad += cantidad.value
  } else {
    carrito.value.push({ productoId: p.id, nombre: p.nombre, precio: Number(p.precio), cantidad: cantidad.value })
  }
  cantidad.value = 1
}

function quitar(index) {
  carrito.value.splice(index, 1)
}

async function registrar() {
  error.value = ''
  exito.value = ''
 
  const request = {
    cliente: cliente.value,
    items: carrito.value.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
  }
  try {
    const { data } = await ventasApi.registrar(request)
    exito.value = `Venta #${data.id} registrada. Total: $${Number(data.total).toFixed(2)}`
    carrito.value = []
    cliente.value = ''
    await cargar() 
  } catch (e) {
    error.value = mensajeError(e)
  }
}

async function cancelar(v) {
  if (!confirm(`¿Cancelar la venta #${v.id}? El stock será devuelto.`)) return
  try {
    await ventasApi.cancelar(v.id)
    await cargar()
  } catch (e) {
    error.value = mensajeError(e)
  }
}

const formatoFecha = (f) => new Date(f).toLocaleString('es-MX')

onMounted(cargar)
</script>

<template>
  <div class="card">
    <h2>Nueva venta</h2>
    <div class="fila">
      <input v-model="cliente" placeholder="Nombre del cliente" />
    </div>
    <br />
    <div class="fila">
      <select v-model="productoId">
        <option value="" disabled>Selecciona un producto</option>
        <option v-for="p in productos" :key="p.id" :value="p.id" :disabled="p.stock === 0">
          {{ p.nombre }} - ${{ p.precio }} (stock: {{ p.stock }})
        </option>
      </select>
      <input v-model.number="cantidad" type="number" min="1" style="width: 80px" />
      <button @click="agregar">Agregar</button>
    </div>

    <table v-if="carrito.length">
      <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>
        <tr v-for="(item, i) in carrito" :key="item.productoId">
          <td>{{ item.nombre }}</td>
          <td>${{ item.precio.toFixed(2) }}</td>
          <td>{{ item.cantidad }}</td>
          <td>${{ (item.precio * item.cantidad).toFixed(2) }}</td>
          <td><button class="peligro" @click="quitar(i)">✕</button></td>
        </tr>
      </tbody>
    </table>

    <h3>Total: ${{ total.toFixed(2) }}</h3>
    <button :disabled="!carrito.length || !cliente" @click="registrar">Registrar venta</button>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="exito" class="exito">{{ exito }}</p>
  </div>

  <div class="card">
    <h2>Historial de ventas</h2>
    <table>
      <thead><tr><th>#</th><th>Cliente</th><th>Fecha</th><th>Total</th><th></th></tr></thead>
      <tbody>
        <template v-for="v in ventas" :key="v.id">
          <tr>
            <td>{{ v.id }}</td>
            <td>{{ v.cliente }}</td>
            <td>{{ formatoFecha(v.fecha) }}</td>
            <td>${{ Number(v.total).toFixed(2) }}</td>
            <td class="fila">
              <button class="secundario" @click="ventaAbierta = ventaAbierta === v.id ? null : v.id">Detalle</button>
              <button class="peligro" @click="cancelar(v)">Cancelar</button>
            </td>
          </tr>
          <tr v-if="ventaAbierta === v.id">
            <td colspan="5">
              <ul>
                <li v-for="d in v.detalles" :key="d.id">
                  {{ d.cantidad }} × {{ d.producto.nombre }} @ ${{ d.precioUnitario }} = ${{ d.subtotal }}
                </li>
              </ul>
            </td>
          </tr>
        </template>
        <tr v-if="ventas.length === 0"><td colspan="5">Aún no hay ventas</td></tr>
      </tbody>
    </table>
  </div>
</template>