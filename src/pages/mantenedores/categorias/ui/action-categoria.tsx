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
import { Categoria } from "@/interfaces/categoria.interface";
import { activeOrdesactiveCategoria } from "@/services/categoria.service";
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
  categoria: Categoria;
  onRefresh: () => void;
}

export default function ActionsCategoria({ categoria, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async (idCategoria: number) => {
    setIsLoading(true);

    const response = await activeOrdesactiveCategoria(idCategoria);

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
        title="Copiar ID del categoria"
        onClick={() => {
          navigator.clipboard.writeText(categoria.idCategoria.toString());
          toast("ID copiado al portapapeles", { position: "top-center" });
        }}
      >
        <Copy size={18} />
      </Button>

      {/* 🟡 Editar */}
      <Link to={`/categoria/${categoria.idCategoria}`}>
        <Button
          size="icon"
          variant="ghost"
          className="bg-yellow-500 hover:bg-yellow-500 text-white rounded-md p-2 transition"
          title="Editar categoria"
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
              categoria.estado === 1
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
            title={
              categoria.estado === 1
                ? "Desactivar categoría"
                : "Activar categoría"
            }
          >
            <RefreshCw
              size={18}
              className={`transition-transform duration-300 ease-in-out ${
                categoria.estado === 1
                  ? "group-hover:rotate-[-90deg]"
                  : "group-hover:rotate-90"
              }`}
            />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {categoria.estado === 1
                ? "¿Desactivar categoria?"
                : "¿Activar categoria?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción{" "}
              {categoria.estado === 1 ? "desactivará" : "activará"} el documento
              en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleChangeStatus(categoria.idCategoria)}
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
