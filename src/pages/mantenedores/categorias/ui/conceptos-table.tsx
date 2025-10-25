"use client";

import { useState } from "react";
import { ConceptoCategoria } from "@/interfaces/concepto-categoria.interface";
import { activeOrdesactiveConceptoCategoria } from "@/services/concepto-categoria.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Power, PowerOff } from "lucide-react";

interface ConceptosTableProps {
  conceptos: ConceptoCategoria[];
  onEdit?: (concepto: ConceptoCategoria) => void;
  onReload?: () => void;
}

export default function ConceptosTable({
  conceptos,
  onEdit,
  onReload,
}: ConceptosTableProps) {
  const [isChanging, setIsChanging] = useState(false);

  const handleToggleEstado = async (idConcepto: number) => {
    try {
      setIsChanging(true);
      const response = await activeOrdesactiveConceptoCategoria(idConcepto);

      if (!response.success) {
        toast.warning(response.message, { position: "top-center" });
        return;
      }

      toast.success(response.message, { position: "top-right" });
      onReload?.(); // refresca lista si se pasa callback
    } catch (error) {
      toast.error("Ocurrió un error al cambiar el estado del concepto.");
      console.error(error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Conceptos asociados</h3>

      {conceptos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay conceptos registrados para esta categoría.
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conceptos.map((concepto) => (
                <TableRow key={concepto.idConcepto}>
                  <TableCell>{concepto.nombreConcepto}</TableCell>
                  <TableCell>S/. {concepto.valor.toFixed(2)}</TableCell>
                  <TableCell>{concepto.tipoConcepto}</TableCell>
                  <TableCell>
                    <Badge
                      variant={concepto.estado === 1 ? "success" : "secondary"}
                    >
                      {concepto.estado === 1 ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(concepto.fechaCreacion).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit?.(concepto)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        concepto.estado === 1 ? "destructive" : "default"
                      }
                      size="icon"
                      disabled={isChanging}
                      onClick={() => handleToggleEstado(concepto.idConcepto)}
                    >
                      {concepto.estado === 1 ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
