# 📘 GUÍA PARA CREAR NUEVOS MÓDULOS EN CONNING FRONTEND

> Documentación completa para crear módulos siguiendo el patrón arquitectónico del sistema

**Fecha de creación:** Octubre 2025
**Sistema:** Conning Intranet - React + TypeScript + Vite
**Patrón:** Basado en módulos existentes (Banco, Cobranza, Cliente, etc.)

---

## 📋 TABLA DE CONTENIDOS

1. [Estructura General de un Módulo](#estructura-general)
2. [Paso a Paso para Crear un Módulo](#paso-a-paso)
3. [Archivos Necesarios](#archivos-necesarios)
4. [Checklist de Implementación](#checklist)
5. [Ejemplos de Código](#ejemplos)
6. [Troubleshooting](#troubleshooting)

---

## 📁 ESTRUCTURA GENERAL DE UN MÓDULO {#estructura-general}

Todo módulo sigue esta estructura estándar:

```
src/
├── pages/
│   └── [seccion]/              # Ej: administracion, mantenedores, ingresos-egresos
│       └── [nombre-modulo]/    # Ej: cobranza, banco, cliente
│           ├── page.tsx        # Lista principal con DataTable
│           ├── [id]/
│           │   └── page.tsx    # Formulario de creación/edición
│           └── ui/
│               ├── columns.tsx # Definición de columnas del DataTable
│               └── action-[nombre].tsx # Acciones de la tabla
├── services/
│   └── [nombre].service.ts     # Servicios API del módulo
├── interfaces/
│   └── [nombre].interface.ts   # Interfaces TypeScript
└── router.tsx                  # Rutas del módulo (actualizar)
```

---

## 🚀 PASO A PASO PARA CREAR UN MÓDULO {#paso-a-paso}

### **PASO 1: Definir las Interfaces TypeScript**

📍 Ubicación: `src/interfaces/[nombre].interface.ts`

```typescript
// Ejemplo: proveedores.interface.ts

export interface Proveedor {
  idProveedor: number;
  nombreCompleto: string;
  numeroDocumento: string;
  tipoDocumentoId: number;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreacion?: string | null;
  usuarioModificacion?: string | null;
}

export interface ProveedorRequest {
  idProveedor: number;
  nombreCompleto: string;
  numeroDocumento: string;
  tipoDocumentoId: number;
  direccion?: string;
  telefono?: string;
  email?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}
```

**📝 Reglas:**
- Interfaz principal: Datos completos del backend
- Interfaz Request: Datos para enviar al backend (POST/PUT)
- Usa `?` para campos opcionales
- Mantén consistencia con el backend

---

### **PASO 2: Crear los Servicios API**

📍 Ubicación: `src/services/[nombre].service.ts`

```typescript
// Ejemplo: proveedor.service.ts

import api from "@/lib/api";
import { Proveedor, ProveedorRequest } from "@/interfaces/proveedor.interface";

export const proveedorService = {
  /**
   * Obtiene todos los proveedores paginados
   */
  getAll: async (page: number = 1, pageSize: number = 10): Promise<any> => {
    const response = await api.get('/proveedor/busquedapaginado', {
      params: { page, pageSize }
    });
    return response.data;
  },

  /**
   * Obtiene proveedores activos (para selects)
   */
  getActivos: async (): Promise<Proveedor[]> => {
    const response = await api.get('/proveedor/selectactivos');
    return response.data;
  },

  /**
   * Obtiene un proveedor por ID
   */
  getById: async (id: number): Promise<Proveedor> => {
    const response = await api.get(`/proveedor/${id}`);
    return response.data.data || response.data;
  },

  /**
   * Crea o actualiza un proveedor
   */
  save: async (data: ProveedorRequest): Promise<any> => {
    const endpoint = data.idProveedor === 0
      ? '/proveedor'
      : `/proveedor/${data.idProveedor}`;

    const method = data.idProveedor === 0 ? 'post' : 'put';
    const response = await api[method](endpoint, data);
    return response.data;
  },

  /**
   * Elimina un proveedor
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/proveedor/${id}`);
  },
};
```

**📝 Reglas:**
- Documenta cada función con comentarios
- Maneja errores apropiadamente
- Usa async/await
- Retorna tipos tipados

---

### **PASO 3: Crear las Columnas del DataTable**

📍 Ubicación: `src/pages/[seccion]/[modulo]/ui/columns.tsx`

```typescript
// Ejemplo: columns.tsx para proveedores

import { ColumnDef } from "@tanstack/react-table";
import { Proveedor } from "@/interfaces/proveedor.interface";
import { Badge } from "@/components/ui/badge";
import ActionProveedor from "./action-proveedor";

export const columns: ColumnDef<Proveedor>[] = [
  {
    accessorKey: "idProveedor",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("idProveedor")}</div>
    ),
  },
  {
    accessorKey: "nombreCompleto",
    header: "Nombre Completo",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("nombreCompleto")}</div>
    ),
  },
  {
    accessorKey: "numeroDocumento",
    header: "RUC/DNI",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as number;
      return (
        <Badge variant={estado === 1 ? "success" : "destructive"}>
          {estado === 1 ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionProveedor data={row.original} />,
  },
];
```

**📝 Reglas:**
- Una columna por campo importante
- Usa badges para estados
- Última columna siempre es "Acciones"
- Formatea datos apropiadamente

---

### **PASO 4: Crear el Componente de Acciones**

📍 Ubicación: `src/pages/[seccion]/[modulo]/ui/action-[nombre].tsx`

```typescript
// Ejemplo: action-proveedor.tsx

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { Proveedor } from "@/interfaces/proveedor.interface";
import { proveedorService } from "@/services/proveedor.service";
import { toast } from "sonner";

interface ActionProveedorProps {
  data: Proveedor;
}

export default function ActionProveedor({ data }: ActionProveedorProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/proveedor/${data.idProveedor}`);
  };

  const handleDelete = async () => {
    if (!confirm("¿Está seguro de eliminar este proveedor?")) return;

    try {
      await proveedorService.delete(data.idProveedor);
      toast.success("Proveedor eliminado exitosamente");
      window.location.reload(); // O usar un refresh más elegante
    } catch (error) {
      toast.error("Error al eliminar el proveedor");
      console.error(error);
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      <Button variant="sidebar" size="sm" onClick={handleEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

**📝 Reglas:**
- Botón editar con icono Pencil
- Botón eliminar con icono Trash2
- Confirmar antes de eliminar
- Mostrar toast con resultados

---

### **PASO 5: Crear la Página Principal (Lista)**

📍 Ubicación: `src/pages/[seccion]/[modulo]/page.tsx`

```typescript
// Ejemplo: page.tsx para lista de proveedores

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/data-table/data-table";
import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { columns } from "./ui/columns";
import { proveedorService } from "@/services/proveedor.service";
import { Proveedor } from "@/interfaces/proveedor.interface";
import { Plus } from "lucide-react";

export default function ProveedorPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await proveedorService.getAll();
      setData(response.data || response);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    navigate("/proveedor/nuevo");
  };

  return (
    <>
      <HeaderPage
        title="Proveedores"
        descripcion="Gestión de proveedores del sistema"
      />

      <div className="mt-4">
        <div className="flex justify-end mb-4">
          <Button variant="sidebar" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </div>
    </>
  );
}
```

**📝 Reglas:**
- Usar HeaderPage para título
- Botón "Nuevo" arriba a la derecha
- DataTable con loading state
- Icono Plus para nuevo

---

### **PASO 6: Crear el Formulario (Creación/Edición)**

📍 Ubicación: `src/pages/[seccion]/[modulo]/[id]/page.tsx`

```typescript
// Ejemplo: [id]/page.tsx para formulario de proveedor

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import HeaderPage from "@/components/header-page";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { proveedorService } from "@/services/proveedor.service";
import { ProveedorRequest } from "@/interfaces/proveedor.interface";

