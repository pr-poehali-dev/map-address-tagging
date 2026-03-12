import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Address } from '@/types/address';

interface MapViewProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function createMarkerIcon(active: boolean, status: string) {
  const color = status === 'error' ? '#ef4444' : status === 'pending' ? '#f59e0b' : active ? '#0f5dbf' : '#1a7fe8';
  const size = active ? 16 : 12;
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2.5px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px ${color}80;
      transition:all 0.15s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToSelected({ addresses, selectedId }: { addresses: Address[]; selectedId: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const addr = addresses.find(a => a.id === selectedId);
    if (addr?.lat && addr?.lng) {
      map.flyTo([addr.lat, addr.lng], 14, { duration: 0.8 });
    }
  }, [selectedId, addresses, map]);
  return null;
}

export default function MapView({ addresses, selectedId, onSelect }: MapViewProps) {
  const geocoded = addresses.filter(a => a.lat !== null && a.lng !== null);
  const center: [number, number] = [59.5, 53.0];

  return (
    <MapContainer
      center={center}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected addresses={addresses} selectedId={selectedId} />
      {geocoded.map(addr => (
        <Marker
          key={addr.id}
          position={[addr.lat!, addr.lng!]}
          icon={createMarkerIcon(selectedId === addr.id, addr.status)}
          eventHandlers={{ click: () => onSelect(addr.id) }}
        >
          <Popup>
            <div style={{ fontFamily: 'Golos Text, sans-serif', minWidth: 160 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{addr.title}</div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>{addr.address}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{addr.city}</div>
              <div style={{
                display: 'inline-block', marginTop: 6, padding: '2px 8px',
                background: '#f0f4ff', borderRadius: 4,
                fontSize: 11, color: '#1a7fe8', fontWeight: 500
              }}>{addr.category}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
