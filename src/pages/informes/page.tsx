"use client";

import { useEffect, useState } from "react";
import HeaderPage from "@/components/header-page";
import { useCallback } from "react";
import { getPlanillasPorProyectoTrabajador } from "@/services/planilla.service";
import { getTrabajadoresActivos } from "@/services/trabajador.service";
import { getProyectosPorTrabajador } from "@/services/proyecto.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { InformeRow, ProyectoResumen } from "@/interfaces/informes.interface";
import { columnNames, getColumns } from "./ui/columns";
import { DataTableClient } from "@/components/datatable-client";

export default function InformesPage() {
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [trabajadores, setTrabajadores] = useState<
    { idTrabajador: number; apellidosNombres: string }[]
  >([]);
  const [proyectos, setProyectos] = useState<
    { idProyecto: number; nombre: string }[]
  >([]);

  const [idTrabajador, setIdTrabajador] = useState<number | undefined>(
    undefined
  );
  const [idProyecto, setIdProyecto] = useState<number | undefined>(undefined);

  const [tableData, setTableData] = useState<InformeRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar trabajadores para select
  useEffect(() => {
    (async () => {
      const data = await getTrabajadoresActivos();
      setTrabajadores(data);
    })();
  }, []);

  // Cuando cambie el trabajador, cargar sus proyectos
  useEffect(() => {
    if (!idTrabajador) {
      setProyectos([]);
      setIdProyecto(undefined);
      return;
    }

    (async () => {
      const res = await getProyectosPorTrabajador(idTrabajador);
      setProyectos(
        res.data.map((p: ProyectoResumen) => ({
          idProyecto: p.idProyecto,
          nombre: p.nombre,
        }))
      );
    })();
  }, [idTrabajador]);

  // Cargar tabla con filtros

  const fetchTable = useCallback(async () => {
    setLoading(true);
    const res = await getPlanillasPorProyectoTrabajador({
      idTrabajador,
      idProyecto,
      fechaIni,
      fechaFin,
    });

    const mapped: InformeRow[] = res.data.map((item) => {
      const trabajadorItem = item.proyecto.trabajadores[0].trabajador;

      return {
        idPlanilla: item.idPlanilla,
        idTrabajador: trabajadorItem.idTrabajador,
        trabajador: trabajadorItem.apellidosNombres,
        idProyecto: item.idProyecto,
        proyecto: item.proyecto.nombre,
        total: item.totalGeneral,
        detalles: item.detalles,
      };
    });

    setTableData(mapped);
    setLoading(false);
  }, [idTrabajador, idProyecto, fechaIni, fechaFin]);

  useEffect(() => {
    fetchTable();
  }, [fetchTable]);

  return (
    <>
      <HeaderPage
        title="Informes"
        descripcion="Listado de pagos por trabajador y proyecto."
      />

      {/*FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-5">
        {/* Fecha Desde */}
        <div>
          <label className="text-sm font-medium">Fecha Inicio</label>
          <Input
            type="date"
            value={fechaIni}
            onChange={(e) => setFechaIni(e.target.value)}
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="text-sm font-medium">Fecha Fin</label>
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        {/* Select Trabajador */}
        <div>
          <label className="text-sm font-medium">Trabajador</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {idTrabajador
                  ? trabajadores.find((t) => t.idTrabajador === idTrabajador)
                      ?.apellidosNombres
                  : "Seleccionar trabajador"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar trabajador..." />
                <CommandList>
                  <CommandEmpty>No encontrado</CommandEmpty>
                  <CommandGroup>
                    {trabajadores.map((t) => (
                      <CommandItem
                        key={t.idTrabajador}
                        onSelect={() => setIdTrabajador(t.idTrabajador)}
                      >
                        {t.apellidosNombres}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Select Proyecto */}
        <div>
          <label className="text-sm font-medium">Proyecto</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {idProyecto
                  ? proyectos.find((p) => p.idProyecto === idProyecto)?.nombre
                  : "Seleccionar proyecto"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar proyecto..." />
                <CommandList>
                  <CommandEmpty>No encontrado</CommandEmpty>
                  <CommandGroup>
                    {proyectos.map((p) => (
                      <CommandItem
                        key={p.idProyecto}
                        onSelect={() => setIdProyecto(p.idProyecto)}
                      >
                        {p.nombre}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Botón Aplicar */}
        <div className="flex items-end">
          <Button onClick={fetchTable} disabled={loading} className="w-full">
            {loading ? "Cargando..." : "Aplicar Filtros"}
          </Button>
        </div>
      </div>

      {/* TABLA */}
      <DataTableClient
        data={tableData}
        columns={getColumns(fechaIni, fechaFin)}
        columnNames={columnNames}
      />
    </>
  );
}
