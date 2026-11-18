import test from 'node:test';
import assert from 'node:assert/strict';
import { TR_DICTIONARY } from '../data/i18n/tr';
import { FR_DICTIONARY } from '../data/i18n/fr';
import { AR_DICTIONARY } from '../data/i18n/ar';
import { DE_DICTIONARY } from '../data/i18n/de';
import { NL_DICTIONARY } from '../data/i18n/nl';
import { loadDictionary } from './i18n';
import {
  getBabDisplayTitle,
  getLocalizedText,
  normalizeTransliterationSearch,
} from './localizedText';
import { DEFAULT_SETTINGS, loadSettings, SETTINGS_STORAGE_KEY } from './storage';
import { selectVoiceForLanguage, type VoiceLike } from './speechService';

function flattenStringEntries(obj: unknown, prefix = ''): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  if (typeof obj === 'string') {
    out.push([prefix, obj]);
    return out;
  }
  if (obj && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      const next = prefix ? `${prefix}.${key}` : key;
      out.push(...flattenStringEntries(val, next));
    }
  }
  return out;
}

test('all 5 UI dictionaries share the exact same key structure and have no empty strings', () => {
  const dicts = {
    tr: TR_DICTIONARY,
    fr: FR_DICTIONARY,
    ar: AR_DICTIONARY,
    de: DE_DICTIONARY,
    nl: NL_DICTIONARY,
  };

  const baseEntries = flattenStringEntries(dicts.tr);
  const baseKeys = baseEntries.map(([k]) => k).sort();

  for (const [code, dict] of Object.entries(dicts)) {
    const entries = flattenStringEntries(dict);
    const keys = entries.map(([k]) => k).sort();
    assert.deepEqual(keys, baseKeys, `Dictionary key mismatch in ${code}`);
    for (const [k, v] of entries) {
      assert.equal(typeof v, 'string', `${code}.${k} must be a string`);
      assert.ok(v.trim().length > 0, `${code}.${k} must not be empty`);
    }
  }
});

test('non-Turkish UI dictionaries contain zero Turkish fallback or Turkish-specific characters', () => {
  const nonTr = {
    fr: FR_DICTIONARY,
    ar: AR_DICTIONARY,
    de: DE_DICTIONARY,
    nl: NL_DICTIONARY,
  };

  const turkishCharsRegex = /[şŞğĞıİ]/;

  for (const [code, dict] of Object.entries(nonTr)) {
    assert.notEqual(dict.nav.home, TR_DICTIONARY.nav.home, `${code}.nav.home matches TR`);
    assert.notEqual(dict.nav.hadisler, TR_DICTIONARY.nav.hadisler, `${code}.nav.hadisler matches TR`);
    assert.notEqual(dict.nav.ayarlar, TR_DICTIONARY.nav.ayarlar, `${code}.nav.ayarlar matches TR`);
    assert.notEqual(
      dict.common.translationPreparing,
      TR_DICTIONARY.common.translationPreparing,
      `${code}.common.translationPreparing matches TR`
    );
    assert.notEqual(dict.disclaimer, TR_DICTIONARY.disclaimer, `${code}.disclaimer matches TR`);
    assert.notEqual(
      dict.settings.alwaysShowRootColorsLabel,
      TR_DICTIONARY.settings.alwaysShowRootColorsLabel,
      `${code}.settings.alwaysShowRootColorsLabel matches TR`
    );

    const entries = flattenStringEntries(dict);
    for (const [key, val] of entries) {
      if (key === 'languagePicker.languageNames.tr') continue;
      assert.equal(
        turkishCharsRegex.test(val),
        false,
        `Unexpected Turkish character in ${code}.${key}: "${val}"`
      );
    }
  }
});

test('loadDictionary lazy-loads all 5 language bundles accurately', async () => {
  assert.equal(await loadDictionary('tr'), TR_DICTIONARY);
  assert.equal(await loadDictionary('fr'), FR_DICTIONARY);
  assert.equal(await loadDictionary('ar'), AR_DICTIONARY);
  assert.equal(await loadDictionary('de'), DE_DICTIONARY);
  assert.equal(await loadDictionary('nl'), NL_DICTIONARY);
});

test('getLocalizedText never falls back to Turkish when translation is missing', () => {
  const trOnly = { tr: 'Türkçe örnek', fr: 'Exemple français' };
  assert.equal(
    getLocalizedText(trOnly, 'de', DE_DICTIONARY.common.translationPreparing),
    DE_DICTIONARY.common.translationPreparing
  );
  assert.equal(
    getLocalizedText(trOnly, 'nl', NL_DICTIONARY.common.translationPreparing),
    NL_DICTIONARY.common.translationPreparing
  );
  assert.equal(
    getLocalizedText(trOnly, 'ar', AR_DICTIONARY.common.translationPreparing),
    AR_DICTIONARY.common.translationPreparing
  );
  assert.equal(getLocalizedText(trOnly, 'fr', 'fallback'), 'Exemple français');
});

