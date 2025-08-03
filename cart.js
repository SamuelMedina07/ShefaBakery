  function orderProduct(productName, index) {
  const cantidad = document.getElementById(`cantidad-${index}`).textContent;

  const phone = "50495953118";
  const message = encodeURIComponent(
    `¡Hola! Me gustaría pedir ${cantidad} ${productName} porfavor`
  );
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, '_blank');
}

function cambiarCantidad(index, delta) {
  const cantidadSpan = document.getElementById(`cantidad-${index}`);
  let cantidad = parseInt(cantidadSpan.textContent);
  cantidad += delta;
  if (cantidad < 1) cantidad = 1;
  cantidadSpan.textContent = cantidad;
}


  
  fetch('db.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo JSON.');
    }
    return response.json();
  })
  .then(data => {
    const container = document.getElementById("productos-container");
    container.innerHTML = ""; // Limpia el texto "Cargando productos..."
    

     data.productos.forEach((producto,index) => {
      const div = document.createElement("div");
      div.className = "producto";
       const disponibleTexto = producto.disponible ? "✅ Disponible" : "❌ No disponible";
  const botonDeshabilitado = producto.disponible ? "" : "disabled";
  const claseBoton = producto.disponible ? "btn-activo" : "btn-inactivo";
  const textoBoton = producto.disponible ? "Pedir por WhatsApp" : "No disponible";
  const polldonuts = producto.nombre === "Paquete Donas Azucaradas" ? "" : "disabled";


      div.innerHTML = `
      <div class="card">
      <img src="${producto.imagen}">
      <div class="card-content">
        <h2>${producto.nombre}</h2>
        <p>${producto.descripcion}</p>
        <div class="price">L.${producto.precio} </div>
        <div class="contador">
      <button onclick="cambiarCantidad(${index}, -1)" ${producto.disponible ? "" : "disabled"}>−</button>
      <span id="cantidad-${index}">1</span>
      <button onclick="cambiarCantidad(${index}, 1)" ${producto.disponible ? "" : "disabled"}>+</button>
    </div>
    
    </div>
       <button class="${claseBoton}" onclick="orderProduct('${producto.nombre}', ${index})" ${botonDeshabilitado}>
      ${textoBoton}
    </button>
     <button class="btn-encuesta" onclick="abrirModal()" ${polldonuts} ${botonDeshabilitado} >Responder encuesta</button>
        </div>
      `;
      container.appendChild(div);
    });     
  })
  .catch(error => {
    document.getElementById("productos-container").innerText = "Error cargando los productos.";
    console.error(error);
  });

  // Abrir y cerrar modal
function abrirModal() {
  document.getElementById("modal-encuesta").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modal-encuesta").style.display = "none";
}

// Enviar encuesta desde modal
document.getElementById("form-encuesta").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const mensaje = document.getElementById("mensaje-encuesta");

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbw-Mn7aL-c1HmSRdoLhcCHm1MvgQyzoFoJgE9E8X4DctCkIBsH6oFKGoLjkYb7zF76c/exec", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      mensaje.textContent = "¡Gracias por tu opinión!";
      form.reset();
      setTimeout(() => cerrarModal(), 2000);
    } else {
      mensaje.textContent = "Error al enviar.";
    }
  } catch (err) {
    mensaje.textContent = "Error de conexión.";
    console.error(err);
  }
});
