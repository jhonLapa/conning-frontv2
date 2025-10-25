import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginDto } from "@/interfaces/auth.interface";
import { useAuthStore } from "@/stores/auth.store";
import { callLogin } from "@/services/auth.service";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore((state) => state);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    defaultValues: {
      email: "admincommig@gmail.com",
      password: "admin",
    },
  });

  const onSubmit = async (values: LoginDto) => {
    try {
      const response = await callLogin(values);

      if (!response.success) {
        toast.warning(response.message, { position: "top-center" });
        return;
      }

      const { user, accessToken, rol } = response.data!;

      // ✅ Guarda datos del usuario y token en Zustand/localStorage
      login(user, accessToken);

      // Puedes guardar el rol si lo necesitas en otro estado global
      localStorage.setItem("rol", JSON.stringify(rol));

      toast.success("✅ Sesión iniciada correctamente", {
        position: "top-center",
      });

      // Redirigir a página principal
      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("❌ Error al iniciar sesión", { position: "top-center" });
    }
  };

  return (
    <div className="w-full sm:w-[350px] mx-auto">
      <h2 className="text-4xl font-bold text-center text-[#efa159]">LOGIN</h2>
      <div className="bg-[#efa159] rounded-lg h-2 w-20 mt-2 mb-10 mx-auto"></div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* EMAIL */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input
              {...register("email", { required: "El correo es obligatorio" })}
              type="email"
              id="email"
              placeholder="Ingrese su correo"
            />
            {errors.email && (
              <p className="msg-error">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Ingrese su contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className="msg-error">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* OLVIDAR CONTRASEÑA */}
        <div className="mt-2">
          <Link
            className="text-sm font-semibold text-[#47455a] hover:underline"
            to="/auth/forgot-password"
          >
            ¿Olvidó su contraseña?
          </Link>
        </div>

        {/* BOTÓN DE LOGIN */}
        <Button
          variant="sidebar"
          className="w-full mt-4"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
    </div>
  );
}
