import { useState, useCallback } from 'react';
import { Address } from '@/types/address';
import { sampleAddresses } from '@/data/sampleAddresses';

const STORAGE_KEY = 'addressmap_addresses';

function loadAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load addresses', e);
  }
  return sampleAddresses;
}

function saveAddresses(addresses: Address[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(loadAddresses);

  const update = useCallback((updated: Address[]) => {
    setAddresses(updated);
    saveAddresses(updated);
  }, []);

  const addAddress = useCallback((addr: Omit<Address, 'id' | 'createdAt'>) => {
    const newAddr: Address = {
      ...addr,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    update([...addresses, newAddr]);
    return newAddr;
  }, [addresses, update]);

  const deleteAddress = useCallback((id: string) => {
    update(addresses.filter(a => a.id !== id));
  }, [addresses, update]);

  const importAddresses = useCallback((newAddresses: Omit<Address, 'id' | 'createdAt'>[]) => {
    const imported: Address[] = newAddresses.map((a, i) => ({
      ...a,
      id: `${Date.now()}-${i}`,
      createdAt: new Date().toISOString().split('T')[0],
    }));
    update([...addresses, ...imported]);
  }, [addresses, update]);

  const exportCSV = useCallback(() => {
    const headers = ['Название', 'Адрес', 'Город', 'Категория', 'Статус', 'Широта', 'Долгота', 'Дата'];
    const rows = addresses.map(a => [
      a.title, a.address, a.city, a.category, a.status,
      a.lat ?? '', a.lng ?? '', a.createdAt
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `addresses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [addresses]);

  return { addresses, addAddress, deleteAddress, importAddresses, exportCSV };
}