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
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
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
import {
  Proveedor,
  TipoComprobante,
  Compra,
  CompraRequest,
} from "@/interfaces/compra.interface";
import { compraService } from "@/services/compra.service";
import { PagoCreditoRequest } from "@/interfaces/venta.interface";

const CompraIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [compra, setCompra] = useState<Compra | null>(null);
  const title = id == "nuevo" ? "Nueva Compra" : "Editar Compra";
  const [openAlert, setOpenAlert] = useState(false);

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [comprobantes, setComprobantes] = useState<TipoComprobante[]>([]);

  // ========= FORMULARIO =========
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompraRequest>({
    defaultValues: {
      idProveedor: 0,
      idTipoComprobante: 0,
      serie: "",
      numero: "",
      fechaEmision: "",
      formaPago: "Contado",
      tipoMoneda: "SOLES",
      observacion: "",
      detalles: [{ unidadMedida: "UNIDAD" }],
      pagosCredito: [],
      subTotal: 0,
      descuentos: 0,
      valorCompra: 0,
      igv: 0,
      importeTotal: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });
  const {
    fields: pagos,
    append: addPago,
    remove: removePago,
  } = useFieldArray({
    control,
    name: "pagosCredito",
  });

  const detalles = (watch("detalles") as CompraRequest["detalles"]) || [];
  const formaPago = watch("formaPago");
  const descuentos = watch("descuentos") || 0;

  // ========= CALCULOS =========
  const subTotal = detalles.reduce(
    (acc, item) => acc + (item?.cantidad || 0) * (item?.valorUnitario || 0),
    0
  );
  const valorCompra = Number((subTotal - descuentos).toFixed(2));
  const igv = Number((valorCompra * 0.18).toFixed(2));
  const importeTotal = Number((valorCompra + igv).toFixed(2));

  // ========= CARGAR DATOS =========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prov, comp] = await Promise.all([
          compraService.getProveedoresActivos(),
          compraService.getTiposComprobanteActivos(),
        ]);
        setProveedores(prov);
        setComprobantes(comp);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar los datos");
      }
    };
    fetchData();
  }, []);

  const mapDetalles = (
    detalles: CompraRequest["detalles"] = []
  ): CompraRequest["detalles"] =>
    (detalles ?? []).map((d) => ({
      cantidad: Number(d.cantidad ?? 0),
      unidadMedida: d.unidadMedida ?? "",
      descripcion: d.descripcion ?? "",
      valorUnitario: Number(d.valorUnitario ?? 0),
      valorTotal: Number(
        (Number(d.cantidad ?? 0) * Number(d.valorUnitario ?? 0)).toFixed(2)
      ),
    }));

  const mapPagos = (
    pagos: Compra["pagosCredito"] = []
  ): CompraRequest["pagosCredito"] =>
    (pagos ?? []).map((p) => ({
      fechaVencimiento: p.fechaVencimiento
        ? p.fechaVencimiento.substring(0, 10)
        : "",
      montoCuota: Number(p.montoCuota ?? 0),
    }));

  // ========= CARGAR COMPRA =========
  const getCompra = async () => {
    if (id === "nuevo") return;
    try {
      const response = await compraService.getById(Number(id));
      setValue("idProveedor", response.idProveedor);
      setValue("idTipoComprobante", response.idTipoComprobante);
      setValue("serie", response.serie);
      setValue("numero", response.numero);
      setValue("fechaEmision", response.fechaEmision?.substring(0, 10));
      setValue("formaPago", response.formaPago);
      setValue("tipoMoneda", response.tipoMoneda);
      setValue("observacion", response.observacion || "");
      setValue("descuentos", response.descuentos || 0);

      if (response.formaPago === "Credito") {
        setValue("pagosCredito", mapPagos(response.pagosCredito));
      } else {
        setValue("pagosCredito", []);
      }

      setValue("detalles", mapDetalles(response.detalles));
      setCompra(response);
    } catch (error) {
      console.error("Error al cargar compra:", error);
      toast.error("Error al cargar la compra");
    }
  };

  useEffect(() => {
    getCompra();
  }, [id]);

  // ========= GUARDAR =========
  const onSubmit = async (data: CompraRequest) => {
    const payload: CompraRequest = {
      ...data,
      idCompra: compra?.idCompra ?? 0,
      detalles: mapDetalles(data.detalles),
      pagosCredito:
        data.formaPago === "Credito"
          ? mapPagos(data.pagosCredito as PagoCreditoRequest[])
          : [],
      subTotal: Number(subTotal.toFixed(2)),
      valorCompra: Number(valorCompra.toFixed(2)),
      igv: Number(igv.toFixed(2)),
      importeTotal: Number(importeTotal.toFixed(2)),
    };

    try {
      const response = await compraService.save(payload);
      if (!response?.message) {
        toast.warning("Error al guardar el registro");
        return;
      }
      toast.success(response.message);
      navigate("/cobranza");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar la compra");
    }
  };

  // ========= VISTA =========
  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Información detallada de la compra"
      />
      <form
        className="flex flex-col gap-5 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Datos de la Compra
            </CardTitle>
            <hr />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Proveedor</Label>
                <select
                  {...register("idProveedor", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  className="w-full border rounded p-2"
                >
                  <option value="">Seleccione Proveedor</option>
                  {proveedores.map((prov) => (
                    <option key={prov.idProveedor} value={prov.idProveedor}>
                      {prov.nombreCompleto}
                    </option>
                  ))}
                </select>
                {errors.idProveedor && (
                  <p className="msg-error">Proveedor requerido</p>
                )}
              </div>

              <div>
                <Label>Tipo Comprobante</Label>
                <select
                  {...register("idTipoComprobante", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  className="w-full border rounded p-2"
                >
                  <option value="">Seleccione comprobante</option>
                  {comprobantes.map((comp) => (
                    <option
                      key={comp.idTipoComprobante}
                      value={comp.idTipoComprobante}
                    >
                      {comp.nombre}
                    </option>
                  ))}
                </select>
                {errors.idTipoComprobante && (
                  <p className="msg-error">Tipo requerido</p>
                )}
              </div>

              <div>
                <Label>Serie</Label>
                <Input {...register("serie", { required: true })} />
              </div>

              <div>
                <Label>Número</Label>
                <Input {...register("numero", { required: true })} />
              </div>

              <div>
                <Label>Fecha Emisión</Label>
                <Input
                  type="date"
                  {...register("fechaEmision", {
                    required: "La fecha es obligatoria",
                  })}
                />
                {errors.fechaEmision && (
                  <p className="msg-error">Fecha requerida</p>
                )}
              </div>

              <div>
                <Label>Forma de Pago</Label>
                <select
                  {...register("formaPago")}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValue("formaPago", value);
                    if (value === "Contado") {
                      setValue("pagosCredito", []);
                    }
                  }}
                  className="w-full border rounded p-2"
                >
                  <option value="Contado">Contado</option>
                  <option value="Credito">Crédito</option>
                </select>
              </div>

              {formaPago === "Credito" && (
                <Card className="mt-4 md:col-span-2">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>Pagos a Crédito</CardTitle>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        addPago({ fechaVencimiento: "", montoCuota: 0 })
                      }
                    >
                      Agregar Pago
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {pagos.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2 items-center"
                      >
                        <Input
                          type="date"
                          {...register(
                            `pagosCredito.${index}.fechaVencimiento` as const
                          )}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          {...register(
                            `pagosCredito.${index}.montoCuota` as const,
                            {
                              valueAsNumber: true,
                            }
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removePago(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <div>
                <Label>Moneda</Label>
                <select
                  {...register("tipoMoneda")}
                  className="w-full border rounded p-2"
                >
                  <option value="SOLES">Soles</option>
                  <option value="DOLARES">Dólares</option>
                </select>
              </div>

              <div>
                <Label>Descuento</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("descuentos", { valueAsNumber: true })}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Observación</Label>
                <textarea
                  {...register("observacion")}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DETALLE DE PRODUCTOS */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg font-light text-gray-500">
              Detalle
            </CardTitle>
            <Button
              type="button"
              onClick={() =>
                append({
                  cantidad: 1,
                  unidadMedida: "UNIDAD",
                  descripcion: "",
                  valorUnitario: 0,
                  valorTotal: 0,
                })
              }
            >
              Agregar Detalle
            </Button>
          </CardHeader>
          <CardContent>
            <table className="w-full border rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-medium">
                    Cant.
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium">
                    U.Medida
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium">
                    Descripción
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium">
                    V.Unitario
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium">
                    Total
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium">
                    Eliminar
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="border-t">
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        {...register(`detalles.${index}.cantidad` as const, {
                          valueAsNumber: true,
                          required: "Cantidad obligatoria",
                          min: 1,
                        })}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <select
                        {...register(`detalles.${index}.unidadMedida` as const)}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="UNIDAD">UNIDAD</option>
                        <option value="BOLSA">BOLSA</option>
                        <option value="KILO">KILO</option>
                        <option value="SERVICIO">SERVICIO</option>
                      </select>
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        {...register(`detalles.${index}.descripcion` as const)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.01"
                        {...register(
                          `detalles.${index}.valorUnitario` as const,
                          {
                            valueAsNumber: true,
                            required: true,
                          }
                        )}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        value={(
                          (detalles[index]?.cantidad || 0) *
                          (detalles[index]?.valorUnitario || 0)
                        ).toFixed(2)}
                        readOnly
                      />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* TOTALES */}
        <Card>
          <CardHeader>
            <CardTitle>Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-end gap-1">
              <p>SubTotal: {subTotal.toFixed(2)}</p>
              <p>Valor Compra: {valorCompra.toFixed(2)}</p>
              <p>IGV (18%): {igv.toFixed(2)}</p>
              <p className="font-bold">
                Importe Total: {importeTotal.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* BOTONES */}
        <CardFooter className="flex justify-end gap-5">
          {id === "nuevo" ? (
            <Button variant="sidebar" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          ) : (
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="sidebar"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setOpenAlert(true)}
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Editar esta compra?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción actualizará los datos de la compra seleccionada.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Sí, editar compra"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            variant="default"
            type="button"
            onClick={() => navigate("/cobranza")}
          >
            Cancelar
          </Button>
        </CardFooter>
      </form>
    </>
  );
};

export default CompraIdPage;
