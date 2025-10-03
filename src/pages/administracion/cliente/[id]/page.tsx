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
import { Cliente, ClienteRequest } from "@/interfaces/cliente.interface";
import {
  getFetchClienteById,
  postCliente,
  putCliente,
} from "@/services/cliente.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ClientesIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const title = id == "nuevo" ? "Nueva Cliente" : "Editar Cliente";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClienteRequest>({
    defaultValues: {
      nombreCompleto: "",
      tipoDocumentoId: 0,
      numeroDocumento: "",
      direccion: "",
      telefono: "",
      email: "",
    },
  });

  const getCliente = async () => {
    if (id == "nuevo") return;

    const response = await getFetchClienteById(Number(id));
    setValue("nombreCompleto", response.nombreCompleto);
    setValue("tipoDocumentoId", response.tipoDocumentoId);
    setValue("numeroDocumento", response.numeroDocumento);
    setValue("direccion", response.direccion);
    setValue("telefono", response.telefono);
    setValue("email", response.email);
    setCliente(response);
  };

  const onSubmit = async (data: ClienteRequest) => {
    const response = cliente
      ? await putCliente(cliente.idCliente, data)
      : await postCliente(data);

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setCliente(null);
    navigate("/cliente");
    return;
  };

  useEffect(() => {
    getCliente();
  }, [id]);

  return (
    <>
      <HeaderPage
        title="Nuevo Cliente"
        descripcion="Informacion detallada del cliente"
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
                      {...register("nombreCompleto", {
                        required: "El nombre es requerido",
                      })}
                    />
                    {errors.nombreCompleto && (
                      <p className="msg-error">
                        {errors.nombreCompleto.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="tipoDocumentoId">
                      Tipo documento
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="tipo de documento"
                      {...register("tipoDocumentoId", {
                        required: "El tipodocumento es requerido",
                      })}
                    />
                    {errors.tipoDocumentoId && (
                      <p className="msg-error">
                        {errors.tipoDocumentoId.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="numeroDocumento">
                      Numero documento
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="numero de documento"
                      {...register("numeroDocumento", {
                        required: "El numero de documento es requerido",
                      })}
                    />
                    {errors.numeroDocumento && (
                      <p className="msg-error">
                        {errors.numeroDocumento.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="direccion">
                      Direccion
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="direccion"
                      {...register("direccion", {
                        required: "La direccion es requerida",
                      })}
                    />
                    {errors.direccion && (
                      <p className="msg-error">{errors.direccion.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="telefono">
                      Telefono
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="telefono"
                      {...register("telefono", {
                        required: "El telefono es requerido",
                      })}
                    />
                    {errors.telefono && (
                      <p className="msg-error">{errors.telefono.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="email">
                      Correo electronico
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="correo electronico"
                      {...register("email", {
                        required: "El correo es requerido",
                      })}
                    />
                    {errors.email && (
                      <p className="msg-error">{errors.email.message}</p>
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
              onClick={() => navigate("/cliente")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default ClientesIdPage;
