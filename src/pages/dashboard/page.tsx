import { useEffect, useState } from "react";
import { getDashboard } from "@/services/dashboard.service";
import { Dashboard } from "@/interfaces/dashboard.interface";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboard();
        setData(response);
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Cargando datos...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No hay datos para mostrar
      </p>
    );
  }

  // 🔹 Fusionar por mes
  const mergedData = Array.from(
    new Set([
      ...data.ventasMensuales.map((v) => v.mes),
      ...data.comprasMensuales.map((c) => c.mes),
      ...(data.planillasMensuales?.map((p) => p.mes) ?? []),
    ])
  ).map((mes) => ({
    mes,
    ventas: Math.abs(
      data.ventasMensuales.find((x) => x.mes === mes)?.total ?? 0
    ),
    compras: Math.abs(
      data.comprasMensuales.find((x) => x.mes === mes)?.total ?? 0
    ),
    planillas: Math.abs(
      data.planillasMensuales?.find((x) => x.mes === mes)?.total ?? 0
    ),
  }));

  mergedData.sort(
    (a, b) =>
      new Date(`2025-${a.mes}-01`).getMonth() -
      new Date(`2025-${b.mes}-01`).getMonth()
  );

  return (
    <div className="p-6 space-y-6">
      {/* ================= Tarjetas resumen ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {/* Ventas */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas del Mes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            S/ {data.totalVentas.toFixed(2)}
          </CardContent>
        </Card>

        {/* Compras */}
        <Card>
          <CardHeader>
            <CardTitle>Compras</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-500">
            S/ {data.totalCompras.toFixed(2)}
          </CardContent>
        </Card>

        {/* Planillas */}
        <Card>
          <CardHeader>
            <CardTitle>Planillas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-yellow-500">
            S/ {data.totalPlanillas.toFixed(2)}
          </CardContent>
        </Card>

        {/* Ingresos */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Especial</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-emerald-500">
            S/ {data.totalIngresos.toFixed(2)}
          </CardContent>
        </Card>

        {/* Egresos */}
        <Card>
          <CardHeader>
            <CardTitle>Egresos Especial</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-rose-500">
            S/ {data.totalEgresos.toFixed(2)}
          </CardContent>
        </Card>

        {/* Movimientos (total general) */}
        <Card>
          <CardHeader>
            <CardTitle>Total General</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-purple-600">
            S/ {data.totalMovimientos.toFixed(2)}
          </CardContent>
        </Card>

        {/* Proyectos Activos */}
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Activos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-blue-500">
            {data.totalProyectosActivos}
          </CardContent>
        </Card>
      </div>

      {/* ================= Gráfico ================= */}
      <Card>
        <CardHeader>
          <CardTitle>
            📊 Comparativo mensual — Ventas vs Compras vs Planillas
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(v) => [`S/ ${v}`, "Monto"]} />
              <Legend />
              <Bar
                dataKey="ventas"
                fill="#22c55e"
                name="Ventas"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="compras"
                fill="#ef4444"
                name="Compras"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="planillas"
                fill="#facc15"
                name="Planillas"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ================= Movimientos recientes ================= */}
      <Card>
        <CardHeader>
          <CardTitle>💸 Flujo de Caja Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Fecha</th>
                <th className="py-2">Tipo</th>
                <th className="py-2">Descripción</th>
                <th className="py-2 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {data.ultimosMovimientos.map((mov, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2">{mov.fecha}</td>
                  <td className="py-2">{mov.tipo}</td>
                  <td className="py-2">{mov.descripcion}</td>
                  <td
                    className={`py-2 text-right font-semibold ${
                      mov.monto > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {mov.monto > 0
                      ? `+S/ ${mov.monto.toFixed(2)}`
                      : `S/ ${mov.monto.toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
