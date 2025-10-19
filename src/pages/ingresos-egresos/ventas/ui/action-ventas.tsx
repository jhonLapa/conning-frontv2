import { Button } from "@/components/ui/button";
import { Venta } from "@/interfaces/venta.interface";
import { Copy, Eye, Pencil, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { activeOrdesactiveVenta, getFetchVentaByIdData } from "@/services/venta.service";
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

export default function ActionsVenta({ venta, onRefresh }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const navigate = useNavigate();

  // 🔵 Ver detalle
  const handleVerDetalle = async () => {
    try {
      setLoading(true);
      const detalle = await getFetchVentaByIdData(venta.idVenta);
      setVentaDetalle(detalle);
      setIsOpen(true);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error al obtener detalle de la venta");
    } finally {
      setLoading(false);
    }
  };

  // 🟡 Editar venta
  const handleEditVenta = () => {
    try {
      setIsEditing(true);
      navigate(`/venta/${venta.idVenta}`);
    } catch (error: unknown) {
      console.error(error);
      toast.error("No se pudo editar la venta", { position: "top-center" });
    } finally {
      setIsEditing(false);
    }
  };

  // 🔁 Cambiar estado (Activo / Inactivo)
  const handleChangeEstado = async () => {
    try {
      setIsChanging(true);
      const nuevoEstado = venta.estado === 1 ? 0 : 1;
      await activeOrdesactiveVenta(venta.idVenta);

      toast.success(
        `La venta se cambió a ${nuevoEstado === 1 ? "Activa" : "Inactiva"}`,
        { position: "top-right" }
      );
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar el estado de la venta", {
        position: "top-center",
      });
    } finally {
      setIsChanging(false);
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
      {/* ✅ Botones redondeados de acción */}
      <div className="flex items-center justify-center gap-2">
        {/* 🔵 Ver detalle */}
        <Button
          size="icon"
          className="rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
          title="Ver detalle"
          onClick={handleVerDetalle}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>

        {/* 🟡 Editar venta */}
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

        {/* 🧾 Copiar ID */}
        <Button
          size="icon"
          className="rounded-md bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
          title="Copiar ID de la venta"
          onClick={() => {
            navigator.clipboard.writeText(venta.idVenta.toString());
            toast.success("ID copiado al portapapeles", {
              position: "top-right",
            });
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>

        {/* 🔁 Cambiar estado */}
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger asChild>
           <Button
            size="icon"
            //variant="ghost"
            className={`rounded-md p-2 transition-all text-white ${
              venta.estado === 1
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            title={
              venta.estado === 1
                ? "Desactivar venta"
                : "Activar venta"
            }
          >
            <RefreshCw
              size={18}
              className={`transition-transform duration-300 ease-in-out ${
                venta.estado === 1
                  ? "group-hover:rotate-[-90deg]"
                  : "group-hover:rotate-90"
              }`}
            />
          </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Deseas cambiar el estado de esta venta?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Actualmente está{" "}
                <strong>
                  {venta.estado === 1 ? "Activa" : "Inactiva"}
                </strong>. Se cambiará a{" "}
                <strong>
                  {venta.estado === 1 ? "Inactiva" : "Activa"}
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

      {/* 🧾 Dialog Detalle de Venta */}
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
                        {d.descripcion} - {d.cantidad} {d.unidadMedida} - V.unitario:{" "}
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
