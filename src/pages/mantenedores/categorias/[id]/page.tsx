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
import { Categoria, CategoriaRequest } from "@/interfaces/categoria.interface";
import { getFechtCategoriaById, postCategoria, putCategoria } from "@/services/categoria.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CategoriaIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoria, setCategoria] = useState<Categoria | null>(null);

  const title = id == "nuevo" ? "Nuevo Categoria" : "Editar Categoria";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaRequest>({
    defaultValues: {
      nombre: "",
    },
  });

  const getCategoria = async () => {
    if (id == "nuevo") return;

    const response = await getFechtCategoriaById(Number(id));
    setValue("nombre", response.nombre);
    setCategoria(response);
  };

  const onSubmit = async (data: CategoriaRequest) => {
    const response = categoria
      ? await putCategoria(categoria.idCategoria, data)
      : await postCategoria(data);

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setCategoria(null);
    navigate("/categoria");
    return;
  };

  useEffect(() => {
    getCategoria();
  }, [id]);

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Informacion detallada de categoría"
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
                    <Label htmlFor="nombre">
                      Nombre
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="nombre"
                      {...register("nombre", {
                        required: "El nombre es requerido",
                      })}
                    />
                    {errors.nombre && (
                      <p className="msg-error">{errors.nombre.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">                   
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
              onClick={() => navigate("/categoria")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default CategoriaIdPage;
