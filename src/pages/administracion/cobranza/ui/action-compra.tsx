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
import {
  FileText,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditarCompraModal from "../components/EditarCompraModal";

interface Props {
  compra: Compra;
  onRefresh: () => void;
}

export default function ActionsCompra({ compra, onRefresh }: Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const compraCompleta = await compraService.getById(compra.idCompra);
      generarPDFFactura(compraCompleta, true);
      toast.success("PDF generado exitosamente", { position: "top-right" });
    } catch (error) {
      toast.error("Error al generar el PDF", { position: "top-center" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEditar = () => {
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
  };

  const handleCompraGuardada = () => {
    onRefresh();
  };

  const handleDelete = async (idCompra: number) => {
    setIsLoading(true);

    try {
      await compraService.delete(idCompra);
      setIsLoading(false);
      toast.success("Compra eliminada exitosamente", { position: "top-right" });
      setOpen(false);
      onRefresh();
    } catch (error) {
      setIsLoading(false);
      toast.error("Error al eliminar la compra", { position: "top-center" });
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
          onClick={handleEditar}
          size="sm"
          className="h-8 w-8 p-0 bg-yellow-500 hover:bg-yellow-600 text-white transition-colors shadow-sm"
          title="Editar compra"
        >
          <Pencil className="h-4 w-4" />
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
              <AlertDialogTitle>
                ¿Estás absolutamente seguro?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente la compra{" "}
                <strong>{compra.serie}-{compra.numero}</strong> de nuestros servidores.
                Esta acción no se puede deshacer.
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

      {/* Modal de edición */}
      {modalAbierto && (
        <EditarCompraModal
          compra={compra}
          onClose={handleCerrarModal}
          onSaved={handleCompraGuardada}
        />
      )}
    </>
  );
}
