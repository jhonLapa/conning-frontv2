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

// 🚨 Importar la interfaz correcta
import { CuentaBancariaTrabajador } from "@/interfaces/cuenta-bancaria-trabajador.interface";
// 🚨 Importar el servicio de activación/desactivación correcto
import { activeOrdesactiveCuentaBancaria } from "@/services/cuenta-bancaria-trabajador.service";
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
  // 🚨 Usar la interfaz de la cuenta bancaria
  cuenta: CuentaBancariaTrabajador;
  onRefresh: () => void;
}

// 🚨 Renombrar el componente
export default function ActionsCuentaBancaria({ cuenta, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🚨 Adaptar la función para el ID de la cuenta bancaria
  const handleChangeStatus = async (idCuentaBanco: number) => {
    setIsLoading(true);

    // 🚨 Llamar al servicio de cuenta bancaria
    const response = await activeOrdesactiveCuentaBancaria(idCuentaBanco);

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
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            // 🚨 Copiar el ID de la cuenta bancaria
            navigator.clipboard.writeText(
              cuenta.idCuentaBanco.toString()
            );
            toast("ID de cuenta copiado");
          }}
        >
          <Copy size={18} />
          <span className="text-sm ml-2">Copiar ID de la cuenta</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            // 🚨 Ruta de edición de la cuenta (ajusta la ruta si es necesario)
            to={`/cuentabancaria/${cuenta.idCuentaBanco}`} 
            className="flex flex-row items-center gap-2"
          >
            <Pencil size={18} />
            <span className="text-sm">Editar cuenta</span>
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
                {/* 🚨 Usar el estado de la cuenta */}
                {cuenta.estado === 1 ? (
                  <Trash2 size={18} />
                ) : (
                  <BadgeCheck size={18} />
                )}
                {/* 🚨 Texto de acción */}
                {cuenta.estado === 1
                  ? "Desactivar cuenta"
                  : "Activar cuenta"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás absolutamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción
                  {/* 🚨 Texto de descripción del estado */}
                  {cuenta.estado === 1 ? " desactivará" : " activará"} la
                  cuenta bancaria de nuestros servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    // 🚨 Pasar el ID de la cuenta bancaria
                    handleChangeStatus(cuenta.idCuentaBanco);
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