"use client";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Categoria, CategoriaRequest } from "@/interfaces/categoria.interface";
import {
  getFechtCategoriaById,
  postCategoria,
  putCategoria,
} from "@/services/categoria.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ConceptosTable from "../ui/conceptos-table";
import { ConceptoCategoria } from "@/interfaces/concepto-categoria.interface";
import { ModalConceptoCategoria } from "../ui/modal-concepto-categoria";

const CategoriaIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conceptoSeleccionado, setConceptoSeleccionado] =
    useState<ConceptoCategoria | null>(null);

  const title = id == "nuevo" ? "Nueva Categoría" : "Editar Categoría";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaRequest>({
    defaultValues: {
      nombre: "",
    },
  });

  const getCategoria = async () => {
    if (id === "nuevo") return;

    try {
      const response = await getFechtCategoriaById(Number(id));
      setValue("nombre", response.nombre);
      setCategoria(response);
    } catch (error) {
      toast.error("Error al cargar la categoría");
      console.error(error);
    }
  };

  const onSubmit = async (data: CategoriaRequest) => {
    const response = categoria
      ? await putCategoria(categoria.idCategoria, data)
      : await postCategoria(data);

    if (!response.success) {
      toast.warning("Error al guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    navigate("/categoria");
  };

  const handleEditConcepto = (concepto: ConceptoCategoria) => {
    setConceptoSeleccionado(concepto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setConceptoSeleccionado(null);
    setIsModalOpen(false);
    getCategoria();
  };

  useEffect(() => {
    getCategoria();
  }, [id]);

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Informacion detallada de categoría"
      />

      <form
        className="flex flex-col gap-5 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              {title}
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="nombre">
                    Nombre
                    <span className="font-semibold text-red-600">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Nombre"
                    {...register("nombre", {
                      required: "El nombre es requerido",
                    })}
                  />
                  {errors.nombre && (
                    <p className="msg-error">{errors.nombre.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-5">
            <Button variant="sidebar" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={() => navigate("/categoria")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Solo mostrar conceptos si la categoría ya existe */}
      {categoria && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">
              Conceptos asociados a la categoría
            </h2>
            <Button onClick={() => setIsModalOpen(true)}>
              + Agregar concepto
            </Button>
          </div>

          <ConceptosTable
            conceptos={categoria.conceptosCategoria || []}
            onEdit={handleEditConcepto}
            onReload={getCategoria}
          />

          <ModalConceptoCategoria
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            idCategoria={categoria.idCategoria}
            conceptoSeleccionado={conceptoSeleccionado}
            onSuccess={async () => {
              await getCategoria();
              setIsModalOpen(false);
              setConceptoSeleccionado(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default CategoriaIdPage;
