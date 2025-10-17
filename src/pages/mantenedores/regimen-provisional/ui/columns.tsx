import { FilterConfig } from "@/components/datatable";
import { SortedIcon } from "@/components/sorted-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import { Regimen } from "@/interfaces/regimen.interface"; 
import ActionsRegimen from "./action-regimen"; 

export const columnNames: Record<string, string> = {
    nombre: "Nombre",
    tipo: "Tipo",
    aporte: "Aporte (%)",
    total: "Total (%)",
    fechaCreacion: "Fecha Creacion",
    estado: "Estado",
    actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
    {
        id: "nombre",
        label: "Nombre",
    },
    {
        id: "tipo",
        label: "Tipo",
    },
];

export const stateFilter: FilterConfig[] = [
    {
        id: "all",
        label: "Todos",
    },
    {
        id: "activo",
        label: "Activos",
    },
    {
        id: "inactivo",
        label: "Inactivos",
    },
];

export const getColumns = (
    refreshDataTable: () => void
): ColumnDef<Regimen>[] => [
    
    {
        id: "nombre",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                >
                    Nombre
                    <SortedIcon isSorted={isSorted} />
                </Button>
            );
        },
        cell: ({ row }) => <span className="ml-4">{row.original.nombre}</span>,
    },
    
    {
        id: "tipo",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(isSorted === "asc")}
                >
                    Tipo
                    <SortedIcon isSorted={isSorted} />
                </Button>
            );
        },
        cell: ({ row }) => <span>{row.original.tipo}</span>,
    },
    
    {
        id: "aporte",
        header: "Aporte (%)",
        cell: ({ row }) => (
            <span>{row.original.aporte ? `${row.original.aporte.toFixed(2)}%` : 'N/A'}</span>
        ),
    },
    {
        id: "total",
        header: "Total (%)",
        cell: ({ row }) => (
            <span>{row.original.total.toFixed(2)}%</span>
        ),
    },
    {
        accessorKey: "estado",
        id: "status",
        header: "Estado",
        cell: ({ row }) => {
            const state: boolean = row.original.estado === 1;
            return (
                <Badge variant={state ? "success" : "destructive"}>
                    {state ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <ActionsRegimen
                regimen={row.original}
                onRefresh={refreshDataTable}
            />
        ),
    },
];