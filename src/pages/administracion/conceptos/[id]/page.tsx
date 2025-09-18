import HeaderPage from "@/components/header-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Concepto } from "@/interfaces/concepto.interface";
import { useState } from "react";
import { useForm } from "react-hook-form";



const ConceptosIdPage = () => {
    
   
    const {register , formState: {errors}} = useForm<Concepto>({
        defaultValues: {
            
        }
    })
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
        "essalud-regular-trabajador": true,
        "sistema-privado-pensiones": true,
        "essalud-cdss-seg-trab-pesquero": true,
        "renta-5ta-categoria-retenciones": true,
        "essalud-seguro-agrario-acuicultor": true,
        "essalud-seguro-regular-pensionista": false,
        "essalud-sctr": true,
        "contrib-solidaria-asistencia-previsional": false,
        "impuesto-extraord-solidaridad": true,
        "aporte-al-fonahpu-ley-29471": false,
        "fondo-derechos-sociales-artista": true,
        "snp-independientes-ley-29903": true,
        senati: true,
        "rep-trab-pesquero-ley-30003": true,
        "sistema-nacional-pensiones-19990": true,
        "generar-archivo-plame": true,
        "compensacion-tiempo-servicios": true,
        gratificaciones: true,
        vacaciones: true,
        "rem-variable": false,
    })

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setCheckedItems((prev) => ({
        ...prev,
        [id]: checked,
        }))
    }

    const checkboxData = [
        // Columna izquierda
        [
        { id: "essalud-regular-trabajador", label: "EsSalud seguro regular Trabajador" },
        { id: "essalud-cdss-seg-trab-pesquero", label: "EsSalud - CDSS - SEG trab Pesquero" },
        { id: "essalud-seguro-agrario-acuicultor", label: "EsSalud seguro Agrario / Acuicultor" },
        { id: "essalud-sctr", label: "EsSalud SCTR" },
        { id: "impuesto-extraord-solidaridad", label: "Impuesto extraord. de Solidaridad (5)" },
        { id: "fondo-derechos-sociales-artista", label: "Fondo derechos sociales del Artista" },
        { id: "senati", label: "SENATI" },
        { id: "sistema-nacional-pensiones-19990", label: "Sistema Nacional de Pensiones 19990" },
        { id: "compensacion-tiempo-servicios", label: "Compensación por tiempo de servicios" },
        { id: "vacaciones", label: "Vacaciones" },
        ],
        // Columna derecha
        [
        { id: "sistema-privado-pensiones", label: "Sistema Privado de Pensiones" },
        { id: "renta-5ta-categoria-retenciones", label: "Renta 5ta categoría Retenciones" },
        { id: "essalud-seguro-regular-pensionista", label: "EsSalud seguro regular Pensionista" },
        { id: "contrib-solidaria-asistencia-previsional", label: "Contrib. solidaria Asistencia Previsional" },
        { id: "aporte-al-fonahpu-ley-29471", label: "Aporte al Fonahpu - Ley 29471" },
        { id: "snp-independientes-ley-29903", label: "SNP - Independientes - Ley 29903" },
        { id: "rep-trab-pesquero-ley-30003", label: "Rep - Trab. Pesquero Ley 30003" },
        { id: "generar-archivo-plame", label: "Generar en archivo para el PLAME" },
        { id: "gratificaciones", label: "Gratificaciones" },
        { id: "rem-variable", label: "Rem. Variable" },
        ],
    ]
   
    
    return (
        <>
            <HeaderPage title="Nuevo concepto" descripcion="Informacion detallada del concepto" />
            <form className="flex flex-col gap-5 mt-4" >
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
                                        <Input
                                            id="grupo"
                                            placeholder=""
                                            {...register("grupo", { required: "El grupo es requerido" })}
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
                                            {...register("code", { required: "El Codigo es requerido" })}
                                            />
                                            {errors.code && (
                                            <p className="msg-error">{errors.code.message}</p>
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
                                            {...register("principalDH", { required: "El principal DH es requerido" })}
                                            />
                                            {errors.principalDH && (
                                            <p className="msg-error">{errors.principalDH.message}</p>
                                        )}
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <CardTitle className="text-lg font-light text-gray-500 mt-6">Permisos</CardTitle>
                        <hr />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                            {checkboxData.map((column, columnIndex) => (
                            <div key={columnIndex} className="space-y-4">
                                {column.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center space-x-3 p-3 rounded-lg  group"
                                >
                                    <Checkbox
                                    id={item.id}
                                    checked={checkedItems[item.id]}
                                    onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                                />
                                    <label
                                    htmlFor={item.id}
                                     >
                                    {item.label}
                                    </label>
                                </div>
                                ))}
                            </div>
                            ))}
                        </div>
                        
                    </CardContent>
                </Card>
                
                
            </form>
        </>
    );
} 

export default ConceptosIdPage
