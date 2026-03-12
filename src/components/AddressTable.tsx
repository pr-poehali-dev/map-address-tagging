import { useState } from 'react';
import { Address, SortField, SortOrder } from '@/types/address';
import Icon from '@/components/ui/icon';

interface AddressTableProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  'Офис': 'bg-blue-50 text-blue-700',
  'Склад': 'bg-amber-50 text-amber-700',
  'Магазин': 'bg-emerald-50 text-emerald-700',
};

const statusConfig = {
  geocoded: { label: 'На карте', dot: 'bg-emerald-400' },
  pending: { label: 'Ожидание', dot: 'bg-amber-400' },
  error: { label: 'Ошибка', dot: 'bg-red-400' },
};

export default function AddressTable({ addresses, selectedId, onSelect, onDelete }: AddressTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sorted = [...addresses].sort((a, b) => {
    const va = a[sortField] ?? '';
    const vb = b[sortField] ?? '';
    if (va < vb) return sortOrder === 'asc' ? -1 : 1;
    if (va > vb) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 inline-flex flex-col opacity-40">
      {sortField === field
        ? <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
        : <Icon name="ChevronsUpDown" size={12} />}
    </span>
  );

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-sm min-w-[560px]">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-border">
            {[
              { field: 'title' as SortField, label: 'Название' },
              { field: 'city' as SortField, label: 'Город' },
              { field: 'category' as SortField, label: 'Категория' },
              { field: 'status' as SortField, label: 'Статус' },
            ].map(col => (
              <th
                key={col.field}
                className="text-left px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort(col.field)}
              >
                {col.label}<SortIcon field={col.field} />
              </th>
            ))}
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((addr, i) => {
            const isSelected = selectedId === addr.id;
            const st = statusConfig[addr.status];
            return (
              <tr
                key={addr.id}
                onClick={() => onSelect(addr.id)}
                className={`
                  border-b border-border/50 cursor-pointer transition-all duration-150
                  ${isSelected ? 'bg-blue-50/60' : 'hover:bg-muted/50'}
                  animate-fade-in
                `}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <div className="w-1 h-4 rounded-full bg-[#1a7fe8] flex-shrink-0" />
                    )}
                    <span className={`font-medium ${isSelected ? 'text-[#1a7fe8]' : 'text-foreground'}`}>
                      {addr.title}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 pl-3">{addr.address}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{addr.city}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[addr.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {addr.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    <span className="text-xs text-muted-foreground">{st.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(addr.id); }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity text-muted-foreground p-1 rounded hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Icon name="MapPin" size={32} className="mb-3 opacity-30" />
          <p className="text-sm">Адреса не найдены</p>
        </div>
      )}
    </div>
  );
}
