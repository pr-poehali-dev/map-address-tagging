export interface Address {
  id: string;
  title: string;
  address: string;
  city: string;
  category: string;
  lat: number | null;
  lng: number | null;
  status: 'geocoded' | 'pending' | 'error';
  note?: string;
  createdAt: string;
}

export type SortField = 'title' | 'city' | 'category' | 'status' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
