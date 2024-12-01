document.addEventListener("DOMContentLoaded", async () => {
    const productosContainer = document.querySelector(".productos");
    const cerrarSesionBtn = document.getElementById("logout-btn");

    // Función para cargar productos desde el servidor
let productos = []; // Declara los productos de manera global

const cargarProductos = async () => {
    try {
        const response = await fetch("http://localhost:3000/productos");
        if (!response.ok) throw new Error("Error al obtener productos");

        productos = await response.json(); // Asigna los productos a la variable global
        productosContainer.innerHTML = "";

        productos.forEach((producto) => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("producto");
            productoDiv.innerHTML = `
                <div class="producto-frente">
                    <img src="${producto.Imagen || 'ruta/a/imagen/default.jpg'}" alt="${producto.Nombre}">
                    <h3>${producto.Nombre}</h3>
                    <p class="categoria">${producto.Categoria}</p>
                    <p class="precio">$${producto.Precio.toFixed(2)}</p>
                    <button class="agregar-carrito-btn" data-id="${producto.Id}">Agregar al Carrito</button>
                </div>
            `;
            productosContainer.appendChild(productoDiv);
        });

        // Asignar evento a los botones "Agregar al carrito"
        document.querySelectorAll(".agregar-carrito-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productoId = btn.getAttribute("data-id");
                agregarAlCarrito(productoId);
            });
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
};

    // Función para agregar productos al carrito
    const agregarAlCarrito = (productoId) => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const producto = productos.find((prod) => prod.Id == productoId); // Busca el producto completo
    
        const productoExistente = carrito.find((prod) => prod.id === productoId);
    
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({
                id: producto.Id,
                nombre: producto.Nombre,
                precio: producto.Precio,
                imagen: producto.Imagen,
                cantidad: 1,
            });
        }
    
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert("Producto añadido al carrito.");
    };

    // Función para cerrar sesión
    cerrarSesionBtn.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("carrito");
        window.location.href = "../templates/Login.html";
    });

    // Inicializar la página
    await cargarProductos();
});







