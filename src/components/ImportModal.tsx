import { useState } from 'react';
import { Address } from '@/types/address';
import Icon from '@/components/ui/icon';

interface ImportModalProps {
  onImport: (addresses: Address[]) => void;
  onClose: () => void;
}

const CSV_EXAMPLE = `Название,Адрес,Город,Категория
Офис на Тверской,ул. Тверская 1,Москва,Офис
Склад на Севере,ул. Складочная 14,Москва,Склад`;

export default function ImportModal({ onImport, onClose }: ImportModalProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Address[]>([]);

  const parseCSV = (raw: string) => {
    const lines = raw.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) { setError('Нужно минимум 2 строки: заголовок + данные'); return; }
    const rows = lines.slice(1);
    const parsed: Address[] = rows.map((row, i) => {
      const cols = row.split(',').map(c => c.trim());
      return {
        id: `import-${Date.now()}-${i}`,
        title: cols[0] || 'Без названия',
        address: cols[1] || '',
        city: cols[2] || '',
        category: cols[3] || 'Прочее',
        lat: null,
        lng: null,
        status: 'pending' as const,
        createdAt: new Date().toISOString().split('T')[0],
      };
    });
    setPreview(parsed);
    setError('');
  };

  const handleTextChange = (val: string) => {
    setText(val);
    if (val.trim()) parseCSV(val);
    else { setPreview([]); setError(''); }
  };

  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-semibold">Импорт адресов</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Вставьте CSV: Название, Адрес, Город, Категория</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
            <Icon name="X" size={14} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <textarea
              className="w-full h-32 text-sm font-mono p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1a7fe8]/20 focus:border-[#1a7fe8] transition-all bg-muted/30"
              placeholder={CSV_EXAMPLE}
              value={text}
              onChange={e => handleTextChange(e.target.value)}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {preview.length > 0 && (
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Предпросмотр: {preview.length} адресов</p>
              <div className="space-y-1 max-h-28 overflow-auto">
                {preview.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="font-medium">{a.title}</span>
                    <span className="text-muted-foreground">{a.city}</span>
                  </div>
                ))}
                {preview.length > 5 && <p className="text-xs text-muted-foreground pl-3">...ещё {preview.length - 5}</p>}
              </div>
            </div>
          )}
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
