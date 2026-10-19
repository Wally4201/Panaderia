const API_URL = "https://script.google.com/macros/s/AKfycbzNeF7zCg6KZi-H2-VQHbf0LN5_cnWES3B-sqcHpurxJy7p1HovLPs4G1nem5u6hos6/exec";

const tablaInventario = document.getElementById("tablaInventario");
const totalProductos = document.getElementById("totalProductos");
const disponibles = document.getElementById("disponibles");
const agotados = document.getElementById("agotados");

let inventario = [];

async function cargarInventario() {
  try {
    const respuesta = await fetch(`${API_URL}?accion=listar`);
    inventario = await respuesta.json();
    mostrarTodo();
    actualizarResumen();
  } catch (error) {
    console.error("Error al cargar inventario:", error);
    tablaInventario.innerHTML = `
      <tr>
        <td colspan="4">No se pudo cargar el inventario.</td>
      </tr>
    `;
  }
}

function pintarTabla(lista) {
  tablaInventario.innerHTML = "";

  if (lista.length === 0) {
    tablaInventario.innerHTML = `
      <tr>
        <td colspan="4">No hay productos que coincidan con el filtro.</td>
      </tr>
    `;
    return;
  }

  lista.forEach(item => {
    const stock = Number(item.stock);
    const precio = Number(item.precio);
    const disponibilidad = stock > 0 ? "Disponible" : "Agotado";
    const claseDisponibilidad = stock > 0 ? "disponible" : "agotado";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.producto}</td>
      <td>${stock}</td>
      <td>$${precio}</td>
      <td class="${claseDisponibilidad}">${disponibilidad}</td>
    `;
    tablaInventario.appendChild(fila);
  });
}

function actualizarResumen() {
  totalProductos.textContent = inventario.length;

  const disponiblesTotal = inventario.filter(item => Number(item.stock) > 0).length;
  const agotadosTotal = inventario.filter(item => Number(item.stock) <= 0).length;

  disponibles.textContent = disponiblesTotal;
  agotados.textContent = agotadosTotal;
}

function mostrarTodo() {
  pintarTabla(inventario);
}

function filtrarMayor1500() {
  const filtrados = inventario.filter(item => Number(item.precio) > 1500);
  pintarTabla(filtrados);
}

function filtrarMenor1500() {
  const filtrados = inventario.filter(item => Number(item.precio) < 1500);
  pintarTabla(filtrados);
}

cargarInventario();