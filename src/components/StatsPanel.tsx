import { Address } from '@/types/address';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsPanelProps {
  addresses: Address[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Офис': '#1a7fe8',
  'Склад': '#f59e0b',
  'Магазин': '#10b981',
};
const DEFAULT_COLOR = '#8b5cf6';

export default function StatsPanel({ addresses }: StatsPanelProps) {
  const total = addresses.length;
  const geocoded = addresses.filter(a => a.status === 'geocoded').length;
  const pending = addresses.filter(a => a.status === 'pending').length;
  const error = addresses.filter(a => a.status === 'error').length;

  const categoryData = Object.entries(
    addresses.reduce<Record<string, number>>((acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const cityData = Object.entries(
    addresses.reduce<Record<string, number>>((acc, a) => {
      acc[a.city] = (acc[a.city] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));

  return (
    <div className="h-full overflow-auto p-5 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Всего" value={total} color="text-foreground" />
        <StatCard label="На карте" value={geocoded} color="text-emerald-600" />
        <StatCard label="Ожидание" value={pending} color="text-amber-600" />
      </div>
      {error > 0 && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
          {error} адрес{error === 1 ? '' : 'а'} с ошибкой геокодирования
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">По категориям</p>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={90} height={90}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={24} outerRadius={42} strokeWidth={0}>
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? DEFAULT_COLOR} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid hsl(var(--border))' }}
                formatter={(v: number) => [v, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 flex-1">
            {categoryData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[d.name] ?? DEFAULT_COLOR }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-medium tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">Топ городов</p>
        <div className="space-y-2">
          {cityData.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-medium tabular-nums">{d.value}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1a7fe8]"
                    style={{ width: `${(d.value / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-muted/40 rounded-lg p-3 text-center">
      <div className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
