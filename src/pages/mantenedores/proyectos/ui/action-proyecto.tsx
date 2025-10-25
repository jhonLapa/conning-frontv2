import { Button } from "@/components/ui/button";
import { Proyecto } from "@/interfaces/proyecto.interface";
import { activeOrdesactiveProyecto } from "@/services/proyecto.service";
import { Copy, Loader2, Pencil, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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

export default function ActionsProyecto({
  proyecto,
  onRefresh,
}: {
  proyecto: Proyecto;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async (idProyecto: number) => {
    setIsLoading(true);
    try {
      const response = await activeOrdesactiveProyecto(idProyecto);

      if (!response.success) {
        toast.warning(response?.message, { position: "top-center" });
        return;
      }

      toast.success(response?.message, { position: "top-right" });
      onRefresh(); // 🔁 Actualiza la lista al cambiar estado
    } catch (error) {
      console.log(error);
      toast.error("Error al cambiar el estado del proyecto");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {/* 🔵 Copiar ID */}
      <Button
        size="icon"
        className="rounded-md bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
        title="Copiar ID del proyecto"
        onClick={() => {
          navigator.clipboard.writeText((proyecto.idProyecto ?? 0).toString());
          toast("ID copiado al portapapeles", { position: "top-center" });
        }}
      >
        <Copy className="h-4 w-4" />
      </Button>

      {/* 🟡 Editar */}
      <Link to={`/proyecto/${proyecto.idProyecto}`}>
        <Button
          size="icon"
          className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm"
          title="Editar proyecto"
        >
          <Pencil size={18} />
        </Button>
      </Link>

      {/* 🔴/🟢 Activar/Desactivar */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            className={`rounded-md p-2 transition text-white ${
              proyecto.estado === 1
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            title={
              proyecto.estado === 1 ? "Desactivar proyecto" : "Activar proyecto"
            }
          >
            <RefreshCw
              size={18}
              className={`transition-transform duration-300 ease-in-out ${
                proyecto.estado === 1
                  ? "group-hover:rotate-[-90deg]"
                  : "group-hover:rotate-90"
              }`}
            />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {proyecto.estado === 1
                ? "¿Desactivar proyecto?"
                : "¿Activar proyecto?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción {proyecto.estado === 1 ? "desactivará" : "activará"}{" "}
              el proyecto en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleChangeStatus(proyecto.idProyecto ?? 0)}
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
