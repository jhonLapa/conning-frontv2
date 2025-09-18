import HeaderPage from "@/components/header-page";
import ImageSelector from "@/components/image-selecto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionSelect } from "@/interfaces";
import { EmpresaRequest } from "@/interfaces/empresas.interface";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";


interface FormEmpresaInput extends EmpresaRequest {
    regimen: OptionSelect | null,
    giroSelect : OptionSelect | null
}

const EmpresaIdPage = () => {
    
    const {control , register , formState: {errors}} = useForm<FormEmpresaInput>({
        defaultValues: {

        }
    })

    const [open , setOpen ] = useState<boolean>(false)

    const handleImage = (url: string) => {
        console.log(url)
    }
    
    return (
        <>
            <HeaderPage title="Nueva Empresa" descripcion="Informacion detallada de la empresa" />
            <form className="flex flex-col gap-5 mt-4" >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-gray-500">Datos Generales</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-center mb-6">
                            <div className="flex-shrink-0 ">
                                <ImageSelector width="w-50" className="mr-4" open={open} setOpen={setOpen} setImagen={handleImage}  /> 
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col space-y-2">         
                                    <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="codigo">Codigo <span className="font-semibold text-red-600">*</span></Label>
                                                <Input
                                                    id="code"
                                                    placeholder="code"
                                                    {...register("code", { required: "El Codigo es requerido" })}
                                                    />
                                                    {errors.code && (
                                                    <p className="msg-error">{errors.code.message}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="documento">Régimen <span className="font-semibold text-red-600">*</span></Label>
                                                <Controller
                                                    name="regimen"
                                                    control={control}
                                                    rules={{ required: "El Regimen es Requerido" }}
                                                    render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        isClearable
                                                        isSearchable
                                                        className="basic-single"
                                                        classNamePrefix="regimen"
                                                        placeholder="- Seleccionar -"
                                                    />
                                                    )}
                                                />
                                                {errors.regimen && (
                                                <p className="msg-error">{errors.regimen.message}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="codigo">R.U.C <span className="font-semibold text-red-600">*</span></Label>
                                                <Input
                                                    id="ruc"
                                                    placeholder="code"
                                                    {...register("ruc", { required: "El RUC es requerido" })}
                                                    />
                                                    {errors.ruc && (
                                                    <p className="msg-error">{errors.ruc.message}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="documento">Estado <span className="font-semibold text-red-600">*</span></Label>
                                                <Controller
                                                    name="regimen"
                                                    control={control}
                                                    rules={{ required: "El Regimen es Requerido" }}
                                                    render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        isClearable
                                                        isSearchable
                                                        className="basic-single"
                                                        classNamePrefix="regimen"
                                                        placeholder="- Seleccionar -"
                                                    />
                                                    )}
                                                />
                                                {errors.regimen && (
                                                <p className="msg-error">{errors.regimen.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-4 space-y-2 gap-2">
                            <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Razon Social <span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="razonSocial"
                                            placeholder="razonSocial"
                                            {...register("razonSocial", { required: "La Razon Social es requerido" })}
                                            />
                                            {errors.razonSocial && (
                                            <p className="msg-error">{errors.razonSocial.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Direccion<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="direccion"
                                            placeholder="direccion"
                                            {...register("direccion", { required: "La direccion es requerido" })}
                                            />
                                            {errors.direccion && (
                                            <p className="msg-error">{errors.direccion.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Ciudad<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="ciudad"
                                            placeholder="ciudad"
                                            {...register("ciudad", { required: "La ciudad es requerido" })}
                                            />
                                            {errors.ciudad && (
                                            <p className="msg-error">{errors.ciudad.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Pan Contable<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id=" "
                                            placeholder="placeholder"
                                            {...register("planContableId", { required: "Plan Contable es requerido" })}
                                            />
                                            {errors.planContableId && (
                                            <p className="msg-error">{errors.planContableId.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-gray-500">Datos Adicionales</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col col-span-4 space-y-2 gap-2">
                            <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Nombre de la Base de Datos<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="razonSocial"
                                            placeholder="razonSocial"
                                            {...register("razonSocial", { required: "La Razon Social es requerido" })}
                                            />
                                            {errors.razonSocial && (
                                            <p className="msg-error">{errors.razonSocial.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Ruta Base de datos<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="direccion"
                                            placeholder="direccion"
                                            {...register("direccion", { required: "La direccion es requerido" })}
                                            />
                                            {errors.direccion && (
                                            <p className="msg-error">{errors.direccion.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Ruta Archivos<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="ciudad"
                                            placeholder="rutaArchivos"
                                            {...register("rutaArchivos", { required: "La rutaArchivos es requerido" })}
                                            />
                                            {errors.rutaArchivos && (
                                            <p className="msg-error">{errors.rutaArchivos.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Ruta de Modulo Planilla<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id=" "
                                            placeholder="rutaArchivos"
                                            {...register("rutaArchivos", { required: "Plan Contable es requerido" })}
                                            />
                                            {errors.rutaArchivos  && (
                                            <p className="msg-error">{errors.rutaArchivos.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Ruta de Imagenes<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id=" "
                                            placeholder=" "
                                            {...register("rutaBd", { required: "Plan Contable es requerido" })}
                                            />
                                            {errors.rutaBd  && (
                                            <p className="msg-error">{errors.rutaBd.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </>
    );
} 

export default EmpresaIdPage
