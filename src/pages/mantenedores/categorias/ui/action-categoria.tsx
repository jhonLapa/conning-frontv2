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
import { Categoria } from "@/interfaces/categoria.interface";
import { activeOrdesactiveCategoria } from "@/services/categoria.service";
import { Copy, Loader2, Pencil, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  categoria: Categoria;
  onRefresh: () => void;
}

export default function ActionsCategoria({ categoria, onRefresh }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const navigate = useNavigate();

  // 🔁 Cambiar estado (Activo / Inactivo)
  const handleChangeEstado = async () => {
    try {
      setIsChanging(true);

      const response = await activeOrdesactiveCategoria(categoria.idCategoria);

      if (!response.success) {
        toast.warning(response.message, { position: "top-center" });
        return;
      }

      toast.success(response.message, { position: "top-right" });
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar el estado de la categoria", {
        position: "top-center",
      });
    } finally {
      setIsChanging(false);
      setAlertOpen(false);
    }
  };

  const handleEditCategoria = () => {
    try {
      setIsEditing(true);
      navigate(/categoria/${categoria.idCategoria});
    } catch (error: unknown) {
      console.error(error);
      toast.error("No se pudo editar la categoria", { position: "top-center" });
    } finally {
      setIsEditing(false);
    }
  };
  return (
    <div className="flex items-center justify-center gap-2">
      {/* 🟡 Editar categoria */}
      <Button
        size="icon"
        className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm"
        title="Editar categoria"
        onClick={handleEditCategoria}
        disabled={isEditing}
      >
        {isEditing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </Button>

      {/* 🧾 Copiar ID */}
      <Button
        size="icon"
        className="rounded-md bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
        title="Copiar ID de la categoria"
        onClick={() => {
          navigator.clipboard.writeText(categoria.idCategoria.toString());
          toast.success("ID copiado al portapapeles", {
            position: "top-right",
          });
        }}
      >
        <Copy className="h-4 w-4" />
      </Button>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            className="rounded-md bg-red-500 hover:bg-red-600 text-white shadow-sm"
            title="Cambiar estado"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Deseas cambiar el estado de esta categoria?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Actualmente está{" "}
              <strong>{categoria.estado === 1 ? "Activa" : "Inactiva"}</strong>.
              Se cambiará a{" "}
              <strong>{categoria.estado === 1 ? "Inactiva" : "Activa"}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isChanging}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangeEstado}
              disabled={isChanging}
              className="gap-2"
            >
              {isChanging ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cambiando...
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