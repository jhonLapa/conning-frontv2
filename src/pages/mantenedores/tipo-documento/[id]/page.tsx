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
  TipoDocumento,
  TipoDocumentoRequest,
} from "@/interfaces/document.interface";
import {
  getFetchDocumentById,
  postDocument,
  putDocument,
} from "@/services/document.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const DocumentosIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [documento, setDocumento] = useState<TipoDocumento | null>(null);
  const esNuevo = id === "nuevo";
  const title = esNuevo ? "Nuevo Documento" : "Editar Documento";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TipoDocumentoRequest>({
    defaultValues: {
      codigo: "",
      nombre: "",
    },
  });

  const getDocumento = async () => {
    if (esNuevo) return;
    const response = await getFetchDocumentById(Number(id));
    setValue("codigo", response.codigo);
    setValue("nombre", response.nombre);
    setDocumento(response);
  };

  const onSubmit = async (data: TipoDocumentoRequest) => {
    const response = documento
      ? await putDocument(documento.idTipoDocumento, data)
      : await postDocument(data);

    if (!response.success) {
      toast.warning("Error al guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setDocumento(null);
    navigate("/tipodocumento");
  };

  useEffect(() => {
    getDocumento();
  }, [id]);

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Información detallada del documento"
      />
      <form
        className="flex flex-col gap-5 mt-4"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Solo mostrar campo código si se está editando */}
                {!esNuevo && (
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      type="text"
                      {...register("codigo")}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                )}

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
          </CardContent>

          <CardFooter className="flex flex-nowrap justify-end gap-5">
            <Button variant={"sidebar"} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant={"default"}
              type="button"
              onClick={() => navigate("/tipodocumento")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default DocumentosIdPage;
