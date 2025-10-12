import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Usuario, UsuarioRequest } from "@/interfaces/usuario.interface";
import { getFechtUsuarioById, postUsuario, putUsuario } from "@/services/usuario.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UsuarioIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const title = id == "nuevo" ? "Nuevo Usuario" : "Editar Usuario";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioRequest>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const getUsuario = async () => {
    if (id == "nuevo") return;

    const response = await getFechtUsuarioById(Number(id));
    setValue("firstName", response.firstName);
    setValue("lastName", response.lastName);
    setValue("email", response.email);
    setUsuario(response);
  };

  const onSubmit = async (data: UsuarioRequest) => {
    let response;
    const payload: UsuarioRequest = { ...data };

    if (id !== "nuevo" && usuario) { 
        
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        }

        const payloadCompletoParaUpdate = {
            ...payload, 
            state: usuario.state,
            userId: usuario.userId 
        };

        response = await putUsuario(Number(id), payloadCompletoParaUpdate as any);
        
    } 
    else {
        const payloadCompletoParaCreate = {
            ...payload, 
            state: true
        };
        response = await postUsuario(payloadCompletoParaCreate as any);
    }

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setUsuario(null);
    navigate("/usuario");
};

  useEffect(() => {
    getUsuario();
  }, [id]);

  return (
    <>
      <HeaderPage
        title="Nuevo Usuario"
        descripcion="Informacion detallada del usuario"
      />
      <form
        className="flex  flex-col gap-5 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              {title}
            </CardTitle>
            <hr />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col col-span-4 space-y-2 gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="firstName">
                      Nombres
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Nombres"
                      {...register("firstName", {
                        required: "El nombre es requerido",
                      })}
                    />
                    {errors.firstName && (
                      <p className="msg-error">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="lastName">
                      Apellidos
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Apellidos"
                      {...register("lastName", {
                        required: "El apellido es requerida",
                      })}
                    />
                    {errors.lastName && (
                      <p className="msg-error">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="email">
                      Correo
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Correo"
                      {...register("email", {
                        required: "El correo es requerido",
                      })}
                    />
                    {errors.email && (
                      <p className="msg-error">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="password">
                      Contraseña
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="password"
                      placeholder="Contraseña"
                      {...register("password", {
                        required: "La contraseña es requerida",
                      })}
                    />
                    {errors.password && (
                      <p className="msg-error">{errors.password.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-nowrap justify-end gap-5">
            <Button variant={"sidebar"} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant={"default"}
              type="button"
              onClick={() => navigate("/usuario")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default UsuarioIdPage;
