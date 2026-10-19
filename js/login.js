const loginForm = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

const credenciales = {
  admin: {
    usuario: "admin",
    password: "admin123",
    ruta: "Administrador/index.html"
  },
  almacenista: {
    usuario: "almacenista",
    password: "bodega123",
    ruta: "Almacenista/index.html"
  },
  cliente: {
    usuario: "cliente",
    password: "cliente123",
    ruta: "Cliente/index.html"
  }
};

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();
  const rol = document.getElementById("rol").value;

  if (usuario === "" || password === "" || rol === "") {
    mensaje.style.color = "#dc2626";
    mensaje.textContent = "Completa todos los campos.";
    return;
  }

  const datos = credenciales[rol];

  if (usuario === datos.usuario && password === datos.password) {
    mensaje.style.color = "#15803d";
    mensaje.textContent = "Acceso correcto. Redirigiendo...";

    setTimeout(() => {
      window.location.href = datos.ruta;
    }, 900);
  } else {
    mensaje.style.color = "#dc2626";
    mensaje.textContent = "Usuario, contraseña o rol incorrectos.";
  }
});