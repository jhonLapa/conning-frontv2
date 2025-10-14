import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, MenuRequest, MenuActivo } from "@/interfaces/menus.interface";
import {
  getFetchMenuById, postMenu, putMenu, getMenuesActivos,
} from "@/services/menus.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MenuIdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  //Detecta edición sin depender de "nuevo"
  const numericId = Number(id);
  const isEdit = !isNaN(numericId);

  const [menu, setMenu] = useState<Menu | null>(null);
  const [menues, setMenues] = useState<MenuActivo[]>([]);
  const [loadingMenues, setLoadingMenues] = useState(false);

  // Título correcto
  const title = isEdit ? "Editar Menu" : "Nuevo Menu";

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<MenuRequest>({
      defaultValues: {
        name: "",
        icon: "",
        url: "",
        fatherId: null,
        position: 0,
      },
    });
  const getMenu = async () => {
    if (!isEdit) return;
    const response = await getFetchMenuById(numericId);
    setMenu(response);
    setValue("name", response.name);
    setValue("icon", response.icon);
    setValue("url", response.url);
    setValue("fatherId", response.fatherId ?? null);
  };

  useEffect(() => {
    getMenu();
  }, [isEdit, numericId]);

  //Efecto 2: cargar menús activos para el combo Father (y filtrar si editas)
  useEffect(() => {
    const loadMenues = async () => {
      setLoadingMenues(true);
      try {
        const list = await getMenuesActivos();
        const filtered = isEdit ? list.filter(m => m.menuId !== numericId) : list;
        setMenues(filtered);
      } finally {
        setLoadingMenues(false);
      }
    };
    loadMenues();
  }, [isEdit, numericId]);

  const onSubmit = async (data: MenuRequest) => {
    const response = menu
      ? await putMenu(menu.menuId, data)
      : await postMenu(data);

    if (!response.success) {
      toast.warning("Error al Guardar el registro", { position: "top-right" });
      return;
    }

    toast.success(response.message, { position: "top-right" });
    setMenu(null);
    navigate("/menu");
  };

  return (
    <>
      <HeaderPage title={title} descripcion="Informacion detallada de Menu" />

      <form className="flex flex-col gap-5 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-gray-500">
              {title}
            </CardTitle>
            <hr />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Name<span className="font-semibold text-red-600">*</span></Label>
                <Input
                  type="text"
                  placeholder="name"
                  {...register("name", { required: "El Name es requerido" })}
                />
                {errors.name && <p className="msg-error">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="icon">Icon<span className="font-semibold text-red-600">*</span></Label>
                <Input
                  type="text"
                  placeholder="icon"
                  {...register("icon", { required: "El icon es requerido" })}
                />
                {errors.icon && <p className="msg-error">{errors.icon.message}</p>}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="url">Url<span className="font-semibold text-red-600">*</span></Label>
                <Input
                  type="text"
                  placeholder="url"
                  {...register("url", { required: "El url es requerido" })}
                />
                {errors.url && <p className="msg-error">{errors.url.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="fatherId">Father<span className="font-semibold text-red-600">*</span></Label>
                <select
                  id="fatherId"
                  className="border rounded p-2"
                  disabled={loadingMenues}
                  {...register("fatherId", {
                    required: "El Father es requerido",
                    setValueAs: (v) => (v === "" ? null : Number(v)),
                  })}
                >
                  <option value="">-- Selecciona Father--</option>
                  {menues.map((m) => (
                    <option key={m.menuId} value={m.menuId}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {errors.fatherId && <p className="msg-error">{errors.fatherId.message}</p>}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-nowrap justify-end gap-5">
            <Button variant={"sidebar"} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant={"default"} type="button" onClick={() => navigate("/menu")}>
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default MenuIdPage;
