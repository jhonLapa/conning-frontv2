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
import { Compra } from "@/interfaces/compra.interface";
import { compraService } from "@/services/compra.service";
import { generarPDFFactura } from "../utils/pdfGenerator";
import {
  Copy,
  FileText,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  compra: Compra;
  onRefresh: () => void;
}

export default function ActionsCompra({ compra, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
            navigator.clipboard.writeText(compra.idCompra.toString());
            toast("ID copiado");
          }}
        >
          <Copy size={18} />
          <span className="text-sm ml-2">Copiar ID</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Ver PDF */}
        <DropdownMenuItem
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <FileText size={18} />
          )}
          <span className="text-sm ml-2">
            {isGeneratingPDF ? "Generando..." : "Ver PDF"}
          </span>
        </DropdownMenuItem>

        {/* Editar - Comentado por ahora, se puede implementar después */}
        {/* <DropdownMenuItem>
          <Link
            to={`/cobranza/${compra.idCompra}`}
            className="flex flex-row items-center gap-2"
          >
            <Pencil size={18} />
            <span className="text-sm">Editar compra</span>
          </Link>
        </DropdownMenuItem> */}

        {/* Eliminar */}
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <button className="w-full flex flex-row items-center gap-2 py-1">
                <Trash2 size={18} />
                Eliminar compra
              </button>
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
