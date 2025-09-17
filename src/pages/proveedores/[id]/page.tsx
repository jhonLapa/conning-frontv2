import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveProveedores } from "@/interfaces/proveedores.interface";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

type OptionType = { value: number; label: string };

interface FormSaveProveedorInputs extends SaveProveedores {
    documento: OptionType | null,
}

export default function ProveedorIdPage() {
    
    const navigate = useNavigate();
    const { id } = useParams();


    const title = id === "nuevo" ? "Nuevo Proveedor" : "Editar Proveedor";
    const [documento, setDocumento] = useState<{ value: number, label:string }[]>()
    

    const {
        handleSubmit,
        register,
        control,
        // setValue,
        formState: { errors },
        // watch,
        // reset,
    } = useForm<FormSaveProveedorInputs>({
        defaultValues: {
            codigo:"",
            tipoDoc:"",
            razonSocial:"",
            direccion:"",
            numeroDoc:"",
            email:"",
            telefono:"",
            status: true,
        },
    });

    const getDocumento = () => {
        const response:OptionType[] = [
            {
                value: 1,
                label: "DNI"
            },
            {
                value: 2,
                label: "RUT"
            }
        ] 

        setDocumento(response)
        
    }


    const onSubmit = async (values: FormSaveProveedorInputs) => {
        console.log(values)
        navigate("/proveedor")
    }

    useEffect(() => {
        getDocumento()
    },[])

    return (
        <>
            <HeaderPage title={title} descripcion="Información detallada del cliente." />
                <form className="flex flex-col gap-5 mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-light text-gray-500">Mantenimiento Proveedor</CardTitle>
                            <hr />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Codigo <span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="name"
                                            placeholder="Codigo"
                                            {...register("codigo", { required: "El Codigo es requerido" })}
                                            />
                                            {errors.codigo && (
                                            <p className="msg-error">{errors.codigo.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="documento">Tipo Documento <span className="font-semibold text-red-600">*</span></Label>
                                        <Controller
                                            name="documento"
                                            control={control}
                                            rules={{ required: "El Tipo Documento es Requerido" }}
                                            render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={documento}
                                                isClearable
                                                isSearchable
                                                className="basic-single"
                                                classNamePrefix="documento"
                                                placeholder="- Seleccionar -"
                                            />
                                            )}
                                        />
                                        {errors.documento && (
                                        <p className="msg-error">{errors.documento.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="razonSocial">Razon Social <span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="razonSocial"
                                            placeholder="Razon Social"
                                            {...register("razonSocial", { required: "La Razon Social es requerido" })}
                                            />
                                            {errors.razonSocial && (
                                            <p className="msg-error">{errors.razonSocial.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="direccion">Direccion <span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="direccion"
                                            placeholder="direccion"
                                            {...register("direccion", { required: "La direccion es requerido" })}
                                            />
                                            {errors.direccion && (
                                            <p className="msg-error">{errors.direccion.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="numeroDoc">Numero Documento <span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="numeroDoc"
                                            placeholder="0"
                                            {...register("numeroDoc", { required: "El numero documento es requerido" })}
                                            />
                                            {errors.numeroDoc && (
                                            <p className="msg-error">{errors.numeroDoc.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="email">Correo <span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="email"
                                            placeholder="email@gmail.com"
                                            {...register("email", { required: "El correo es requerido" })}
                                            />
                                            {errors.email && (
                                            <p className="msg-error">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="telefono">Telefono</Label>
                                        <Input
                                            id="telefono"
                                            placeholder="0"
                                            {...register("telefono", { required: false })}
                                            />
                                            {errors.telefono && (
                                            <p className="msg-error">{errors.telefono.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                        <CardFooter className="flex flex-row items-center justify-end gap-2">
                            <Button variant="secondary" className="border-2" onClick={() => navigate("/proveedor")}>Cancelar</Button>
                            <Button type="submit"  variant="destructive">Guardar</Button>
                        </CardFooter>
                </form>

        </>
    );
}
