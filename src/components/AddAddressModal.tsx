import { useState } from 'react';
import { Address } from '@/types/address';
import Icon from '@/components/ui/icon';

interface AddAddressModalProps {
  onAdd: (addr: Omit<Address, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  existingCategories: string[];
}

const DEFAULT_CATEGORIES = ['Офис', 'Склад', 'Магазин', 'Прочее'];

export default function AddAddressModal({ onAdd, onClose, existingCategories }: AddAddressModalProps) {
  const categories = Array.from(new Set([...DEFAULT_CATEGORIES, ...existingCategories]));

  const [form, setForm] = useState({
    title: '',
    address: '',
    city: '',
    category: 'Офис',
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Введите название';
    if (!form.address.trim()) e.address = 'Введите адрес';
    if (!form.city.trim()) e.city = 'Введите город';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({
      title: form.title.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      category: form.category,
      lat: null,
      lng: null,
      status: 'pending',
      note: form.note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-semibold text-base">Новый адрес</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Заполните данные для добавления на карту</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground">
            <Icon name="X" size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field
            label="Название *"
            placeholder="Например: Офис на Тверской"
            value={form.title}
            onChange={v => set('title', v)}
            error={errors.title}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Город *"
              placeholder="Москва"
              value={form.city}
              onChange={v => set('city', v)}
              error={errors.city}
            />
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Категория</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full text-sm border border-border rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <Field
            label="Адрес *"
            placeholder="ул. Тверская, 1"
            value={form.address}
            onChange={v => set('address', v)}
            error={errors.address}
          />

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Примечание</label>
            <textarea
              placeholder="Необязательно — любые пометки"
              value={form.note}
              onChange={e => set('note', e.target.value)}
              rows={2}
              className="w-full text-sm border border-border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex items-start gap-2 bg-muted/40 rounded-lg px-3 py-2.5">
            <Icon name="Info" size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Адрес будет добавлен со статусом «Ожидание». Координаты можно указать вручную позже или через импорт CSV.
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Icon name="Plus" size={14} />
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, placeholder, value, onChange, error,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-1 transition-colors placeholder:text-muted-foreground/50 ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-border focus:ring-ring'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
