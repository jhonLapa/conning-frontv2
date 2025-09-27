import HeaderPage from "@/components/header-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OptionSelect } from "@/interfaces";
import { Concepto, ConceptoAfectacionInput, ConceptoAfectacionRequest, ConceptoRequest } from "@/interfaces/concepto.interface";
import { getAfectacionFecth } from "@/services/afectacion.service";
import { getFechtConceptoById, getFecthAfectacionConceto, postConcepto, postConceptoAfectacion, putConcepto } from "@/services/concepto.service";
import { getGrupoConceptoSelect } from "@/services/grupo-concepto.service";
import { defaultSelectStyles } from "@/utils";
import { AlertCircle, PlusCircle, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "sonner";
interface InputFormConcepto extends ConceptoRequest {
    afectaciones: ConceptoAfectacionInput[]
    grupo: OptionSelect | null
    afectacion: OptionSelect | null
}


const ConceptosIdPage = () => {

    const navigate = useNavigate()
    const { id } = useParams()
    const [grupoConcepto, setGrupoConcepto] = useState<OptionSelect[]>([])
    const [afectacion, setAfectacion] = useState<OptionSelect[]>([])
    const [concepto, setConcepto] = useState<Concepto>()


    const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<InputFormConcepto>({
        defaultValues: {
            idGrupo: 0,
            codigo: "",
            descripcion: "",
            ctaDebe: "",
            ctaHaber: "",
            principalDH: "",
            activo: false,
            calculoAutomatico: false,
            generaArchivoPLAME: true,
            grupo: null,
            afectaciones: []
        }
    })

    const { fields, append , remove} = useFieldArray({
        control,
        name: "afectaciones"
    })

    const getAfectaciones = async () => {

        const response = await getAfectacionFecth()

        const select: OptionSelect[] = response.map(item => {
            return {
                value: item.idAfectacion.toString(),
                label: item.nombre
            }
        })
        setAfectacion(select)
    }

    const getConcepto = async () => {
        if (id != "nuevo") {

            const response = await getFechtConceptoById(Number(id))
            setConcepto(response)
            setValue("codigo", response.codigo)
            setValue("ctaDebe", response.ctaDebe)
            setValue("ctaHaber", response.ctaHaber)
            setValue("descripcion", response.descripcion)
            setValue("principalDH", response.principalDH)
            setValue("grupo", {
                value: response.grupo.idGrupo.toString(),
                label: response.grupo.nombre
            })



            const afectaciones = await getFecthAfectacionConceto(response.idConcepto);


            setValue("afectaciones", afectaciones.map(item => {
                return {
                    idAfectacion: item.idAfectacion,
                    idValid: item.idAfectacion,
                    nombre: item.afectacion.nombre,
                    estado: item.estado === 1
                }
            }));
        }
    };

    const deleteItem = (item: number, index:number) => {
        if(item != 0){
            console.log(item)
        }else{
            remove(index)
        }


    }


    const getGrupoSelect = async () => {

        const response = await getGrupoConceptoSelect()
        const select: OptionSelect[] = response.map(item => {
            return {
                value: item.idGrupo.toString(),
                label: `${item.codigo}-${item.nombre}`
            }
        })
        setGrupoConcepto(select)

    }

    const onSubmit = async (values: InputFormConcepto) => {
        const form: ConceptoRequest = {
            idGrupo: Number(values.grupo?.value),
            codigo: values.codigo,
            descripcion: values.descripcion,
            activo: true,
            ctaDebe: values.ctaDebe,
            ctaHaber: values.ctaHaber,
            principalDH: values.principalDH.toUpperCase(),
            calculoAutomatico: true,
            generaArchivoPLAME: values.generaArchivoPLAME
        }

        const responseConcepto = concepto ? await putConcepto(concepto.idConcepto, form) : await postConcepto(form)

        if (!responseConcepto.success) {
            toast.error("Ocurrior un error al Guardar", { position: "top-right" })
            return
        }

        if (values.afectaciones && values.afectaciones.length > 0) {
            const conceptoAfectacion: ConceptoAfectacionRequest[] = values.afectaciones?.map(item => {
                return {
                    idAfectacion: item.idAfectacion,
                    idConcepto: responseConcepto.data?.idConcepto ?? 0,
                    estado: item.estado ? 1 : 0
                }
            })
            const responseMasivo = await postConceptoAfectacion(conceptoAfectacion)

            if (!responseMasivo.success) {
                toast.error("Ocurrior un error al Guardar", { position: "top-right" })
                return
            }
        }

        toast.success(responseConcepto.message, { position: "top-right" })
        navigate("/concepto")
        return
    }

    const onSelectAfectacion = () => {
        const select = watch("afectacion") as OptionSelect | null;

        if (!select) {
            toast.warning("Seleccione una afectación para agregar, por favor...", {
            position: "top-right",
            icon: <AlertCircle />
            });
            return;
        }

        const exists = fields.some(item => item.idAfectacion === Number(select.value));

        if (exists) {
            toast.warning("La afectación ya se encuentra registrada", {
                position: "top-right",
                icon: <AlertCircle />
            });
            return;
        }

        append({
            idAfectacion: Number(select.value),
            idValid: 0 ,
            nombre: select.label,
            estado: true,
        });

        setValue("afectacion", null);
    };




    useEffect(() => {
        getAfectaciones()
        getGrupoSelect()
        getConcepto();
    }, [id])


    return (
        <>
            <HeaderPage title="Nuevo concepto" descripcion="Informacion detallada del concepto" />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4" >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-gray-500">Datos Generales</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2">
                            <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Grupo<span className="font-semibold text-red-600">*</span></Label>
                                        <Controller
                                            name="grupo"
                                            control={control}
                                            rules={{ required: "El grupo de Concepto es Requerido" }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={grupoConcepto}
                                                    isClearable
                                                    isSearchable
                                                    className="basic-single"
                                                    classNamePrefix="grupoConcepto"
                                                    placeholder="- Seleccionar -"
                                                    styles={defaultSelectStyles}
                                                />
                                            )}
                                        />
                                        {errors.grupo && (
                                            <p className="msg-error">{errors.grupo.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Codigo<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="code"
                                            placeholder=""
                                            {...register("codigo", { required: "El Codigo es requerido" })}
                                        />
                                        {errors.codigo && (
                                            <p className="msg-error">{errors.codigo.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Descripcion<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="descripcion"
                                            placeholder=""
                                            {...register("descripcion", { required: "El Codigo es requerido" })}
                                        />
                                        {errors.descripcion && (
                                            <p className="msg-error">{errors.descripcion.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Cta. Debe<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="ctaDebe"
                                            placeholder=""
                                            {...register("ctaDebe", { required: "El ctaDebe es requerido" })}
                                        />
                                        {errors.ctaDebe && (
                                            <p className="msg-error">{errors.ctaDebe.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Cta. Haber<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="ctaHaber"
                                            placeholder=""
                                            {...register("ctaHaber", { required: "El ctaHaber es requerido" })}
                                        />
                                        {errors.ctaHaber && (
                                            <p className="msg-error">{errors.ctaHaber.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Principal D/H<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="principalDH"
                                            placeholder=""
                                            maxLength={1}

                                            {...register("principalDH", { required: "El principal DH es requerido" })}
                                        />
                                        {errors.principalDH && (
                                            <p className="msg-error">{errors.principalDH.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-gray-500">Lista Afectaciones</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2 gap-5">
                            <div className="flex w-full flex-nowrap items-center gap-2">
                                <div className="flex-1">
                                    <Controller
                                        name="afectacion"
                                        control={control}
                                        rules={{ required: false }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={afectacion}
                                                isClearable
                                                isSearchable
                                                className="basic-single"
                                                classNamePrefix="grupoConcepto"
                                                placeholder="- Seleccionar Afectacion -"
                                                styles={defaultSelectStyles}
                                            />
                                        )}
                                    />
                                </div>

                                <Button variant="destructive" className="whitespace-nowrap" type="button" onClick={()=>onSelectAfectacion()}>
                                    Agregar Afectacion
                                    <PlusCircle />
                                </Button>
                            </div>

                            <div className="flex items-center  rounded-md shadow-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nro</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields && fields.length > 0 &&
                                            fields.map((item, index) => {
                                                const state: boolean = item.estado;
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.nombre}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={state ? "success" : "destructive"}>
                                                                {state ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Trash2Icon size={20} onClick={()=> deleteItem(item.idValid!, index)} className="text-red-500 cursor-pointer" />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>

                                </Table>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-nowrap justify-end gap-5">
                        <Button variant={"sidebar"} type="submit" disabled={isSubmitting}  >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button variant={"default"} type="button" onClick={() => navigate("/concepto")}>
                            Cancelar
                        </Button>
                    </CardFooter>
                </Card>


            </form>
        </>
    );
}

export default ConceptosIdPage
