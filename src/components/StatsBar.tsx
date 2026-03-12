import { Address } from '@/types/address';
import Icon from '@/components/ui/icon';

interface StatsBarProps {
  addresses: Address[];
}

export default function StatsBar({ addresses }: StatsBarProps) {
  const total = addresses.length;
  const geocoded = addresses.filter(a => a.status === 'geocoded').length;
  const pending = addresses.filter(a => a.status === 'pending').length;
  const cities = new Set(addresses.map(a => a.city)).size;

  const stats = [
    { label: 'Всего адресов', value: total, icon: 'MapPin', color: 'text-foreground' },
    { label: 'На карте', value: geocoded, icon: 'CheckCircle', color: 'text-emerald-600' },
    { label: 'Ожидают', value: pending, icon: 'Clock', color: 'text-amber-600' },
    { label: 'Городов', value: cities, icon: 'Building2', color: 'text-blue-600' },
  ];

  const geocodedPct = total > 0 ? Math.round((geocoded / total) * 100) : 0;

  return (
    <div className="flex items-center gap-6 px-6 py-3 bg-white border-b border-border">
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-2 min-w-0">
          <Icon name={s.icon} fallback="Info" size={14} className={s.color} />
          <span className={`text-lg font-semibold ${s.color}`}>{s.value}</span>
          <span className="text-xs text-muted-foreground hidden sm:block">{s.label}</span>
          {i < stats.length - 1 && <div className="w-px h-4 bg-border ml-4" />}
        </div>
      ))}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Геокодировано</span>
        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${geocodedPct}%` }}
          />
        </div>
        <span className="text-xs font-medium">{geocodedPct}%</span>
      </div>
    </div>
  );
}
