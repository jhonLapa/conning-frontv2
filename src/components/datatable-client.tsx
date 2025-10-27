"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableClientProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[]; // ← sin 'any'
  columnNames: Record<string, string>;
}

export function DataTableClient<TData>({
  data,
  columns,
  columnNames,
}: DataTableClientProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-white mt-4 p-2">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // ✅ Usamos columnNames para evitar el warning de "unused"
                const mapped =
                  columnNames[header.column.id] ??
                  (typeof header.column.columnDef.header === "string"
                    ? (header.column.columnDef.header as string)
                    : undefined);

                return (
                  <th
                    key={header.id}
                    className="border-b p-2 text-left font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : mapped ?? // si hay nombre mapeado, úsalo
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                No hay datos para mostrar
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
