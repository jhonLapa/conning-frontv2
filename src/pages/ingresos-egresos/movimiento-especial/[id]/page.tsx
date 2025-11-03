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
  MovimientoEspecial,
  MovimientoEspecialRequest,
} from "@/interfaces/movimiento-especial";
import {
  getFetchMovimientoEspecialById,
  postMovimientoEspecial,
  putMovimientoEspecial,
} from "@/services/movimiento-especial.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MovimientoEspecialIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movimiento, setMovimiento] = useState<MovimientoEspecial | null>(null);
  const title = id == "nuevo" ? "Nuevo Movimiento" : "Editar Movimiento";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MovimientoEspecialRequest>({
    defaultValues: {
      fecha: "",
      descripcion: "",
      monto: 0,
      tipoMovimiento: "INGRESO",
      cuentaBancaria: "",
      observacion: "",
    },
  });

  const getMovimientoEspecial = async () => {
    if (id == "nuevo") return;

    const response = await getFetchMovimientoEspecialById(Number(id));
    setValue("fecha", response.fecha ? response.fecha.substring(0, 10) : "");
    setValue("descripcion", response.descripcion);
    setValue("monto", response.monto);
    setValue("tipoMovimiento", response.tipoMovimiento);
    setValue("cuentaBancaria", response.cuentaBancaria);
    setValue("observacion", response.observacion);
    setMovimiento(response);
  };

  const onSubmit = async (data: MovimientoEspecialRequest) => {
    const response = movimiento
      ? await putMovimientoEspecial(movimiento.idMovimientoEspecial, data)
      : await postMovimientoEspecial(data);

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setMovimiento(null);
    navigate("/movimientoespecial");
    return;
  };

  useEffect(() => {
    getMovimientoEspecial();
  }, [id]);

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Informacion detallada del movimiento"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FECHA */}
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  {...register("fecha", {
                    required: "La fecha es obligatoria",
                  })}
                />
                {errors.fecha && (
                  <p className="msg-error">{errors.fecha.message}</p>
                )}
              </div>

              {/* TIPO DE MOVIMIENTO */}
              <div>
                <Label>Tipo de movimiento</Label>
                <select
                  {...register("tipoMovimiento", { required: true })}
                  className="w-full border rounded p-2"
                >
                  <option value="INGRESO">Ingreso</option>
                  <option value="EGRESO">Egreso</option>
                </select>
              </div>

              {/* PROYECTO */}
              <div className="md:col-span-2">
                <Label>Proyecto</Label>
                <Input
                  type="text"
                  placeholder="Ej. Proyecto Ferre"
                  {...register("observacion")}
                />
              </div>

              {/* MONTO */}
              <div>
                <Label>Monto</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("monto", {
                    required: "Debes poner un monto",
                    valueAsNumber: true,
                    min: { value: 1, message: "El monto debe ser mayor a 0" },
                  })}
                />
                {errors.monto && (
                  <p className="msg-error">{errors.monto.message}</p>
                )}
              </div>

              {/* CUENTA BANCARIA */}
              <div>
                <Label>Cuenta bancaria</Label>
                <Input
                  type="text"
                  placeholder="Ej. BBVA 123-456-789"
                  {...register("cuentaBancaria")}
                />
              </div>

              {/* DESCRIPCIÓN */}
              <div className="md:col-span-2">
                <Label htmlFor="descripcion">
                  Descripción{" "}
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <textarea
                  rows={3}
                  className="w-full border rounded p-2"
                  placeholder="Escribe la descripción del movimiento"
                  {...register("descripcion", {
                    required: "La descripción es requerida",
                  })}
                />
                {errors.descripcion && (
                  <p className="msg-error">{errors.descripcion.message}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button variant="sidebar" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={() => navigate("/movimientoespecial")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default MovimientoEspecialIdPage;
