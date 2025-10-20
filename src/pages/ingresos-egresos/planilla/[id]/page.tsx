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
import { Planilla, PlanillaRequest } from "@/interfaces/planilla";
import {
  getFetchPlanillaById,
  postPlanilla,
  putPlanilla,
} from "@/services/planilla.service";
import { getProyectosActivos } from "@/services/proyecto.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// 🧩 Nuevos tipos auxiliares para tablas internas
interface DetalleTrabajador {
  id: number;
  nombre: string;
  dias: number;
  montoTotal: number;
}

interface Aporte {
  id: number;
  tipo: string;
  monto: number;
}

export default function PlanillaIdPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [planilla, setPlanilla] = useState<Planilla | null>(null);

  const [proyectos, setProyectos] = useState<
    { idProyecto: number; nombre: string }[]
  >([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  const title = id == "nuevo" ? "Nueva Planilla" : "Editar Planilla";

  // Datos internos de detalle/aportes
  const [detalles, setDetalles] = useState<DetalleTrabajador[]>([]);
  const [aportes, setAportes] = useState<Aporte[]>([]);

  // Simula carga de aportes desde API RegimenPrevisional
  useEffect(() => {
    const fetchAportes = async () => {
      // Aquí luego reemplazas por getRegimenPrevisional()
      setAportes([
        { id: 1, tipo: "AFP", monto: 64.01 },
        { id: 2, tipo: "ONP", monto: 64.0 },
      ]);
    };
    fetchAportes();
  }, []);

  // Cargar proyectos activos
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyectosActivos();
        setProyectos(data);
      } catch (error) {
        console.error("Error cargando proyectos", error);
      } finally {
        setLoadingProyectos(false);
      }
    };
    fetchProyectos();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlanillaRequest>({
    defaultValues: {
      idProyecto: 0,
      mes: 0,
      anio: new Date().getFullYear(),
      periodoInicio: "",
      periodoFin: "",
      fechaPago: "",
      frecuenciaPago: "",
    },
  });

  const getPlanilla = async () => {
    if (id === "nuevo") return;
    const response = await getFetchPlanillaById(Number(id));
    setValue("idProyecto", response.idProyecto);
    setValue("mes", response.mes);
    setValue("anio", response.anio);
    setValue("fechaPago", response.fechaPago);
    setValue("frecuenciaPago", response.frecuenciaPago ?? "");
    setPlanilla(response);
  };

  useEffect(() => {
    getPlanilla();
  }, [id]);

  const onSubmit = async (data: PlanillaRequest) => {
    const response = planilla
      ? await putPlanilla(planilla.idPlanilla, data)
      : await postPlanilla(data);

    if (!response.success) {
      toast.warning("Error al guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    navigate("/planilla");
  };

  // 🧮 Helpers
  const agregarTrabajador = () => {
    setDetalles([
      ...detalles,
      { id: Date.now(), nombre: "", dias: 0, montoTotal: 0 },
    ]);
  };

  const eliminarTrabajador = (id: number) => {
    setDetalles(detalles.filter((d) => d.id !== id));
  };

  const eliminarAporte = (id: number) => {
    setAportes(aportes.filter((a) => a.id !== id));
  };

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Registro de planillas por proyecto"
      />

      <form
        className="flex flex-col gap-5 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 🧾 Datos generales */}
        <Card>
          <CardHeader>
            <CardTitle>Datos generales de la planilla</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Proyecto */}
            <div>
              <Label>Proyecto</Label>
              <select
                {...register("idProyecto", {
                  valueAsNumber: true,
                  required: true,
                })}
                className="w-full border rounded p-2"
              >
                <option value="">Seleccione Proyecto</option>
                {loadingProyectos ? (
                  <option>Cargando...</option>
                ) : (
                  proyectos.map((p) => (
                    <option key={p.idProyecto} value={p.idProyecto}>
                      {p.nombre}
                    </option>
                  ))
                )}
              </select>
              {errors.idProyecto && (
                <p className="msg-error">Proyecto requerido</p>
              )}
            </div>

            {/* Mes */}
            <div>
              <Label>Mes</Label>
              <Input
                type="text"
                {...register("mes", { required: true })}
                placeholder="Enero"
              />
            </div>

            {/* Año */}
            <div>
              <Label>Año</Label>
              <Input type="number" {...register("anio", { required: true })} />
            </div>

            {/* Fecha de pago */}
            <div>
              <Label>Fecha de Pago</Label>
              <Input
                type="date"
                {...register("fechaPago", { required: true })}
              />
            </div>

            {/* Frecuencia de pago */}
            <div>
              <Label>Frecuencia de Pago</Label>
              <select
                {...register("frecuenciaPago", { required: true })}
                className="w-full border rounded p-2"
              >
                <option value="MENSUAL">Mensual</option>
                <option value="QUINCENAL">Quincenal</option>
                <option value="SEMANAL">Semanal</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 👷‍♂️ Detalle de Trabajadores */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Trabajadores</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm border rounded-lg">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Trabajador</th>
                  <th className="p-2 w-20">Días</th>
                  <th className="p-2 w-32">Monto Total (S/)</th>
                  <th className="p-2 w-16 text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">
                      <Input
                        value={item.nombre}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDetalles(
                            detalles.map((d) =>
                              d.id === item.id ? { ...d, nombre: val } : d
                            )
                          );
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.dias}
                        onChange={(e) =>
                          setDetalles(
                            detalles.map((d) =>
                              d.id === item.id
                                ? { ...d, dias: Number(e.target.value) }
                                : d
                            )
                          )
                        }
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.montoTotal}
                        onChange={(e) =>
                          setDetalles(
                            detalles.map((d) =>
                              d.id === item.id
                                ? { ...d, montoTotal: Number(e.target.value) }
                                : d
                            )
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => eliminarTrabajador(item.id)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={agregarTrabajador}
            >
              + Agregar Trabajador
            </Button>
          </CardContent>
        </Card>

        {/* 💰 Aportes */}
        <Card>
          <CardHeader>
            <CardTitle>Aportes</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm border rounded-lg">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Tipo</th>
                  <th className="p-2 w-32">Monto (S/)</th>
                  <th className="p-2 w-16 text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {aportes.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-2">{a.tipo}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={a.monto}
                        onChange={(e) =>
                          setAportes(
                            aportes.map((x) =>
                              x.id === a.id
                                ? { ...x, monto: Number(e.target.value) }
                                : x
                            )
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => eliminarAporte(a.id)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/planilla")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
