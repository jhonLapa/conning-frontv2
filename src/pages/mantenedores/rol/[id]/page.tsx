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
import {
  Rol,
  RolRequest,
} from "@/interfaces/rol.interface";
import {
  getFetchRolById,
  postRol,
  putRol,
} from "@/services/rol.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const RolIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rol, setRol] = useState<Rol | null>(null);
  const title = id == "nuevo" ? "Nuevo Rol" : "Editar Rol";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RolRequest>({
    defaultValues: {
      name: "",
      descripcion: "",
    },
  });

  const getRol = async () => {
      if (id == "nuevo") return;
  
      const response = await getFetchRolById(Number(id));
      setValue("name", response.name);
      setValue("descripcion", response.descripcion);
      setRol(response);
    };

    const onSubmit = async (data: RolRequest) => {
        const response = rol
          ? await putRol(rol.roleId, data)
          : await postRol(data);
    
        if (!response.success) {
          toast.warning("Error al Guardar el registro", { position: "top-right" });
          return;
        }
    
        toast.success(response.message, { position: "top-right" });
        setRol(null);
        navigate("/rol");
        return;
      };

    useEffect(() => {
    getRol();
    }, [id]);


    return (
        <>
          <HeaderPage
            title="Nuevo Rol"
            descripcion="Informacion detallada de Rol"
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
                        <Label htmlFor="name">
                          Name
                          <span className="font-semibold text-red-600">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="name"
                          {...register("name", {
                            required: "El Name es requerido",
                          })}
                        />
                        {errors.name && (
                          <p className="msg-error">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="descripcion">
                          Descripcion
                          <span className="font-semibold text-red-600">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="descripcion"
                          {...register("descripcion", {
                            required: "El descripcion es requerido",
                          })}
                        />
                        {errors.descripcion && (
                          <p className="msg-error">{errors.descripcion.message}</p>
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
                  onClick={() => navigate("/rol")}
                >
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          </form>
        </>
      );


};
  export default RolIdPage;
