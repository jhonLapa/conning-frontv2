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
} from "@/services/planilla.service";
import { getProyectosActivos } from "@/services/proyecto.service";
import { getRegimenesActivos } from "@/services/regimen.service";
import {
  getTrabajadoresActivos,
  getDetallePlanillaTrabajador,
} from "@/services/trabajador.service";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

/* ============================================================
   Tipos
   ============================================================ */
interface Concepto {
  idConcepto: number;
  nombreConcepto: string;
  valor: number;
  tipoConcepto: "INGRESO" | "DESCUENTO";
}

interface Regimen {
  idRegimen: number;
  nombre: string;
  tipo: string;
  comision?: number | null;
  prima?: number | null;
  aporte: number;
  total: number;
  tope?: number | null;
}

interface DetalleTrabajador {
  id: number;
  idTrabajador?: number;
  nombre: string;
  dias: number;
  horas60?: number;
  horas100?: number;
  indemnizacion?: number;
  montoTotal: number;
  totalDescuentos?: number;
  totalNeto?: number;
  conceptos?: Concepto[];
  regimen?: Regimen | null; // ✅ ahora acepta null y tiene todos los campos reales
}

interface Aporte {
  id: number;
  tipo: string;
  monto: number;
}
/* ============================================================
   Componente principal
   ============================================================ */
