import { Button } from "@/components/ui/button";
import { Trabajador, CuentaBancaria } from "@/interfaces/trabajador.interface";
import {
  Copy,
  Eye,
  Pencil,
  Loader2,
  Banknote,
  RefreshCw, // Agregamos RefreshCw para el estilo de "cambiar estado" como en Venta
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getFetchTrabajadorById,
  activeOrDesactiveTrabajador,
} from "@/services/trabajador.service";
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

// Eliminamos las importaciones de DropdownMenu ya que no se usarán
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MoreHorizontal } from "lucide-react"; // Ya no se necesita el icono de 3 puntos

interface Props {
  trabajador: Trabajador;
  onRefresh: () => void; // Función para refrescar la tabla
}

export default function ActionsTrabajador({ trabajador, onRefresh }: Props) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [trabajadorDetalle, setTrabajadorDetalle] = useState<Trabajador | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [alertEditOpen, setAlertEditOpen] = useState(false);
  const [alertStatusOpen, setAlertStatusOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const navigate = useNavigate();

  const isActivo = trabajador.estado === 1;

  // ... (funciones handleVerDetalle, handleEditTrabajador, handleToggleStatus, renderCuentasBancarias se mantienen igual)
  const handleVerDetalle = async () => {
    try {
      setLoadingDetail(true);
      const detalle = await getFetchTrabajadorById(trabajador.idTrabajador);
      setTrabajadorDetalle(detalle);
      setIsDetailOpen(true);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error al obtener detalle del trabajador");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleEditTrabajador = () => {
    const id = trabajador.idTrabajador;
    setIsEditing(true);
    try {
      navigate(`/trabajador/${id}`);
      toast.success("Redirigiendo a editar trabajador...");
    } catch (error: unknown) {
      toast.error("Error al redirigir.");
    } finally {
      setIsEditing(false);
      setAlertEditOpen(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsChangingStatus(true);
    const newStatusText = isActivo ? "desactivar" : "activar";
    try {
      const response = await activeOrDesactiveTrabajador(
        trabajador.idTrabajador
      );

      if (response.success) {
        toast.success(`Trabajador ${newStatusText} exitosamente.`);
        onRefresh();
      } else {
        toast.error(
          `Error al ${newStatusText} el trabajador: ${response.message}`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        `Ocurrió un error de conexión al ${newStatusText} el trabajador.`
      );
    } finally {
      setIsChangingStatus(false);
      setAlertStatusOpen(false);
    }
  };

  const renderCuentasBancarias = (cuentas: CuentaBancaria[]) => {
    const principal = cuentas.find((c) => c.principal === 1);

    if (!principal) {
      return (
        <p className="text-gray-500">Sin cuenta bancaria principal registrada.</p>
      );
    }

    return (
      <div className="border-t pt-2 mt-2">
        <h4 className="font-semibold flex items-center gap-1">
          <Banknote size={16} /> Cuenta Principal:
        </h4>
        <ul className="list-disc ml-5 mt-1 text-xs space-y-1">
          <li>
            **Banco:** {principal.banco.nombre}
          </li>
          <li>
            **Nro Cuenta:** {principal.numeroCuenta}
          </li>
          <li>
            **Moneda:** {principal.moneda}
          </li>
          <li>
            **Tipo:** {principal.tipoCuenta}
          </li>
        </ul>
      </div>
    );
  };

  const statusText = isActivo ? "Desactivar" : "Activar";
  // Usamos RefreshCw como en el componente Venta para el cambio de estado.
  // const StatusIcon = isActivo ? PowerOff : CheckCircle;

  return (
    <>
      {/* 🛑 AQUÍ ESTÁ EL CAMBIO PRINCIPAL: Botones de acción directos */}
      <div className="flex items-center justify-center gap-2">
        {/* 🔵 Ver detalle */}
        <Button
          size="icon"
          className="rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
          title="Ver detalle"
          onClick={handleVerDetalle}
          disabled={loadingDetail}
        >
          {loadingDetail ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>

        {/* 🟡 Editar trabajador (Abre AlertDialog) */}
        <AlertDialog open={alertEditOpen} onOpenChange={setAlertEditOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              className="rounded-md bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm"
              title="Editar trabajador"
              disabled={isEditing}
            >
              {isEditing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Estás seguro de editar este trabajador?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción te llevará al formulario de edición.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isEditing}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleEditTrabajador}
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

        {/* 🧾 Copiar ID */}
        <Button
          size="icon"
          className="rounded-md bg-gray-500 hover:bg-gray-600 text-white shadow-sm"
          title="Copiar ID de trabajador"
          onClick={() => {
            navigator.clipboard.writeText(trabajador.idTrabajador.toString());
            toast.success("ID copiado al portapapeles", {
              position: "top-right",
            });
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>

        {/* 🔁 Cambiar estado (Activar/Desactivar) */}
        <AlertDialog open={alertStatusOpen} onOpenChange={setAlertStatusOpen}>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              // Usamos colores según el estado que tendrá DESPUÉS del click
              className={`rounded-md ${
                isActivo
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white shadow-sm`}
              title={`Cambiar estado a ${isActivo ? "Inactivo" : "Activo"}`}
              disabled={isChangingStatus}
            >
              {isChangingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {`¿Estás seguro de ${statusText.toLowerCase()} a este trabajador?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {`El estado del trabajador cambiará a ${
                  isActivo ? "INACTIVO" : "ACTIVO"
                }. Esto afecta su acceso y visibilidad en el sistema.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isChangingStatus}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleStatus}
                disabled={isChangingStatus}
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                {isChangingStatus ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  statusText
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* ---------------------------------------------
          MODAL DE DETALLE (Se mantiene igual)
      --------------------------------------------- */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-xl p-6 bg-white shadow-lg">
          <DialogTitle className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Detalle del Trabajador #{trabajador.idTrabajador}
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-700 space-y-4">
            {loadingDetail ? (
              <p className="text-center flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando detalles...
              </p>
            ) : trabajadorDetalle ? (
              <div className="space-y-3">
                {/* BLOQUE DE DATOS PERSONALES */}
                <h3 className="font-bold text-base text-blue-600">
                  Datos Personales
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p>
                    <strong>Nombre:</strong>{" "}
                    {trabajadorDetalle.apellidosNombres}
                  </p>
                  <p>
                    <strong>F. Nacimiento:</strong>{" "}
                    {trabajadorDetalle.fechaNacimiento.substring(0, 10)}
                  </p>
                  <p>
                    <strong>Documento:</strong>{" "}
                    {trabajadorDetalle.tipoDocumento.nombre} -{" "}
                    {trabajadorDetalle.numeroDocumento}
                  </p>
                  <p>
                    <strong>F. Ingreso:</strong>{" "}
                    {trabajadorDetalle.fechaIngreso.substring(0, 10)}
                  </p>
                  <p className="col-span-2">
                    <strong>Dirección:</strong>{" "}
                    {trabajadorDetalle.direccion || "No especificado"}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {trabajadorDetalle.telefono || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {trabajadorDetalle.email || "N/A"}
                  </p>
                </div>

                {/* BLOQUE DE DATOS LABORALES */}
                <h3 className="font-bold text-base text-blue-600 border-t pt-3 mt-3">
                  Datos Laborales
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p>
                    <strong>Categoría:</strong>{" "}
                    {trabajadorDetalle.categoria.nombre}
                  </p>
                  <p>
                    <strong>Régimen:</strong> {trabajadorDetalle.regimen.nombre}
                  </p>
                  <p className="col-span-2">
                    <strong>Estado:</strong>
                    <span
                      className={`font-semibold ml-2 ${
                        isActivo ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isActivo ? "ACTIVO" : "INACTIVO"}
                    </span>
                  </p>
                </div>

                {/* BLOQUE DE CUENTAS BANCARIAS */}
                <h3 className="font-bold text-base text-blue-600 border-t pt-3 mt-3">
                  Cuentas Bancarias
                </h3>
                {renderCuentasBancarias(trabajadorDetalle.cuentasBancarias)}
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