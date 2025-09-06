const API_URL = "https://68ba1b9d6aaf059a5b597970.mockapi.io/api/productos"

const tabla = document.getElementById("tabla-productos")
const form = document.getElementById("form-producto")
const btnAbrirForm = document.getElementById("btn-abrir-form")
const btnCancelar = document.getElementById("btn-cancelar")
const btnGuardar = document.getElementById("btn-guardar")

let editId = null

// Mostrar productos
async function obtenerProductos() {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error("Error al obtener productos")
    const productos = await res.json()
    renderProductos(productos)
  } catch (error) {
    console.error(error)
  }
}

function renderProductos(productos) {
  tabla.innerHTML = ""
  productos.forEach(p => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>$${p.price}</td>
      <td><img src="${p.imagen}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;"></td>
      <td>
        <button class="button is-small is-warning" onclick="editarProducto('${p.id}')">Editar</button>
        <button class="button is-small is-danger" onclick="eliminarProducto('${p.id}')">Eliminar</button>
      </td>
    `
    tabla.appendChild(tr)
  })
}

// Abrir/Cerrar formulario
btnAbrirForm.addEventListener("click", () => {
  form.reset();
  editId = null;
  btnGuardar.textContent = "Guardar"
  form.style.display = "block"
})
btnCancelar.addEventListener("click", () => form.style.display = "none")

// Guardar producto (crear o actualizar)
form.addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("nombre").value
  const price = document.getElementById("precio").value
  const imagen = document.getElementById("imagen").value || "https://via.placeholder.com/150"

  try {
    let res;
    if (editId) {
      res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, imagen })
      });
      alert("Producto actualizado correctamente")
    } else {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, imagen })
      })
      alert("Producto creado correctamente")
    }
    if (!res.ok) throw new Error("Error al guardar producto")
    obtenerProductos();
    form.style.display = "none"
  } catch (error) {
    console.error(error)
    alert("Hubo un error")
  }
});

// Editar producto
window.editarProducto = async function(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) throw new Error("Error al obtener producto")
    const p = await res.json()
    document.getElementById("nombre").value = p.name
    document.getElementById("precio").value = p.price
    document.getElementById("imagen").value = p.imagen
    editId = id
    btnGuardar.textContent = "Actualizar"
    form.style.display = "block"
  } catch (error) {
    console.error(error)
  }
};

// Eliminar producto
window.eliminarProducto = async function(id) {
  if (!confirm("¿Seguro que quieres eliminar este producto?")) return
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar producto")
    alert("Producto eliminado")
    obtenerProductos()
  } catch (error) {
    console.error(error)
  }
}

// Cargar al inicio
obtenerProductos()
