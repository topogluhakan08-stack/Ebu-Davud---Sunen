import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BookMarked, RotateCcw } from 'lucide-react';
import type { SunenPrintCity } from '../../types';
import { useApp } from '../../context/AppContext';
import { ManuscriptCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { SpeechControls } from '../tts/SpeechControls';

import { getLocalizedSunenUi } from '../../utils/articleTranslations';

interface EditionsMapProps {
  cities: SunenPrintCity[];
}

export const EditionsMap: React.FC<EditionsMapProps> = ({ cities }) => {
  const { settings, articlePack } = useApp();
  const isDark = settings.theme === 'dark';
  const ui = getLocalizedSunenUi(settings.language, articlePack).editionsMap;
  const popupDir = settings.language === 'ar' ? 'rtl' : 'ltr';

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const boundsRef = useRef<L.LatLngBounds | null>(null);

  const orderedCities = useMemo(
    () => [...cities].sort((a, b) => a.order - b.order),
    [cities]
  );

  const [selectedId, setSelectedId] = useState<string>(orderedCities[0]?.id || 'leknev');

  const selectedCity = useMemo(
    () => orderedCities.find((c) => c.id === selectedId) ?? orderedCities[0],
    [orderedCities, selectedId]
  );

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [31.5, 42.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 10,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const latLngs: L.LatLngExpression[] = [];

    orderedCities.forEach((city) => {
      latLngs.push([city.lat, city.lng]);

      const icon = L.divIcon({
        className: 'custom-print-city-marker',
        html: `<div style="width:28px;height:28px;border-radius:9999px;background:#14284B;color:#fff;border:2px solid #B8862D;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${city.order}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([city.lat, city.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div dir="${popupDir}" style="min-width:170px;font-family:sans-serif;">
            <strong style="font-size:14px;">${city.order}. ${city.cityTr}</strong><br/>
            <span style="font-size:12px;color:#57534e;">${city.countryTr} · ${city.editions.length} ${ui.popupRecordsSuffix}</span>
          </div>`
        );

      marker.on('click', () => {
        setSelectedId(city.id);
      });

      markersRef.current[city.id] = marker;
    });

    const bounds = L.latLngBounds(latLngs);
    boundsRef.current = bounds;
    map.fitBounds(bounds, { padding: [36, 36] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Update active marker, refresh localized popups & pan smoothly
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCity) return;

    orderedCities.forEach((city) => {
      const marker = markersRef.current[city.id];
      if (!marker) return;
      const isSelected = city.id === selectedCity.id;
      const bg = isSelected ? '#0F5132' : isDark ? '#25334d' : '#14284B';
      const border = isSelected ? '#FCD34D' : '#B8862D';
      const scale = isSelected ? 'scale(1.18)' : 'scale(1)';

      marker.setIcon(
        L.divIcon({
          className: 'custom-print-city-marker',
          html: `<div style="width:28px;height:28px;border-radius:9999px;background:${bg};color:#fff;border:2px solid ${border};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;transform:${scale};transition:transform 150ms ease;box-shadow:0 2px 6px rgba(0,0,0,0.35);">${city.order}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })
      );
      marker.setPopupContent(
        `<div dir="${popupDir}" style="min-width:170px;font-family:sans-serif;">
          <strong style="font-size:14px;">${city.order}. ${city.cityTr}</strong><br/>
          <span style="font-size:12px;color:#57534e;">${city.countryTr} · ${city.editions.length} ${ui.popupRecordsSuffix}</span>
        </div>`
      );
    });

    if (settings.reducedMotion) {
      map.setView([selectedCity.lat, selectedCity.lng], Math.max(map.getZoom(), 4), {
        animate: false,
      });
    } else {
      map.panTo([selectedCity.lat, selectedCity.lng], { animate: true, duration: 0.6 });
    }
  }, [selectedCity, orderedCities, isDark, settings.reducedMotion, popupDir, ui.popupRecordsSuffix]);

  const handleReset = () => {
    setSelectedId(orderedCities[0].id);
    if (mapRef.current && boundsRef.current) {
      mapRef.current.fitBounds(boundsRef.current, { padding: [36, 36] });
    }
  };

  const selectedNarration = selectedCity
    ? `${selectedCity.cityTr}. ${selectedCity.highlightTr} ${ui.editionsSpeechPrefix} ${selectedCity.editions.join('; ')}`
    : '';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          iconLeft={<RotateCcw className="w-4 h-4" />}
        >
          {ui.resetAllBtn}
        </Button>

        <StatusBadge variant="extra" label={ui.coordBadge} />
      </div>

      {/* Balanced 12-col split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)] min-h-[380px] lg:min-h-[440px] relative z-0">
          <div
            ref={mapContainerRef}
            className="w-full h-[380px] lg:h-full lg:min-h-[440px]"
            aria-label={ui.mapAria}
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
                    {ui.centerLabel} {selectedCity.order} / {orderedCities.length} ·{' '}
                    {selectedCity.countryTr}
                  </p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    {selectedCity.cityTr}
                  </h3>
                </div>
                {settings.language !== 'ar' && (
                  <span
                    className="font-arabic-inline text-2xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)]"
                    dir="rtl"
                  >
                    {selectedCity.cityAr}
                  </span>
                )}
              </div>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {selectedCity.highlightTr}
              </p>

              <div className="space-y-2 pt-2 border-t border-[var(--border-hairline)]">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {ui.editionsHeading} ({selectedCity.editions.length})
                </p>
                <ul className="space-y-2">
                  {selectedCity.editions.map((ed) => (
                    <li
                      key={ed}
                      className="text-xs text-[var(--text-primary)] flex items-start gap-2 leading-relaxed"
                    >
                      <BookMarked
                        className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--accent-gold)]"
                        aria-hidden="true"
                      />
                      <span>{ed}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)]">
              <SpeechControls
                id={`print-city-${selectedCity.id}`}
                compact
                arabicText={settings.language === 'ar' ? selectedNarration : undefined}
                primaryText={settings.language === 'ar' ? undefined : selectedNarration}
              />
            </div>
          </ManuscriptCard>
        )}
      </div>

      {/* 8-City Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {orderedCities.map((city) => {
          const active = city.id === selectedCity?.id;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => setSelectedId(city.id)}
              aria-pressed={active}
              className={`min-h-[44px] px-3 py-2 rounded-xl border text-start transition-colors cursor-pointer ${
                active
                  ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              <span className="block text-[10px] font-tabular opacity-80">
                0{city.order} · {city.editions.length} {ui.stripEditionUnit}
              </span>
              <span className="block text-xs font-semibold truncate">{city.cityTr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
