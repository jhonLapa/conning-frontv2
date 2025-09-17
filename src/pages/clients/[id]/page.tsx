import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveCliente } from "@/interfaces/cliente.interface";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

type OptionType = { value: number; label: string };

interface FormClienteInputs extends SaveCliente {
    documento: OptionType | null,
    vendedor: OptionType | null,
    distrito: OptionType | null,
    provincia: OptionType | null,
    departamento: OptionType | null,
}

export default function ClienteIdPage() {
    
    const navigate = useNavigate();
    const { id } = useParams();


    const title = id === "nuevo" ? "Nuevo Cliente" : "Editar Cliente";
    const [vendedor, setVendedor] = useState<{ value: number, label:string }[]>()
    const [documento, setDocumento] = useState<{ value: number, label:string }[]>()
    const [distrito, setDistrito] = useState<{ value: number, label:string }[]>()
    const [provincia, setProvincia] = useState<{ value: number, label:string }[]>()
    const [departamento, setDepartamento] = useState<{ value: number, label:string }[]>()

    const {
        handleSubmit,
        register,
        control,
        // setValue,
        formState: { errors },
        // watch,
        // reset,
    } = useForm<FormClienteInputs>({
        defaultValues: {
            codigo:"",
            tipoDoc:"",
            razonSocial:"",
            direccion:"",
            numeroDoc:"",
            email:"",
            telefono:"",
            vendedorId:0,
            departamentoId:0,
            provinciaId:0,
            distritoId:0,
            lineaCredito:"",
            ampliacionLineaCredito:"",
            status: true,
            documento: null,
            departamento: null,
            distrito: null,
            provincia: null,
            vendedor: null
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
        setVendedor(response)
        setDistrito(response)
        setProvincia(response)
        setDepartamento(response)
    }


    const onSubmit = async (values: FormClienteInputs) => {
        console.log(values)
        navigate("/cliente")
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
                            <CardTitle className="text-lg font-light text-gray-500">Mantenimiento Cliente</CardTitle>
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
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="vendedor">Vendedor</Label>
                                        <Controller
                                            name="vendedor"
                                            control={control}
                                            rules={{ required: false }}
                                            render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={vendedor}
                                                isClearable
                                                isSearchable
                                                className="basic-single"
                                                classNamePrefix="vendedor"
                                                placeholder="- Seleccionar -"
                                            />
                                            )}
                                        />
                                        {errors.vendedor && (
                                        <p className="msg-error">{errors.vendedor.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="departamento">Departamento</Label>
                                        <Controller
                                            name="departamento"
                                            control={control}
                                            rules={{ required: false}}
                                            render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={departamento}
                                                isClearable
                                                isSearchable
                                                className="basic-single"
                                                classNamePrefix="departamento"
                                                placeholder="- Seleccionar -"
                                            />
                                            )}
                                        />
                                        {errors.departamento && (
                                        <p className="msg-error">{errors.departamento.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="provincia">Provincia</Label>
                                        <Controller
                                            name="provincia"
                                            control={control}
                                            rules={{ required: false }}
                                            render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={provincia}
                                                isClearable
                                                isSearchable
                                                className="basic-single"
                                                classNamePrefix="provincia"
                                                placeholder="- Seleccionar -"
                                            />
                                            )}
                                        />
                                        {errors.provincia && (
                                        <p className="msg-error">{errors.provincia.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="distrito">Distrito</Label>
                                        <Controller
                                            name="distrito"
                                            control={control}
                                            rules={{ required: false }}
                                            render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={distrito}
                                                isClearable
                                                isSearchable
                                                className="basic-single"
                                                classNamePrefix="distrito"
                                                placeholder="- Seleccionar -"
                                            />
                                            )}
                                        />
                                        {errors.distrito && (
                                        <p className="msg-error">{errors.distrito.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-light text-gray-500">Credito Cliente</CardTitle>
                            <hr />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="lineaCredito">Linea Credito</Label>
                                        <Input
                                            id="lineaCredito"
                                            placeholder="0"
                                            {...register("lineaCredito", { required: false })}
                                            />
                                            {errors.lineaCredito && (
                                            <p className="msg-error">{errors.lineaCredito.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="ampliacionLineaCredito">Ampliacion Linea Credito</Label>
                                        <Input
                                            id="ampliacionLineaCredito"
                                            placeholder="0"
                                            {...register("ampliacionLineaCredito", { required: false })}
                                            />
                                            {errors.ampliacionLineaCredito && (
                                            <p className="msg-error">{errors.ampliacionLineaCredito.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <CardFooter className="flex flex-row items-center justify-end gap-2">
                        <Button variant="secondary" className="border-2" onClick={() => navigate("/cliente")}>Cancelar</Button>
                        <Button type="submit"  variant="destructive" >Guardar</Button>
                    </CardFooter>
                </form>

        </>
    );
}
