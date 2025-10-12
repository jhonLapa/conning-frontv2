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
  TipoComprobante,
  TipoComprobanteRequest,
} from "@/interfaces/tipo-comprobante.interface";
import {
  getFetchComprobanteById,
  postComprobante,
  putComprobante,
} from "@/services/tipo-comprobante.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ComprobanteIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comprobante, setComprobante] = useState<TipoComprobante | null>(null);
  const title = id == "nuevo" ? "Nuevo Comprobante" : "Editar Comprobante";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TipoComprobanteRequest>({
    defaultValues: {
      codigo: "",
      nombre: "",
    },
  });

  const getComprobante = async () => {
    if (id == "nuevo") return;

    const response = await getFetchComprobanteById(Number(id));
    setValue("codigo", response.codigo);
    setValue("nombre", response.nombre);
    setComprobante(response);
  };

  const onSubmit = async (data: TipoComprobanteRequest) => {
    const response = comprobante
      ? await putComprobante(comprobante.idTipoComprobante, data)
      : await postComprobante(data);

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setComprobante(null);
    navigate("/tipocomprobante");
    return;
  };

  useEffect(() => {
    getComprobante();
  }, [id]);

  return (
    <>
      <HeaderPage
        title="Nuevo Comprobante"
        descripcion="Informacion detallada del comprobante"
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
                    <Label htmlFor="codigo">
                      Codigo
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="codigo"
                      {...register("codigo", {
                        required: "El codigo es requerido",
                      })}
                    />
                    {errors.codigo && (
                      <p className="msg-error">{errors.codigo.message}</p>
                    )}
                  </div>
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
              onClick={() => navigate("/tipocomprobante")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default ComprobanteIdPage;
