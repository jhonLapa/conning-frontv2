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
import { TipoComprobante } from "@/interfaces/tipo-comprobante.interface";
import { activeOrdesactiveComprobante } from "@/services/tipo-comprobante.service";
import {
  BadgeCheck,
  Copy,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  comprobante: TipoComprobante;
  onRefresh: () => void;
}

export default function ActionsComprobante({ comprobante, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async (idTipoComprobante: number) => {
    setIsLoading(true);

    const response = await activeOrdesactiveComprobante(idTipoComprobante);

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
        variant="ghost"
        className="bg-gray-500 hover:bg-sky-600 text-white rounded-md p-2 transition"
        title="Copiar ID del comprobante"
        onClick={() => {
          navigator.clipboard.writeText(comprobante.idTipoComprobante.toString());
          toast("ID copiado al portapapeles", { position: "top-center" });
        }}
      >
        <Copy size={18} />
      </Button>

      {/* 🟡 Editar */}
      <Link to={`/tipocomprobante/${comprobante.idTipoComprobante}`}>
        <Button
          size="icon"
          variant="ghost"
          className="bg-yellow-500 hover:bg-yellow-500 text-white rounded-md p-2 transition"
          title="Editar comprobante"
        >
          <Pencil size={18} />
        </Button>
      </Link>

      {/* ⚫ Activar/Desactivar */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={`rounded-md p-2 transition-all text-white ${
              comprobante.estado === 1
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
            title={
              comprobante.estado === 1
                ? "Desactivar comprobante"
                : "Activar comprobante"
            }
          >
            <RefreshCw
              size={18}
              className={`transition-transform duration-300 ease-in-out ${
                comprobante.estado === 1
                  ? "group-hover:rotate-[-90deg]"
                  : "group-hover:rotate-90"
              }`}
            />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {comprobante.estado === 1
                ? "¿Desactivar comprobante?"
                : "¿Activar comprobante?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción{" "}
              {comprobante.estado === 1 ? "desactivará" : "activará"} el documento
              en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleChangeStatus(comprobante.idTipoComprobante)}
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
