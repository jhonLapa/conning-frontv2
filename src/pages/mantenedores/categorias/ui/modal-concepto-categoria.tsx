"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  postConceptoCategoria,
  putConceptoCategoria,
} from "@/services/concepto-categoria.service";
import {
  ConceptoCategoria,
  ConceptoCategoriaRequest,
} from "@/interfaces/concepto-categoria.interface";

interface ModalConceptoCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  idCategoria: number;
  conceptoSeleccionado?: ConceptoCategoria | null;
  onSuccess: () => void; // 🔁 Refresca la tabla después de guardar
}

export const ModalConceptoCategoria = ({
  isOpen,
  onClose,
  idCategoria,
  conceptoSeleccionado,
  onSuccess,
}: ModalConceptoCategoriaProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConceptoCategoriaRequest>({
    defaultValues: {
      nombreConcepto: "",
      valor: 0,
      idCategoria,
    },
  });

  useEffect(() => {
    reset(
      conceptoSeleccionado
        ? {
            nombreConcepto: conceptoSeleccionado.nombreConcepto,
            valor: conceptoSeleccionado.valor,
            idCategoria,
          }
        : { nombreConcepto: "", valor: 0, idCategoria }
    );
  }, [conceptoSeleccionado, idCategoria, reset]);

  const onSubmit = async (data: ConceptoCategoriaRequest) => {
    try {
      const response = conceptoSeleccionado
        ? await putConceptoCategoria(conceptoSeleccionado.idConcepto, data)
        : await postConceptoCategoria(data);

      if (!response.success) {
        toast.warning(response.message || "Error al guardar el concepto", {
          position: "top-right",
        });
        return;
      }

      toast.success(
        conceptoSeleccionado
          ? "Se ha actualizado correctamente ✅"
          : "Se ha creado correctamente ✅",
        { position: "top-right" }
      );

      await onSuccess();
      reset();
    } catch (error) {
      toast.error("Error en el servidor", { position: "top-right" });
      console.error(error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {conceptoSeleccionado ? "Editar Concepto" : "Agregar Concepto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nombre del concepto</label>
            <Input
              {...register("nombreConcepto", { required: "Campo requerido" })}
              placeholder="Ej. Jornal, Dominical, etc."
            />
            {errors.nombreConcepto && (
              <p className="text-sm text-red-500 mt-1">
                {errors.nombreConcepto.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Valor</label>
            <Input
              type="number"
              step="0.01"
              {...register("valor", { required: "Campo requerido" })}
              placeholder="Ej. 86.80"
            />
            {errors.valor && (
              <p className="text-sm text-red-500 mt-1">
                {errors.valor.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {conceptoSeleccionado ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
