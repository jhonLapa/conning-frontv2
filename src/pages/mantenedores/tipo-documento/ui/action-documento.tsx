import { Button } from "@/components/ui/button";
import { TipoDocumento } from "@/interfaces/document.interface";
import { activeOrdesactiveDocument } from "@/services/document.service";
import { BadgeCheck, Copy, Loader2, Pencil, Trash2 } from "lucide-react";
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

export default function ActionsDocument({
  document,
  onRefresh,
}: {
  document: TipoDocumento;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async (idTipoDocumento: number) => {
    setIsLoading(true);
    const response = await activeOrdesactiveDocument(idTipoDocumento);

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
        className="bg-sky-500 hover:bg-sky-600 text-white rounded-md p-2 transition"
        title="Copiar ID del documento"
        onClick={() => {
          navigator.clipboard.writeText(document.idTipoDocumento.toString());
          toast("ID copiado al portapapeles", { position: "top-center" });
        }}
      >
        <Copy size={18} />
      </Button>

      {/* 🟡 Editar */}
      <Link to={`/tipodocumento/${document.idTipoDocumento}`}>
        <Button
          size="icon"
          variant="ghost"
          className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-md p-2 transition"
          title="Editar documento"
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
            className={`rounded-md p-2 transition text-white ${
              document.estado === 1
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            title={
              document.estado === 1
                ? "Desactivar documento"
                : "Activar documento"
            }
          >
            {document.estado === 1 ? (
              <Trash2 size={18} />
            ) : (
              <BadgeCheck size={18} />
            )}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {document.estado === 1
                ? "¿Desactivar documento?"
                : "¿Activar documento?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción{" "}
              {document.estado === 1 ? "desactivará" : "activará"} el documento
              en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleChangeStatus(document.idTipoDocumento)}
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
