import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bank, BankRequest } from "@/interfaces/bank.interface";
import { getFechtBankById, postBank, putBank } from "@/services/bank.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";


const BankIdPage = () => {

    const navigate = useNavigate()
    const { id } = useParams()
    const [ bank , setBank ] = useState<Bank | null>(null)
    
    const title = id == "nuevo" ? "Nuevo Banco" :  "Editar Banco"
    
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<BankRequest>({
        defaultValues: {
            nombre: "",
            nombreCorto: "",
            codigoPais: "",
            swiftCode: ""
        }
    })
   
    const getBank = async () => {

        if( id == "nuevo") return

        const response = await getFechtBankById(Number(id))
        setValue("nombre", response.nombre)
        setValue("nombreCorto", response.nombreCorto)
        setValue("codigoPais", response.codigoPais)
        setValue("swiftCode", response.swiftCode)
        setBank(response)
    }

   
    
    const onSubmit = async (data: BankRequest) => {
        
        const response = bank ? await putBank(bank.id, data) : await postBank(data)
        
        if(!response.success){
            toast.warning("Error al Guardar el registro", {position: "top-right"})
            return
        }

        toast.success(response.message, {position: "top-right"})
        setBank(null)
        navigate("/banco")
        return

    };

    useEffect(() => {
        getBank()
    }, [id])


    return (
        <>
            <HeaderPage title="Nueva afectacion" descripcion="Informacion detallada del afecto" />
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
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="nombreCorto">Nombre Corto<span className="font-semibold text-red-600">*</span></Label>
                                        <Input 
                                            type="text" 
                                            placeholder="nombre corto"
                                            {...register("nombreCorto", { required: "El nombre corto es requerido" })}
                                        />
                                        {errors.nombreCorto && (
                                            <p className="msg-error">{errors.nombreCorto.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigoPais">Codigo Pais<span className="font-semibold text-red-600">*</span></Label>
                                        <Input 
                                            type="text"
                                            maxLength={3}
                                            placeholder="codigo de pais"
                                            {...register("codigoPais", { required: "El codigo de pais corto es requerido" })}
                                        />
                                        {errors.codigoPais && (
                                            <p className="msg-error">{errors.codigoPais.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="swiftCode">Codigo<span className="font-semibold text-red-600">*</span></Label>
                                        <Input 
                                            type="text" 
                                            placeholder="Codigo"
                                            {...register("swiftCode", { required: "El codigo swift corto es requerido" })}
                                        />
                                        {errors.swiftCode && (
                                            <p className="msg-error">{errors.swiftCode.message}</p>
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
                        <Button variant={"default"} type="button" onClick={() => navigate("/banco")}>
                            Cancelar
                        </Button>
                    </CardFooter>

                </Card>
            </form>
        </>
    );
}

export default BankIdPage
