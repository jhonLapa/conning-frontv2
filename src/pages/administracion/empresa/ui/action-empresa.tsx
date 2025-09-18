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
import { EmpresaList } from "@/interfaces/empresas.interface";
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
  empresa: EmpresaList;
  onRefresh: () => void;
}

export default function ActionsEmpresa({ empresa, onRefresh }: Props) {
  
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async (id: number) => {
    setIsLoading(true);
    console.log(id)

    // const response = await activeOrinactiveRol(id);

    setIsLoading(false);

    // if (!response?.success) {
    //   toast.warning(response?.message, { position: "top-center" });
    //   return;
    // }

    // toast.success(response?.message, { position: "top-center" });
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
            navigator.clipboard.writeText(empresa.id.toString());
            toast("ID copiado");
          }}
        >
          <Copy size={18} />
          <span className="text-sm ml-2">Copiar ID de Empresa</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            to={`/empresa/${empresa.id}`}
            className="flex flex-row items-center gap-2"
          >
            <Pencil size={18} />
            <span className="text-sm">Editar Empresa</span>
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
                {empresa.estado ? <Trash2 size={18} /> : <BadgeCheck size={18} />}
                {empresa.estado ? "Desactivar Empresa" : "Activar Empresa"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás absolutamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción {empresa.estado ? "desactivara" : "activara"} la empresa
                  de nuestros servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleChangeStatus(empresa.id);
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
