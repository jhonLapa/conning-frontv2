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
import {
  Trabajador,
  TrabajadorRequest,
  CuentaBancariaRequest,
} from "@/interfaces/trabajador.interface";
import { Bank } from "@/interfaces/bank.interface";

type TipoDocumentoSelect = { idTipoDocumento: number; nombre: string };
type CategoriaSelect = { idCategoria: number; nombre: string };
type RegimenSelect = { idRegimen: number; nombre: string };

import {
  getFetchTrabajadorById,
  postTrabajador,
} from "@/services/trabajador.service";
import { getDocumentosActivos } from "@/services/tipo-documento.service";
import { getCategoriasActivas } from "@/services/categoria.service";
import { getRegimenesActivos } from "@/services/regimen.service";
import { getBankFecth } from "@/services/bank.service";

import { Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface FormTrabajador extends TrabajadorRequest {}

const TrabajadorIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trabajador, setTrabajador] = useState<Trabajador | null>(null);
  const title = id === "nuevo" ? "Nuevo Trabajador" : "Editar Trabajador";
  const isEdit = id !== "nuevo";

  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoSelect[]>(
    []
  );
  const [categorias, setCategorias] = useState<CategoriaSelect[]>([]);
  const [regimenes, setRegimenes] = useState<RegimenSelect[]>([]);
  const [bancos, setBancos] = useState<Bank[]>([]);
  const [loadingSelectores, setLoadingSelectores] = useState(true);
  const [loadingTrabajador, setLoadingTrabajador] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormTrabajador>({
    defaultValues: {
      idTipoDocumento: 0,
      numeroDocumento: "",
      apellidosNombres: "",
      idCategoria: 0,
      idRegimen: 0,
      fechaIngreso: new Date().toISOString().substring(0, 10),
      cuentas: [],
      estado: 1,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cuentas",
  });

  const mapCuentasToRequest = (
    cuentas: Trabajador["cuentasBancarias"] = []
  ): CuentaBancariaRequest[] =>
    (cuentas ?? []).map((cuenta) => ({
      idCuentaBanco: cuenta.idCuentaBanco,
      idBanco: cuenta.banco.idBanco,
      numeroCuenta: cuenta.numeroCuenta,
      cci: cuenta.cci || undefined,
      tipoCuenta: cuenta.tipoCuenta,
      moneda: cuenta.moneda,
      principal: cuenta.principal,
      fechaInicio: cuenta.fechaInicio.substring(0, 10),
      fechaFin: cuenta.fechaFin ? cuenta.fechaFin.substring(0, 10) : undefined,
    }));

  useEffect(() => {
    const loadSelectores = async () => {
      try {
        const [docs, cats, regs, bks] = await Promise.all([
          getDocumentosActivos() as Promise<TipoDocumentoSelect[]>, // Casteo de seguridad, pero el tipo de servicio debería coincidir
          getCategoriasActivas() as Promise<CategoriaSelect[]>,
          getRegimenesActivos() as Promise<RegimenSelect[]>,
          getBankFecth(),
        ]);

        setTiposDocumento(docs);
        setCategorias(cats);
        setRegimenes(regs);
        setBancos(bks);
      } catch (error) {
        console.error(error);

        toast.error("Error al cargar datos de selectores.", {
          position: "top-right",
        });
      } finally {
        setLoadingSelectores(false);
      }
    };

    loadSelectores();
  }, []);

  useEffect(() => {
    const getTrabajador = async () => {
      if (!isEdit) {
        setLoadingTrabajador(false);
        return;
      }

      try {
        const response = await getFetchTrabajadorById(Number(id));
        if (!response) {
          toast.error("Trabajador no encontrado o la API devolvió null.", {
            position: "top-right",
          });
          setLoadingTrabajador(false);
          return;
        }
        setValue(
          "idTipoDocumento",
          response.tipoDocumento ? response.tipoDocumento.idTipoDocumento : 0
        );
        setValue("numeroDocumento", response.numeroDocumento);
        setValue("apellidosNombres", response.apellidosNombres);
        setValue(
          "idCategoria",
          response.categoria ? response.categoria.idCategoria : 0
        );
        setValue(
          "idRegimen",
          response.regimen ? response.regimen.idRegimen : 0
        );
        setValue(
          "fechaNacimiento",
          response.fechaNacimiento
            ? String(response.fechaNacimiento).substring(0, 10)
            : ""
        );
        setValue(
          "fechaIngreso",
          response.fechaIngreso
            ? response.fechaIngreso.substring(0, 10)
            : new Date().toISOString().substring(0, 10)
        );
        setValue("email", response.email ?? "");
        setValue("telefono", response.telefono ?? "");
        setValue("direccion", response.direccion ?? "");
        setValue("estado", response.estado);
        setValue("cuentas", mapCuentasToRequest(response.cuentasBancarias));
        setTrabajador(response);
      } catch (error) {
        toast.error("Error al cargar los datos del Trabajador.", {
          position: "top-right",
        });
        console.error(error);
      } finally {
        setLoadingTrabajador(false);
      }
    };
    getTrabajador();
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: FormTrabajador) => {
    const payload: TrabajadorRequest = {
      ...data,
      idTrabajador: trabajador?.idTrabajador ?? 0,
      cuentas: data.cuentas.map((c) => ({
        ...c,
        idCuentaBanco: c.idCuentaBanco || undefined,
        cci: c.cci || undefined,
        principal: Number(c.principal),
      })),
      idTipoDocumento: Number(data.idTipoDocumento),
      idCategoria: Number(data.idCategoria),
      idRegimen: Number(data.idRegimen),
    };

    try {
      const response = await postTrabajador(payload);

      if (!response?.success) {
        return;
      }

      setTrabajador(null);
      navigate("/trabajador");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar el trabajador", {
        position: "top-right",
      });
    }
  };

  if (loadingSelectores || (isEdit && loadingTrabajador)) {
    return <div>Cargando datos...</div>;
  }

  return (
    <>
      <HeaderPage
        title={title}
        descripcion="Información del trabajador y sus cuentas bancarias asociadas."
      />
      <form
        className="flex flex-col gap-5 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        DATOS PRINCIPALES DEL TRABAJADOR
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Datos Personales y Laborales
            </CardTitle>
            <hr />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Tipo Documento */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="idTipoDocumento">
                  Tipo Doc.{" "}
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <select
                  {...register("idTipoDocumento", {
                    valueAsNumber: true,
                    required: "Tipo Doc. requerido",
                  })}
                  className="w-full border rounded p-2"
                >
                  <option value={0}>Seleccione Tipo Doc.</option>
                  {tiposDocumento.map((doc) => (
                    <option
                      key={doc.idTipoDocumento}
                      value={doc.idTipoDocumento}
                    >
                      {doc.nombre}
                    </option>
                  ))}
                </select>
                {errors.idTipoDocumento && (
                  <p className="msg-error">{errors.idTipoDocumento.message}</p>
                )}
              </div>

              {/* Nro Documento */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="numeroDocumento">
                  Nro. Documento{" "}
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <Input
                  id="numeroDocumento"
                  type="text"
                  placeholder="Nro de Documento"
                  {...register("numeroDocumento", {
                    required: "Nro. Documento es requerido",
                  })}
                />
                {errors.numeroDocumento && (
                  <p className="msg-error">{errors.numeroDocumento.message}</p>
                )}
              </div>

              {/* Apellidos y Nombres */}
              <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="apellidosNombres">
                  Apellidos y Nombres{" "}
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Apellidos y Nombres completos"
                  {...register("apellidosNombres", {
                    required: "Nombre es requerido",
                  })}
                />
                {errors.apellidosNombres && (
                  <p className="msg-error">{errors.apellidosNombres.message}</p>
                )}
              </div>

              {/* Categoría */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="idCategoria">
                  Categoría{" "}
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <select
                  {...register("idCategoria", {
                    valueAsNumber: true,
                    required: "Categoría requerida",
                  })}
                  className="w-full border rounded p-2"
                >
                  <option value={0}>Seleccione Categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                {errors.idCategoria && (
                  <p className="msg-error">{errors.idCategoria.message}</p>
                )}
              </div>

              {/* Régimen */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="idRegimen">
                  Régimen Previsional{" "}
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <select
                  {...register("idRegimen", {
                    valueAsNumber: true,
                    required: "Régimen requerido",
                  })}
                  className="w-full border rounded p-2"
                >
                  <option value={0}>Seleccione Régimen</option>
                  {regimenes.map((reg) => (
                    <option key={reg.idRegimen} value={reg.idRegimen}>
                      {reg.nombre}
                    </option>
                  ))}
                </select>
                {errors.idRegimen && (
                  <p className="msg-error">{errors.idRegimen.message}</p>
                )}
              </div>

              {/* Fecha Ingreso */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="fechaIngreso">
                  Fecha Ingreso{" "}
                  <span className="font-semibold text-red-600">*</span>
                </Label>
                <Input
                  type="date"
                  {...register("fechaIngreso", {
                    required: "Fecha Ingreso es requerida",
                  })}
                />
                {errors.fechaIngreso && (
                  <p className="msg-error">{errors.fechaIngreso.message}</p>
                )}
              </div>

              {/* Fecha Nacimiento */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha Nacimiento</Label>
                <Input type="date" {...register("fechaNacimiento")} />
              </div>

              {/* Correo */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="correo">Correo</Label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email")}
                />
              </div>

              {/* Teléfono */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  type="text"
                  placeholder="9xxxxxxxx"
                  {...register("telefono")}
                />
              </div>

              {/* Dirección */}
              <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  type="text"
                  placeholder="Dirección completa"
                  {...register("direccion")}
                />
              </div>

              {/* Estado (Solo en Edición) */}
              {isEdit && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    {...register("estado", { valueAsNumber: true })}
                    className="w-full border rounded p-2"
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* -------------------- CUENTAS BANCARIAS (useFieldArray) -------------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500 flex justify-between items-center">
              Cuentas Bancarias
              <Button
                type="button"
                size="sm"
                // Valores por defecto para una nueva cuenta
                onClick={() =>
                  append({
                    idBanco: 0,
                    numeroCuenta: "",
                    tipoCuenta: "AHORRO",
                    moneda: "PEN",
                    principal: 0,
                    cci: undefined,
                    fechaInicio: new Date().toISOString().substring(0, 10),
                  })
                }
              >
                + Agregar Cuenta
              </Button>
            </CardTitle>
            <hr />
          </CardHeader>
          <CardContent>
            {fields.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay cuentas bancarias registradas. Agregue una para
                continuar.
              </p>
            )}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border p-4 mb-4 rounded-md bg-gray-50 grid grid-cols-1 md:grid-cols-6 gap-3"
              >
                <div className="col-span-1 md:col-span-6 flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-700">
                    Cuenta #{index + 1} (
                    {field.idCuentaBanco
                      ? `ID: ${field.idCuentaBanco}`
                      : "Nueva"}
                    )
                  </h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>

                {/* Banco */}
                <div className="flex flex-col space-y-2">
                  <Label>
                    Banco <span className="font-semibold text-red-600">*</span>
                  </Label>
                  <select
                    {...register(`cuentas.${index}.idBanco` as const, {
                      valueAsNumber: true,
                      required: "Banco requerido",
                    })}
                    className="w-full border rounded p-2"
                  >
                    <option value={0}>Seleccione Banco</option>
                    {bancos.map((bank) => (
                      <option key={bank.idBanco} value={bank.idBanco}>
                        {bank.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.cuentas?.[index]?.idBanco && (
                    <p className="msg-error">Banco requerido</p>
                  )}
                </div>

                {/* Nro. Cuenta */}
                <div className="flex flex-col space-y-2">
                  <Label>
                    Nro. Cuenta{" "}
                    <span className="font-semibold text-red-600">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Número de cuenta"
                    {...register(`cuentas.${index}.numeroCuenta` as const, {
                      required: "Nro. Cuenta es requerido",
                    })}
                  />
                  {errors.cuentas?.[index]?.numeroCuenta && (
                    <p className="msg-error">Nro. Cta. requerido</p>
                  )}
                </div>

                {/* CCI */}
                <div className="flex flex-col space-y-2">
                  <Label>CCI (Opcional)</Label>
                  <Input
                    type="text"
                    placeholder="CCI (20 dígitos)"
                    {...register(`cuentas.${index}.cci` as const)}
                  />
                </div>

                {/* Tipo Cuenta */}
                <div className="flex flex-col space-y-2">
                  <Label>
                    Tipo Cuenta{" "}
                    <span className="font-semibold text-red-600">*</span>
                  </Label>
                  <select
                    {...register(`cuentas.${index}.tipoCuenta` as const, {
                      required: "Tipo requerido",
                    })}
                    className="w-full border rounded p-2"
                  >
                    <option value="AHORRO">AHORRO</option>
                    <option value="CORRIENTE">CORRIENTE</option>
                  </select>
                </div>

                {/* Moneda */}
                <div className="flex flex-col space-y-2">
                  <Label>
                    Moneda <span className="font-semibold text-red-600">*</span>
                  </Label>
                  <select
                    {...register(`cuentas.${index}.moneda` as const, {
                      required: "Moneda requerida",
                    })}
                    className="w-full border rounded p-2"
                  >
                    <option value="PEN">SOLES</option>
                    <option value="USD">DÓLARES</option>
                  </select>
                </div>

                {/* Principal */}
                <div className="flex flex-col space-y-2">
                  <Label>
                    Principal{" "}
                    <span className="font-semibold text-red-600">*</span>
                  </Label>
                  <select
                    {...register(`cuentas.${index}.principal` as const, {
                      setValueAs: (v) => v === "true",
                      required: true,
                    })}
                    className="w-full border rounded p-2"
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* Fecha Inicio */}
                <div className="flex flex-col space-y-2">
                  <Label>
                    Fecha Inicio{" "}
                    <span className="font-semibold text-red-600">*</span>
                  </Label>
                  <Input
                    type="date"
                    {...register(`cuentas.${index}.fechaInicio` as const, {
                      required: "Fecha es requerida",
                    })}
                  />
                </div>

                {/* Fecha Fin (Opcional) */}
                <div className="flex flex-col space-y-2">
                  <Label>Fecha Fin (Cierre)</Label>
                  <Input
                    type="date"
                    {...register(`cuentas.${index}.fechaFin` as const)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* -------------------- FOOTER -------------------- */}
        <CardFooter className="flex justify-end gap-3 mt-4">
          <Button type="submit" disabled={isSubmitting} variant="sidebar">
            {isSubmitting
              ? isEdit
                ? "Actualizando..."
                : "Creando..."
              : "Guardar Trabajador"}
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => navigate("/trabajador")}
          >
            Cancelar
          </Button>
        </CardFooter>
      </form>
    </>
  );
};

export default TrabajadorIdPage;
