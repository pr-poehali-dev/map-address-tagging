import { useState, useMemo, lazy, Suspense } from 'react';
import { Address } from '@/types/address';
import { sampleAddresses } from '@/data/sampleAddresses';
import AddressTable from '@/components/AddressTable';
import DetailPanel from '@/components/DetailPanel';
import StatsBar from '@/components/StatsBar';
import ImportModal from '@/components/ImportModal';
import Icon from '@/components/ui/icon';

const MapView = lazy(() => import('@/components/MapView'));

const CATEGORIES = ['Все', 'Офис', 'Склад', 'Магазин', 'Прочее'];

export default function Index() {
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Все');
  const [activeView, setActiveView] = useState<'map' | 'table'>('map');
  const [showImport, setShowImport] = useState(false);

  const selected = useMemo(() => addresses.find(a => a.id === selectedId) ?? null, [addresses, selectedId]);

  const filtered = useMemo(() => {
    return addresses.filter(addr => {
      const matchSearch = search === '' || [addr.title, addr.address, addr.city].some(
        v => v.toLowerCase().includes(search.toLowerCase())
      );
      const matchCat = categoryFilter === 'Все' || addr.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [addresses, search, categoryFilter]);

  const handleSelect = (id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleImport = (newAddresses: Address[]) => {
    setAddresses(prev => [...prev, ...newAddresses]);
  };

  const handleExport = () => {
    const header = 'Название,Адрес,Город,Категория,Статус,Широта,Долгота';
    const rows = addresses.map(a =>
      `"${a.title}","${a.address}","${a.city}","${a.category}","${a.status}","${a.lat ?? ''}","${a.lng ?? ''}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'addresses.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-background" style={{ fontFamily: 'Golos Text, sans-serif' }}>

      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-3.5 bg-white border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <Icon name="MapPin" size={14} className="text-background" />
          </div>
          <span className="font-semibold text-base tracking-tight">GeoMap</span>
        </div>

        <div className="flex-1 max-w-sm ml-4">
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по адресу, городу..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-muted/60 border border-transparent rounded-lg focus:outline-none focus:border-[#1a7fe8]/40 focus:bg-white transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Icon name="X" size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-white shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-muted/60 rounded-lg p-1 gap-0.5">
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeView === 'map' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Map" size={12} /> Карта
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeView === 'table' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="List" size={12} /> Таблица
            </button>
          </div>

          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Icon name="Upload" size={12} />
            Импорт
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Icon name="Download" size={12} />
            CSV
          </button>
        </div>
      </header>

      {/* Stats */}
      <StatsBar addresses={filtered} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">

        {activeView === 'map' ? (
          <>
            {/* Map */}
            <div className={`flex-1 relative transition-all duration-300 ${selected ? 'mr-0' : ''}`}>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-muted/30">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Загрузка карты...
                  </div>
                </div>
              }>
                <MapView
                  addresses={filtered}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              </Suspense>

              {/* Float counter */}
              <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-border/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1a7fe8]" />
                <span className="text-xs font-medium">{filtered.filter(a => a.status === 'geocoded').length} меток на карте</span>
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="w-72 flex-shrink-0">
                <DetailPanel address={selected} onClose={() => setSelectedId(null)} />
              </div>
            )}
          </>
        ) : (
          <>
            {/* Table view */}
            <div className={`flex-1 overflow-hidden transition-all ${selected ? '' : ''}`}>
              <AddressTable
                addresses={filtered}
                selectedId={selectedId}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="w-72 flex-shrink-0">
                <DetailPanel address={selected} onClose={() => setSelectedId(null)} />
              </div>
            )}
          </>
        )}
      </div>

      {showImport && (
        <ImportModal onImport={handleImport} onClose={() => setShowImport(false)} />
      )}
    </div>
  );
}
