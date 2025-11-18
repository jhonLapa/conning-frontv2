import { Button } from "@/components/ui/button";
import { Trabajador } from "@/interfaces/trabajador.interface";
import { Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Props {
  trabajador: Trabajador;
  onRefresh: () => void;
}

export default function ActionsInforme({ trabajador }: Props) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleVerProyectos = () => {
    const id = trabajador.idTrabajador;
    const fechaInicio = params.get("fechaInicio");
    const fechaFin = params.get("fechaFin");

    // 🔗 Propagamos fechas al siguiente nivel
    navigate(
      `/informes/proyectosInforme?idTrabajador=${id}&fechaInicio=${fechaInicio || ""}&fechaFin=${fechaFin || ""}`
    );
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="icon"
        className="rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        title="Ver proyectos del trabajador"
        onClick={handleVerProyectos}
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
}
