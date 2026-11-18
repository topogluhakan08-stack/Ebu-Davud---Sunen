import React from 'react';
import type { BabIconType } from '../../types';

interface SymbolicIconProps {
  type: BabIconType;
  color?: string;
  className?: string;
}

/**
 * Respectful, non-figurative symbolic SVG illustrations for the 11 Babs of Kitab al-Adab.
 * Never depicts human or prophetic figures; uses geometric motifs, light, and natural symbols.
 */
export const SymbolicBabIcon: React.FC<SymbolicIconProps> = ({
  type,
  color = 'currentColor',
  className = 'w-10 h-10',
}) => {
  switch (type) {
    case 'hilm':
      // Balance scale & olive leaf motif (forbearance & gentle character)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M24 8V38M16 38H32" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M11 16H37" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M11 16L7 26H15L11 16Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color} fillOpacity="0.12" />
          <path d="M37 16L33 26H41L37 16Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color} fillOpacity="0.12" />
          <circle cx="24" cy="10" r="2.5" fill={color} />
        </svg>
      );
    case 'vakar':
      // Architectural arch & serene lantern (dignity & measured composure)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M12 40V22C12 14.5 18 9 24 7C30 9 36 14.5 36 22V40" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M8 40H40" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 12V19" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M19 23C19 20.2 21.2 18 24 18C26.8 18 29 20.2 29 23L27 31H21L19 23Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.14" />
          <circle cx="24" cy="24" r="2" fill={color} />
        </svg>
      );
    case 'kazm':
      // Sealed vessel & calm water waves (containing anger)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M18 10H30L28 16H20L18 10Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M15 20C12 24 12 33 17 38H31C36 33 36 24 33 20C31.5 18 30 16 28 16H20C18 16 16.5 18 15 20Z" stroke={color} strokeWidth="2.2" fill={color} fillOpacity="0.1" />
          <path d="M17 27C19.5 25.5 22 28.5 24.5 27C27 25.5 29 28.5 31 27" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'ghadab_word':
      // Flame quenched by water droplets (speech & wudu at anger)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M21 38C15.5 38 12 34 12 28.5C12 23 16 19 19 14C21 17 22 19 21 22C24 20 26 17 26.5 13C29.5 16.5 32 21.5 32 27.5C32 33.5 27.5 38 21 38Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill={color} fillOpacity="0.12" />
          <path d="M35 10C35 10 39 15 39 17.5C39 19.7 37.2 21.5 35 21.5C32.8 21.5 31 19.7 31 17.5C31 15 35 10 35 10Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.22" />
          <path d="M14 41H34" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'teysir':
      // Smooth open path / twin parallel arcs (ease & forbearance)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M10 34C16 34 18 14 28 14H38" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M33 9L38 14L33 19" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 24C14 24 16 34 24 34H36" stroke={color} strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" opacity="0.65" />
          <circle cx="10" cy="34" r="3" fill={color} />
        </svg>
      );
    case 'muaseret':
      // Intersecting hospitality arches (kind companionship)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M10 36V22C10 15.9 14.9 11 21 11C27.1 11 32 15.9 32 22V36" stroke={color} strokeWidth="2.2" fill={color} fillOpacity="0.08" />
          <path d="M16 36V22C16 15.9 20.9 11 27 11C33.1 11 38 15.9 38 22V36" stroke={color} strokeWidth="2.2" fill={color} fillOpacity="0.08" />
          <path d="M7 36H41" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'haya':
      // Draped modest veil & serene light crescent (hayaa / modesty)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M10 12C15 18 18 28 14 38" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M38 12C33 18 30 28 34 38" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M10 12C18 16 30 16 38 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="24" cy="26" r="6" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.14" />
          <path d="M21 26C22 24.5 26 24.5 27 26" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'ahlak':
      // Eight-pointed Rub el Hizb geometric star (noble character in the mizan)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <rect x="13" y="13" width="22" height="22" rx="2" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
          <rect x="13" y="13" width="22" height="22" rx="2" transform="rotate(45 24 24)" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
          <circle cx="24" cy="24" r="4" fill={color} />
        </svg>
      );
    case 'tevazu':
      // Stylized camel silhouette & horizon line (al-Adba camel story, humility)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M10 36H38" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path
            d="M14 36V27C14 23 17 21 19 21C21 21 22 17 24 17C26 17 27 21 29 21H32L34 15L37 16L35.5 22C35.5 25 33 27 31 27V36M20 28V36M26 28V36"
            stroke={color}
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
            fillOpacity="0.1"
          />
        </svg>
      );
    case 'ovgu':
      // Reed quill & protective geometric shield (restraint from excessive praise)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M24 9L36 14V24C36 31.5 30.8 36.8 24 39C17.2 36.8 12 31.5 12 24V14L24 9Z" stroke={color} strokeWidth="2.1" fill={color} fillOpacity="0.1" />
          <path d="M19 29L29 19M29 19H23M29 19V25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'rifk':
    default:
      // Gentle cupped palm & sprouting leaf (gentleness & deliberateness)
      return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
          <path d="M10 32C15 32 18 35 24 35C30 35 34 31 38 27" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 27V14" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
          <path d="M24 20C24 14 30 11 35 12C35 17 31 21 24 20Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.16" />
          <path d="M24 23C24 18 19 15 14 16C14 21 18 24 24 23Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.16" />
        </svg>
      );
  }
};
