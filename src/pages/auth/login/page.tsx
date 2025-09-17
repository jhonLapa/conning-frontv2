import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { callLogin } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface LoginDto {
  username: string,
  password: string,
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuthStore((state) => state);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginDto>({
    defaultValues: {
      username: "admin",
      password: "123",
    },
  });

  const onSubmit = async (values: LoginDto) => {
    const response = await callLogin(values);

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    if (response.data) {
      login(response.data?.user, response.data?.token);
      navigate("/");
    }

    // if (response.data?.user.rol.name === "Cliente") {
    //   navigate("/cliente");
    // } else {
    // }
  };

  return (
    <div className="w-full sm:w-[350px] mx-auto">
      <h2 className="text-4xl font-bold text-center text-[#efa159]">LOGIN</h2>
      <div className="bg-[#efa159] rounded-lg h-2 w-20 mt-2 mb-10 mx-auto"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              {...register("username", {
                required: "El nombre de usuario es requerido",
              })}
              type="username"
              id="username"
              placeholder="Ingrese su nombre de usuario"
            />
            {errors.username && (
              <p className="msg-error">{errors.username.message}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                {...register("password", {
                  required: "La contraseña es requerida",
                })}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Ingrese su contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 -translate-y-1/2 text-gray-500 cursor-pointer ${
                  errors.password ? "top-1/3" : "top-1/2"
                }`}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>

              {errors.password && (
                <p className="msg-error">{errors.password.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-1">
          <Link
            className="text-sm font-semibold text-[#47455a] hover:underline"
            to="/auth"
          >
            ¿Olvidó su contraseña?
          </Link>
        </div>

        {/* <Button variant="sidebar" className="w-full mt-4" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button> */}
         <Button variant="sidebar" className="w-full mt-4" type="button" onClick={() => navigate("/")}>
          Iniciar sesión
        </Button>

        <div className="mt-4 flex flex-col justify-center items-center">
          <p className="text-sm text-gray-600">¿No tienes una cuenta?</p>
          <Link
            className="text-sm font-semibold text-[#47455a] hover:underline"
            to="/auth/registro"
          >
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
}
