import { useState, useMemo, Suspense } from 'react';
import { useAddresses } from '@/hooks/useAddresses';
import AddressTable from '@/components/AddressTable';
import DetailPanel from '@/components/DetailPanel';
import FilterBar from '@/components/FilterBar';
import StatsPanel from '@/components/StatsPanel';
import ImportModal from '@/components/ImportModal';
import AddAddressModal from '@/components/AddAddressModal';
import MapView from '@/components/MapView';
import Icon from '@/components/ui/icon';

type SideTab = 'table' | 'stats';

export default function Index() {
  const { addresses, addAddress, deleteAddress, importAddresses, exportCSV } = useAddresses();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sideTab, setSideTab] = useState<SideTab>('table');
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const selected = useMemo(() => addresses.find(a => a.id === selectedId) ?? null, [addresses, selectedId]);

  const filtered = useMemo(() => {
    return addresses.filter(addr => {
      const q = search.toLowerCase();
      const matchSearch = !q || [addr.title, addr.address, addr.city].some(v => v.toLowerCase().includes(q));
      const matchCat = !categoryFilter || addr.category === categoryFilter;
      const matchStatus = !statusFilter || addr.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [addresses, search, categoryFilter, statusFilter]);

  const handleSelect = (id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  const handleDelete = (id: string) => {
    if (selectedId === id) setSelectedId(null);
    deleteAddress(id);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="flex-none flex items-center justify-between px-5 py-3 bg-white border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <Icon name="MapPin" size={14} className="text-background" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight">АдресМап</span>
            <span className="ml-2 text-xs text-muted-foreground">{addresses.length} адресов</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Icon name="Plus" size={12} />
            Добавить
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Icon name="Upload" size={12} />
            Импорт
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Icon name="Download" size={12} />
            Экспорт
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex flex-col w-[400px] flex-none border-r border-border bg-white overflow-hidden">
          <div className="flex-none flex items-center gap-1 px-4 pt-3 pb-2">
            {(['table', 'stats'] as SideTab[]).map(t => (
              <button
                key={t}
                onClick={() => setSideTab(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sideTab === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {t === 'table' ? 'Список' : 'Статистика'}
              </button>
            ))}
            {sideTab === 'table' && filtered.length !== addresses.length && (
              <span className="ml-auto text-xs text-muted-foreground">{filtered.length} из {addresses.length}</span>
            )}
          </div>

          {sideTab === 'table' && (
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              addresses={addresses}
            />
          )}

          <div className="flex-1 overflow-auto">
            {sideTab === 'table' ? (
              <AddressTable
                addresses={filtered}
                selectedId={selectedId}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            ) : (
              <StatsPanel addresses={addresses} />
            )}
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="Loader2" size={16} className="animate-spin" />
                Загрузка карты...
              </div>
            </div>
          }>
            <MapView
              addresses={addresses}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </Suspense>

          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-border/50 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a7fe8]" />
            <span className="text-xs font-medium">{addresses.filter(a => a.status === 'geocoded').length} меток</span>
          </div>

          {selected && (
            <div className="absolute top-0 right-0 h-full w-72 z-10 shadow-xl">
              <DetailPanel address={selected} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      </div>

      {showImport && (
        <ImportModal onImport={importAddresses} onClose={() => setShowImport(false)} />
      )}
      {showAdd && (
        <AddAddressModal
          onAdd={addr => { addAddress(addr); setSideTab('table'); }}
          onClose={() => setShowAdd(false)}
          existingCategories={Array.from(new Set(addresses.map(a => a.category)))}
        />
      )}
    </div>
  );
}