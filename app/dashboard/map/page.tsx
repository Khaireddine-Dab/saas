'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building2, Star } from 'lucide-react';
import { DataTable } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { storesApi } from '@/lib/api';

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: string | number;
  longitude: string | number;
  status: string;
  rating_average: number;
  total_reviews: number;
  total_orders: number;
  owner_details?: { full_name: string };
}

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  // Fetch stores from the backend API
  useEffect(() => {
    storesApi.getAll()
      .then((data: any) => {
        const storeList = Array.isArray(data) ? data : (data?.results ?? []);
        setStores(storeList);
      })
      .catch((err: any) => console.error('Failed to fetch stores:', err))
      .finally(() => setLoading(false));
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    if (!token) {
      console.error('MAPBOX TOKEN IS MISSING');
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [10.1815, 36.8065],
      zoom: 6,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.on('load', () => {
      mapRef.current = map;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add markers when stores load
  useEffect(() => {
    if (!mapRef.current || stores.length === 0) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoords = false;

    stores.forEach((store) => {
      const lat = parseFloat(String(store.latitude));
      const lng = parseFloat(String(store.longitude));
      if (isNaN(lat) || isNaN(lng)) return;

      hasValidCoords = true;

      const el = document.createElement('div');
      el.style.cssText = 'cursor: pointer; display: flex; flex-direction: column; align-items: center; z-index: 1;';
      el.innerHTML = `
        <div style="background: white; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; color: #1f2937;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 4px; max-width: 110px;
          overflow: hidden; text-overflow: ellipsis;">${store.name}</div>
        <div style="width: 20px; height: 20px; background-color: #ef4444; border: 2px solid white;
          border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="min-width:160px;padding:6px;">
              <h3 style="font-weight:600;margin-bottom:4px;color:#1f2937;">${store.name}</h3>
              <p style="font-size:12px;color:#6b7280;margin-bottom:2px;">${store.city}</p>
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="font-size:12px;font-weight:600;color:#f59e0b;">${Number(store.rating_average).toFixed(1)}</span>
                <span>⭐</span>
                <span style="font-size:11px;color:#9ca3af;">(${store.total_reviews} avis)</span>
              </div>
            </div>
          `)
        )
        .addTo(mapRef.current!);

      el.addEventListener('click', () => setSelectedStore(store));
      markersRef.current[store.id] = marker;
      bounds.extend([lng, lat]);
    });

    if (hasValidCoords) {
      mapRef.current.fitBounds(bounds, { padding: 70, maxZoom: 14 });
    }
  }, [stores, mapRef.current]);

  // Fly to selected store
  useEffect(() => {
    if (!selectedStore || !mapRef.current) return;
    const lat = parseFloat(String(selectedStore.latitude));
    const lng = parseFloat(String(selectedStore.longitude));
    if (!isNaN(lat) && !isNaN(lng)) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14, duration: 1000 });
      markersRef.current[selectedStore.id]?.togglePopup();
    }
  }, [selectedStore]);

  const filteredStores = (stores ?? []).filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Map & Location Management</h1>
        <p className="text-muted-foreground mt-2">
          Visualisez et gérez les emplacements géographiques des boutiques
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total boutiques', value: stores.length, icon: Building2 },
          { label: 'Avec coordonnées', value: stores.filter(s => s.latitude && s.longitude).length, icon: MapPin },
          { label: 'Note moyenne', value: stores.length ? (stores.reduce((a, s) => a + Number(s.rating_average), 0) / stores.length).toFixed(1) : '—', icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Icon className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold text-foreground">{loading ? '...' : value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Store List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Chargement...</p>
            ) : filteredStores.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune boutique trouvée.</p>
            ) : (
              filteredStores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedStore?.id === store.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:border-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{store.name}</p>
                      <p className="text-xs opacity-75 truncate">{store.address}, {store.city}</p>
                    </div>
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right - Mapbox Map */}
        <div className="lg:col-span-2">
          <div className="relative bg-card border border-border rounded-lg overflow-hidden" style={{ height: '420px' }}>
            <div ref={mapContainerRef} className="w-full h-full" />
            {/* Overlay badge */}
            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 pointer-events-none">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Mapbox Premium Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Store Details */}
      {selectedStore && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Détails de la boutique</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Nom', value: selectedStore.name },
              { label: 'Propriétaire', value: selectedStore.owner_details?.full_name ?? '—' },
              { label: 'Ville', value: selectedStore.city },
              { label: 'Adresse', value: selectedStore.address },
              { label: 'Coordonnées', value: `${Number(selectedStore.latitude).toFixed(4)}, ${Number(selectedStore.longitude).toFixed(4)}` },
              { label: 'Note', value: `${Number(selectedStore.rating_average).toFixed(1)} ⭐ (${selectedStore.total_reviews} avis)` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium text-foreground">{value}</p>
              </div>
            ))}
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <StatusBadge status={selectedStore.status} />
            </div>
          </div>
        </div>
      )}

      {/* Stores Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Toutes les boutiques</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : (
          <DataTable<Store>
            columns={[
              { key: 'name', label: 'Boutique', sortable: true },
              { key: 'city', label: 'Ville', sortable: true },
              { key: 'address', label: 'Adresse' },
              { key: 'status', label: 'Statut', render: (v) => <StatusBadge status={v} /> },
              { key: 'rating_average', label: 'Note', render: (v) => `${Number(v).toFixed(1)} ⭐`, sortable: true },
            ]}
            data={filteredStores}
          />
        )}
      </div>
    </div>
  );
}
