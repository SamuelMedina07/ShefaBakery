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
    
    data.productos.sort((a, b) => {
  return (b.disponible === true) - (a.disponible === true);
});
     data.productos.forEach((producto,index) => {
      const div = document.createElement("div");
      div.className = "producto";
       const disponibleTexto = producto.disponible ? "✅ Disponible" : "❌ No disponible";
  const botonDeshabilitado = producto.disponible ? "" : "disabled";
  const claseBoton = producto.disponible ? "btn-activo" : "btn-inactivo";
  const textoBoton = producto.disponible ? "Pedir por WhatsApp" : "No disponible";

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
        </div>
      `;
      container.appendChild(div);
    });     
  })
  .catch(error => {
    document.getElementById("productos-container").innerText = "Error cargando los productos.";
    console.error(error);
  });