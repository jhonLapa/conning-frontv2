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
import { Planilla } from "@/interfaces";

import { activeOrdesactivePlanilla } from "@/services/planilla.service";
import {
  Copy,
  Loader2,
  Pencil,
  RefreshCw,
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

    const response = await activeOrdesactivePlanilla(
      idPlanilla
    );

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
    <div className="flex justify-center gap-2">
      {/* 🔵 Copiar ID */}
      <Button
        size="icon"
        className="rounded-md bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
        title="Copiar ID del planilla"
        onClick={() => {
          navigator.clipboard.writeText(planilla.idPlanilla.toString());
          toast("ID copiado al portapapeles", { position: "top-center" });
        }}
      >
        <Copy className="h-4 w-4" />
      </Button>

      {/* 🟡 Editar */}
      <Link to={`/planilla/${planilla.idPlanilla}`}>
        <Button
          size="icon"
          className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm"
          title="Editar planilla"
        >
          <Pencil size={18} />
        </Button>
      </Link>

      {/* ⚫ Activar/Desactivar */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            //variant="ghost"
            className={`rounded-md p-2 transition-all text-white ${
              planilla.estado === 1
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            title={
              planilla.estado === 1
                ? "Desactivar planilla"
                : "Activar planilla"
            }
          >
            <RefreshCw
              size={18}
              className={`transition-transform duration-300 ease-in-out ${
                planilla.estado === 1
                  ? "group-hover:rotate-[-90deg]"
                  : "group-hover:rotate-90"
              }`}
            />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {planilla.estado === 1
                ? "¿Desactivar planilla?"
                : "¿Activar planilla?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción{" "}
              {planilla.estado === 1 ? "desactivará" : "activará"} el documento
              en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleChangeStatus(planilla.idPlanilla)}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
