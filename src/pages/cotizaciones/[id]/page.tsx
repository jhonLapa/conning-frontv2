import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SaveProveedores } from "@/interfaces/proveedores.interface";
import { cn } from "@/lib/utils";
import { ClipboardListIcon, PenBoxIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

type OptionType = { value: number; label: string };

interface FormSaveProveedorInputs extends SaveProveedores {
    documento: OptionType | null,
}

export default function CotizacionesIdPage() {
    
    const navigate = useNavigate();
    const { id } = useParams();
    const [showPanel, setShowPanel] = useState<boolean>(false);

    const title = id === "nuevo" ? "Nueva Cotizacion" : "Editar Cotizacion";
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

    const productos = [
        {
            "codigo": "32181211",
            "producto": "LLANTA 12.5/80-18 12PR FOREUNNER QH-603 R-4 TL CHINA",
            "cantidad": 1,
            "unidad": "UND",
            "precio": 508.475,
            "vVenta": 508.4746,
            "tVenta": 600
        },
        {
            "codigo": "TOD2400554",
            "producto": "LLANTA 21L24 12PR H658 R-4 ROCKBUSTER TL CHINA",
            "cantidad": 1,
            "unidad": "UND",
            "precio": 1406.78,
            "vVenta": 1406.7797,
            "tVenta": 1660
        },
        {
            "codigo": "TOD2400586",
            "producto": "LLANTA 21L24 12PR ST-516 R-4 SOLIDWAY TL",
            "cantidad": 1,
            "unidad": "UND",
            "precio": 1449.153,
            "vVenta": 1449.1525,
            "tVenta": 1710
        },
        {
            "codigo": "TOD2500421",
            "producto": "LLANTA 23.5-25 24PR H108A TCF E-3/L-3 ROCKBUSTER TCF ONDAS",
            "cantidad": 1,
            "unidad": "UND",
            "precio": 2313.559,
            "vVenta": 2313.5593,
            "tVenta": 2730
        },
        {
            "codigo": "TOD2500424",
            "producto": "LLANTA 23.5-25 24PR H108C TCF E-3/L-3 ROCKBUSTER PATA DE OSO TCF",
            "cantidad": 1,
            "unidad": "UND",
            "precio": 2317.797,
            "vVenta": 2317.7966,
            "tVenta": 2735
        },
        {
            "codigo": "34181200",
            "producto": "LLANTA LLANTA 12.5/80-18 12PR APOLLO AIT 426 R-4 TL INDIA",
            "cantidad": 1,
            "unidad": "UND",
            "precio": 889.831,
            "vVenta": 889.8305,
            "tVenta": 1050
        },
        {
            "codigo": "11R22.5 KUMHO",
            "producto": "LLANTA 11R22.5 16PR KRS02 KUMHO DELANTERA KOREA",
            "cantidad": 1,
            "unidad": "UND",
            "precio": 1305.085,
            "vVenta": 1305.0847,
            "tVenta": 1540
        },
        {
            "codigo": "GIAP5030",
            "producto": "LLANTA 11R22.5 18PR AD123 GRENLANDER MIXTA DELANTERA",
            "cantidad": 1,
            "unidad": "UND",
            "precio": 457.627,
            "vVenta": 457.6271,
            "tVenta": 540
        }
    ]

    const handleBoleta = () => {
        setShowPanel(!showPanel)
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col xl:flex-row gap-5 rounded-md min-h-full mt-3">
                    <div className={cn("transition-all rounded-2xl w-full  border border-gray-100 h-fit", showPanel ? "xl:w-2/3 " : "")}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-light text-gray-500">Mantenimiento Proveedor</CardTitle>
                                <hr />
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="codigo">Cliente <span className="font-semibold text-red-600">*</span></Label>
                                            <Input
                                                id="name"
                                                placeholder="Codigo"
                                                {...register("codigo", { required: "El Codigo es requerido" })}
                                                />
                                                {errors.codigo && (
                                                <p className="msg-error">{errors.codigo.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="direccion">Direccion</Label>
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="numeroDoc">Tipo de Venta</Label>
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
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="email">Vendedor</Label>
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
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="email">Atencion</Label>
                                            <Input
                                                id="email"
                                                placeholder=""
                                                {...register("email", { required: "El correo es requerido" })}
                                                />
                                                {errors.email && (
                                                <p className="msg-error">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="numeroDoc">Moneda</Label>
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
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="email">Almacen</Label>
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
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="email">Tipo de Cambio</Label>
                                            <Input
                                                id="email"
                                                placeholder="0"
                                                {...register("email", { required: "El correo es requerido" })}
                                                />
                                                {errors.email && (
                                                <p className="msg-error">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardContent>
                                <HeaderPage title="" descripcion="Listado de todos los Productos :">
                                    <Button className="bg-[#858eb4] hover:bg-[#858eb4]/80 text-white rounded-md px-4 py-1.5 flex gap-2 items-center justify-center w-full lg:w-auto cursor-pointer">
                                        <ShoppingCartIcon />Finalizar
                                    </Button>
                                    <Button className="bg-[#f49c8a] hover:bg-[#f49c8a]/80 text-white rounded-md px-4 py-1.5 flex gap-2 items-center justify-center w-full lg:w-auto cursor-pointer">
                                        <ClipboardListIcon />Vaciar Listado
                                    </Button>
                                </HeaderPage>
                                <div className="mt-5">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead className="w-[100px]">Codigo</TableHead>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Cantidad</TableHead>
                                            <TableHead>Unidad</TableHead>
                                            <TableHead>Precio</TableHead>
                                            <TableHead>V.Venta</TableHead>
                                            <TableHead>T.Venta</TableHead>
                                            <TableHead className="text-center">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {productos.map((prod) => (
                                                <TableRow key={prod.codigo}>
                                                <TableCell>{prod.codigo}</TableCell>
                                                <TableCell>{prod.producto}</TableCell>
                                                <TableCell>{prod.cantidad}</TableCell>
                                                <TableCell>{prod.unidad}</TableCell>
                                                <TableCell>{prod.precio}</TableCell>
                                                <TableCell>{prod.vVenta}</TableCell>
                                                <TableCell>{prod.tVenta}</TableCell>
                                                <TableCell className="flex gap-2">
                                                    <Button
                                                        variant="link"
                                                        className="text-amber-400"
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => handleBoleta()}
                                                    >
                                                        <PenBoxIcon />
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="text-red-400"
                                                        size="sm"
                                                        onClick={() => console.log("Eliminar", prod.codigo)}
                                                    >
                                                        <Trash2Icon />
                                                    </Button>
                                                </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                        <CardFooter className="mt-4 flex items-center justify-end gap-2">
                            <Button variant="secondary" className="border-2" onClick={() => navigate("/cotizaciones")}>Cancelar</Button>
                            <Button type="submit"  variant="destructive">Guardar</Button>
                        </CardFooter>
                    </div>
                    {
                        showPanel && (
                            <div className="h-fit rounded-2xl w-full xl:w-1/3 border border-gray-100">
                            <Card>
                                <CardContent>
                                    <div className="flex flex-col col-span-1 space-y-2 gap-2">
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-3 text-sm">
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="codigo">Condicion Venta<span className="font-semibold text-red-600">*</span></Label>
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
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="codigo">Documento<span className="font-semibold text-red-600">*</span></Label>
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
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="codigo">Punto Emision<span className="font-semibold text-red-600">*</span></Label>
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
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="email">Numero</Label>
                                                <Input
                                                    id="email"
                                                    placeholder=""
                                                    {...register("email", { required: "El correo es requerido" })}
                                                    />
                                                    {errors.email && (
                                                    <p className="msg-error">{errors.email.message}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="email">Fecha</Label>
                                                <Input
                                                    id="email"
                                                    type="date"
                                                    placeholder=""
                                                    {...register("email", { required: "El correo es requerido" })}
                                                    />
                                                    {errors.email && (
                                                    <p className="msg-error">{errors.email.message}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="email">Dias Vigentes</Label>
                                                <Input
                                                    id="email"
                                                    placeholder=""
                                                    {...register("email", { required: "El correo es requerido" })}
                                                    />
                                                    {errors.email && (
                                                    <p className="msg-error">{errors.email.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-3 text-sm">
                                            <div className="flex flex-col space-y-2">
                                                <Label htmlFor="codigo">Condicion Venta<span className="font-semibold text-red-600">*</span></Label>
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
                                            </div>
                                            <div className="flex flex-col space-y-2 mt-3 text-sm ">
                                                <div className="flex items-center justify-between">
                                                    <span>OPE.GRAVADAS</span>
                                                    <span>14567.8</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>OPE.INAFECTAS</span>
                                                    <span>0</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>OPE.EXONERADAS</span>
                                                    <span>0</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>SUBTOTAL</span>
                                                    <span>14567.8</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>IGV{"(18%)"}</span>
                                                    <span>2622.2</span>
                                                </div>
                                                <div className="flex items-center justify-between text-red-500">
                                                    <span>TOTAL</span>
                                                    <span>$/.17190</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            </div>
                        )
                    }
                </div>
            </form>
        </>
    );
}
