import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionSelect } from "@/interfaces";
import { getGrupoConceptoSelect } from "@/services/grupo-concepto.service";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";
import Select from "react-select";
import { Checkbox } from "@/components/ui/checkbox";
import { defaultSelectStyles } from "@/utils";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getConceptoByIdGrupo, getFechtConceptoById, getFecthAfectacionConceto } from "@/services/concepto.service";
import { Concepto, ConceptoAfectacionInput, ConceptoRequest } from "@/interfaces/concepto.interface";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface InputFormMantenimientoConceto extends ConceptoRequest {
    grupoConcepto: OptionSelect | null
    afectaciones: ConceptoAfectacionInput[]

}

const MantenimientoConceptoIdPage = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [grupoConcepto, setGrupoConcepto] = useState<OptionSelect[]>([])
    const [itemGrupoConcept, setItemGrupoConcept] = useState<Concepto[] | null>(null)

    const title = id == "nuevo" ? "Nuevo Mantenimiento Concepto" : "Editar Mantenimiento Concepto"
    
    const { register, handleSubmit, control ,setValue, formState: { errors, isSubmitting } } = useForm<InputFormMantenimientoConceto>({
        defaultValues: {
            codigo: "",
            ctaDebe: "",
            ctaHaber: "",
            descripcion: "",
            principalDH: "",
            activo: false,
            calculoAutomatico: false,
            grupoConcepto: null,
            afectaciones:[]
        }
    })
    const { fields } = useFieldArray({
            control,
            name: "afectaciones"
        })

    

    const selectItemCodigo = async (item: string) => {
        if (item) {
            const response = await getConceptoByIdGrupo(Number(item))
            setItemGrupoConcept(response)
        } else {
            setItemGrupoConcept(null)
        }

    }

    const selectItemConcepto = async (id: number) => {
        const response = await getFechtConceptoById(id)
        setValue("activo", response.activo)
        setValue("codigo", response.codigo)
        setValue("ctaDebe", response.ctaDebe)
        setValue("ctaHaber", response.ctaHaber)
        setValue("principalDH", response.principalDH)
        setValue("descripcion", response.descripcion)
        setValue("calculoAutomatico", response.calculoAutomatico)
        setValue("grupoConcepto", {
            value: response.grupo.idGrupo.toString(),
            label:`${response.grupo.codigo}-${response.grupo.nombre}`
        })

        const afectaciones = await getFecthAfectacionConceto(id);

        setValue("afectaciones", afectaciones.map(item => {
            return {
                idAfectacion: item.idAfectacion,
                idValid: item.idAfectacion,
                nombre: item.afectacion.nombre,
                estado: item.estado === 1
            }
        }))
    }

   

    const getAfectacionSelect = async () => {

        const response = await getGrupoConceptoSelect()
        const select: OptionSelect[] = response.map(item => {
            return {
                value: item.idGrupo.toString(),
                label: `${item.codigo}-${item.nombre}`
            }
        })
        setGrupoConcepto(select)

    }





    const onSubmit = async (data: InputFormMantenimientoConceto) => {

        console.log(data)
        // const response = bank ? await putBank(bank.id, data) : await postBank(data)

        // if(!response.success){
        //     toast.warning("Error al Guardar el registro", {position: "top-right"})
        //     return
        // }

        // toast.success(response.message, {position: "top-right"})
        // setBank(null)
        // navigate("/banco")
        // return

    };

    useEffect(() => {
        getAfectacionSelect()
    }, [])


    return (
        <>
            <HeaderPage title="Nueva afectacion" descripcion="Informacion detallada del afecto" />
            <form className="flex  flex-col gap-5 mt-4 " onSubmit={handleSubmit(onSubmit)} >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-gray-500">{title}</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent >
                        <div className={cn("grid  gap-6 mb-4", itemGrupoConcept ? "grid-cols-2" : "grid-cols-1")}>
                            <div className="flex flex-col space-y-2 ">
                                <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="nombre">Grupo<span className="font-semibold text-red-600">*</span></Label>
                                            <Controller
                                                name="grupoConcepto"
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
                                                        onChange={(selectedOption) => {
                                                            field.onChange(selectedOption); // 👈 actualiza RHF
                                                            selectItemCodigo(selectedOption?.value); // 👈 tu función adicional
                                                        }}
                                                        styles={defaultSelectStyles}
                                                    />
                                                )}
                                            />
                                            {errors.grupoConcepto && (
                                                <p className="msg-error">{errors.grupoConcepto.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="swiftCode">Codigo</Label>
                                            <Input
                                                type="text"
                                                readOnly
                                                placeholder="Codigo"
                                                {...register("codigo", { required: "El codigo swift corto es requerido" })}
                                            />
                                        </div>
                                        <div className="flex flex-row items-center gap-4">
                                            <Controller
                                                name="activo"
                                                control={control}
                                                defaultValue={false}
                                                render={({ field }) => (
                                                    <div className="flex flex-row items-center gap-4">
                                                        <Checkbox
                                                            checked={field.value}       // 👈 importante
                                                            onCheckedChange={field.onChange}
                                                            id="activo"
                                                        />
                                                        <Label htmlFor="activo">Activo</Label>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="descripcion">Descripcio</Label>
                                            <Input
                                                type="text"
                                                readOnly
                                                placeholder="descripcion"
                                                {...register("descripcion", { required: false })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="ctaDebe">Cta. Debe</Label>
                                            <Input
                                                type="text"
                                                readOnly
                                                placeholder=""
                                                {...register("ctaDebe", { required: false })}
                                            />
                                        </div>
                                        <div className="flex flex-row items-center gap-4">
                                            <Controller
                                                name="calculoAutomatico"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-row items-center gap-4">
                                                        <Checkbox
                                                            id="calculoAutomatico"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                        <Label htmlFor="calculoAutomatico">Cálculo Automático</Label>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="swiftCode">Cta. Haber</Label>
                                            <Input
                                                type="text"
                                                readOnly
                                                placeholder=""
                                                {...register("ctaHaber", { required: false })}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <Label htmlFor="principalDH">Principal D/H</Label>
                                            <Input
                                                type="text"
                                                readOnly
                                                placeholder=""
                                                {...register("principalDH", { required: false })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                (itemGrupoConcept && itemGrupoConcept.length > 0) && (
                                    <div className="flex flex-col">
                                        <RadioGroup>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead></TableHead>
                                                        <TableHead>Codigo</TableHead>
                                                        <TableHead>Descripcio</TableHead>
                                                        <TableHead>Estado</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>


                                                    {
                                                        itemGrupoConcept.map((item, index) => {
                                                            const state: boolean = item.estado === 1;

                                                            return (
                                                                <TableRow key={index}>
                                                                    <TableCell>
                                                                        <RadioGroupItem
                                                                            value={item.idConcepto.toString()}
                                                                            id={item.idConcepto.toString()}
                                                                            onClick={() => {
                                                                                selectItemConcepto(item.idConcepto)
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>{item.codigo}</TableCell>
                                                                    <TableCell>{item.descripcion}</TableCell>
                                                                    <TableCell>
                                                                        <Badge variant={state ? "success" : "destructive"}>
                                                                            {state ? "Activo" : "Inactivo"}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </TableBody>
                                            </Table>
                                        </RadioGroup>
                                    </div>
                                )
                            }
                        </div>
                    </CardContent>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-gray-500">Afectaciones</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center  rounded-md shadow-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nro</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Estado</TableHead>
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
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
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

export default MantenimientoConceptoIdPage
