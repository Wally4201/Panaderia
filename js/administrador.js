const API_URL = "https://script.google.com/macros/s/AKfycbzNeF7zCg6KZi-H2-VQHbf0LN5_cnWES3B-sqcHpurxJy7p1HovLPs4G1nem5u6hos6/exec";

const tablaInventario = document.getElementById("tablaInventario");
const formProducto = document.getElementById("formProducto");
const mensaje = document.getElementById("mensaje");
const totalProductos = document.getElementById("totalProductos");
const stockBajo = document.getElementById("stockBajo");
const valorTotal = document.getElementById("valorTotal");

let inventario = [];

async function cargarInventario() {
  try {
    const respuesta = await fetch(`${API_URL}?accion=listar`);
    inventario = await respuesta.json();
    mostrarInventario();
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

function mostrarInventario() {
  tablaInventario.innerHTML = "";

  inventario.forEach(item => {
    const stock = Number(item.stock);
    const precio = Number(item.precio);
    const estado = stock < 10 ? "Stock bajo" : "Disponible";
    const claseEstado = stock < 10 ? "estado-bajo" : "estado-normal";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.producto}</td>
      <td>${stock}</td>
      <td>$${precio}</td>
      <td class="${claseEstado}">${estado}</td>
    `;
    tablaInventario.appendChild(fila);
  });
}

function actualizarResumen() {
  totalProductos.textContent = inventario.length;

  const bajos = inventario.filter(item => Number(item.stock) < 10).length;
  stockBajo.textContent = bajos;

  const total = inventario.reduce((acumulado, item) => {
    return acumulado + (Number(item.stock) * Number(item.precio));
  }, 0);

  valorTotal.textContent = `$${total.toLocaleString("es-MX")}`;
}

formProducto.addEventListener("submit", async function (e) {
  e.preventDefault();

  const producto = document.getElementById("producto").value.trim();
  const stock = parseInt(document.getElementById("stock").value);
  const precio = parseFloat(document.getElementById("precio").value);

  if (producto === "" || isNaN(stock) || isNaN(precio)) {
    mensaje.style.color = "#dc2626";
    mensaje.textContent = "Completa todos los campos correctamente.";
    return;
  }

  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        accion: "agregar",
        producto,
        stock,
        precio
      })
    });

    const resultado = await respuesta.json();
    mensaje.style.color = "#15803d";
    mensaje.textContent = resultado.mensaje;

    formProducto.reset();
    cargarInventario();
  } catch (error) {
    console.error("Error al agregar producto:", error);
    mensaje.style.color = "#dc2626";
    mensaje.textContent = "No se pudo agregar el producto.";
  }
});

cargarInventario();