export default function PlanillaIdPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [planilla, setPlanilla] = useState<Planilla | null>(null);

  const [proyectos, setProyectos] = useState<
    { idProyecto: number; nombre: string }[]
  >([]);
  const [trabajadores, setTrabajadores] = useState<
    {
      idTrabajador: number;
      apellidosNombres: string;
      categoria?: {
        idCategoria: number;
        nombre: string;
      } | null;
    }[]
  >([]);
  const [, setRegimenes] = useState<{ idRegimen: number; nombre: string }[]>(
    []
  );

  const [detalles, setDetalles] = useState<DetalleTrabajador[]>([]);
  const [aportes, setAportes] = useState<Aporte[]>([]);
  const [totalPlanilla, setTotalPlanilla] = useState<number>(0);

  const { register, handleSubmit, setValue, formState } =
    useForm<PlanillaRequest>({
      defaultValues: {
        planilla: {
          idPlanilla: 0,
          idProyecto: 0,
          mes: "",
          fechaPago: "",
          frecuenciaPago: "",
        },
        detalle: [],
        aportes: [],
      },
    });
  /* ============================================================
     Cargar datos iniciales
     ============================================================ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proyRes, trabRes, regRes] = await Promise.allSettled([
          getProyectosActivos(),
          getTrabajadoresActivos(),
          getRegimenesActivos(),
        ]);

        if (proyRes.status === "fulfilled") setProyectos(proyRes.value);
        else console.warn("⚠️ No se pudieron cargar proyectos");

        if (trabRes.status === "fulfilled") setTrabajadores(trabRes.value);
        else console.warn("⚠️ No se pudieron cargar trabajadores");

        if (regRes.status === "fulfilled") {
          setRegimenes(regRes.value);
          setAportes((prev) =>
            prev.length > 0
              ? prev
              : regRes.value.map((r) => ({
                  id: r.idRegimen,
                  tipo: r.nombre,
                  monto: 0,
                }))
          );
        } else console.warn("⚠️ No se pudieron cargar regímenes");
      } catch (err) {
        console.error("Error inesperado en carga inicial:", err);
        toast.warning("Error al cargar datos iniciales");
      }
    };

    fetchData();
  }, []);

  /* ============================================================
   Cargar planilla si estamos en modo edición
   ============================================================ */
  useEffect(() => {
    if (!id || id === "nuevo") return;

    const fetchPlanilla = async () => {
      try {
        const data = await getFetchPlanillaById(Number(id));
        setPlanilla(data);

        // ✅ Datos generales
        setValue("planilla.idProyecto", data.idProyecto);
        setValue("planilla.mes", data.mes);
        setValue("planilla.fechaPago", data.fechaPago.split("T")[0]);
        setValue("planilla.frecuenciaPago", data.frecuenciaPago);

        // ✅ Detalles base
        const detallesData = data.detalles ?? [];
        if (detallesData.length > 0) {
          setDetalles(
            detallesData.map((d) => ({
              id: d.idDetallePlanilla,
              idTrabajador: d.idTrabajadorProyecto,
              nombre: "",
              dias: d.diasTrabajados,
              horas60: d.horas60 ?? 0,
              horas100: d.horas100 ?? 0,
              totalHoras: d.horas60 + d.horas100,
              indemnizacion: d.indemnizacion ?? 0,
              montoTotal: d.totalMonto ?? 0,
              totalDescuentos: d.totalDescuentos ?? 0,
              totalNeto: (d.totalMonto ?? 0) - (d.totalDescuentos ?? 0),
              conceptos: [], // ✅ vacío por defecto
              regimen: undefined, // ✅ null inicial
            }))
          );

          // Total inicial
          const total = detallesData.reduce(
            (acc, x) => acc + ((x.totalMonto ?? 0) - (x.totalDescuentos ?? 0)),
            0
          );
          setTotalPlanilla(Number(total.toFixed(2)));
        }

        // ✅ Aportes existentes
        const aportesData = data.aportesPlanilla ?? [];
        if (aportesData.length > 0) {
          setAportes(
            aportesData.map((a) => ({
              id: a.idAportePlanilla,
              tipo: a.tipoAporte,
              monto: a.monto,
            }))
          );
        }

        // ✅ Cargar conceptos/regímenes reales de cada trabajador
        if (detallesData.length > 0) {
          for (const d of detallesData) {
            try {
              const result = await getDetallePlanillaTrabajador(
                d.idTrabajadorProyecto
              );
              const detalle = result.data;

              setDetalles((prev) =>
                prev.map((p) =>
                  p.id === d.idDetallePlanilla
                    ? {
                        ...p,
                        nombre: detalle?.apellidosNombres ?? "",
                        conceptos: detalle?.conceptos ?? [],
                        regimen: detalle?.regimen ?? null,
                      }
                    : p
                )
              );

              // 🔄 Recalcular con datos completos
              recalcularMonto(d.idDetallePlanilla);
            } catch {
              console.warn(
                `⚠️ No se pudo cargar detalle del trabajador ${d.idTrabajadorProyecto}`
              );
            }
          }
        }

        toast.success("✅ Datos de planilla cargados correctamente");
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar los datos de la planilla");
      }
    };

    fetchPlanilla();
  }, [id, setValue]);

  useEffect(() => {
    if (!planilla || detalles.length === 0) return;

    const incompletos = detalles.filter(
      (d) =>
        (d.conceptos?.length ?? 0) > 0 && // ✅ seguro y limpio
        d.regimen &&
        (d.montoTotal === 0 || d.totalNeto === 0)
    );
    if (incompletos.length === 0) return;

    incompletos.forEach((d) => {
      recalcularMonto(d.id);
    });
  }, [planilla]);

  useEffect(() => {
    if (detalles.length === 0) {
      setTotalPlanilla(0);
      return;
    }

    const total = detalles.reduce((acc, d) => acc + (d.totalNeto ?? 0), 0);
    setTotalPlanilla(Number(total.toFixed(2)));
  }, [detalles]);

  /* ============================================================
     Obtener detalle trabajador
     ============================================================ */
  const obtenerDetalleTrabajador = async (
    idTrabajador: number,
    idLocal: number
  ) => {
    try {
      const result = await getDetallePlanillaTrabajador(idTrabajador);
      const detalle = result.data;

      setDetalles((prev) =>
        prev.map((d) =>
          d.id === idLocal
            ? {
                id: d.id,
                idTrabajador,
                nombre: detalle?.apellidosNombres ?? "",
                dias: 0,
                montoTotal: 0,
                totalDescuentos: 0,
                totalNeto: 0,
                conceptos: detalle?.conceptos ?? [],
                regimen: detalle?.regimen,
              }
            : d
        )
      );

      // 🔄 Recalcular después de que React actualice el estado
      setTimeout(() => {
        recalcularMonto(idLocal);
      }, 150);

      toast.success(`${detalle?.apellidosNombres} cargado correctamente`);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener detalle del trabajador");
    }
  };

  /* ============================================================
     Agregar / eliminar trabajador
     ============================================================ */
  const agregarTrabajador = () => {
    setDetalles((prev) => [
      ...prev,
      {
        id: Date.now(),
        idTrabajador: undefined,
        nombre: "",
        dias: 0,
        horas60: 0,
        horas100: 0,
        indemnizacion: 0,
        montoTotal: 0,
        totalDescuentos: 0,
        totalNeto: 0,
        conceptos: [],
        regimen: undefined,
      },
    ]);
  };

  const eliminarTrabajador = (id: number) => {
    setDetalles((prev) => {
      // Filtra el trabajador eliminado
      const actualizados = prev.filter((d) => d.id !== id);

      // 💵 Recalcular total de planilla general
      const total = actualizados.reduce(
        (acc, x) => acc + (x.totalNeto ?? 0),
        0
      );
      setTotalPlanilla(Number(total.toFixed(2)));

      // 🧾 Recalcular aportes ONP / AFP / CONAFOVICER
      recalcularAportesGlobales(actualizados);

      // 🔁 Retornar el nuevo estado actualizado
      return actualizados;
    });
  };

  const recalcularMonto = (id: number) => {
    setDetalles((prev) => {
      const actualizados = prev.map((d) => {
        if (d.id !== id) return d;

        const dias = Math.max(d.dias ?? 0, 0);
        const h60 = Math.max(d.horas60 ?? 0, 0);
        const h100 = Math.max(d.horas100 ?? 0, 0);
        const hIndem = Math.max(d.indemnizacion ?? 0, 0);

        if (dias === 0) {
          return { ...d, montoTotal: 0, totalDescuentos: 0, totalNeto: 0 };
        }

        // ============================================================
        // 🧮 Eliminar duplicados por nombreConcepto
        // ============================================================
        const conceptosUnicos = Array.from(
          new Map(d.conceptos?.map((c) => [c.nombreConcepto, c])).values()
        );

        // ============================================================
        // 💰 Calcular total de ingresos (Bruto)
        // ============================================================
        const totalIngresos =
          (conceptosUnicos.reduce((acc, c) => {
            if (c.tipoConcepto !== "INGRESO") return acc;

            // Excluir horas extras
            if (
              [
                "horaExtraSimple",
                "horaExtra60",
                "horaExtra100",
                "horaExtraIndemnizacion",
              ].includes(c.nombreConcepto)
            )
              return acc;

            const nombreNormalizado = c.nombreConcepto
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");

            let multiplicador = 1;
            switch (nombreNormalizado) {
              case "salariobasico":
              case "dso":
              case "buc":
              case "movilidad":
              case "indemnizacion":
              case "vacaciones":
                multiplicador = dias;
                break;
              case "gratificacion":
              case "bextraessalud":
                multiplicador = 7;
                break;
            }

            // 🔹 Redondear cada subtotal individual
            const subtotal = Number((c.valor * multiplicador).toFixed(2));
            return acc + subtotal;
          }, 0) ?? 0) +
          Number(
            (
              h60 *
                (d.conceptos?.find((x) => x.nombreConcepto === "horaExtra60")
                  ?.valor ?? 0) +
              h100 *
                (d.conceptos?.find((x) => x.nombreConcepto === "horaExtra100")
                  ?.valor ?? 0) +
              hIndem *
                (d.conceptos?.find(
                  (x) => x.nombreConcepto === "horaExtraIndemnizacion"
                )?.valor ?? 0)
            ).toFixed(2)
          );

        const totalBruto = Number(totalIngresos.toFixed(2));

        // ============================================================
        // 📉 Base imponible (solo conceptos afectos a ONP / CONAFOVICER)
        // ============================================================
        const conceptosAfectos = [
          "salariobasico",
          "dso",
          "buc",
          "indemnizacion",
        ];

        const baseImponible = conceptosUnicos.reduce((acc, c) => {
          const nombreNormalizado = c.nombreConcepto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          if (
            c.tipoConcepto === "INGRESO" &&
            conceptosAfectos.includes(nombreNormalizado)
          ) {
            const subtotal = Number((c.valor * dias).toFixed(2));
            return acc + subtotal;
          }
          return acc;
        }, 0);

        // ============================================================
        // 📉 Descuentos de ley (ONP / AFP / CONAFOVICER)
        // ============================================================
        let descuentoOnp = 0;
        let descuentoConafovicer = 0;
        let descuentoTotal = 0;
        if (d.regimen?.tipo?.toUpperCase() === "ONP") {
          descuentoOnp = Number(((baseImponible * 13) / 100).toFixed(2));
          descuentoConafovicer = Number(((baseImponible * 2) / 100).toFixed(2));
          descuentoTotal = Number(
            (descuentoOnp + descuentoConafovicer).toFixed(2)
          );
        }
        // ✅ Aquí el cambio
        else if (d.regimen?.tipo?.toUpperCase().startsWith("AFP")) {
          descuentoTotal = Number(
            ((baseImponible * (d.regimen.total ?? 12.9)) / 100).toFixed(2)
          );
        }

        const totalNeto = Number((totalBruto - descuentoTotal).toFixed(2));

        // ============================================================
        // 📦 Retornar valores actualizados
        // ============================================================
        return {
          ...d,
          montoTotal: totalBruto,
          totalDescuentos: descuentoTotal,
          totalNeto: totalNeto,
        };
      });

      // ============================================================
      // 💵 Total Planilla General
      // ============================================================
      const total = actualizados.reduce(
        (acc, x) => acc + (x.totalNeto ?? 0),
        0
      );
      setTotalPlanilla(Number(total.toFixed(2)));

      // 🧾 Recalcular aportes ONP / AFP / CONAFOVICER
      recalcularAportesGlobales(actualizados);

      return actualizados;
    });
  };

  const recalcularAportesGlobales = (
    detallesActualizados: DetalleTrabajador[]
  ) => {
    let totalOnp = 0;
    let totalConafovicer = 0;
    let totalAfpHabitat = 0;
    let totalAfpPrima = 0;
    let totalAfpIntegra = 0;
    let totalAfpProfuturo = 0;

    for (const d of detallesActualizados) {
      if (!d.regimen?.tipo) continue;

      const tipo = d.regimen.tipo.toUpperCase();
      const nombreRegimen = d.regimen.nombre?.toUpperCase() ?? "";
      const baseImponible = d.montoTotal + (d.totalDescuentos ?? 0);

      if (tipo === "ONP") {
        const onp = (baseImponible * 13) / 100;
        const cona = (baseImponible * 2) / 100;
        totalOnp += onp;
        totalConafovicer += cona;
      } else if (tipo === "AFP") {
        const aporte = (baseImponible * (d.regimen.total ?? 12.9)) / 100;

        if (nombreRegimen.includes("HABITAT")) totalAfpHabitat += aporte;
        else if (nombreRegimen.includes("PRIMA")) totalAfpPrima += aporte;
        else if (nombreRegimen.includes("INTEGRA")) totalAfpIntegra += aporte;
        else if (nombreRegimen.includes("PROFUTURO"))
          totalAfpProfuturo += aporte;
      }
    }

    setAportes([
      { id: 1, tipo: "ONP", monto: Number(totalOnp.toFixed(2)) },
      {
        id: 2,
        tipo: "CONAFOVICER",
        monto: Number(totalConafovicer.toFixed(2)),
      },
      { id: 3, tipo: "AFP HABITAT", monto: Number(totalAfpHabitat.toFixed(2)) },
      { id: 4, tipo: "AFP PRIMA", monto: Number(totalAfpPrima.toFixed(2)) },
      { id: 5, tipo: "AFP INTEGRA", monto: Number(totalAfpIntegra.toFixed(2)) },
      {
        id: 6,
        tipo: "AFP PROFUTURO",
        monto: Number(totalAfpProfuturo.toFixed(2)),
      },
    ]);
  };

  /* ============================================================
     Guardar planilla
     ============================================================ */
  const onSubmit = async (form: PlanillaRequest) => {
    const payload: PlanillaRequest = {
      planilla: {
        idPlanilla: planilla?.idPlanilla ?? 0,
        idProyecto: form.planilla.idProyecto,
        mes: form.planilla.mes,
        periodoInicio: new Date().toISOString(),
        periodoFin: new Date().toISOString(),
        fechaPago: form.planilla.fechaPago,
        usuarioCreacion: "ADMIN",
        frecuenciaPago: form.planilla.frecuenciaPago,
        totalGeneral: totalPlanilla,
      },

      detalle: detalles.map((d) => ({
        idPlanilla: planilla?.idPlanilla ?? 0,
        idTrabajadorProyecto: d.idTrabajador ?? 0,
        diasTrabajados: d.dias,
        horasTrabajadas: (d.horas60 ?? 0) + (d.horas100 ?? 0),
        totalMonto: d.montoTotal ?? 0,
        totalHoras:
          (d.horas60 ?? 0) + (d.horas100 ?? 0) + (d.indemnizacion ?? 0),
        totalDescuentos: d.totalDescuentos ?? 0,
        usuarioCreacion: "ADMIN",

        // ✅ campos requeridos por la interfaz
        horas60: d.horas60 ?? 0,
        horas100: d.horas100 ?? 0,
        indemnizacion: d.indemnizacion ?? 0,
      })),

      aportes: aportes.map((a) => ({
        idPlanilla: planilla?.idPlanilla ?? 0,
        tipoAporte: a.tipo,
        monto: a.monto ?? 0,
        fechaVencimiento: new Date().toISOString(),
        fechaPago: new Date().toISOString(),
      })),
    };
    try {
      const res = await postPlanilla(payload);
      if (!res.success) {
        toast.error("Error al guardar la planilla");
        return;
      }

      toast.success("✅ Planilla guardada correctamente");
      navigate("/planilla");
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar la solicitud");
    }
  };

  /* ============================================================
     Render del formulario
     ============================================================ */
  return (
    <>
      <HeaderPage
        title={id === "nuevo" ? "Nueva Planilla" : "Editar Planilla"}
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
            <div>
              <Label>Proyecto</Label>
              <select
                {...register("planilla.idProyecto", { valueAsNumber: true })}
                className="w-full border rounded p-2"
              >
                <option value="">Seleccione Proyecto</option>
                {proyectos.map((p) => (
                  <option key={p.idProyecto} value={p.idProyecto}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Mes</Label>
              <Input
                type="month"
                {...register("planilla.mes")}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <Label>Fecha de Pago</Label>
              <Input type="date" {...register("planilla.fechaPago")} />
            </div>
            <div>
              <Label>Frecuencia</Label>
              <select
                {...register("planilla.frecuenciaPago")}
                className="w-full border rounded p-2"
              >
                <option value="MENSUAL">Mensual</option>
                <option value="QUINCENAL">Quincenal</option>
                <option value="SEMANAL">Semanal</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 👥 Detalle de trabajadores */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Trabajadores</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Trabajador</th>
                  <th className="p-2 w-20">Días</th>
                  <th className="p-2 w-20">horas 60%</th>
                  <th className="p-2 w-20">horas 100%</th>
                  <th className="p-2 w-24">horas Indem.</th>
                  <th className="p-2 w-24 text-right">Bruto</th>
                  <th className="p-2 w-24 text-right">Descuento</th>
                  <th className="p-2 w-24 text-right">Neto</th>
                  <th className="p-2 w-16 text-center">❌</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((item) => (
                  <tr key={item.id} className="border-t">
                    {/* Trabajador */}
                    <td className="p-2">
                      <select
                        value={item.idTrabajador ?? ""}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val) obtenerDetalleTrabajador(val, item.id);
                          else eliminarTrabajador(item.id);
                        }}
                        className="w-full border rounded p-2"
                      >
                        <option value="">Seleccione</option>
                        {trabajadores.map((t) => (
                          <option key={t.idTrabajador} value={t.idTrabajador}>
                            {t.apellidosNombres} -{" "}
                            {t.categoria?.nombre ?? "Sin categoría"}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Campos de horas y días */}
                    {["dias", "horas60", "horas100", "indemnizacion"].map(
                      (campo) => (
                        <td className="p-2" key={campo}>
                          {[
                            "dias",
                            "horas60",
                            "horas100",
                            "indemnizacion",
                          ].includes(campo) && (
                            <Input
                              type="number"
                              value={
                                Number(
                                  item[campo as keyof DetalleTrabajador]
                                ) || ""
                              }
                              onChange={(e) => {
                                const raw = e.target.value;
                                const val =
                                  raw === "" ? 0 : Math.max(Number(raw), 0);

                                setDetalles((prev) =>
                                  prev.map((d) =>
                                    d.id === item.id
                                      ? { ...d, [campo]: val }
                                      : d
                                  )
                                );

                                if (raw !== "") recalcularMonto(item.id);
                              }}
                            />
                          )}
                        </td>
                      )
                    )}

                    {/* Bruto, Descuento, Neto */}
                    <td className="p-2 text-right font-semibold text-gray-700">
                      S/ {item.montoTotal.toFixed(2)}
                    </td>
                    <td className="p-2 text-right text-red-500 font-semibold">
                      -S/ {(item.totalDescuentos ?? 0).toFixed(2)}
                    </td>
                    <td className="p-2 text-right text-green-700 font-bold">
                      S/ {(item.totalNeto ?? 0).toFixed(2)}
                    </td>

                    <td className="text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => eliminarTrabajador(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 🧾 Total General */}
            <div className="flex justify-between items-center border-t mt-4 pt-3 text-lg font-semibold">
              <span>💰 Total Planilla:</span>
              <span className="text-green-700 font-bold text-2xl">
                S/ {totalPlanilla.toFixed(2)}
              </span>
            </div>

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

        {/* Aportes */}
        <Card>
          <CardHeader>
            <CardTitle>Aportes calculados automáticamente</CardTitle>
          </CardHeader>
          <CardContent>
            {aportes.map((a, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-1 mb-1 text-sm font-semibold"
              >
                <span>{a.tipo}</span>
                <span>S/ {a.monto.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <CardFooter className="flex justify-end gap-4">
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/planilla")}
          >
            Cancelar
          </Button>
        </CardFooter>
      </form>
    </>
  );
}
