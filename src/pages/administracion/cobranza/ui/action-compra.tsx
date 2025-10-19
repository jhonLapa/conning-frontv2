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
import { FileText, Loader2, Pencil, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Props {
  compra: Compra;
  onRefresh: () => void;
}

export default function ActionsCompra({ compra, onRefresh }: Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [isChanging, setIsChanging] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

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
      toast.error("No se pudo editar la compra", { position: "top-center" });
    } finally {
      setIsEditing(false);
    }
  };

  const handleChangeEstado = async () => {
    try {
      setIsChanging(true);
      const nuevoEstado = compra.estado === 1 ? 0 : 1;
      await compraService.activeOrdesactiveCompra(compra.idCompra);

      toast.success(
        `La compra se cambió a ${nuevoEstado === 1 ? "Activa" : "Inactiva"}`,
        { position: "top-right" }
      );
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar el estado de la compra", {
        position: "top-center",
      });
    } finally {
      setIsChanging(false);
      setAlertOpen(false);
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
          title="Editar compra"
          onClick={handleEditVenta}
          disabled={isEditing}
        >
          {isEditing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </Button>

           {/* 🔁 Cambiar estado */}
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger asChild>
           <Button
            size="icon"
            //variant="ghost"
            className={`rounded-md p-2 transition-all text-white ${
              compra.estado === 1
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            title={
              compra.estado === 1
                ? "Desactivar compra"
                : "Activar compra"
            }
          >
            <RefreshCw
              size={18}
              className={`transition-transform duration-300 ease-in-out ${
                compra.estado === 1
                  ? "group-hover:rotate-[-90deg]"
                  : "group-hover:rotate-90"
              }`}
            />
          </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Deseas cambiar el estado de esta compra?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Actualmente está{" "}
                <strong>
                  {compra.estado === 1 ? "Activa" : "Inactiva"}
                </strong>. Se cambiará a{" "}
                <strong>
                  {compra.estado === 1 ? "Inactiva" : "Activa"}
                </strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isChanging}>Cancelar</AlertDialogCancel>
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
    </>
  );
}
