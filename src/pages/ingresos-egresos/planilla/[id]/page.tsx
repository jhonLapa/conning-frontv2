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
import { getRegimenesActivos } from "@/services/regimen.service";
import { getTrabajadoresActivos } from "@/services/trabajador.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface DetalleTrabajador {
  id: number;
  idTrabajador?: number;
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
  const [trabajadores, setTrabajadores] = useState<
    { idTrabajador: number; apellidosNombres: string }[]
  >([]);
  const [regimenes, setRegimenes] = useState<
    { idRegimen: number; nombre: string }[]
  >([]);

  const [loadingProyectos, setLoadingProyectos] = useState(true);
  const [loadingTrabajadores, setLoadingTrabajadores] = useState(true);
  const [loadingRegimenes, setLoadingRegimenes] = useState(true);

  const title = id == "nuevo" ? "Nueva Planilla" : "Editar Planilla";

  // Datos internos
  const [detalles, setDetalles] = useState<DetalleTrabajador[]>([]);
  const [aportes, setAportes] = useState<Aporte[]>([]);

  // Cargar datos desde los servicios reales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proyData, trabData, regData] = await Promise.all([
          getProyectosActivos(),
          getTrabajadoresActivos(),
          getRegimenesActivos(),
        ]);
        setProyectos(proyData);
        setTrabajadores(trabData);
        setRegimenes(regData);

        const aportesIniciales = regData.map((r) => ({
          id: r.idRegimen,
          tipo: r.nombre,
          monto: 0,
        }));
        setAportes(aportesIniciales);
      } catch (error) {
        console.error("Error al cargar datos iniciales", error);
        toast.warning("Error al cargar datos iniciales");
      } finally {
        setLoadingProyectos(false);
        setLoadingTrabajadores(false);
        setLoadingRegimenes(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Formulario principal
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

  // Helpers
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

        {/* Detalle de Trabajadores */}
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
                      <select
                        value={item.idTrabajador ?? ""}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const nombreSeleccionado =
                            trabajadores.find((t) => t.idTrabajador === val)
                              ?.apellidosNombres || "";
                          setDetalles(
                            detalles.map((d) =>
                              d.id === item.id
                                ? {
                                    ...d,
                                    idTrabajador: val,
                                    nombre: nombreSeleccionado,
                                  }
                                : d
                            )
                          );
                        }}
                        className="w-full border rounded p-2"
                      >
                        <option value="">Seleccione</option>
                        {loadingTrabajadores ? (
                          <option>Cargando...</option>
                        ) : (
                          trabajadores.map((t) => (
                            <option key={t.idTrabajador} value={t.idTrabajador}>
                              {t.apellidosNombres}
                            </option>
                          ))
                        )}
                      </select>
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

        {/*Aportes */}
        <Card>
          <CardHeader>
            <CardTitle>Aportes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRegimenes ? (
              <p className="p-3 text-sm text-center">Cargando aportes...</p>
            ) : regimenes.length === 0 ? (
              <p className="p-3 text-sm text-center">
                No hay regímenes activos
              </p>
            ) : (
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
            )}
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
