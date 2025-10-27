import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { generarPDFBoleta } from "../utils/pdfGenerator";
import { InformeRow } from "@/interfaces/informes.interface";

interface Props {
  row: InformeRow;
  fechaIni: string;
  fechaFin: string;
}

export default function ActionsInforme({ row, fechaIni, fechaFin }: Props) {
  const handlePDF = async () => {
    await generarPDFBoleta({
      idTrabajador: row.idTrabajador,
      idProyecto: row.idProyecto,
      fechaIni,
      fechaFin,
    });
  };

  return (
    <Button size="icon" className="bg-blue-600 text-white" onClick={handlePDF}>
      <FileText size={16} />
    </Button>
  );
}