interface FormData {
  nombreCompleto: string;
  numeroDocumento: string;
  tipoDocumentoId: number;
  direccion: string;
  telefono: string;
  email: string;
  activo: boolean;
}

export default function ProveedorIdPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const title = id === "nuevo" ? "Nuevo Proveedor" : "Editar Proveedor";

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nombreCompleto: "",
      numeroDocumento: "",
      tipoDocumentoId: 1,
      direccion: "",
      telefono: "",
      email: "",
      activo: true,
    },
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (id && id !== "nuevo") {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await proveedorService.getById(Number(id));

      setValue("nombreCompleto", data.nombreCompleto);
      setValue("numeroDocumento", data.numeroDocumento);
      setValue("tipoDocumentoId", data.tipoDocumentoId);
      setValue("direccion", data.direccion || "");
      setValue("telefono", data.telefono || "");
      setValue("email", data.email || "");
      setValue("activo", data.estado === 1);
    } catch (error) {
      toast.error("Error al cargar los datos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const requestData: ProveedorRequest = {
        idProveedor: id === "nuevo" ? 0 : Number(id),
        nombreCompleto: data.nombreCompleto,
        numeroDocumento: data.numeroDocumento,
        tipoDocumentoId: data.tipoDocumentoId,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
        usuarioCreacion: "admin", // O del estado de autenticación
      };

      await proveedorService.save(requestData);

      toast.success(
        id === "nuevo"
          ? "Proveedor creado exitosamente"
          : "Proveedor actualizado exitosamente"
      );

      setTimeout(() => navigate("/proveedor"), 1500);
    } catch (error) {
      toast.error("Error al guardar el proveedor");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <>
      <HeaderPage title={title} descripcion="Información del proveedor" />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              Datos del Proveedor
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="nombreCompleto">
                  Nombre Completo
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("nombreCompleto", {
                    required: "El nombre es requerido",
                  })}
                  placeholder="Ingrese el nombre completo"
                />
                {errors.nombreCompleto && (
                  <p className="text-red-500 text-sm">{errors.nombreCompleto.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="numeroDocumento">
                  RUC/DNI
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register("numeroDocumento", {
                    required: "El documento es requerido",
                  })}
                  placeholder="Ingrese RUC o DNI"
                />
                {errors.numeroDocumento && (
                  <p className="text-red-500 text-sm">{errors.numeroDocumento.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  {...register("telefono")}
                  placeholder="Ingrese teléfono"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Ingrese email"
                />
              </div>

              <div className="flex flex-col space-y-2 col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  {...register("direccion")}
                  placeholder="Ingrese dirección"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button variant="sidebar" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={() => navigate("/proveedor")}
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
```

**📝 Reglas:**
- Usar Cards para agrupar secciones
- Validaciones con react-hook-form
- Loading state al cargar datos
- Toast para feedback
- Redirigir después de guardar

---

### **PASO 7: Agregar las Rutas**

📍 Ubicación: `src/router.tsx`

```typescript
// Agregar imports
import ProveedorPage from "./pages/administracion/proveedor/page";
import ProveedorIdPage from "./pages/administracion/proveedor/[id]/page";

// Agregar rutas dentro del children de AdminLayout
{
  path: "/proveedor",
  element: <ProveedorPage />,
},
{
  path: "/proveedor/:id",
  element: <ProveedorIdPage />,
},
```

**📝 Reglas:**
- Ruta lista: `/nombre-modulo`
- Ruta formulario: `/nombre-modulo/:id`
- Usar kebab-case en URLs

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN {#checklist}

### Antes de empezar:
- [ ] Verificar endpoints de API disponibles
- [ ] Documentar estructura de datos del backend
- [ ] Definir campos requeridos vs opcionales

### Archivos a crear:
- [ ] `src/interfaces/[nombre].interface.ts`
- [ ] `src/services/[nombre].service.ts`
- [ ] `src/pages/[seccion]/[modulo]/page.tsx`
- [ ] `src/pages/[seccion]/[modulo]/[id]/page.tsx`
- [ ] `src/pages/[seccion]/[modulo]/ui/columns.tsx`
- [ ] `src/pages/[seccion]/[modulo]/ui/action-[nombre].tsx`

### Configuración:
- [ ] Actualizar `src/router.tsx` con las rutas
- [ ] Agregar opción en menú lateral (si aplica)
- [ ] Configurar permisos (si aplica)

### Testing:
- [ ] Probar creación de registros
- [ ] Probar edición de registros
- [ ] Probar eliminación de registros
- [ ] Probar validaciones de formulario
- [ ] Probar paginación (si aplica)
- [ ] Probar búsqueda (si aplica)

---

## 📌 EJEMPLOS DE CÓDIGO ÚTILES {#ejemplos}

### Select con datos de API

```typescript
const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);

useEffect(() => {
  const fetchTipos = async () => {
    const tipos = await tipoDocumentoService.getActivos();
    setTiposDocumento(tipos);
  };
  fetchTipos();
}, []);

// En el JSX
<select {...register("tipoDocumentoId")}>
  <option value="">-- Seleccione --</option>
  {tiposDocumento.map((tipo) => (
    <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento}>
      {tipo.nombre}
    </option>
  ))}
</select>
```

### Formateo de Fechas

```typescript
// En columns.tsx
{
  accessorKey: "fechaCreacion",
  header: "Fecha Creación",
  cell: ({ row }) => {
    const fecha = new Date(row.getValue("fechaCreacion"));
    return fecha.toLocaleDateString('es-PE');
  },
}
```

### Tabla Dinámica con Add/Remove

```typescript
const [items, setItems] = useState([{ id: 1, campo: "" }]);

const agregarItem = () => {
  setItems([...items, { id: Date.now(), campo: "" }]);
};

const eliminarItem = (id: number) => {
  if (items.length > 1) {
    setItems(items.filter(item => item.id !== id));
  }
};

const handleItemChange = (id: number, valor: string) => {
  setItems(items.map(item =>
    item.id === id ? { ...item, campo: valor } : item
  ));
};
```

---

## 🔧 TROUBLESHOOTING {#troubleshooting}

### Error: "Cannot read properties of undefined"
**Solución:** Verificar que el backend retorna los datos en el formato esperado. Usar optional chaining (`?.`)

### Error: "403 Forbidden" en API
**Solución:** Verificar autenticación y permisos del usuario

### DataTable no muestra datos
**Solución:**
- Verificar que `columns` y `data` están correctamente definidos
- Revisar console.log para ver estructura de datos

### Formulario no carga datos en edición
**Solución:**
- Verificar que `useEffect` se ejecuta cuando `id` cambia
- Usar `setValue` para cada campo

### Error al hacer POST/PUT
**Solución:**
- Verificar estructura del `RequestData`
- Revisar Network tab en DevTools
- Verificar que el endpoint acepta el formato enviado

---

## 🎨 BUENAS PRÁCTICAS

1. **Nombres Consistentes:**
   - Singular para interfaces: `Proveedor`, no `Proveedores`
   - kebab-case para URLs: `/tipo-documento`
   - camelCase para variables: `tipoDocumento`
   - PascalCase para componentes: `ProveedorPage`

2. **Organización:**
   - Un servicio por módulo
   - Agrupar interfaces relacionadas
   - Componentizar acciones repetitivas

3. **Validaciones:**
   - Campos requeridos con `*` rojo
   - Mensajes de error claros
   - Validar en frontend Y backend

4. **UX:**
   - Loading states visibles
   - Mensajes toast informativos
   - Confirmación antes de eliminar
   - Deshabilitar botones durante submit

5. **Código Limpio:**
   - Comentar funciones complejas
   - Extraer lógica repetitiva
   - Manejar errores apropiadamente
   - Usar TypeScript correctamente

---

## 📚 RECURSOS ADICIONALES

- **Documentación del proyecto:** `IMPLEMENTACION_PDF_COBRANZA.txt`
- **Ejemplos reales:** Ver módulos de `cobranza`, `banco`, `cliente`
- **Componentes UI:** Ver `src/components/ui/`
- **API Base:** `src/lib/api.ts`

---

## ✨ MÓDULOS DE EJEMPLO A SEGUIR

1. **Cobranza** (`src/pages/administracion/cobranza/`)
   - Formulario complejo con múltiples Cards
   - Generación de PDF
   - Tablas dinámicas

2. **Banco** (`src/pages/mantenedores/banks/`)
   - CRUD básico
   - Patrón estándar

3. **Cliente** (`src/pages/administracion/cliente/`)
   - Selects dependientes
   - Validaciones complejas

---

**Fecha:** Octubre 2025
**Autor:** Claude AI Assistant
**Versión:** 1.0

🤖 Generated with [Claude Code](https://claude.com/claude-code)
