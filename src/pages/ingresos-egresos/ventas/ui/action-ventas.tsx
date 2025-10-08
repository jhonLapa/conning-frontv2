import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Venta } from "@/interfaces/venta.interface";
import { Copy, MoreHorizontal, Eye, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getFetchVentaByIdData } from "@/services/venta.service";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  venta: Venta;
  onRefresh: () => void;
}

export default function ActionsVenta({ venta }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const handleVerDetalle = async () => {
    try {
      setLoading(true);
      const detalle = await getFetchVentaByIdData(venta.idVenta);
      setVentaDetalle(detalle);
      setIsOpen(true);
    } catch (error: unknown) {
      console.error(error);
      toast("Error al obtener detalle de la venta");
    } finally {
      setLoading(false);
    }
  };

  const handleEditVenta = async () => {
    setIsEditing(true);
    try {
      navigate(`/venta/${venta.idVenta}`);
      toast.success("Redirigiendo a editar venta...", {
        position: "top-right",
      });
    } catch (error: unknown) {
      console.error(error);
      toast.error("No se pudo editar la venta", { position: "top-center" });
    } finally {
      setIsEditing(false);
      setAlertOpen(false);
    }
  };

  const formatCurrency = (value: number, currency: "PEN" | "USD") =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency,
    }).format(value);

  return (
    <>
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
              navigator.clipboard.writeText(venta.idVenta.toString());
              toast("ID copiado");
            }}
          >
            <Copy size={18} />
            <span className="text-sm ml-2">Copiar ID de la venta</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleVerDetalle} disabled={loading}>
            <Eye size={18} />
            <span className="text-sm ml-2">
              {loading ? "Cargando..." : "Ver detalle"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
              <AlertDialogTrigger asChild>
                <button className="w-full flex flex-row items-center gap-2 py-1">
                  <Pencil size={18} />
                  <span className="text-sm">Editar venta</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Estás seguro de editar esta venta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción te llevará al formulario de edición de la venta.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isEditing}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleEditVenta}
                    disabled={isEditing}
                    className="gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando...
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-xl p-6 bg-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Detalle de la venta #{venta.idVenta}
            </DialogTitle>
          </div>

          <DialogDescription className="text-sm text-gray-700 space-y-4">
            {loading ? (
              <p className="text-center">Cargando...</p>
            ) : ventaDetalle ? (
              <div className="space-y-2">
                <p>
                  <strong>Cliente:</strong>{" "}
                  {ventaDetalle.cliente?.nombreCompleto}
                </p>
                <p>
                  <strong>Tipo Comprobante:</strong>{" "}
                  {ventaDetalle.tipoComprobante?.nombre}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(ventaDetalle.fechaEmision).toLocaleDateString()}
                </p>
                <p>
                  <strong>Forma de pago:</strong> {ventaDetalle.formaPago}
                </p>
                <p>
                  <strong>Moneda:</strong> {ventaDetalle.tipoMoneda}
                </p>
                <p>
                  <strong>Importe total:</strong> {ventaDetalle.importeTotal}
                </p>

                <div>
                  <strong>Detalles:</strong>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    {ventaDetalle.detalles.map((d) => (
                      <li key={d.idDetalleVenta}>
                        {d.descripcion} - {d.cantidad} {d.unidadMedida} -
                        V.unitario:{" "}
                        {formatCurrency(
                          d.valorUnitario,
                          ventaDetalle.tipoMoneda as "PEN" | "USD"
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p>No hay detalles disponibles</p>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
