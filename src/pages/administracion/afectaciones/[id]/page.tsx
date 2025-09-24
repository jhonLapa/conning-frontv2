import HeaderPage from "@/components/header-page";
import { FormSkeleton } from "@/components/skeleton-compact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AfectacionConfiguracion, AfectacionMap } from "@/interfaces/afectacione.interface";
import { getAfectacionFecth, postConfigAfectacion } from "@/services/afectacion.service";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export interface InputAfectacionFormData {
    afectaciones: AfectacionConfiguracion[]
}

const AfectactioneIdPage = () => {

    const navigate = useNavigate()

    const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<InputAfectacionFormData>({
        defaultValues: {
            afectaciones: []
        }
    })
   
    const { fields, append, remove } = useFieldArray({
        control,
        name: "afectaciones"
    });


    const [checkboxData, setCheckboxData] = useState<AfectacionMap[]>([])
    
    const getAfectaciones = async () => {
        const response = await getAfectacionFecth()
        const afectaciones: AfectacionMap[] = response.map((item) => {
            return {
                id: item.idAfectacion.toString(),
                label: item.nombre,
                code: item.codigo
            }
        })
        setCheckboxData(afectaciones)
    }

    const handleCheckboxChange = (item: AfectacionMap, checked: boolean) => {
    const idAfectacion = Number(item.id);

    if (checked) {
        // agregar solo si no existe
        if (!fields.find(f => f.idAfectacion === idAfectacion)) {
            append({
                idEmpresa: 1,
                idAfectacion,
                porcentaje: 0,
                activo: true
            });
        }
    } else {
        const index = fields.findIndex(f => f.idAfectacion === idAfectacion);
        if (index !== -1) remove(index);
    }
    };
    
    
    const onSubmit = async (data: InputAfectacionFormData) => {
        const form = data.afectaciones.filter(item => item.idAfectacion !== 0);
        const response = await postConfigAfectacion(form)
        
        if(!response.success){
            toast.warning("Error al Guardar el registro", {position: "top-right"})
            return
        }

        toast.success(response.message, {position: "top-right"})
        return

    };
    useEffect(() => {
        getAfectaciones()
    }, [])


    return (
        <>
            <HeaderPage title="Nueva afectacion" descripcion="Informacion detallada del afecto" />
            <form className="flex  flex-col gap-5 mt-4" onSubmit={handleSubmit(onSubmit)} >
                <Card>
                    <CardHeader>
                        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 items-center">
                            <CardTitle className="text-lg font-light text-gray-500">Afectaciones</CardTitle>
                            <CardTitle className="text-lg font-light text-gray-500 text-center">Porcentaje (%)</CardTitle>
                            <CardTitle className="text-lg font-light text-gray-500 text-center">Código</CardTitle>
                        </div>
                        <hr />
                    </CardHeader>
                    <CardContent>
                        {
                            (checkboxData && checkboxData.length > 0) ? (
                                <div className="flex flex-col space-y-2">
                                    <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                        {checkboxData.map((item) => {
                                            const index = fields.findIndex(f => f.idAfectacion === Number(item.id));
                                            const selected = index !== -1;
                                            return (
                                                <div key={item.id} className="grid grid-cols-3 md:grid-cols-3 gap-4">
                                                    <div className="flex flex-col space-y-2 ">
                                                        <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg  group">
                                                            <Checkbox
                                                                id={item.id}
                                                                checked={selected}
                                                                onCheckedChange={(checked) =>
                                                                    handleCheckboxChange(item, checked as boolean)
                                                                } />
                                                            <label htmlFor={item.id}>
                                                                {item.label}
                                                            </label>

                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-2">
                                                        <Input
                                                            id="grupo"
                                                            placeholder="(%)"
                                                            {...register(`afectaciones.${index}.porcentaje` as const, {
                                                                required: false
                                                            })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col space-y-2">
                                                        <Input
                                                            id="grupo"
                                                            placeholder=""
                                                            value={item.code}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <FormSkeleton variant="detailed" fields={3} />
                            )
                        }
                    </CardContent>
                    <CardFooter className="flex flex-nowrap justify-end gap-5">
                        <Button variant={"sidebar"} type="submit" disabled={isSubmitting}  >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button variant={"default"} type="button" onClick={() => navigate("/afectacion")}>
                            Cancelar
                        </Button>
                    </CardFooter>

                </Card>
            </form>
        </>
    );
}

export default AfectactioneIdPage