test('getBabDisplayTitle selects language-appropriate bab title', () => {
  const sampleBab = {
    titleTr: 'Hilim ve Hz. Peygamber’in Ahlâkı',
    titleFr: 'La mansuétude et le noble caractère du Prophète',
    titleAr: 'بَابٌ فِي الْحِلْمِ وَأَخْلَاقِ النَّبِيِّ ﷺ',
  };
  assert.equal(getBabDisplayTitle(sampleBab, 'tr'), sampleBab.titleTr);
  assert.equal(getBabDisplayTitle(sampleBab, 'fr'), sampleBab.titleFr);
  assert.equal(getBabDisplayTitle(sampleBab, 'ar'), sampleBab.titleAr);
  assert.equal(getBabDisplayTitle(sampleBab, 'de'), sampleBab.titleAr);
  assert.equal(getBabDisplayTitle(sampleBab, 'nl'), sampleBab.titleAr);
});

test('normalizeTransliterationSearch aligns cross-language transliterations and Arabic script', () => {
  assert.equal(normalizeTransliterationSearch('Ebû Dâvûd'), 'ebudavud');
  assert.equal(normalizeTransliterationSearch('Abou Daoud'), 'ebudavud');
  assert.equal(normalizeTransliterationSearch('Abū Dāwūd'), 'ebudavud');
  assert.equal(normalizeTransliterationSearch('أَبُو دَاوُدَ'), 'ebudavud');

  assert.equal(normalizeTransliterationSearch('Sicistân'), 'sicistan');
  assert.equal(normalizeTransliterationSearch('Sidschistān'), 'sicistan');
  assert.equal(normalizeTransliterationSearch('Sidzjistān'), 'sicistan');
  assert.equal(normalizeTransliterationSearch('سجستان'), 'sicistan');

  assert.equal(normalizeTransliterationSearch("el-Lü'lüî").includes('lului'), true);
  assert.equal(normalizeTransliterationSearch('al-Loulouî').includes('lului'), true);

  assert.equal(normalizeTransliterationSearch('Muâz'), 'muaz');
  assert.equal(normalizeTransliterationSearch('Muadh'), 'muaz');
  assert.equal(normalizeTransliterationSearch('Moadh'), 'muaz');
  assert.equal(normalizeTransliterationSearch('معاذ'), 'muaz');

  assert.equal(normalizeTransliterationSearch('Hattâbî').includes('hattabi'), true);
  assert.equal(normalizeTransliterationSearch('al-Khattabi').includes('hattabi'), true);
});

test('loadSettings enforces secondaryLanguage !== language and alwaysShowRootColors default false', () => {
  assert.equal(DEFAULT_SETTINGS.alwaysShowRootColors, false);
  assert.equal(DEFAULT_SETTINGS.language, 'tr');
  assert.equal(DEFAULT_SETTINGS.secondaryLanguage, 'none');

  const store = new Map<string, string>();
  const originalWindow = (globalThis as { window?: unknown }).window;
  (globalThis as { window?: unknown }).window = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, val: string) => {
        store.set(key, val);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
  };

  try {
    store.set(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ language: 'de', secondaryLanguage: 'de' })
    );
    const loadedCollision = loadSettings();
    assert.equal(loadedCollision.language, 'de');
    assert.equal(loadedCollision.secondaryLanguage, 'none');
    assert.equal(loadedCollision.alwaysShowRootColors, false);

    store.set(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        language: 'nl',
        secondaryLanguage: 'fr',
        alwaysShowRootColors: true,
      })
    );
    const loadedValid = loadSettings();
    assert.equal(loadedValid.language, 'nl');
    assert.equal(loadedValid.secondaryLanguage, 'fr');
    assert.equal(loadedValid.alwaysShowRootColors, true);
  } finally {
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window?: unknown }).window = originalWindow;
    }
  }
});

test('selectVoiceForLanguage supports 5 languages with male preference priority', () => {
  const pool: VoiceLike[] = [
    { name: 'Microsoft Katja', lang: 'de-DE' },
    { name: 'Microsoft Stefan', lang: 'de-DE' },
    { name: 'Microsoft Fenna', lang: 'nl-NL' },
    { name: 'Microsoft Maarten', lang: 'nl-NL' },
    { name: 'Amelie', lang: 'fr-FR' },
    { name: 'Thomas', lang: 'fr-FR' },
  ];

  const de = selectVoiceForLanguage(pool, 'de-DE', { genderPreference: 'male' });
  assert.equal(de.voice?.name, 'Microsoft Stefan');
  assert.equal(de.gender, 'male');
  assert.equal(de.warning, null);

  const nl = selectVoiceForLanguage(pool, 'nl-NL', { genderPreference: 'male' });
  assert.equal(nl.voice?.name, 'Microsoft Maarten');
  assert.equal(nl.gender, 'male');
  assert.equal(nl.warning, null);

  const fr = selectVoiceForLanguage(pool, 'fr-FR', { genderPreference: 'male' });
  assert.equal(fr.voice?.name, 'Thomas');
  assert.equal(fr.gender, 'male');
  assert.equal(fr.warning, null);

  const missingDe = selectVoiceForLanguage([], 'de-DE', { genderPreference: 'male' });
  assert.equal(missingDe.voice, null);
  assert.equal(missingDe.hasAnyVoiceForLang, false);
  assert.ok(missingDe.warning);
});
