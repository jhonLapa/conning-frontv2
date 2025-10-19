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

const PlanillaIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [planilla, setPlanilla] = useState<Planilla | null>(null);

  const [proyectos, setProyectos] = useState<
    { idProyecto: number; nombre: string }[]
  >([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);
  const title = id == "nuevo" ? "Nueva Planilla" : "Editar Planilla";

  useEffect(() => {
    const fetchPlanillas = async () => {
      try {
        const data = await getProyectosActivos();
        setProyectos(data);
      } catch (error) {
        console.error("Error cargando proyectos", error);
      } finally {
        setLoadingProyectos(false);
      }
    };
    fetchPlanillas();
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
      anio: 0,
      periodoInicio: "",
      periodoFin: "",
      fechaPago: "",
      frecuenciaPago: "",
    },
  });

  const getPlanila = async () => {
    if (id == "nuevo") return;

    const response = await getFetchPlanillaById(Number(id));
    setValue("idProyecto", response.idProyecto);
    setValue("mes", response.mes);
    setValue("anio", response.anio);
    setValue("periodoInicio", response.periodoInicio);
    setValue("periodoFin", response.periodoFin);
    setValue("fechaPago", response.fechaPago);
    setValue("frecuenciaPago", response.frecuenciaPago ?? "");
    //setValue("periodoTexto", response.periodoTexto);
    setPlanilla(response);
  };

  const onSubmit = async (data: PlanillaRequest) => {
    const response = planilla
      ? await putPlanilla(planilla.idPlanilla, data)
      : await postPlanilla(data);

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setPlanilla(null);
    navigate("/planilla");
    return;
  };

  useEffect(() => {
    getPlanila();
  }, [id]);

  const getTodayLocal = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <>
      <HeaderPage
        title="Datos de la planilla"
        descripcion="Informacion detallada de planillas"
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
                      {loadingProyectos && <option>Cargando...</option>}
                      {proyectos?.map((proyecto) => (
                        <option
                          key={proyecto.idProyecto}
                          value={proyecto.idProyecto}
                        >
                          {proyecto.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.idProyecto && (
                      <p className="msg-error">Proyecto requerido</p>
                    )}
                  </div>
                  <div>
                    <Label>Mes</Label>
                    <Input {...register("mes", { required: true })} />
                    {errors.mes && <p className="msg-error">Mes requerido</p>}
                  </div>
                  <div>
                    <Label>Año</Label>
                    <Input {...register("anio", { required: true })} />
                    {errors.anio && <p className="msg-error">Año requerido</p>}
                  </div>
                  <div>
                    <Label>Periodo Inicio</Label>
                    <Input
                      type="date"
                      min={getTodayLocal()}
                      {...register("periodoInicio", {
                        required: "La fecha es obligatoria",
                        validate: (value) => {
                          const today = getTodayLocal();
                          return (
                            value >= today ||
                            "La fecha no puede ser anterior a hoy"
                          );
                        },
                      })}
                    />
                    {errors.periodoInicio && (
                      <p className="msg-error">
                        {errors.periodoInicio.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Periodo Fin</Label>
                    <Input
                      type="date"
                      min={getTodayLocal()}
                      {...register("periodoFin", {
                        required: "La fecha es obligatoria",
                        validate: (value) => {
                          const today = getTodayLocal();
                          return (
                            value >= today ||
                            "La fecha no puede ser anterior a hoy"
                          );
                        },
                      })}
                    />
                    {errors.periodoFin && (
                      <p className="msg-error">{errors.periodoFin.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Fecha Pago</Label>
                    <Input
                      type="date"
                      min={getTodayLocal()}
                      {...register("fechaPago", {
                        required: "La fecha es obligatoria",
                        validate: (value) => {
                          const today = getTodayLocal();
                          return (
                            value >= today ||
                            "La fecha no puede ser anterior a hoy"
                          );
                        },
                      })}
                    />
                    {errors.fechaPago && (
                      <p className="msg-error">{errors.fechaPago.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Frecuencia</Label>
                    <select
                      {...register("frecuenciaPago", { required: true })}
                      className="w-full border rounded p-2"
                    >
                      <option value="SEMANAL">Ingreso</option>
                      <option value="QUINCENAL">Egreso</option>
                      <option value="MENSUAL">Ingreso</option>
                    </select>
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
              onClick={() => navigate("/planilla")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default PlanillaIdPage;
