import { Address } from '@/types/address';
import Icon from '@/components/ui/icon';

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  categoryFilter: string;
  onCategoryChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  addresses: Address[];
}

export default function FilterBar({
  search, onSearchChange,
  categoryFilter, onCategoryChange,
  statusFilter, onStatusChange,
  addresses,
}: FilterBarProps) {
  const categories = ['', ...Array.from(new Set(addresses.map(a => a.category)))];
  const statuses = [
    { value: '', label: 'Все статусы' },
    { value: 'geocoded', label: 'На карте' },
    { value: 'pending', label: 'Ожидание' },
    { value: 'error', label: 'Ошибка' },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-white">
      <div className="relative flex-1 max-w-xs">
        <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск адреса..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={12} />
          </button>
        )}
      </div>

      <select
        value={categoryFilter}
        onChange={e => onCategoryChange(e.target.value)}
        className="text-sm border border-border rounded-md px-2.5 py-1.5 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
      >
        <option value="">Все категории</option>
        {categories.filter(Boolean).map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={e => onStatusChange(e.target.value)}
        className="text-sm border border-border rounded-md px-2.5 py-1.5 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
      >
        {statuses.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
