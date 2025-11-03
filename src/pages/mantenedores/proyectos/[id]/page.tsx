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
import { CheckCircle2, XCircle } from "lucide-react";

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
    fechaFin: string | null;
    frecuenciaPago: string;
    usuarioCreacion: string;
  };
  trabajador: {
    idTrabajador: number;
    fechaInicio: string;
    fechaFin: string | null;
    usuarioCreacion: string;
  }[];
  sindicato: {
    mes: string;
    monto: number;
    fechaPago: string;
    usuarioCreacion: string;
  }[];
  // 👇 antes era obligatorio, ahora lo hacemos opcional
  proyectoEncargado?: {
    idTrabajador: number;
    rol: string;
    fechaInicio: string;
    fechaFin: string | null;
  } | null;
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
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProyectoFormData>({
    defaultValues: {
      proyecto: {
        idCliente: 0,
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        frecuenciaPago: "MENSUAL",
        usuarioCreacion: "ADMIN",
      },
      trabajador: [],
      sindicato: [],
      proyectoEncargado: null, // 👈 ahora puede ser null
    },
  });

  const {
    fields: trabajadores,
    append: addTrabajador,
    remove: removeTrabajador,
    replace: replaceTrabajadores, // 👈 agrega esta
  } = useFieldArray({ control, name: "trabajador" });

  const {
    fields: sindicatos,
    append: addSindicato,
    remove: removeSindicato,
    replace: replaceSindicatos, // 👈 agrega esta
  } = useFieldArray({ control, name: "sindicato" });

  const [trabajadoresActivos, setTrabajadoresActivos] = useState<
    { idTrabajador: number; apellidosNombres: string }[]
  >([]);
  const [loadingTrabajadores, setLoadingTrabajadores] = useState(true);
  const [hasEncargado, setHasEncargado] = useState(false);

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
    if (!id || id === "nuevo") return;

    const parseDate = (value?: string | Date | null): string => {
      if (!value) return "";
      if (value instanceof Date) return value.toISOString().split("T")[0];
      if (typeof value === "string") return value.split("T")[0];
      return "";
    };

    const fetchProyecto = async () => {
      setLoading(true);

      try {
        const data = await getFechtProyectoById(Number(id));
        data.idCliente = Number(data.idCliente ?? 0);

        const encargado = data.proyectoEncargado?.[0];
        const tieneEncargado = !!(
          encargado &&
          encargado.idTrabajador > 0 &&
          encargado.fechaInicio
        );

        // 👇 reemplazar arrays correctamente en edición
        replaceTrabajadores(
          (data.trabajadores ?? []).map((t: TrabajadorProyectoCreate) => ({
            idTrabajador: t.idTrabajador ?? 0,
            fechaInicio: parseDate(t.fechaInicio),
            fechaFin: parseDate(t.fechaFin),
            usuarioCreacion: "ADMIN",
          }))
        );

        replaceSindicatos(
          (data.aportesSindicato ?? []).map((s: SindicatoDto) => ({
            mes: s.mes ?? "",
            monto: s.monto ?? 0,
            fechaPago: parseDate(s.fechaPago),
            usuarioCreacion: "ADMIN",
          }))
        );

        reset({
          proyecto: {
            idProyecto: data.idProyecto ?? 0,
            idCliente: Number(data.idCliente ?? 0),
            nombre: data.nombre ?? "",
            descripcion: data.descripcion ?? "",
            fechaInicio: parseDate(data.fechaInicio),
            fechaFin: parseDate(data.fechaFin),
            frecuenciaPago: data.frecuenciaPago ?? "MENSUAL",
            usuarioCreacion: "ADMIN",
          },
          trabajador:
            (data.trabajadores ?? []).map((t: TrabajadorProyectoCreate) => ({
              idTrabajador: t.idTrabajador ?? 0,
              fechaInicio: parseDate(t.fechaInicio),
              fechaFin: parseDate(t.fechaFin),
              usuarioCreacion: "ADMIN",
            })) ?? [],
          sindicato:
            (data.aportesSindicato ?? []).map((s: SindicatoDto) => ({
              mes: s.mes ?? "",
              monto: s.monto ?? 0,
              fechaPago: parseDate(s.fechaPago),
              usuarioCreacion: "ADMIN",
            })) ?? [],
          proyectoEncargado: encargado
            ? {
                idTrabajador: encargado.idTrabajador ?? 0,
                rol: encargado.rol ?? "",
                fechaInicio: parseDate(encargado.fechaInicio),
                fechaFin: parseDate(encargado.fechaFin),
              }
            : null,
        });

        // ✅ si hay encargado, activar el bloque visual
        setHasEncargado(tieneEncargado);
      } catch (error) {
        console.error(error);
        toast.error("❌ Error al cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [id, reset]);

  const onSubmit = async (data: ProyectoFormData) => {
    setLoading(true);
    try {
      // 👇 solo incluir encargado si tiene datos válidos

      const errores: string[] = [];

      // 📌 Validar encargado si el checkbox está activo
      if (hasEncargado) {
        const encargado = data.proyectoEncargado;
        if (!encargado || !encargado.fechaInicio) {
          errores.push("El encargado debe tener una fecha de inicio válida.");
        }
        if (!encargado?.idTrabajador || encargado.idTrabajador <= 0) {
          errores.push("Debe seleccionar un encargado de proyecto.");
        }
      }

      // 📌 Validar que todos los trabajadores tengan fecha de inicio
      data.trabajador.forEach((t, index) => {
        if (!t.fechaInicio) {
          errores.push(
            `El trabajador N°${index + 1} debe tener una fecha de inicio.`
          );
        }
      });

      // 📌 Si hay errores, mostrar alerta y detener envío
      if (errores.length > 0) {
        toast.error(
          <div>
            <strong>Corrige los siguientes errores:</strong>
            <ul className="list-disc ml-5 mt-1">
              {errores.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>,
          { position: "top-right" }
        );
        setLoading(false);
        return;
      }

      const payload: ProyectoFormData = {
        ...data,
        proyecto: {
          ...data.proyecto,
          idProyecto:
            data.proyecto.idProyecto && data.proyecto.idProyecto > 0
              ? data.proyecto.idProyecto
              : id
              ? Number(id)
              : 0,
          fechaFin: data.proyecto.fechaFin || null,
        },
        // ✅ Solo enviamos trabajadores si el usuario los modificó o agregó
        ...(id === "nuevo" || (data.trabajador && data.trabajador.length > 0)
          ? {
              trabajador: data.trabajador.map((t) => ({
                ...t,
                fechaFin: t.fechaFin || null,
              })),
            }
          : {}), // 👈 en edición, si está vacío, NO lo enviamos
        // ✅ Igual para sindicato, si quieres mismo comportamiento
        ...(id === "nuevo" || (data.sindicato && data.sindicato.length > 0)
          ? { sindicato: data.sindicato }
          : {}),
        proyectoEncargado: hasEncargado
          ? {
              ...data.proyectoEncargado!,
              fechaFin: data.proyectoEncargado?.fechaFin || null,
            }
          : null,
      };
      const response = await postProyectoCompleto(payload);

      // ⚠️ Validar respuesta
      if (!response?.success) {
        return; // ❌ No redirigir si hubo error
      }

      // ✅ Éxito
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>{response.message}</span>
        </div>,
        { position: "top-right" }
      );

      // 🕒 Pequeña pausa antes de redirigir (para que se vea el toast)
      setTimeout(() => {
        navigate("/proyecto");
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>❌ Error inesperado al guardar el proyecto</span>
        </div>,
        { position: "top-right" }
      );
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
            {/* Cliente */}
            <div>
              <Label>Cliente *</Label>
              <select
                {...register("proyecto.idCliente", {
                  valueAsNumber: true,
                  required: "El cliente es obligatorio",
                  min: { value: 1, message: "Debe seleccionar un cliente" },
                })}
                className="w-full border rounded p-2"
              >
                <option value={0}>Seleccione Cliente</option>
                {loadingClientes && <option>Cargando...</option>}
                {clientes.map((c) => (
                  <option key={c.idCliente} value={c.idCliente}>
                    {c.nombreCompleto}
                  </option>
                ))}
              </select>
              {errors?.proyecto?.idCliente && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.proyecto.idCliente.message}
                </p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <Label>Nombre *</Label>
              <Input
                {...register("proyecto.nombre", {
                  required: "El nombre es obligatorio",
                })}
              />
              {errors?.proyecto?.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.proyecto.nombre.message}
                </p>
              )}
            </div>

            {/* Fecha Inicio */}
            <div>
              <Label>Fecha Inicio *</Label>
              <Input
                type="date"
                {...register("proyecto.fechaInicio", {
                  required: "La fecha de inicio es obligatoria",
                })}
              />
              {errors?.proyecto?.fechaInicio && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.proyecto.fechaInicio.message}
                </p>
              )}
            </div>

            {/* Fecha Fin (opcional) */}
            <div>
              <Label>Fecha Fin</Label>
              <Input type="date" {...register("proyecto.fechaFin")} />
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
                  usuarioCreacion: "ADMIN",
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
                  mes: "",
                  monto: 0,
                  fechaPago: "",
                  usuarioCreacion: "ADMIN",
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
                    type="month"
                    {...register(`sindicato.${i}.mes` as const)}
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
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg font-light text-gray-500">
              🧑‍💼 Encargado del Proyecto
            </CardTitle>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasEncargado}
                onChange={(e) => setHasEncargado(e.target.checked)}
              />
              <span>Agregar encargado</span>
            </label>
          </CardHeader>

          {hasEncargado && (
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
                <Input
                  type="date"
                  {...register("proyectoEncargado.fechaFin")}
                />
              </div>
            </CardContent>
          )}
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
