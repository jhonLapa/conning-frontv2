import { DataTable } from "@/components/datatable";
import HeaderPage from "@/components/header-page";
import { useRef } from "react";
import {
    columnFilter,
    columnNames,
    getColumns,
    stateFilter,
} from "./ui/columns"; 

export default function RegimenPage() {
    const refreshDataTable = useRef<() => void>(null);

    return (
        <>
            <HeaderPage
                title="Regímenes Previsionales"
                descripcion="Listado de todos los regímenes (AFP, ONP, etc.)."
                linkConfig={{
                    title: "Nuevo Régimen",
                    url: "/regimenprevisional/nuevo",
                }}
            />

            <DataTable
                columns={getColumns(() => refreshDataTable.current?.())}
                columnNames={columnNames}
                url="regimenprevisional/busquedapaginado"
                typeFilter={columnFilter}
                stateFilter={stateFilter}
                onRefresh={(callback) => {
                    refreshDataTable.current = callback;
                }}
            />
        </>
    );
}