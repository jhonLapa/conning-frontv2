import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  Table as TableInterfaz,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { fetchData } from "@/hooks/use-fetchDatatable";
import Pagination from "./pagination";
import EmptyTable from "./empty-table";

/* ============================================================
   Tipos
   ============================================================ */
export interface FilterConfig {
  id: string;
  label: string;
  type?: "string" | "number";
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  url: string;
  columnNames: Record<string, string>;
  typeFilter: FilterConfig[];
  stateFilter: FilterConfig[];
  onRefresh?: (refreshFn: () => void) => void;
  customFilters?: React.ComponentType<{ table: TableInterfaz<TData> }>;
  onSearchChange?: (value: string, filterId: string) => void; // 👈 para exportar búsqueda
}

/* ============================================================
   Componente principal
   ============================================================ */
export function DataTable<TData, TValue>({
  columns,
  url,
  columnNames,
  typeFilter,
  stateFilter,
  onRefresh,
  customFilters: CustomFilters,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [currentStatus, setCurrentStatus] = useState(
    stateFilter.length > 0 ? stateFilter[0].id : "all"
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [data, setData] = useState<TData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastpage, setLastpage] = useState(0);
  const [typeInput, setTypeInput] = useState<"string" | "number">(
    typeFilter[0].type ?? "string"
  );
  const [selectTypeFilter, setSelectTypeFilter] = useState(typeFilter[0].id);

  /* ============================================================
     Obtener datos (fetchData)
     ============================================================ */
  const getList = useCallback(async () => {
    const response = await fetchData(url, {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy: sorting.length
        ? `${sorting[0].id}.${sorting[0].desc ? "desc" : "asc"}`
        : undefined,
      filters: columnFilters,
    });

    const { data, meta } = response;
    setData(data as TData[]);
    setLastpage(meta.totalPages);
    setPagination((prev) => ({ ...prev, pageIndex: meta.page }));
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters, url]);

  /* ============================================================
     Hooks
     ============================================================ */
  useEffect(() => {
    if (onRefresh) onRefresh(getList);
  }, [getList, onRefresh]);

  useEffect(() => {
    getList();
  }, [getList]);

  /* ============================================================
     Configuración de tabla (TanStack)
     ============================================================ */
  const table = useReactTable({
    data: data ?? [],
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const handlePageChange = (page: number) => table.setPageIndex(page);

  /* ============================================================
     Búsqueda (con debounce)
     ============================================================ */
  const handleSearch = useDebouncedCallback((value: string) => {
    table.getColumn(selectTypeFilter)?.setFilterValue(value);
  }, 300);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearch(value);

    // 🔹 Notificar búsqueda al padre (para exportar)
    if (onSearchChange) onSearchChange(value, selectTypeFilter);
  };

  /* ============================================================
     Render
     ============================================================ */
  return (
    <div className="mt-4">
      {/* 🔹 Cabecera de filtros */}
      <div className="flex flex-col gap-3 sm:flex-row justify-between items-center py-4">
        {/* 🔹 Filtro de tipo + buscador */}
        <div className="flex flex-row w-full">
          {typeFilter.length > 1 && (
            <Select
              value={selectTypeFilter}
              onValueChange={(value) => {
                const filter = typeFilter.find((e) => e.id === value);
                setTypeInput(filter?.type ?? "string");

                // Reiniciar filtros del campo previo
                if (columnFilters.length > 0) {
                  setSearchTerm("");
                  const status = columnFilters.find(
                    (item) => item.id === "status"
                  );
                  setColumnFilters(status ? [status] : []);
                }

                setSelectTypeFilter(value);
              }}
            >
              <SelectTrigger className="w-[188px] mr-2 bg-white">
                <SelectValue placeholder="Seleccionar Filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Buscar por:</SelectLabel>
                  {typeFilter.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Input
            type={typeInput}
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleInputChange}
            className="bg-white"
          />
        </div>

        {/* 🔹 Filtro de estado + columnas */}
        <div className="flex w-full justify-between">
          {stateFilter.length > 0 && (
            <Select
              value={currentStatus}
              onValueChange={(value) => {
                setCurrentStatus(value);
                table.getColumn("status")?.setFilterValue(value);
              }}
            >
              <SelectTrigger className="w-32 bg-white">
                <SelectValue placeholder="Seleccionar Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {stateFilter.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {/* 🔹 Selector de columnas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide() && col.id !== "actions")
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {columnNames[col.id] || col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 🔹 Filtros personalizados */}
      {CustomFilters && <CustomFilters table={table} />}

      {/* 🔹 Tabla principal */}
      {data.length === 0 ? (
        <EmptyTable text="No hay resultados" />
      ) : (
        <>
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No existe resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            allPages={lastpage}
            currentPage={pagination.pageIndex}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
