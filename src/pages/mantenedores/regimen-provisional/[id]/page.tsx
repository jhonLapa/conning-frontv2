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
import { Regimen, RegimenRequest } from "@/interfaces/regimen.interface"; 
import {
    getFetchRegimenById,
    postRegimen,
    putRegimen,
} from "@/services/regimen.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface FullRegimenRequest {
    idRegimen?: number;
    nombre: string;
    tipo: string;
    comision: number | null; 
    prima: number | null; 
    aporte: number;
    total: number;
    tope: number | null;
}

const RegimenIdPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [regimen, setRegimen] = useState<Regimen | null>(null);
    const title = id === "nuevo" ? "Nuevo Régimen" : "Editar Régimen";

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FullRegimenRequest>({ 
        defaultValues: {
            nombre: "",
            tipo: "",
            comision: 0,
            prima: 0,
            aporte: 0,
            total: 0,
            tope: 0,
        },
    });

    const getRegimen = async () => {
        if (id === "nuevo") return;

        try {
            const response = await getFetchRegimenById(Number(id));

            setValue("nombre", response.nombre);
            setValue("tipo", response.tipo);
            
            setValue("comision", response.comision || 0);
            setValue("prima", response.prima || 0);
            setValue("aporte", response.aporte);
            setValue("total", response.total);
            setValue("tope", response.tope || 0);

            setRegimen(response);
        } catch (error) {
            toast.error("Error al cargar los datos del Régimen.", { position: "top-right" });
            console.error(error);
        }
    };

    const onSubmit = async (data: FullRegimenRequest) => {
        const paylod: RegimenRequest = {
            nombre: data.nombre,
            tipo: data.tipo,
        };

        try {
            const response = regimen
                ? await putRegimen(regimen.idRegimen, paylod)
                : await postRegimen(paylod);

            if (!response.success) {
                toast.warning("Error al Guardar el registro", { position: "top-right" });
                return;
            }

            toast.success(response.message, { position: "top-right" });
            setRegimen(null);
            navigate("/regimenprevisional"); 
            
        } catch (error) {
            toast.error("Ocurrió un error al guardar.", { position: "top-right" });
            console.error(error);
        }
    };

    useEffect(() => {
        getRegimen();
    }, [id]);

    return (
        <>
            <HeaderPage
                title={title}
                descripcion="Información detallada del régimen previsional"
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* Campo: Nombre */}
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="nombre">
                                    Nombre <span className="font-semibold text-red-600">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Nombre del régimen (ej. AFP Habitat, ONP)"
                                    {...register("nombre", {
                                        required: "El nombre es requerido",
                                    })}
                                />
                                {errors.nombre && (<p className="msg-error">{errors.nombre.message}</p>)}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="tipo">
                                    Tipo <span className="font-semibold text-red-600">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Tipo (ej. PENSIONES)"
                                    {...register("tipo", {
                                        required: "El tipo es requerido",
                                    })}
                                />
                                {errors.tipo && (<p className="msg-error">{errors.tipo.message}</p>)}
                            </div>
                            
                            Aporte
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="aporte">Aporte (%) <span className="font-semibold text-red-600">*</span></Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ej: 10.00"
                                    {...register("aporte", { 
                                        valueAsNumber: true, 
                                        required: "Aporte requerido" 
                                    })}
                                />
                                {errors.aporte && (<p className="msg-error">{errors.aporte.message}</p>)}
                            </div>
                            
                            Comisión
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="comision">Comisión (%)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ej: 0.84 (0 si es ONP)"
                                    {...register("comision", { valueAsNumber: true })}
                                />
                            </div>

                            Prima
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="prima">Prima (%)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ej: 1.25 (0 si es ONP)"
                                    {...register("prima", { valueAsNumber: true })}
                                />
                            </div>

                            Total
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="total">Total (%) <span className="font-semibold text-red-600">*</span></Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Total de descuento"
                                    {...register("total", { 
                                        valueAsNumber: true, 
                                        required: "Total requerido"
                                    })}
                                    disabled // Se asume que se calcula o no se debe editar
                                />
                                {errors.total && (<p className="msg-error">{errors.total.message}</p>)}
                            </div>

                            Tope
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="tope">Tope (Monto S/)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Monto máximo imponible"
                                    {...register("tope", { valueAsNumber: true })}
                                />
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
                            onClick={() => navigate("/regimenprevisional")}
                        >
                            Cancelar
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </>
    );
};

export default RegimenIdPage;