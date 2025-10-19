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
import { Planilla } from "@/interfaces/planilla";
import { activeOrdesactivePlanilla } from "@/services/planilla.service";
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
  planilla: Planilla;
  onRefresh: () => void;
}

export default function ActionsPlanilla({ planilla, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async (idPlanilla: number) => {
    setIsLoading(true);

    const response = await activeOrdesactivePlanilla(idPlanilla);

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
            navigator.clipboard.writeText(planilla.idPlanilla.toString());
            toast("ID copiado");
          }}
        >
          <Copy size={18} />
          <span className="text-sm ml-2">Copiar ID de planilla</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            to={`/planilla/${planilla.idPlanilla}`}
            className="flex flex-row items-center gap-2"
          >
            <Pencil size={18} />
            <span className="text-sm">Editar planilla</span>
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
                {planilla.estado === 1 ? (
                  <Trash2 size={18} />
                ) : (
                  <BadgeCheck size={18} />
                )}
                {planilla.estado === 1
                  ? "Desactivar planilla"
                  : "Activar planilla"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás absolutamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción {""}
                  {planilla.estado === 1 ? "desactivara" : "activara"} la
                  planilla de nuestros servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleChangeStatus(planilla.idPlanilla);
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
