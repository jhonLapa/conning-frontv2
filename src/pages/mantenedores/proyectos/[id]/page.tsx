import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { postProyectoCompleto } from "@/services/proyecto.service";

/* ============================================================
   Tipos para el formulario completo
   ============================================================ */
interface ProyectoFormData {
  proyecto: {
    idCliente: number;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    frecuenciaPago: string;
    estado: number;
    usuarioCreacion: string;
  };
  trabajador: {
    idTrabajador: number;
    fechaInicio: string;
    fechaFin: string;
    estado: number;
    usuarioCreacion: string;
  }[];
  sindicato: {
    mes: number;
    anio: number;
    monto: number;
    fechaPago: string;
    estado: number;
    usuarioCreacion: string;
  }[];
  proyectoEncargado: {
    idTrabajador: number;
    rol: string;
    fechaInicio: string;
    fechaFin: string;
    estado: number;
  };
}

/* ============================================================
   Componente principal
   ============================================================ */
export default function ProyectoCompletoForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<ProyectoFormData>({
    defaultValues: {
      proyecto: {
        idCliente: 0,
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        frecuenciaPago: "Mensual",
        estado: 1,
        usuarioCreacion: "jcotos",
      },
      trabajador: [],
      sindicato: [],
      proyectoEncargado: {
        idTrabajador: 0,
        rol: "",
        fechaInicio: "",
        fechaFin: "",
        estado: 1,
      },
    },
  });

  // 🔹 Campos dinámicos
  const { fields: trabajadores, append: addTrabajador, remove: removeTrabajador } =
    useFieldArray({ control, name: "trabajador" });

  const { fields: sindicatos, append: addSindicato, remove: removeSindicato } =
    useFieldArray({ control, name: "sindicato" });

  // 🔹 Enviar formulario
  const onSubmit = async (data: ProyectoFormData) => {
    setLoading(true);
    try {
      const response = await  postProyectoCompleto(data);

      if (response.error) {
        toast.warning(response.message);
        return;
      }

      toast.success("✅ Proyecto registrado correctamente");
      reset();
      navigate("/proyectos");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al registrar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderPage
        title="Registrar Proyecto Completo"
        descripcion="Incluye datos del proyecto, trabajadores, aportes y encargado"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mt-4"
      >
        {/* ================= PROYECTO ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              🧱 Datos del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>ID Cliente *</Label>
              <Input
                type="number"
                {...register("proyecto.idCliente", { required: true })}
              />
            </div>
            <div>
              <Label>Nombre *</Label>
              <Input {...register("proyecto.nombre", { required: true })} />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input {...register("proyecto.descripcion")} />
            </div>
            <div>
              <Label>Fecha Inicio *</Label>
              <Input type="date" {...register("proyecto.fechaInicio")} />
            </div>
            <div>
              <Label>Fecha Fin *</Label>
              <Input type="date" {...register("proyecto.fechaFin")} />
            </div>
            <div>
              <Label>Frecuencia Pago</Label>
              <Input {...register("proyecto.frecuenciaPago")} />
            </div>
          </CardContent>
        </Card>

        {/* ================= TRABAJADORES ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              👷 Trabajadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trabajadores.map((t, i) => (
              <div
                key={t.id}
                className="grid grid-cols-5 gap-3 mb-3 items-end border-b pb-2"
              >
                <div>
                  <Label>ID Trabajador</Label>
                  <Input
                    type="number"
                    {...register(`trabajador.${i}.idTrabajador` as const, {
                      required: true,
                    })}
                  />
                </div>
                <div>
                  <Label>Fecha Inicio</Label>
                  <Input
                    type="date"
                    {...register(`trabajador.${i}.fechaInicio` as const)}
                  />
                </div>
                <div>
                  <Label>Fecha Fin</Label>
                  <Input
                    type="date"
                    {...register(`trabajador.${i}.fechaFin` as const)}
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input
                    type="number"
                    {...register(`trabajador.${i}.estado` as const)}
                    defaultValue={1}
                  />
                </div>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => removeTrabajador(i)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                addTrabajador({
                  idTrabajador: 0,
                  fechaInicio: "",
                  fechaFin: "",
                  estado: 1,
                  usuarioCreacion: "jcotos",
                })
              }
            >
              ➕ Agregar Trabajador
            </Button>
          </CardContent>
        </Card>

        {/* ================= APORTES SINDICATO ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              💰 Aportes Sindicato
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sindicatos.map((s, i) => (
              <div
                key={s.id}
                className="grid grid-cols-6 gap-3 mb-3 items-end border-b pb-2"
              >
                <div>
                  <Label>Mes</Label>
                  <Input
                    type="number"
                    {...register(`sindicato.${i}.mes` as const, {
                      required: true,
                    })}
                  />
                </div>
                <div>
                  <Label>Año</Label>
                  <Input
                    type="number"
                    {...register(`sindicato.${i}.anio` as const, {
                      required: true,
                    })}
                  />
                </div>
                <div>
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`sindicato.${i}.monto` as const, {
                      required: true,
                    })}
                  />
                </div>
                <div>
                  <Label>Fecha Pago</Label>
                  <Input
                    type="date"
                    {...register(`sindicato.${i}.fechaPago` as const)}
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input
                    type="number"
                    {...register(`sindicato.${i}.estado` as const)}
                    defaultValue={1}
                  />
                </div>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => removeSindicato(i)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                addSindicato({
                  mes: 0,
                  anio: new Date().getFullYear(),
                  monto: 0,
                  fechaPago: "",
                  estado: 1,
                  usuarioCreacion: "jcotos",
                })
              }
            >
              ➕ Agregar Aporte
            </Button>
          </CardContent>
        </Card>

        {/* ================= ENCARGADO ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              🧑‍💼 Encargado del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <Label>ID Trabajador</Label>
              <Input
                type="number"
                {...register("proyectoEncargado.idTrabajador")}
              />
            </div>
            <div>
              <Label>Rol</Label>
              <Input {...register("proyectoEncargado.rol")} />
            </div>
            <div>
              <Label>Fecha Inicio</Label>
              <Input
                type="date"
                {...register("proyectoEncargado.fechaInicio")}
              />
            </div>
            <div>
              <Label>Fecha Fin</Label>
              <Input type="date" {...register("proyectoEncargado.fechaFin")} />
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end gap-5">
          <Button variant="sidebar" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...
              </>
            ) : (
              "💾 Guardar Proyecto Completo"
            )}
          </Button>
          <Button
            variant="default"
            type="button"
            onClick={() => navigate("/proyecto")}
          >
            Cancelar
          </Button>
        </CardFooter>
      </form>
    </>
  );
}
