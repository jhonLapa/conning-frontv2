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

import { Proyecto, ProyectoRequest } from "@/interfaces/proyecto.interface";
import { Cliente } from "@/interfaces/cliente.interface";

import {
  getFechtProyectoById,
  postProyecto,
  putProyecto,
} from "@/services/proyecto.service";
import { getClienteFetch } from "@/services/cliente.service"; 

import { formatDateForInput } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ProyectoForm = Omit<ProyectoRequest, 'idCliente'> & {
    idCliente: number | string | undefined; 
}


const ProyectoIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]); 

  const title = id == "nuevo" ? "Nuevo Proyecto" : "Editar Proyecto";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProyectoForm>({ 
    defaultValues: {
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      idCliente: undefined, 
      frecuenciaPago: "",
    },
  });

  const getProyecto = async () => {
    if (id == "nuevo") return;

    try {
        const response = await getFechtProyectoById(Number(id));
        setValue("nombre", response.nombre);
        setValue("descripcion", response.descripcion);
        setValue("fechaInicio", formatDateForInput(response.fechaInicio));
        setValue("fechaFin", formatDateForInput(response.fechaFin));
        setValue("idCliente", response.idCliente); 
        setValue("frecuenciaPago", response.frecuenciaPago);
        setProyecto(response);
    } catch (error) {
        toast.error("Error al cargar los datos del proyecto.", { position: "top-right" });
    }
  };

  const loadClientes = async () => {
    try {
      const clientList = await getClienteFetch();
      setClientes(clientList);
    } catch (error) {
      toast.error("Error al cargar la lista de clientes.", { position: "top-right" });
    }
  };

  const onSubmit = async (data: ProyectoForm) => {
    const payload: ProyectoRequest = { 
        ...data, 
        idCliente: Number(data.idCliente), 
        fechaInicio: data.fechaInicio || null, 
        fechaFin: data.fechaFin || null,
    };
    
    const response = proyecto
      ? await putProyecto(proyecto.idProyecto, payload)
      : await postProyecto(payload);

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setProyecto(null);
    navigate("/proyecto");
  };

  useEffect(() => {
    loadClientes(); 
    getProyecto();
  }, [id]);

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Informacion detallada del proyecto"
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
              <div className="flex flex-col col-span-4 space-y-2 gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="nombre">
                      Nombre
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Nombre"
                      {...register("nombre", {
                        required: "El nombre es requerido",
                      })}
                    />
                    {errors.nombre && (
                      <p className="msg-error">{errors.nombre.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="descripcion">
                      Descripcion
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Descripcion"
                      {...register("descripcion", {
                        required: "La descripcion es requerida",
                      })}
                    />
                    {errors.descripcion && (
                      <p className="msg-error">{errors.descripcion.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fechaInicio">
                      Fecha Inicio
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="date"
                      placeholder="Fecha de Inicio"
                      {...register("fechaInicio", {
                        required: "La fecha de inicio es requerida",
                      })}
                    />
                    {errors.fechaInicio && (
                      <p className="msg-error">{errors.fechaInicio.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fechaFin">
                      Fecha Fin
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      type="date"
                      placeholder="Fecha de Fin"
                      {...register("fechaFin", {
                        required: "La fecha de fin es requerida",
                      })}
                    />
                    {errors.fechaFin && (
                      <p className="msg-error">{errors.fechaFin.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="idCliente">
                      Cliente
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register("idCliente", {
                        required: "El cliente es requerido",
                        valueAsNumber: true, 
                      })}
                      disabled={clientes.length === 0 && !proyecto} 
                    >
                      <option value="">
                        {clientes.length === 0 ? "Cargando clientes..." : "Seleccione Cliente"}
                      </option>
                      {clientes.map((client) => (
                        <option 
                          key={client.idCliente} 
                          value={client.idCliente} 
                        >
                          {client.nombreCompleto}
                        </option>
                      ))}
                    </select>
                    {errors.idCliente && (
                      <p className="msg-error">{errors.idCliente.message}</p>
                    )}
                  </div>                 
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="frecuenciaPago">
                      Frecuencia de Pago
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register("frecuenciaPago", {
                        required: "La frecuencia de pago es requerida",
                      })}
                    >
                        <option value="">Seleccione Frecuencia</option>
                        <option value="SEMANAL">Semanal</option>
                        <option value="QUINCENAL">Quincenal</option>
                        <option value="MENSUAL">Mensual</option>
                        </select>
                      {errors.frecuenciaPago && (
                       <p className="msg-error">{errors.frecuenciaPago.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-nowrap justify-end gap-5">
            <Button variant={"sidebar"} type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
            <Button
              variant={"default"}
              type="button"
              onClick={() => navigate("/proyecto")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default ProyectoIdPage;