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
import { Loader2, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  postProyectoCompleto,
  getFechtProyectoById,
} from "@/services/proyecto.service";
import { getClientesActivos } from "@/services/cliente.service";
import { SindicatoDto, TrabajadorProyectoCreate } from "@/interfaces";
import { getTrabajadoresActivos } from "@/services/trabajador.service";

/* ============================================================
   Tipos del formulario
   ============================================================ */
interface ProyectoFormData {
  proyecto: {
    idProyecto?: number;
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
   Página principal
   ============================================================ */
export default function ProyectoCompletoIdPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const title = id ? "Editar Proyecto" : "Registrar Proyecto Completo";
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<
    { idCliente: number; nombreCompleto: string }[]
  >([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  // 🧩 Formulario
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

  const {
    fields: trabajadores,
    append: addTrabajador,
    remove: removeTrabajador,
  } = useFieldArray({ control, name: "trabajador" });

  const {
    fields: sindicatos,
    append: addSindicato,
    remove: removeSindicato,
  } = useFieldArray({ control, name: "sindicato" });

  const [trabajadoresActivos, setTrabajadoresActivos] = useState<
    { idTrabajador: number; apellidosNombres: string }[]
  >([]);
  const [loadingTrabajadores, setLoadingTrabajadores] = useState(true);

  /* ============================================================
     🟢 Cargar clientes activos
     ============================================================ */
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientesActivos();
        setClientes(data);
      } catch (error) {
        console.error("Error cargando clientes", error);
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const data = await getTrabajadoresActivos();
        setTrabajadoresActivos(data);
      } catch (error) {
        console.error("Error al cargar trabajadores", error);
      } finally {
        setLoadingTrabajadores(false);
      }
    };

    fetchTrabajadores();
  }, []);

  /* ============================================================
     🟡 Cargar proyecto si estamos en edición
     ============================================================ */
  useEffect(() => {
    if (!id) return;

    const parseDate = (value?: string | Date | null): string => {
      if (!value) return "";
      if (value instanceof Date) {
        // Convierte el Date a formato YYYY-MM-DD
        return value.toISOString().split("T")[0];
      }
      if (typeof value === "string") {
        // Si ya es string ISO, recorta solo la fecha
        return value.split("T")[0];
      }
      return "";
    };

    const fetchProyecto = async () => {
      setLoading(true);
      try {
        const data = await getFechtProyectoById(Number(id));

        reset({
          proyecto: {
            idProyecto: data.idProyecto,
            idCliente: data.idCliente,
            nombre: data.nombre ?? "",
            descripcion: data.descripcion ?? "",
            fechaInicio: parseDate(data.fechaInicio),
            fechaFin: parseDate(data.fechaFin),
            frecuenciaPago: data.frecuenciaPago ?? "Mensual",
            estado: data.estado ?? 1,
            usuarioCreacion: "jcotos",
          },
          trabajador:
            (data.trabajadores ?? []).map((t: TrabajadorProyectoCreate) => ({
              idTrabajador: t.idTrabajador ?? 0,
              fechaInicio: parseDate(t.fechaInicio),
              fechaFin: parseDate(t.fechaFin),
              estado: t.estado ?? 1,
              usuarioCreacion: "jcotos",
            })) ?? [],
          sindicato:
            (data.aportesSindicato ?? []).map((s: SindicatoDto) => ({
              mes: s.mes ?? 0,
              anio: s.anio ?? new Date().getFullYear(),
              monto: s.monto ?? 0,
              fechaPago: parseDate(s.fechaPago),
              estado: s.estado ?? 1,
              usuarioCreacion: "jcotos",
            })) ?? [],
          proyectoEncargado: {
            idTrabajador: data.encargados?.[0]?.idTrabajador ?? 0,
            rol: data.encargados?.[0]?.rol ?? "",
            fechaInicio: parseDate(data.encargados?.[0]?.fechaInicio),
            fechaFin: parseDate(data.encargados?.[0]?.fechaFin),
            estado: data.encargados?.[0]?.estado ?? 1,
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("❌ Error al cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [id, reset]);

  /* ============================================================
     🔹 Guardar proyecto (nuevo o edición)
     ============================================================ */
  const onSubmit = async (data: ProyectoFormData) => {
    setLoading(true);
    try {
      const response = await postProyectoCompleto(data);

      if (!response?.message) {
        toast.warning(response.message);
        return;
      }

      toast.success(
        id
          ? "✅ Proyecto actualizado correctamente"
          : "✅ Proyecto registrado correctamente"
      );
      navigate("/proyecto");
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al guardar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🧱 Render
     ============================================================ */
  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Incluye datos del proyecto, trabajadores, aportes y encargado"
      />

      {loading && (
        <div className="text-center text-gray-500 my-4">
          <Loader2 className="inline h-5 w-5 animate-spin mr-2" />
          Cargando datos del proyecto...
        </div>
      )}

      <form
        className="flex flex-col gap-5 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* ================= Datos del Proyecto ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              🧱 Datos del Proyecto
            </CardTitle>
            <hr />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Cliente *</Label>
              <select
                {...register("proyecto.idCliente", {
                  valueAsNumber: true,
                  required: true,
                })}
                className="w-full border rounded p-2"
              >
                <option value="">Seleccione Cliente</option>
                {loadingClientes && <option>Cargando...</option>}
                {clientes.map((c) => (
                  <option key={c.idCliente} value={c.idCliente}>
                    {c.nombreCompleto}
                  </option>
                ))}
              </select>
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

        {/* ================= Trabajadores ================= */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-light text-gray-500">
              👷 Trabajadores
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            {trabajadores.map((t, i) => (
              <div
                key={t.id}
                className="grid grid-cols-5 gap-3 mb-3 items-end border-b pb-2"
              >
                <div>
                  <Label>ID Trabajador</Label>
                  <select
                    {...register(`trabajador.${i}.idTrabajador` as const, {
                      valueAsNumber: true,
                      required: true,
                    })}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Seleccione un trabajador</option>
                    {loadingTrabajadores && <option>Cargando...</option>}
                    {trabajadoresActivos.map((t) => (
                      <option key={t.idTrabajador} value={t.idTrabajador}>
                        {t.apellidosNombres}
                      </option>
                    ))}
                  </select>
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
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ================= Sindicato ================= */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-light text-gray-500">
              💰 Aportes Sindicato
            </CardTitle>
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
                    {...register(`sindicato.${i}.mes` as const)}
                  />
                </div>
                <div>
                  <Label>Año</Label>
                  <Input
                    type="number"
                    {...register(`sindicato.${i}.anio` as const)}
                  />
                </div>
                <div>
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`sindicato.${i}.monto` as const)}
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
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ================= Encargado ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              🧑‍💼 Encargado del Proyecto
            </CardTitle>
            <hr />
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <Label>ID Trabajador</Label>
              <select
                {...register("proyectoEncargado.idTrabajador", {
                  valueAsNumber: true,
                })}
                className="w-full border rounded p-2"
              >
                <option value="">Seleccione un encargado</option>
                {loadingTrabajadores && <option>Cargando...</option>}
                {trabajadoresActivos.map((t) => (
                  <option key={t.idTrabajador} value={t.idTrabajador}>
                    {t.apellidosNombres}
                  </option>
                ))}
              </select>
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

        {/* ================= Footer ================= */}
        <CardFooter className="flex justify-end gap-5">
          <Button variant="sidebar" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Guardando...
              </>
            ) : id ? (
              "💾 Actualizar Proyecto"
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
