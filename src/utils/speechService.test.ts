import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyVoiceGender,
  NO_ARABIC_VOICE_WARNING,
  NO_MALE_VOICE_WARNING,
  selectVoiceForLanguage,
  type VoiceLike,
} from './speechService';

test('classifyVoiceGender identifies male and female voices case-insensitively', () => {
  assert.equal(classifyVoiceGender('Microsoft Naayf - Arabic (Saudi Arabia)', 'ar-SA'), 'male');
  assert.equal(classifyVoiceGender('majed', 'ar-SA'), 'male');
  assert.equal(classifyVoiceGender('Microsoft Tolga - Turkish (Turkey)', 'tr-TR'), 'male');
  assert.equal(classifyVoiceGender('Zariyah', 'ar-SA'), 'female');
  assert.equal(classifyVoiceGender('filiz', 'tr-TR'), 'female');
  assert.equal(classifyVoiceGender('Yelda', 'tr-TR'), 'female');
  assert.equal(classifyVoiceGender('Google العربية', 'ar-SA'), 'unknown');
});

test('erkek ses tercihi varken kadın ses seçilmiyor', () => {
  const arVoices: VoiceLike[] = [
    { name: 'Microsoft Zariyah Online (Natural) - Arabic (Saudi Arabia)', lang: 'ar-SA' },
    { name: 'Hoda', lang: 'ar-EG' },
    { name: 'Majed', lang: 'ar-SA' },
  ];

  const arResult = selectVoiceForLanguage(arVoices, 'ar-SA', {
    genderPreference: 'male',
  });
  assert.equal(arResult.voice?.name, 'Majed');
  assert.equal(arResult.gender, 'male');
  assert.equal(arResult.warning, null);

  const trVoices: VoiceLike[] = [
    { name: 'Microsoft Emel - Turkish', lang: 'tr-TR' },
    { name: 'Yelda', lang: 'tr-TR' },
    { name: 'Tolga', lang: 'tr-TR' },
  ];

  const trResult = selectVoiceForLanguage(trVoices, 'tr-TR', {
    genderPreference: 'male',
  });
  assert.equal(trResult.voice?.name, 'Tolga');
  assert.equal(trResult.gender, 'male');
  assert.equal(trResult.warning, null);

  // Unknown non-female voice is still preferred over known female voices when male is unavailable
  const mixedNoMale: VoiceLike[] = [
    { name: 'Salma', lang: 'ar-SA' },
    { name: 'Google العربية', lang: 'ar-SA' },
  ];
  const mixedResult = selectVoiceForLanguage(mixedNoMale, 'ar-SA', {
    genderPreference: 'male',
  });
  assert.equal(mixedResult.voice?.name, 'Google العربية');
  assert.equal(mixedResult.warning, NO_MALE_VOICE_WARNING);
});

test('ses yoksa uyarı veriliyor (erkek ses yoksa veya dil sesi hiç yoksa)', () => {
  const onlyFemaleVoices: VoiceLike[] = [
    { name: 'Zariyah', lang: 'ar-SA' },
    { name: 'Filiz', lang: 'tr-TR' },
  ];

  const arFallback = selectVoiceForLanguage(onlyFemaleVoices, 'ar-SA', {
    genderPreference: 'male',
  });
  assert.equal(arFallback.hasMaleVoiceForLang, false);
  assert.equal(arFallback.warning, NO_MALE_VOICE_WARNING);

  const trFallback = selectVoiceForLanguage(onlyFemaleVoices, 'tr-TR', {
    genderPreference: 'male',
  });
  assert.equal(trFallback.hasMaleVoiceForLang, false);
  assert.equal(trFallback.warning, NO_MALE_VOICE_WARNING);

  const emptyVoices: VoiceLike[] = [];
  const noArabic = selectVoiceForLanguage(emptyVoices, 'ar-SA', {
    genderPreference: 'male',
  });
  assert.equal(noArabic.voice, null);
  assert.equal(noArabic.hasAnyVoiceForLang, false);
  assert.equal(noArabic.warning, NO_ARABIC_VOICE_WARNING);
});
