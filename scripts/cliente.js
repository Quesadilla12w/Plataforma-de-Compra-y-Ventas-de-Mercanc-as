document.addEventListener("DOMContentLoaded", function () {
    // Manejar formulario de inicio de sesión
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Obtener los valores ingresados
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                // Enviar solicitud al backend
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar usuario en localStorage
                    localStorage.setItem("usuario", JSON.stringify(data.user));

                    // Mostrar mensaje de éxito
                    alert("Inicio de sesión exitoso.");

                    // Redirigir a la página principal
                    window.location.href = "../templates/Principal.html";
                } else {
                    // Mostrar mensaje de error si las credenciales son incorrectas
                    alert(data.message || "Credenciales incorrectas.");
                }
            } catch (error) {
                console.error("Error al iniciar sesión:", error);

                // Mostrar mensaje de error si el servidor no responde
                alert("Error al conectarse al servidor.");
            }
        });
    }

    // Manejar formulario de registro
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            // Obtener los valores ingresados
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;

            try {
                // Enviar solicitud al backend
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, role }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Mostrar mensaje de éxito
                    alert("Registro exitoso. Ahora puedes iniciar sesión.");

                    // Redirigir al inicio de sesión
                    window.location.href = "../templates/Login.html";
                } else {
                    // Mostrar mensaje de error si hubo un problema al registrar
                    alert(data.message || "Error al registrar usuario.");
                }
            } catch (error) {
                console.error("Error al registrar usuario:", error);

                // Mostrar mensaje de error si el servidor no responde
                alert("Error al conectarse al servidor.");
            }
        });
    }

    // Manejar botón de cerrar sesión
    const cerrarSesionBtn = document.getElementById("logout-btn");
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", () => {
            // Limpiar datos del usuario en localStorage
            localStorage.removeItem("usuario");
            localStorage.removeItem("carrito");

            // Redirigir al inicio de sesión
            window.location.href = "../templates/Login.html";
        });
    }
});



