import { Address } from '@/types/address';
import Icon from '@/components/ui/icon';

interface DetailPanelProps {
  address: Address | null;
  onClose: () => void;
}

const statusConfig = {
  geocoded: { label: 'На карте', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-400' },
  pending: { label: 'Ожидание', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  error: { label: 'Ошибка', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-400' },
};

export default function DetailPanel({ address, onClose }: DetailPanelProps) {
  if (!address) return null;

  const st = statusConfig[address.status];

  return (
    <div className="h-full bg-white border-l border-border flex flex-col animate-slide-in-right">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Детали</span>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <Icon name="X" size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-5">
        <div>
          <h2 className="font-semibold text-lg leading-tight">{address.title}</h2>
          <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </div>
        </div>

        <div className="space-y-3">
          <InfoRow icon="MapPin" label="Адрес" value={address.address} />
          <InfoRow icon="Building2" label="Город" value={address.city} />
          <InfoRow icon="Tag" label="Категория" value={address.category} />
          <InfoRow icon="Calendar" label="Добавлен" value={new Date(address.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} />
          {address.lat && address.lng && (
            <InfoRow
              icon="Crosshair"
              label="Координаты"
              value={`${address.lat.toFixed(4)}, ${address.lng.toFixed(4)}`}
            />
          )}
          {address.note && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-700">{address.note}</p>
            </div>
          )}
        </div>

        {address.lat && address.lng && (
          <div className="pt-2">
            <a
              href={`https://www.openstreetmap.org/?mlat=${address.lat}&mlon=${address.lng}&zoom=16`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <Icon name="ExternalLink" size={13} />
              Открыть в OpenStreetMap
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded-md bg-muted flex-shrink-0">
        <Icon name={icon} fallback="Info" size={13} className="text-muted-foreground" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}