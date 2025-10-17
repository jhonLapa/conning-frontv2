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
  CuentaBancariaTrabajador,
  CuentaBancariaTrabajadorSaveRequest,
} from "@/interfaces/cuenta-bancaria-trabajador.interface";
import {
  getFechtCuentaById,
  postCuentaBancaria,
  putCuentaBancaria,
} from "@/services/cuenta-bancaria-trabajador.service"; // 🚨 Usamos los servicios correctos
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CuentaBancariaTrabajadorIdPage = () => {
  const navigate = useNavigate();
  // El ID puede ser el de la cuenta bancaria si estamos editando, o el ID del trabajador si estamos creando (para prellenar)
  const { id } = useParams(); 
  const [cuenta, setCuenta] = useState<CuentaBancariaTrabajador | null>(null);
  const title = id === "nuevo" ? "Nueva Cuenta Bancaria" : "Editar Cuenta Bancaria";

  // 🚨 Usamos la interfaz de solicitud correcta
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CuentaBancariaTrabajadorSaveRequest>({
    defaultValues: {
      idTrabajador: 0, 
      idBanco: 0,
      numeroCuenta: "",
      cci: null,
      tipoCuenta: "AHORRO", // O el valor por defecto que uses
      moneda: "SOL",        // O el valor por defecto que uses
      principal: 0,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: null,
      estado: 1,
    },
  });

  // 🚨 Adaptación de la función de carga de datos
  const getCuenta = async () => {
    // Si el ID es 'nuevo', no cargamos nada, pero tal vez recibamos el ID del Trabajador
    // Si usas un URL como /cuentabancaria/trabajador/{idTrabajador}/nuevo, ajusta la lógica de `useParams`
    if (id === "nuevo") return; 

    // Asumimos que `id` es el `idCuentaBanco` para la edición
    try {
        const response = await getFechtCuentaById(Number(id));
        
        // Asignación de valores al formulario
        setValue("idTrabajador", response.idTrabajador);
        setValue("idBanco", response.idBanco);
        setValue("numeroCuenta", response.numeroCuenta);
        setValue("cci", response.cci || null);
        setValue("tipoCuenta", response.tipoCuenta);
        setValue("moneda", response.moneda);
        setValue("principal", response.principal);
        setValue("fechaInicio", String(response.fechaInicio).split('T')[0]); // Formato YYYY-MM-DD
        setValue("fechaFin", response.fechaFin ? String(response.fechaFin).split('T')[0] : null);
        setValue("estado", response.estado);

        setCuenta(response);
    } catch (error) {
        toast.error("Error al cargar los datos de la cuenta.");
    }
  };

  // 🚨 Adaptación de la función de envío
  const onSubmit = async (data: CuentaBancariaTrabajadorSaveRequest) => {
    // Asegúrate de que los campos numéricos se conviertan a número, especialmente si vienen de Inputs de texto.
    const payload: CuentaBancariaTrabajadorSaveRequest = {
        ...data,
        idTrabajador: Number(data.idTrabajador),
        idBanco: Number(data.idBanco),
        principal: Number(data.principal),
        estado: Number(data.estado),
        // Si el campo CCI es una cadena vacía, asegúrate de que sea `null` para el backend si es opcional
        cci: data.cci || null
    };

    const response = cuenta
      ? await putCuentaBancaria(cuenta.idCuentaBanco, payload)
      : await postCuentaBancaria(payload);

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setCuenta(null);
    // 🚨 Redirige a la página que liste las cuentas o al trabajador
    // Asumo que navegas a una lista general de cuentas o a la vista del trabajador.
    navigate(`/trabajadores/${data.idTrabajador}`); 
    return;
  };

  useEffect(() => {
    getCuenta();
  }, [id]);

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Información detallada de la cuenta bancaria del trabajador"
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
                    {/* Campo: ID Trabajador (oculto o select de trabajador) */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="idTrabajador">ID Trabajador</Label>
                      <Input
                        type="number"
                        placeholder="ID Trabajador"
                        readOnly={!!cuenta} // No permitir cambiar el trabajador al editar
                        {...register("idTrabajador", {
                            required: "El ID del trabajador es requerido",
                            valueAsNumber: true,
                        })}
                      />
                      {errors.idTrabajador && (<p className="msg-error">{errors.idTrabajador.message}</p>)}
                    </div>
                    {/* Campo: ID Banco (Select) */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="idBanco">Banco<span className="font-semibold text-red-600">*</span></Label>
                      {/* Aquí iría un componente Select para el Banco */}
                      <Input
                        type="number"
                        placeholder="ID Banco"
                        {...register("idBanco", {
                          required: "El Banco es requerido",
                          valueAsNumber: true,
                        })}
                      />
                      {errors.idBanco && (<p className="msg-error">{errors.idBanco.message}</p>)}
                    </div>
                    {/* Campo: Número de Cuenta */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="numeroCuenta">Número de Cuenta<span className="font-semibold text-red-600">*</span></Label>
                      <Input
                        type="text"
                        placeholder="Número de Cuenta"
                        {...register("numeroCuenta", {
                          required: "El número de cuenta es requerido",
                        })}
                      />
                      {errors.numeroCuenta && (<p className="msg-error">{errors.numeroCuenta.message}</p>)}
                    </div>
                    {/* Campo: CCI (Opcional) */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="cci">CCI</Label>
                      <Input
                        type="text"
                        placeholder="CCI (Opcional)"
                        {...register("cci")}
                      />
                    </div>
                    {/* Campo: Tipo Cuenta (Select) */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="tipoCuenta">Tipo de Cuenta<span className="font-semibold text-red-600">*</span></Label>
                      {/* Aquí iría un componente Select para Tipo Cuenta */}
                      <Input
                        type="text"
                        placeholder="Tipo Cuenta"
                        {...register("tipoCuenta", {
                          required: "El Tipo de Cuenta es requerido",
                        })}
                      />
                      {errors.tipoCuenta && (<p className="msg-error">{errors.tipoCuenta.message}</p>)}
                    </div>
                    {/* Campo: Moneda (Select) */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="moneda">Moneda<span className="font-semibold text-red-600">*</span></Label>
                      {/* Aquí iría un componente Select para Moneda */}
                      <Input
                        type="text"
                        placeholder="Moneda"
                        {...register("moneda", {
                          required: "La Moneda es requerida",
                        })}
                      />
                      {errors.moneda && (<p className="msg-error">{errors.moneda.message}</p>)}
                    </div>
                    {/* Campo: Principal (Checkbox/Radio) */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="principal">Principal (1=Sí, 0=No)</Label>
                      {/* Aquí iría un Checkbox o Select */}
                      <Input
                        type="number"
                        placeholder="1 o 0"
                        {...register("principal", {
                            required: "Indicar si es principal es requerido",
                            valueAsNumber: true,
                        })}
                      />
                    </div>
                    {/* Campo: Fecha Inicio */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="fechaInicio">Fecha Inicio<span className="font-semibold text-red-600">*</span></Label>
                      <Input
                        type="date"
                        {...register("fechaInicio", {
                          required: "La Fecha de Inicio es requerida",
                        })}
                      />
                    </div>
                    {/* Campo: Fecha Fin (Opcional) */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="fechaFin">Fecha Fin (Opcional)</Label>
                      <Input
                        type="date"
                        {...register("fechaFin")}
                      />
                    </div>
                    {/* Campo: Estado */}
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="estado">Estado (1=Activo, 0=Inactivo)</Label>
                      <Input
                        type="number"
                        placeholder="1 o 0"
                        {...register("estado", {
                            required: "El estado es requerido",
                            valueAsNumber: true,
                        })}
                      />
                    </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-nowrap justify-end gap-5">
            <Button variant={"sidebar"} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cuenta"}
            </Button>
            <Button
              variant={"default"}
              type="button"
              // 🚨 Navegación de regreso, asumo que es a la vista del trabajador o a la lista
              onClick={() => navigate(-1)} 
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default CuentaBancariaTrabajadorIdPage;