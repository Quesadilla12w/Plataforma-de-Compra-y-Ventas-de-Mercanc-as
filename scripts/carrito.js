document.addEventListener("DOMContentLoaded", () => {
    const carritoContainer = document.getElementById("productos-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const finalizarCompraBtn = document.getElementById("finalizar-compra-btn");

    // Función para cargar el carrito desde LocalStorage
// Función para cargar el carrito desde LocalStorage
const cargarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoContainer.innerHTML = "";

    if (carrito.length === 0) {
        carritoContainer.innerHTML = "<p>El carrito está vacío.</p>";
        totalCarrito.textContent = "0.00";
        return;
    }

    carrito.forEach((producto) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("carrito-item");
        itemDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-img">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <p>Cantidad: 
                <button class="btn-cantidad disminuir" data-id="${producto.id}">-</button>
                ${producto.cantidad}
                <button class="btn-cantidad aumentar" data-id="${producto.id}">+</button>
            </p>
            <p>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        `;
        carritoContainer.appendChild(itemDiv);
    });

    actualizarTotal();
};


    // Función para actualizar el total del carrito
    const actualizarTotal = () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
        totalCarrito.textContent = total.toFixed(2);
    };

    // Función para actualizar cantidades
    const actualizarCantidad = (id, accion) => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const producto = carrito.find((p) => p.id === id);

        if (producto) {
            if (accion === "aumentar") {
                producto.cantidad += 1;
            } else if (accion === "disminuir" && producto.cantidad > 1) {
                producto.cantidad -= 1;
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            cargarCarrito();
        }
    };

    // Función para eliminar un producto del carrito
    const eliminarProducto = (id) => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito = carrito.filter((producto) => producto.id !== id);

        localStorage.setItem("carrito", JSON.stringify(carrito));
        cargarCarrito();
    };

    // Función para finalizar la compra
    finalizarCompraBtn.addEventListener("click", () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        // Lógica de compra (podría integrarse con backend)
        alert("Compra realizada con éxito.");
        localStorage.removeItem("carrito");
        cargarCarrito();
    });

    // Asignar eventos a los botones
    carritoContainer.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);

        if (e.target.classList.contains("btn-cantidad")) {
            const accion = e.target.classList.contains("aumentar") ? "aumentar" : "disminuir";
            actualizarCantidad(id, accion);
        }

        if (e.target.classList.contains("btn-eliminar")) {
            eliminarProducto(id);
        }
    });

    // Inicializar la página
    cargarCarrito();
});

