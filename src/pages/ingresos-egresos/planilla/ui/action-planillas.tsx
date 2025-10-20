import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Planilla } from "@/interfaces/planilla";
import { getFetchPlanillaById } from "@/services/planilla.service";
import { ClipboardList, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  planilla: Planilla;
  //onRefresh: () => void;
}

export default function ActionsPlanilla({ planilla }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [planillaDetalle, setPlanillaDetalle] = useState<Planilla | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  // const handleChangeStatus = async (idPlanilla: number) => {
  //   setIsLoading(true);

  //   const response = await activeOrdesactivePlanilla(idPlanilla);

  //   if (!response.success) {
  //     setIsLoading(false);
  //     toast.warning(response?.message, { position: "top-center" });
  //     return;
  //   }

  //   setIsLoading(false);
  //   toast.success(response?.message, { position: "top-right" });
  //   onRefresh();
  // };

  // 🔵 Ver detalle
  const handleVerDetalle = async () => {
    try {
      setIsLoading(true);
      const detalle = await getFetchPlanillaById(planilla.idPlanilla);
      setPlanillaDetalle(detalle);

      setOpen(true);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error al obtener detalle de la venta");
    } finally {
      setIsLoading(false);
    }
  };

  // 🟡 Editar venta
  const handleEditVenta = () => {
    try {
      setIsEditing(true);
      navigate(`/planilla/${planilla.idPlanilla}`);
    } catch (error: unknown) {
      console.error(error);
      toast.error("No se pudo editar la planilla", { position: "top-center" });
    } finally {
      setIsEditing(false);
    }
  };

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
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>

        {/* 🟡 Editar venta */}
        <Button
          size="icon"
          className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm"
          title="Editar planilla"
          onClick={handleEditVenta}
          disabled={isEditing}
        >
          {isEditing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ClipboardList className="h-4 w-4" />
          )}
        </Button>

        {/* 🧾 Copiar ID */}
        {/* <Button
          size="icon"
          className="rounded-md bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
          title="Copiar ID de la planilla"
          onClick={() => {
            navigator.clipboard.writeText(planilla.idPlanilla.toString());
            toast.success("ID copiado al portapapeles", {
              position: "top-right",
            });
          }}
        >
          <Copy className="h-4 w-4" />
        </Button> */}
      </div>
      {/* 🧾 Dialog Detalle de Venta */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-xl p-6 bg-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Detalle de la planilla #{planilla.idPlanilla}
            </DialogTitle>
          </div>

          <DialogDescription className="text-sm text-gray-700 space-y-4">
            {isLoading ? (
              <p className="text-center">Cargando...</p>
            ) : planillaDetalle ? (
              <div className="space-y-2">
                <p>
                  <strong>Mes:</strong> {planillaDetalle.mes}
                </p>
                <p>
                  <strong>Año:</strong> {planillaDetalle.anio}
                </p>
                <p>
                  <strong>Fecha de creacion:</strong>{" "}
                  {new Date(planillaDetalle.fechaCreacion).toLocaleDateString()}
                </p>
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
