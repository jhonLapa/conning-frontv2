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
import { Venta, VentaRequest } from "@/interfaces/venta.interface";
import { getClientesActivos } from "@/services/cliente.service";
import { getComprobantesActivos } from "@/services/tipo-comprobante.service";
import { getProyectosActivos } from "@/services/proyecto.service";
import { getFetchVentaByIdData, postVenta } from "@/services/venta.service";
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

const VentasIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venta, setVenta] = useState<Venta | null>(null);
  const title = id == "nuevo" ? "Nueva Venta" : "Editar Venta";
  const [openAlert, setOpenAlert] = useState(false);

  const [clientes, setClientes] = useState<
    { idCliente: number; nombreCompleto: string }[]
  >([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  const [comprobantes, setComprobantes] = useState<
    { idTipoComprobante: number; nombre: string }[]
  >([]);
  const [loadingComprobantes, setLoadingComprobantes] = useState(true);

  const [proyectos, setProyectos] = useState<
    { idProyecto: number; nombre: string }[]
  >([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientesActivos();
        setClientes(data);
      } catch (error) {
        console.error("Error cargando clientes", error);
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchComprobantes = async () => {
      try {
        const data = await getComprobantesActivos();
        setComprobantes(data);
      } catch (error) {
        console.error("Error cargando comprobantes", error);
      } finally {
        setLoadingComprobantes(false);
      }
    };

    fetchComprobantes();
  }, []);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await getProyectosActivos();
        setProyectos(data);
      } catch (error) {
        console.error("Error cargando proyectos", error);
      } finally {
        setLoadingProyectos(false);
      }
    };

    fetchProyectos();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VentaRequest>({
    defaultValues: {
      idCliente: 0,
      idTipoComprobante: 0,
      idProyecto: 0,
      serie: "",
      numero: "",
      fechaEmision: "",
      formaPago: "CONTADO",
      tipoMoneda: "PEN",
      observacion: "",
      detalles: [
        {
          unidadMedida: "UNID",
        },
      ],
      pagosCredito: [],
      subTotal: 0,
      descuentos: 0,
      valorPago: 0,
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

  const {
    fields: depositos,
    append: addDeposito,
    remove: removeDeposito,
  } = useFieldArray({
    control,
    name: "depositosVenta",
  });

  const detalles = (watch("detalles") as VentaRequest["detalles"]) || [];
  const formaPago = watch("formaPago");

  const subTotal = detalles.reduce(
    (acc, item) => acc + (item?.cantidad || 0) * (item?.valorUnitario || 0),
    0
  );

  const igv = Number((subTotal * 0.18).toFixed(2));
  const importeTotal = Number(subTotal.toFixed(2)) + igv;
  const detraccion = importeTotal * 0.4;
  const totalDepositos = (watch("depositosVenta") || []).reduce(
    (acc, item) => acc + (item?.monto || 0),
    0
  );
  const mapDetalles = (
    detalles: VentaRequest["detalles"] = []
  ): VentaRequest["detalles"] =>
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
    pagos: Venta["pagosCredito"] = []
  ): VentaRequest["pagosCredito"] =>
    (pagos ?? []).map((p) => ({
      fechaVencimiento: p.fechaVencimiento
        ? p.fechaVencimiento.substring(0, 10)
        : "",
      montoCuota: Number(p.montoCuota ?? 0),
    }));

  const mapDepositos = (
    depositos: Venta["depositosVenta"] = []
  ): VentaRequest["depositosVenta"] =>
    (depositos ?? []).map((d) => ({
      fechaDeposito: d.fechaDeposito ? d.fechaDeposito.substring(0, 10) : "",
      monto: Number(d.monto ?? 0),
    }));

  const getVenta = async () => {
    if (id === "nuevo") return;

    const response = await getFetchVentaByIdData(Number(id));
    setValue("idCliente", response.idCliente);
    setValue("idTipoComprobante", response.idTipoComprobante);
    setValue("idProyecto", response.idProyecto);
    setValue("serie", response.serie);
    setValue("numero", response.numero);
    setValue("valorPago", response.valorPago);
    setValue("estado", response.estado);
    setValue(
      "fechaEmision",
      response.fechaEmision ? response.fechaEmision.substring(0, 10) : ""
    );
    setValue("formaPago", response.formaPago);
    setValue("tipoMoneda", response.tipoMoneda);
    setValue("observacion", response.observacion);

    if (response.formaPago === "CREDITO") {
      setValue("pagosCredito", mapPagos(response.pagosCredito));
    } else {
      setValue("pagosCredito", []);
    }

    setValue("detalles", mapDetalles(response.detalles));
    setValue("depositosVenta", mapDepositos(response.depositosVenta));
    setVenta(response);
  };

  const onSubmit = async (data: VentaRequest) => {
    if (!data.detalles || data.detalles.length === 0) {
      toast.warning("Debe agregar al menos un detalle a la venta.", {
        position: "top-right",
      });
      return;
    }

    if (!data.idProyecto || data.idProyecto <= 0) {
      toast.warning("Debe seleccionar un proyecto válido.", {
        position: "top-right",
      });
      return;
    }

    const detallesConTotales = mapDetalles(data.detalles);
    const pagosNormalizados: VentaRequest["pagosCredito"] = (
      data.pagosCredito ?? []
    ).map((p) => ({
      fechaVencimiento: p.fechaVencimiento ?? "",
      montoCuota: Number(p.montoCuota ?? 0),
    }));

    const payload: VentaRequest = {
      ...data,
      idVenta: venta?.idVenta ?? 0,
      detalles: detallesConTotales,
      pagosCredito: data.formaPago === "CREDITO" ? pagosNormalizados : [],
      idProyecto: data.idProyecto, // ✅ Asegura que se envía al backend
      estado: data.estado, // ✅ Asegura que se envía al backend
      depositosVenta: data.depositosVenta ?? [], // ✅ Agregado aquí

      subTotal: Number(subTotal.toFixed(2)),
      valorPago: Number(data.valorPago ?? 0), // 👈 aquí por si acaso viene vacío
      igv: Number(igv.toFixed(2)),
      importeTotal: Number(importeTotal.toFixed(2)),
    };

    try {
      const response = await postVenta(payload);
      if (!response?.message) {
        toast.warning("Error al Guardar el registro", {
          position: "top-right",
        });
        return;
      }
      toast.success(response.message, { position: "top-right" });
      setVenta(null);
      navigate("/venta");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar la venta", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    getVenta();
  }, [id]);

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Informacion detallada de la venta"
      />
      <form
        className="flex flex-col gap-5 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Datos de la Venta
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* =========================================================
                    🔹 CLIENTE
                ========================================================= */}
              <div>
                <Label>Cliente</Label>
                <select
                  {...register("idCliente", {
                    valueAsNumber: true,
                    required: "El cliente es obligatorio",
                    validate: (v) => v > 0 || "Seleccione un cliente válido",
                  })}
                  className={`w-full border rounded p-2 ${
                    errors.idCliente ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Seleccione Cliente</option>
                  {loadingClientes && <option>Cargando...</option>}
                  {clientes?.map((cliente) => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.nombreCompleto}
                    </option>
                  ))}
                </select>
                {errors.idCliente && (
                  <p className="msg-error">{errors.idCliente.message}</p>
                )}
              </div>

              {/* =========================================================
          🔹 PROYECTO
      ========================================================= */}
              <div>
                <Label>Proyecto</Label>
                <select
                  {...register("idProyecto", {
                    valueAsNumber: true,
                    required: "El proyecto es obligatorio",
                    validate: (v) => v > 0 || "Seleccione un proyecto válido",
                  })}
                  className={`w-full border rounded p-2 ${
                    errors.idProyecto ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Seleccione proyecto</option>
                  {loadingProyectos && <option>Cargando...</option>}
                  {proyectos.map((comp) => (
                    <option key={comp.idProyecto} value={comp.idProyecto}>
                      {comp.nombre}
                    </option>
                  ))}
                </select>
                {errors.idProyecto && (
                  <p className="msg-error">{errors.idProyecto.message}</p>
                )}
              </div>

              {/* =========================================================
          🔹 TIPO COMPROBANTE, SERIE, NÚMERO
      ========================================================= */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Tipo Comprobante</Label>
                  <select
                    {...register("idTipoComprobante", {
                      valueAsNumber: true,
                      required: "El tipo de comprobante es obligatorio",
                      validate: (v) =>
                        v > 0 || "Seleccione un comprobante válido",
                    })}
                    className={`w-full border rounded p-2 ${
                      errors.idTipoComprobante ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Seleccione comprobante</option>
                    {loadingComprobantes && <option>Cargando...</option>}
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
                    <p className="msg-error">
                      {errors.idTipoComprobante.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Serie</Label>
                  <Input
                    {...register("serie", {
                      required: "La serie es obligatoria",
                      minLength: {
                        value: 1,
                        message: "Ingrese una serie válida",
                      },
                    })}
                    className={errors.serie ? "border-red-500" : ""}
                  />
                  {errors.serie && (
                    <p className="msg-error">{errors.serie.message}</p>
                  )}
                </div>

                <div>
                  <Label>Número</Label>
                  <Input
                    {...register("numero", {
                      required: "El número es obligatorio",
                      minLength: {
                        value: 1,
                        message: "Ingrese un número válido",
                      },
                    })}
                    className={errors.numero ? "border-red-500" : ""}
                  />
                  {errors.numero && (
                    <p className="msg-error">{errors.numero.message}</p>
                  )}
                </div>
              </div>

              {/* =========================================================
          🔹 FECHA EMISIÓN
      ========================================================= */}
              <div>
                <Label>Fecha Emisión</Label>
                <Input
                  type="date"
                  {...register("fechaEmision", {
                    required: "La fecha de emisión es obligatoria",
                  })}
                  className={errors.fechaEmision ? "border-red-500" : ""}
                />
                {errors.fechaEmision && (
                  <p className="msg-error">{errors.fechaEmision.message}</p>
                )}
              </div>

              {/* =========================================================
                    🔹 FORMA DE PAGO Y ESTADO
                ========================================================= */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Forma de Pago</Label>
                  <select
                    {...register("formaPago", {
                      required: "Seleccione una forma de pago",
                    })}
                    onChange={(e) => {
                      const value = e.target.value as "CONTADO" | "CREDITO";
                      setValue("formaPago", value);
                      setValue("estado", value === "CONTADO" ? 1 : 0);

                      if (value === "CONTADO") setValue("pagosCredito", []);
                    }}
                    className={`w-full border rounded p-2 ${
                      errors.formaPago ? "border-red-500" : ""
                    }`}
                  >
                    <option value="CONTADO">Contado</option>
                    <option value="CREDITO">Crédito</option>
                  </select>
                  {errors.formaPago && (
                    <p className="msg-error">{errors.formaPago.message}</p>
                  )}
                </div>

                <div>
                  <Label>Cancelado</Label>
                  <select
                    {...register("estado", { valueAsNumber: true })}
                    className="w-full border rounded p-2"
                  >
                    <option value={1}>Sí</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>

              {/* =========================================================
               🔹 MONEDA Y OBSERVACIÓN
                 ========================================================= */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Moneda</Label>
                  <select
                    {...register("tipoMoneda", {
                      required: "Seleccione un tipo de moneda",
                    })}
                    className={`w-full border rounded p-2 ${
                      errors.tipoMoneda ? "border-red-500" : ""
                    }`}
                  >
                    <option value="PEN">Soles</option>
                    <option value="USD">Dólares</option>
                  </select>
                  {errors.tipoMoneda && (
                    <p className="msg-error">{errors.tipoMoneda.message}</p>
                  )}
                </div>
                <div>
                  <Label>Valor Pago</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ingrese el valor depositado en banco"
                    {...register("valorPago", {
                      valueAsNumber: true,
                      setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)), // 👈 convierte vacío en 0
                    })}
                  />
                </div>
              </div>

              {/* =========================================================
                🔹 PAGOS A CRÉDITO (SI APLICA)
            ========================================================= */}
              {formaPago === "CREDITO" && (
                <Card className="mt-4">
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
                            `pagosCredito.${index}.fechaVencimiento` as const,
                            { required: "Fecha de vencimiento obligatoria" }
                          )}
                          className={
                            errors.pagosCredito?.[index]?.fechaVencimiento
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.pagosCredito?.[index]?.fechaVencimiento && (
                          <p className="msg-error">
                            {
                              errors.pagosCredito[index].fechaVencimiento
                                ?.message
                            }
                          </p>
                        )}

                        <Input
                          type="number"
                          step="0.01"
                          {...register(
                            `pagosCredito.${index}.montoCuota` as const,
                            {
                              valueAsNumber: true,
                              required: "Monto de cuota obligatorio",
                              min: { value: 0.01, message: "Monto inválido" },
                            }
                          )}
                          className={
                            errors.pagosCredito?.[index]?.montoCuota
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.pagosCredito?.[index]?.montoCuota && (
                          <p className="msg-error">
                            {errors.pagosCredito[index].montoCuota?.message}
                          </p>
                        )}

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

              {/* =========================================================
          🔹  VENTA DEPOSIT  
      ========================================================= */}

              <Card className="mt-4">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>Depósitos de Venta</CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addDeposito({ fechaDeposito: "", monto: 0 })}
                  >
                    Agregar Depósito
                  </Button>
                </CardHeader>

                <CardContent>
                  {depositos.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2 items-center"
                    >
                      <Input
                        type="date"
                        {...register(
                          `depositosVenta.${index}.fechaDeposito` as const,
                          {
                            required: "Fecha de depósito obligatoria",
                          }
                        )}
                        className={
                          errors.depositosVenta?.[index]?.fechaDeposito
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.depositosVenta?.[index]?.fechaDeposito && (
                        <p className="msg-error">
                          {errors.depositosVenta[index].fechaDeposito?.message}
                        </p>
                      )}

                      <Input
                        type="number"
                        step="0.01"
                        {...register(`depositosVenta.${index}.monto` as const, {
                          valueAsNumber: true,
                          required: "Monto obligatorio",
                          min: { value: 0.01, message: "Monto inválido" },
                        })}
                        className={
                          errors.depositosVenta?.[index]?.monto
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.depositosVenta?.[index]?.monto && (
                        <p className="msg-error">
                          {errors.depositosVenta[index].monto?.message}
                        </p>
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeDeposito(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {depositos.length > 0 && (
                    <div className="text-right font-semibold mt-2">
                      Total Depósitos: {totalDepositos.toFixed(2)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <Label>Observación</Label>
                <textarea
                  className="w-full border rounded p-2"
                  {...register("observacion")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                  unidadMedida: "UND",
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
                          required: "La cantidad es obligatorio",
                          min: 1,
                        })}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <select
                        {...register(
                          `detalles.${index}.unidadMedida` as const,
                          {
                            required: true,
                          }
                        )}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="UNID">UNID</option>
                        <option value="KG">KG</option>
                        <option value="LT">LT</option>
                        <option value="M">M</option>
                        <option value="CAJA">CAJA</option>
                      </select>
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        placeholder="Descripción"
                        {...register(`detalles.${index}.descripcion` as const)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...register(
                          `detalles.${index}.valorUnitario` as const,
                          {
                            valueAsNumber: true,
                            required: true,
                            min: 0.01,
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

        <Card>
          <CardHeader>
            <CardTitle>Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-end gap-1">
              <p>Subtotal: {subTotal.toFixed(2)}</p>
              <p>IGV (18%): {igv.toFixed(2)}</p>
              <p className="font-bold">
                Importe Total: {importeTotal.toFixed(2)}
              </p>

              <p className="font-bold">Detraccion: {detraccion.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end gap-5">
          {/* 🔹 Si es NUEVO: guarda directamente */}
          {id === "nuevo" ? (
            <Button variant="sidebar" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          ) : (
            <>
              {/* 🔸 Si es EDICIÓN: pide confirmación antes de guardar */}
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
                    <AlertDialogTitle>
                      ¿Estás seguro de editar esta venta?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción actualizará los datos de la venta
                      seleccionada.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmitting}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? "Guardando..." : "Sí, editar venta"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          <Button
            variant="default"
            type="button"
            onClick={() => navigate("/venta")}
          >
            Cancelar
          </Button>
        </CardFooter>
      </form>
    </>
  );
};

export default VentasIdPage;
