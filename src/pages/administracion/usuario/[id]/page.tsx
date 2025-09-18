import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionSelect } from "@/interfaces";
import { UsuarioRequest } from "@/interfaces/usuario.interface";
import { Building2, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { EmpresaSelect } from "../ui/empresa-select";
import { EmpresaList } from "@/interfaces/empresas.interface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


interface FormUsuarioInput extends UsuarioRequest {
    rol: OptionSelect | null,
    confirmPassword: string
}


const UsuarioIdPage = () => {
    
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const {control , register ,watch, formState: {errors}} = useForm<FormUsuarioInput>({
        defaultValues: {
            
        }
    })
    const password = watch("password"); 
    const [empresa, setEmpresa] = useState<EmpresaList[]>([])
    const [selectedCompany, setSelectedCompany] = useState<EmpresaList | null>(null)

    const handleAddCompany = () => {
        if (selectedCompany && !empresa.find((c) => c.id === selectedCompany.id)) {
        setEmpresa((prev) => [...prev, selectedCompany])
        setSelectedCompany(null)
        }
    }

    const handleRemoveCompany = (id: number) => {
        setEmpresa((prev) => prev.filter((c) => c.id !== id))
    }

   
    
    return (
        <>
            <HeaderPage title="Nuevo Usuario" descripcion="Informacion detallada del usuario" />
            <form className="flex flex-col gap-5 mt-4" >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-gray-500">Datos Generales</CardTitle>
                        <hr />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2">         
                            <div className="flex flex-col col-span-4 space-y-2 gap-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Nombre<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="firstName"
                                            placeholder=""
                                            {...register("firstName", { required: "El Codigo es requerido" })}
                                            />
                                            {errors.firstName && (
                                            <p className="msg-error">{errors.firstName.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="codigo">Apellido<span className="font-semibold text-red-600">*</span></Label>
                                        <Input
                                            id="lastName"
                                            placeholder=""
                                            {...register("lastName", { required: "El Codigo es requerido" })}
                                            />
                                            {errors.lastName && (
                                            <p className="msg-error">{errors.lastName.message}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col space-y-2 relative">
                                        <label htmlFor="password">Contraseña <span className="font-semibold text-red-600">*</span></label>
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="border rounded-md p-2"
                                            {...register("password", { required: "La contraseña es requerida" })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-10"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        {errors.password && (
                                        <p className="msg-error">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-2 relative">
                                        <label htmlFor="confirmPassword">Confirmar contraseña<span className="font-semibold text-red-600">*</span></label>
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirm ? "text" : "password"}
                                            className="border rounded-md p-2"
                                            {...register("confirmPassword", {
                                                required: "La confirmación es requerida",
                                                validate: (value) =>
                                                value === password || "Las contraseñas no coinciden",
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-10">
                                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        {errors.confirmPassword && (
                                        <p className="msg-error">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="documento">Rol <span className="font-semibold text-red-600">*</span></Label>
                                        <Controller
                                            name="rol"
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
                                        {errors.rol && (
                                        <p className="msg-error">{errors.rol.message}</p>
                                        )}
                                    </div>
                                    
                                    
                                </div>
                            </div>
                        </div>
                        
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Agregar Nueva Empresa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Buscar empresa</label>
                            <EmpresaSelect
                            value={selectedCompany}
                            onChange={setSelectedCompany}
                            placeholder="Escribe para buscar empresas..."
                            />
                        </div>
                        <Button onClick={handleAddCompany} disabled={!selectedCompany} className="h-10 px-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar
                        </Button>
                        </div>
                    </CardContent>
                    <CardContent>
                        {empresa.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay empresas agregadas aún</p>
                            <p className="text-sm">Usa el selector de arriba para agregar empresas</p>
                        </div>
                        ) : (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Ruc</TableHead>
                                <TableHead>Razon Social</TableHead>
                                <TableHead className="w-[100px]">Acciones</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {empresa.map((empre) => (
                                <TableRow key={empre.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    {empre.code}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{empre.ruc}</Badge>
                                </TableCell>
                                <TableCell>{empre.razonSocial}</TableCell>
                                <TableCell>
                                    <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCompany(empre.id)}
                                    className="text-destructive hover:text-destructive"
                                    >
                                    <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
                
            </form>
        </>
    );
} 

export default UsuarioIdPage
