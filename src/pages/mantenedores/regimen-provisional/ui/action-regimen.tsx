import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Regimen } from "@/interfaces/regimen.interface"; 
import { activeOrDesactiveRegimen } from "@/services/regimen.service"; 
import {
    BadgeCheck,
    Copy,
    Loader2,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Props {
    regimen: Regimen;
    onRefresh: () => void;
}

export default function ActionsRegimen({ regimen, onRefresh }: Props) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeStatus = async (idRegimen: number) => {
        setIsLoading(true);
        const response = await activeOrDesactiveRegimen(idRegimen);
        if (!response.success) {
            setIsLoading(false);
            toast.warning(response?.message, { position: "top-center" });
            return;
        }
        setIsLoading(false);
        toast.success(response?.message, { position: "top-right" });
        onRefresh();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>                
                <DropdownMenuItem
                    onClick={() => {
                        navigator.clipboard.writeText(
                            // Usamos idRegimen
                            regimen.idRegimen.toString() 
                        );
                        toast("ID de Régimen copiado");
                    }}
                >
                    <Copy size={18} />
                    <span className="text-sm ml-2">Copiar ID del Régimen</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem>
                    <Link
                        to={`/regimen/${regimen.idRegimen}`} 
                        className="flex flex-row items-center gap-2"
                    >
                        <Pencil size={18} />
                        <span className="text-sm">Editar Régimen</span>
                    </Link>
                </DropdownMenuItem>               
                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault(); 
                    }}
                >
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <button className="w-full flex flex-row items-center gap-2 py-1">
                                {regimen.estado === 1 ? (
                                    <Trash2 size={18} />
                                ) : (
                                    <BadgeCheck size={18} />
                                )}
                                {regimen.estado === 1
                                    ? "Desactivar Régimen"
                                    : "Activar Régimen"}
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    ¿Estás absolutamente seguro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción
                                    {regimen.estado === 1 ? " desactivará" : " activará"} el
                                    régimen de nuestros servidores.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isLoading}>
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        handleChangeStatus(regimen.idRegimen);
                                    }}
                                    disabled={isLoading}
                                    className="gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Cargando...
                                        </>
                                    ) : (
                                        "Continuar"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}