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
import { Compra } from "@/interfaces/compra.interface";
import { compraService } from "@/services/compra.service";
import { generarPDFFactura } from "../utils/pdfGenerator";
import { FileText, Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Props {
  compra: Compra;
  onRefresh: () => void;
}

export default function ActionsCompra({ compra, onRefresh }: Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleGeneratePDF = async (): Promise<void> => {
    setIsGeneratingPDF(true);
    try {
      if (!compra?.idCompra) {
        toast.warning("⚠️ No hay una compra seleccionada para generar el PDF", {
          position: "top-center",
        });
        return;
      }

      const compraCompleta = await compraService.getById(compra.idCompra);

      if (!compraCompleta) {
        toast.error("❌ No se encontró la compra en el servidor", {
          position: "top-center",
        });
        return;
      }

      await generarPDFFactura(compraCompleta, true);
      toast.success("✅ PDF generado exitosamente", { position: "top-right" });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("❌ Error al generar el PDF", { position: "top-center" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEditVenta = () => {
    try {
      setIsEditing(true);
      navigate(`/cobranza/${compra.idCompra}`);
    } catch (error: unknown) {
      console.error(error);
      toast.error("No se pudo editar la venta", { position: "top-center" });
    } finally {
      setIsEditing(false);
    }
  };

const handleDelete = async (idCompra: number) => {
  setIsLoading(true);

  try {
    if (!idCompra) {
      toast.warning("⚠️ ID de compra inválido", { position: "top-center" });
      return;
    }

    const response = await compraService.delete(idCompra);

    if (response.error) {
      toast.warning(response.message, { position: "top-center" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setOpen(false);
    onRefresh?.();
  } catch (error) {
    console.error("Error al eliminar la compra:", error);
    toast.error("❌ Error inesperado al eliminar la compra", { position: "top-center" });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* Botón Ver PDF - Fondo Azul */}
        <Button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          size="sm"
          className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm"
          title="Ver PDF"
        >
          {isGeneratingPDF ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </Button>

        {/* Botón Editar - Fondo Amarillo */}
        <Button
          size="icon"
          className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm"
          title="Editar venta"
          onClick={handleEditVenta}
          disabled={isEditing}
        >
          {isEditing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </Button>

        {/* Botón Eliminar - Fondo Rojo */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm"
              title="Eliminar compra"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente la compra{" "}
                <strong>
                  {compra.serie}-{compra.numero}
                </strong>{" "}
                de nuestros servidores. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDelete(compra.idCompra);
                }}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Continuar"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
