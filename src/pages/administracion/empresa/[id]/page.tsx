import HeaderPage from "@/components/header-page";
import ImageSelector from "@/components/image-selecto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionSelect } from "@/interfaces";
import { useState } from "react";
import { useForm } from "react-hook-form";

/* ============================================================
   INTERFACES
   ============================================================ */
export interface EmpresaRequest {
  codigo: string;
  ruc: string;
  razonSocial: string;
  direccion: string;
  ciudad: string;
  regimenId: number;
  planContableId: number;
  web?: string | null;
  email?: string | null;
  telefono?: string | null;
  giro?: string | null;
  rutaBD?: string | null;
  rutaArchivos?: string | null;
  rutaImagenes?: string | null;
  logo?: string | null;
  estado: boolean;
  idUsuarioCreacion: number;
  idUsuarioModificacion?: number | null;
}

interface FormEmpresaInput extends EmpresaRequest {
  regimen: OptionSelect | null;
  giroSelect: OptionSelect | null;
}

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
const EmpresaIdPage = () => {
  const {
    register,
    formState: { errors },
  } = useForm<FormEmpresaInput>({
    defaultValues: {
      regimen: null,
      giroSelect: null,
      estado: true,
    },
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleImage = (url: string) => {
    console.log("Logo seleccionado:", url);
  };

  return (
    <>
      <HeaderPage
        title="Nueva Empresa"
        descripcion="Información detallada de la empresa"
      />

      <form className="flex flex-col gap-5 mt-4">
        {/* =========================================================
            DATOS GENERALES
        ========================================================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Datos Generales
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="flex gap-4 items-center mb-6">
              <div className="flex-shrink-0">
                <ImageSelector
                  width="w-50"
                  className="mr-4"
                  open={open}
                  setOpen={setOpen}
                  setImagen={handleImage}
                />
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Código */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="codigo">
                      Código{" "}
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      id="codigo"
                      placeholder="EMP001"
                      {...register("codigo", {
                        required: "El código es requerido",
                      })}
                    />
                    {errors.codigo && (
                      <p className="msg-error">{errors.codigo.message}</p>
                    )}
                  </div>

                  {/* RUC */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="ruc">
                      R.U.C{" "}
                      <span className="font-semibold text-red-600">*</span>
                    </Label>
                    <Input
                      id="ruc"
                      placeholder="20608147625"
                      {...register("ruc", { required: "El RUC es requerido" })}
                    />
                    {errors.ruc && (
                      <p className="msg-error">{errors.ruc.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Razon social, dirección, ciudad, plan contable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label>
                  Razón Social <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("razonSocial", {
                    required: "La razón social es requerida",
                  })}
                />
                {errors.razonSocial && (
                  <p className="msg-error">{errors.razonSocial.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label>
                  Dirección <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("direccion", {
                    required: "La dirección es requerida",
                  })}
                />
                {errors.direccion && (
                  <p className="msg-error">{errors.direccion.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label>
                  Ciudad <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("ciudad", {
                    required: "La ciudad es requerida",
                  })}
                />
                {errors.ciudad && (
                  <p className="msg-error">{errors.ciudad.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label>
                  Plan Contable ID <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="number"
                  {...register("planContableId", {
                    required: "El plan contable es requerido",
                  })}
                />
                {errors.planContableId && (
                  <p className="msg-error">{errors.planContableId.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* =========================================================
            DATOS ADICIONALES
        ========================================================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Datos Adicionales
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label>Web</Label>
                <Input placeholder="https://..." {...register("web")} />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Email</Label>
                <Input placeholder="empresa@email.com" {...register("email")} />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Teléfono</Label>
                <Input placeholder="999 999 999" {...register("telefono")} />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Giro</Label>
                <Input
                  placeholder="Venta de materiales..."
                  {...register("giro")}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Ruta BD</Label>
                <Input
                  placeholder="C:\\bases\\empresa1.mdf"
                  {...register("rutaBD")}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Ruta Archivos</Label>
                <Input
                  placeholder="C:\\archivos\\empresa1"
                  {...register("rutaArchivos")}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Ruta Imágenes</Label>
                <Input
                  placeholder="C:\\imagenes\\empresa1"
                  {...register("rutaImagenes")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default EmpresaIdPage;
