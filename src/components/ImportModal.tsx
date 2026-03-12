import { useState, useRef } from 'react';
import { Address } from '@/types/address';
import Icon from '@/components/ui/icon';

interface ImportModalProps {
  onImport: (addresses: Omit<Address, 'id' | 'createdAt'>[]) => void;
  onClose: () => void;
}

const CSV_EXAMPLE = `Название,Адрес,Город,Категория,Статус,Широта,Долгота
Офис Центральный,"ул. Тверская, 1",Москва,Офис,geocoded,55.7568,37.6155
Склад №3,"ул. Складочная, 14",Москва,Склад,geocoded,55.8020,37.5890`;

function parseCSVText(raw: string): Omit<Address, 'id' | 'createdAt'>[] {
  const lines = raw.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const results: Omit<Address, 'id' | 'createdAt'>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const [title = '', address = '', city = '', category = 'Офис', , latStr, lngStr] = cols;
    const lat = latStr ? parseFloat(latStr) : null;
    const lng = lngStr ? parseFloat(lngStr) : null;
    if (title || address) {
      results.push({
        title: title || address,
        address,
        city,
        category,
        lat: lat && !isNaN(lat) ? lat : null,
        lng: lng && !isNaN(lng) ? lng : null,
        status: (lat && lng && !isNaN(lat) && !isNaN(lng)) ? 'geocoded' : 'pending',
      });
    }
  }
  return results;
}

export default function ImportModal({ onImport, onClose }: ImportModalProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Omit<Address, 'id' | 'createdAt'>[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleParse = (raw: string) => {
    setText(raw);
    if (!raw.trim()) { setPreview([]); setError(''); return; }
    const parsed = parseCSVText(raw);
    setPreview(parsed);
    setError(parsed.length === 0 ? 'Не удалось распознать данные. Проверьте формат.' : '');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => handleParse(ev.target?.result as string ?? '');
    reader.readAsText(file, 'utf-8');
  };

  const handleImport = () => {
    if (preview.length === 0) return;
    onImport(preview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-semibold">Импорт адресов</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Загрузите CSV файл или вставьте данные</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
            <Icon name="X" size={14} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-[#1a7fe8] hover:bg-blue-50/20 transition-colors"
          >
            <Icon name="Upload" size={18} className="mx-auto text-muted-foreground mb-1.5" />
            <p className="text-sm font-medium">Загрузить CSV файл</p>
            <p className="text-xs text-muted-foreground mt-0.5">или перетащите сюда</p>
            <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFile} />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            <span>или вставьте текст</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div>
            <textarea
              className="w-full h-28 text-xs font-mono p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-ring bg-muted/20 placeholder:text-muted-foreground/50"
              placeholder={CSV_EXAMPLE}
              value={text}
              onChange={e => handleParse(e.target.value)}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {preview.length > 0 && (
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Готово к импорту: <span className="text-foreground font-semibold">{preview.length}</span> адресов
                {' · '}{preview.filter(a => a.status === 'geocoded').length} с координатами
              </p>
              <div className="space-y-1 max-h-24 overflow-auto">
                {preview.slice(0, 4).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.status === 'geocoded' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="font-medium truncate">{a.title}</span>
                    <span className="text-muted-foreground">{a.city}</span>
                  </div>
                ))}
                {preview.length > 4 && <p className="text-xs text-muted-foreground pl-3">...ещё {preview.length - 4}</p>}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <span className="font-medium">Формат: </span>
            Название, Адрес, Город, Категория, Статус, Широта, Долгота
          </div>
        </div>

        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
            Отмена
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0}
            className="px-4 py-2 text-sm rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Импортировать {preview.length > 0 ? `(${preview.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
