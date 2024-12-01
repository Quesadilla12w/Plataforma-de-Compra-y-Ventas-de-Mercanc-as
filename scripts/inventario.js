document.addEventListener("DOMContentLoaded", () => {
    const formAgregar = document.getElementById("form-agregar-producto");
    const productosLista = document.getElementById("productos-lista");
    const cerrarSesionBtn = document.getElementById("logout-button");

    // Función para cargar productos existentes
    const cargarProductos = async () => {
        try {
            const response = await fetch("http://localhost:3000/productos"); // Ruta del backend
            if (!response.ok) throw new Error("Error al obtener productos");
    
            const productos = await response.json();
            productosLista.innerHTML = ""; // Limpiar productos actuales
    
            productos.forEach((producto) => {
                const productoDiv = document.createElement("div");
                productoDiv.classList.add("producto-item");
    
                productoDiv.innerHTML = `
                    <input type="text" value="${producto.Nombre}" class="producto-nombre" data-id="${producto.Id}" disabled />
                    <textarea class="producto-descripcion" data-id="${producto.Id}" disabled>${producto.Descripcion}</textarea>
                    <input type="number" value="${producto.Precio}" class="producto-precio" data-id="${producto.Id}" disabled />
                    <input type="number" value="${producto.Stock}" class="producto-stock" data-id="${producto.Id}" disabled />
                    <input type="text" value="${producto.Categoria}" class="producto-categoria" data-id="${producto.Id}" disabled />
                    <img src="${producto.Imagen}" alt="${producto.Nombre}" class="producto-img" />
                    <button class="guardar-producto" data-id="${producto.Id}" style="display: none;">Guardar</button>
                    <button class="editar-producto" data-id="${producto.Id}">Editar</button>
                    <button class="eliminar-producto" data-id="${producto.Id}">Eliminar</button>
                `;
                productosLista.appendChild(productoDiv);
});

    
        // Asignar eventos a botones de editar, guardar y eliminar
        document.querySelectorAll(".editar-producto").forEach((btn) =>
            btn.addEventListener("click", (e) => habilitarEdicion(e.target.dataset.id))
        );
        document.querySelectorAll(".guardar-producto").forEach((btn) =>
            btn.addEventListener("click", (e) => guardarCambiosProducto(e.target.dataset.id))
        );
        document.querySelectorAll(".eliminar-producto").forEach((btn) =>
            btn.addEventListener("click", (e) => eliminarProducto(e.target.dataset.id))
        );
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
    };

    // Función para agregar un producto
    const agregarProducto = async () => {
        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const stock = parseInt(document.getElementById("stock").value);
        const categoria = document.getElementById("categoria").value;
        const imagen = document.getElementById("imagen").value; // Ahora se usa como URL directa
    
        try {
            const response = await fetch("http://localhost:3000/productos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    precio,
                    stock,
                    categoria,
                    imagen, // La URL de la imagen se envía directamente
                }),
            });
    
            if (!response.ok) {
                throw new Error("Error al agregar producto");
            }
    
            alert("Producto agregado correctamente");
            cargarProductos(); // Actualiza la lista de productos
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Error al agregar producto");
        }
    };

    const habilitarEdicion = (id) => {
        const nombre = document.querySelector(`.producto-nombre[data-id="${id}"]`);
        const descripcion = document.querySelector(`.producto-descripcion[data-id="${id}"]`);
        const precio = document.querySelector(`.producto-precio[data-id="${id}"]`);
        const stock = document.querySelector(`.producto-stock[data-id="${id}"]`);
        const categoria = document.querySelector(`.producto-categoria[data-id="${id}"]`);
        const guardarBtn = document.querySelector(`.guardar-producto[data-id="${id}"]`);
        const editarBtn = document.querySelector(`.editar-producto[data-id="${id}"]`);
    
        // Habilitar campos
        [nombre, descripcion, precio, stock, categoria].forEach((campo) => campo.disabled = false);
        guardarBtn.style.display = "inline";
        editarBtn.style.display = "none";
    };
    

    const guardarCambiosProducto = async (id) => {
        const nombre = document.querySelector(`.producto-nombre[data-id="${id}"]`).value;
        const descripcion = document.querySelector(`.producto-descripcion[data-id="${id}"]`).value;
        const precio = parseFloat(document.querySelector(`.producto-precio[data-id="${id}"]`).value);
        const stock = parseInt(document.querySelector(`.producto-stock[data-id="${id}"]`).value);
        const categoria = document.querySelector(`.producto-categoria[data-id="${id}"]`).value;
    
        try {
            const response = await fetch(`http://localhost:3000/productos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, descripcion, precio, stock, categoria }),
            });
    
            if (response.ok) {
                alert("Producto actualizado correctamente.");
                cargarProductos(); // Recargar productos
            } else {
                throw new Error("Error al actualizar producto");
            }
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            alert("No se pudo actualizar el producto.");
        }
    };
    
    
        // Función para eliminar un producto
        const eliminarProducto = async (id) => {
            if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    
            try {
                const response = await fetch(`http://localhost:3000/productos/${id}`, {
                    method: "DELETE",
                });
    
                if (response.ok) {
                    alert("Producto eliminado correctamente.");
                    cargarProductos(); // Recargar productos
                } else {
                    throw new Error("Error al eliminar producto");
                }
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                alert("No se pudo eliminar el producto.");
            }
        };

    // Función para editar un producto
    const editarProducto = async (id) => {
        const productoDiv = document.querySelector(`[data-id="${id}"]`).parentElement;
    
        const nombreInput = productoDiv.querySelector('input[name="nombre"]');
        const descripcionInput = productoDiv.querySelector('textarea[name="descripcion"]');
        const precioInput = productoDiv.querySelector('input[name="precio"]');
        const stockInput = productoDiv.querySelector('input[name="stock"]');
        const categoriaInput = productoDiv.querySelector('input[name="categoria"]');
        const imagenInput = productoDiv.querySelector('input[name="imagen"]'); // Nuevo: campo URL de la imagen
    
        const datosActualizados = {
            Nombre: nombreInput.value.trim(),
            Descripcion: descripcionInput.value.trim(),
            Precio: parseFloat(precioInput.value),
            Stock: parseInt(stockInput.value, 10),
            Categoria: categoriaInput.value.trim(),
            Imagen: imagenInput.value.trim(), // Incluye la URL de la imagen
        };
    
        try {
            const response = await fetch(`http://localhost:3000/productos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActualizados),
            });
    
            if (!response.ok) throw new Error("Error al editar el producto");
    
            alert("Producto editado correctamente.");
            cargarProductos(); // Recargar la lista de productos
        } catch (error) {
            console.error("Error al editar producto:", error);
            alert("No se pudo editar el producto.");
        }
    };

    // Función para obtener un producto por ID
    const obtenerProducto = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/productos/${id}`);
            if (!response.ok) throw new Error("Error al obtener producto");
            return await response.json();
        } catch (error) {
            console.error("Error al obtener producto:", error);
            alert("No se pudo obtener el producto.");
        }
    };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            localStorage.removeItem("usuario");
            window.location.href = "../templates/Login.html"; // Redirigir al login
        }
    };

    // Evento para agregar un producto
    const agregarProductoEventHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData(formAgregar);
        await agregarProducto(formData);
    };

    formAgregar.addEventListener("submit", agregarProductoEventHandler);

    // Asignar evento al botón de cerrar sesión
    cerrarSesionBtn.addEventListener("click", cerrarSesion);

    // Inicializar productos al cargar la página
    cargarProductos();
});




