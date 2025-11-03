import axios from "axios";
import { toast } from "sonner"; // 🔔 Para mostrar notificaciones globales

// =============================
// ⚙️ Configuración base de Axios
// =============================
const api = axios.create({
  // baseURL: "https://localhost:7109/api/",
  baseURL: "http://cotos02-002-site3.qtempurl.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================
// 🧩 INTERCEPTORES GLOBALES
// =============================

// ✅ Interceptar respuestas exitosas (status 200)
api.interceptors.response.use(
  (response) => {
    // Si el backend devuelve success=false (aunque sea status 200)
    if (response?.data?.success === false) {
      toast.warning(response.data.message || "Error en la operación.", {
        position: "top-right",
      });
    }

    return response; // devolvemos la respuesta normal
  },

  // ⚠️ Interceptar errores HTTP (status 400, 401, 403, 404, 500, etc.)
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.Message ||
      "Ocurrió un error inesperado.";

    // =============================
    // 💬 Mostrar mensajes automáticos según el tipo de error
    // =============================
    switch (status) {
      case 400:
        toast.warning(message, { position: "top-right" });
        break;

      case 401:
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente.", {
          position: "top-right",
        });
        // (Opcional) limpiar token o redirigir
        localStorage.removeItem("token");
        window.location.href = "/login";
        break;

      case 403:
        toast.warning("No tienes permisos para realizar esta acción.", {
          position: "top-right",
        });
        break;

      case 404:
        toast.warning("Recurso no encontrado o no disponible.", {
          position: "top-right",
        });
        break;

      case 500:
        toast.error("Error interno del servidor.", {
          position: "top-right",
        });
        break;

      default:
        toast.warning(message, { position: "top-right" });
        break;
    }

    // Devolver el error para que el componente pueda manejarlo si quiere
    return Promise.reject(error);
  }
);

export default api;
