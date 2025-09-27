import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GrupoConcepto, GrupoConceptoRequest } from "@/interfaces/grupo-concepto";
import { getFechtGrupoConceptoById, postGrupoConcepto, putGrupoConcepto } from "@/services/grupo-concepto.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";


const GrupoConceptoIdPage = () => {

    const navigate = useNavigate()
    const { id } = useParams()
    const [ grupoConcepto , setGrupoConcepto ] = useState<GrupoConcepto | null>(null)
    const title = id == "nuevo" ? "Nueva Grupo" :  "Editar Grupo"
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<GrupoConceptoRequest>({
        defaultValues: {
            codigo: "",
            nombre: ""
        }
    })
   
    const getGrupoConcepto = async () => {

        if( id == "nuevo") return

        const response = await getFechtGrupoConceptoById(Number(id))
        setValue("codigo", response.codigo)
        setValue("nombre", response.nombre)
        setGrupoConcepto(response)
    }

   
    
    const onSubmit = async (data: GrupoConceptoRequest) => {
        
        const response = grupoConcepto ? await putGrupoConcepto(grupoConcepto.idGrupo, data) : await postGrupoConcepto(data)
        
        if(!response.success){
            toast.warning("Error al Guardar el registro", {position: "top-right"})
            return
        }

        toast.success(response.message, {position: "top-right"})
        setGrupoConcepto(null)
        navigate("/grupo-concepto")
        return

    };

    useEffect(() => {
        getGrupoConcepto()
    }, [id])


    return (
        <>
            <HeaderPage title="Nueva Grupo" descripcion="Informacion detallada del Grupo" />
            <form className="flex  flex-col gap-5 mt-4" onSubmit={handleSubmit(onSubmit)} >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-gray-500">{title}</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2">         
                            <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Codigo<span className="font-semibold text-red-600">*</span></Label>
                                        <Input 
                                            type="text" 
                                            placeholder="codigo"
                                            {...register("codigo", { required: "El codigo es requerido" })}
                                        />
                                        {errors.codigo && (
                                            <p className="msg-error">{errors.codigo.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="nombre">Nombre<span className="font-semibold text-red-600">*</span></Label>
                                        <Input 
                                            type="text" 
                                            placeholder="nombre"
                                            {...register("nombre", { required: "El nombre es requerido" })}
                                        />
                                        {errors.nombre && (
                                            <p className="msg-error">{errors.nombre.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-nowrap justify-end gap-5">
                        <Button variant={"sidebar"} type="submit" disabled={isSubmitting}  >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button variant={"default"} type="button" onClick={() => navigate("/grupo-concepto")}>
                            Cancelar
                        </Button>
                    </CardFooter>

                </Card>
            </form>
        </>
    );
}

export default GrupoConceptoIdPage
