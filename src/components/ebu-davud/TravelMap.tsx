import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Pause, Play, RotateCcw } from 'lucide-react';
import type { ScholarCity } from '../../types';
import { useApp } from '../../context/AppContext';
import { ManuscriptCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { SpeechControls } from '../tts/SpeechControls';

interface TravelMapProps {
  cities: ScholarCity[];
  activeCityId?: string | null;
  onSelectCity?: (cityId: string) => void;
}

export const TravelMap: React.FC<TravelMapProps> = ({
  cities,
  activeCityId,
  onSelectCity,
}) => {
  const { settings } = useApp();
  const isDark = settings.theme === 'dark';

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeLineRef = useRef<L.Polyline | null>(null);

  const [selectedId, setSelectedId] = useState<string>(activeCityId || cities[0]?.id || 'sicistan');
  const [isPlaying, setIsPlaying] = useState(false);

  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.order - b.order),
    [cities]
  );

  useEffect(() => {
    if (activeCityId && activeCityId !== selectedId) {
      setSelectedId(activeCityId);
    }
  }, [activeCityId]);

  const selectedCity = useMemo(
    () => sortedCities.find((c) => c.id === selectedId) ?? sortedCities[0],
    [sortedCities, selectedId]
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectCity?.(id);
  };

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [32.5, 45.0],
      zoom: 4,
      minZoom: 3,
      maxZoom: 10,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const coords: L.LatLngExpression[] = sortedCities.map((c) => [c.lat, c.lng]);
    const routeLine = L.polyline(coords, {
      color: '#B8862D',
      weight: 2.5,
      opacity: 0.75,
      dashArray: '6, 6',
    }).addTo(map);
    routeLineRef.current = routeLine;

    sortedCities.forEach((city) => {
      const icon = L.divIcon({
        className: 'custom-city-marker',
        html: `<div style="width:28px;height:28px;border-radius:9999px;background:#14284B;color:#fff;border:2px solid #B8862D;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${city.order}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([city.lat, city.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:170px;font-family:sans-serif;">
            <strong style="font-size:14px;">${city.order}. ${city.nameTr}</strong><br/>
            <span style="font-size:12px;color:#57534e;">${city.yearText}</span><br/>
            <span style="font-size:12px;">${city.roleTr}</span>
          </div>`
        );

      marker.on('click', () => {
        setIsPlaying(false);
        handleSelect(city.id);
      });

      markersRef.current[city.id] = marker;
    });

    map.fitBounds(routeLine.getBounds(), { padding: [36, 36] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [sortedCities]);

  // Highlight active marker & pan smoothly
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCity) return;

    sortedCities.forEach((city) => {
      const marker = markersRef.current[city.id];
      if (!marker) return;
      const isSelected = city.id === selectedCity.id;
      const bg = isSelected ? '#0F5132' : isDark ? '#25334d' : '#14284B';
      const border = isSelected ? '#FCD34D' : '#B8862D';
      const scale = isSelected ? 'scale(1.18)' : 'scale(1)';
      marker.setIcon(
        L.divIcon({
          className: 'custom-city-marker',
          html: `<div style="width:28px;height:28px;border-radius:9999px;background:${bg};color:#fff;border:2px solid ${border};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;transform:${scale};transition:transform 150ms ease;box-shadow:0 2px 6px rgba(0,0,0,0.35);">${city.order}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })
      );
    });

    if (settings.reducedMotion) {
      map.setView([selectedCity.lat, selectedCity.lng], Math.max(map.getZoom(), 5), {
        animate: false,
      });
    } else {
      map.panTo([selectedCity.lat, selectedCity.lng], { animate: true, duration: 0.6 });
    }
  }, [selectedCity, sortedCities, isDark, settings.reducedMotion]);

  // Play journey animation across all 14 stops
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setSelectedId((prev) => {
        const idx = sortedCities.findIndex((c) => c.id === prev);
        const nextIdx = idx + 1;
        if (nextIdx >= sortedCities.length) {
          setIsPlaying(false);
          return sortedCities[0].id;
        }
        const nextId = sortedCities[nextIdx].id;
        onSelectCity?.(nextId);
        return nextId;
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isPlaying, sortedCities, onSelectCity]);

  const handleResetView = () => {
    setIsPlaying(false);
    handleSelect(sortedCities[0].id);
    if (mapRef.current && routeLineRef.current) {
      mapRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [36, 36] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Controls & City Index Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={isPlaying ? 'emerald' : 'primary'}
            size="sm"
            onClick={() => setIsPlaying((prev) => !prev)}
            iconLeft={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isPlaying ? 'Yolculuğu Duraklat' : 'Yolculuğu Oynat (14 Şehir)'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetView}
            iconLeft={<RotateCcw className="w-4 h-4" />}
          >
            Haritayı Sıfırla
          </Button>
        </div>

        <StatusBadge variant="extra" label="Ek açıklama · Koordinatlar coğrafî konum içindir" />
      </div>

      {/* Map + Selected City Inspector (balanced 12-col split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)] min-h-[380px] lg:min-h-[460px] relative z-0">
          <div
            ref={mapContainerRef}
            className="w-full h-[380px] lg:h-full lg:min-h-[460px]"
            aria-label="Ebû Dâvûd'un 14 şehirlik ilim yolculuğu haritası"
          />
        </div>

        {selectedCity && (
          <ManuscriptCard
            accentColor="var(--accent-emerald)"
            className="lg:col-span-5 p-6 flex flex-col justify-between gap-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-tabular text-[var(--text-secondary)]">
                    Durak {selectedCity.order} / {sortedCities.length} · {selectedCity.region}
                  </p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    {selectedCity.nameTr}
                  </h3>
                </div>
                <span className="font-arabic-inline text-2xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)]" dir="rtl">
                  {selectedCity.nameAr}
                </span>
              </div>

              <div className="text-xs font-tabular text-[var(--accent-emerald)] font-medium">
                {selectedCity.yearText} · {selectedCity.roleTr}
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {selectedCity.detailsTr}
              </p>

              <div className="space-y-2 pt-2 border-t border-[var(--border-hairline)]">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Bu Şehirdeki Hocalar &amp; Hadiseler
                </p>
                <ul className="space-y-1.5">
                  {selectedCity.teachersOrEvents.map((ev) => (
                    <li key={ev} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--accent-gold)]" aria-hidden="true" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)]">
              <SpeechControls
                id={`city-${selectedCity.id}`}
                compact
                turkishText={`${selectedCity.nameTr}. ${selectedCity.yearText}. ${selectedCity.detailsTr}`}
              />
            </div>
          </ManuscriptCard>
        )}
      </div>

      {/* 14-City Interactive Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {sortedCities.map((city) => {
          const active = city.id === selectedCity?.id;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                handleSelect(city.id);
              }}
              className={`min-h-[44px] px-2.5 py-2 rounded-xl border text-left transition-colors cursor-pointer ${
                active
                  ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              <span className="block text-[10px] font-tabular opacity-80">
                {city.order < 10 ? `0${city.order}` : city.order}
              </span>
              <span className="block text-xs font-semibold truncate">{city.nameTr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
