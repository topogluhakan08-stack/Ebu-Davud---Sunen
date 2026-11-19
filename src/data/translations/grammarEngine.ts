import type { GrammarPack } from './lexiconTypes';

type TargetLang = 'fr' | 'de' | 'nl' | 'ar';
type Quad = Record<TargetLang, string>;

const POS_TABLE: Record<string, Quad> = {
  'Fiil': { fr: 'Verbe', de: 'Verb', nl: 'Werkwoord', ar: 'فِعْل' },
  'İsim': { fr: 'Nom', de: 'Nomen', nl: 'Zelfstandig naamwoord', ar: 'اِسْم' },
  'Harf': { fr: 'Particule', de: 'Partikel', nl: 'Partikel', ar: 'حَرْف' },
  'Zamir': { fr: 'Pronom', de: 'Pronomen', nl: 'Voornaamwoord', ar: 'ضَمِير' },
  'Özel İsim': { fr: 'Nom propre', de: 'Eigenname', nl: 'Eigennaam', ar: 'عَلَم' },
  'Sıfat': { fr: 'Adjectif', de: 'Adjektiv', nl: 'Bijvoeglijk naamwoord', ar: 'صِفَة' },
  'İsim (Temyîz)': { fr: 'Nom (spécificatif / tamyîz)', de: 'Nomen (Tamyîz)', nl: 'Naamwoord (tamyîz)', ar: 'اِسْم (تَمْيِيز)' },
  'İsm-i Fâil': { fr: 'Participe actif (ism al-fâ‘il)', de: 'Partizip Aktiv (Ism al-fâ‘il)', nl: 'Actief deelwoord (ism al-fâ‘il)', ar: 'اِسْم فَاعِل' },
  'Fiil-i Muzâri': { fr: 'Verbe inaccompli (mudâri‘)', de: 'Imperfekt (Mudâri‘)', nl: 'Onvoltooid werkwoord (mudâri‘)', ar: 'فِعْل مُضَارِع' },
  'İsm-i Tasgîr': { fr: 'Diminutif (tasghîr)', de: 'Diminutiv (Tasghîr)', nl: 'Verkleinwoord (tasghîr)', ar: 'اِسْم تَصْغِير' },
  'Fiil-i Mâzî + Zamir': { fr: 'Verbe accompli + pronom', de: 'Perfekt + Pronomen', nl: 'Voltooid werkwoord + voornaamwoord', ar: 'فِعْل مَاضٍ + ضَمِير' },
  'İsm-i Fiil': { fr: 'Nom verbal interjectif (ism al-fi‘l)', de: 'Verbalnomen (Ism al-fi‘l)', nl: 'Verbaalnaamwoord (ism al-fi‘l)', ar: 'اِسْم فِعْل' },
  'İsim + Zamir': { fr: 'Nom + pronom', de: 'Nomen + Pronomen', nl: 'Naamwoord + voornaamwoord', ar: 'اِسْم + ضَمِير' },
  'Sıfat-ı Müşebbehe': { fr: 'Adjectif assimilé (sifa mushabbaha)', de: 'Verbaladjektiv (Sifa muschabbaha)', nl: 'Kwaliteitsadjectief (sifa mushabbaha)', ar: 'صِفَة مُشَبَّهَة' },
  'Fiil-i Muzâri + Zamir': { fr: 'Verbe inaccompli + pronom', de: 'Imperfekt + Pronomen', nl: 'Onvoltooid werkwoord + voornaamwoord', ar: 'فِعْل مُضَارِع + ضَمِير' },
  'Emr-i Hâzır': { fr: 'Impératif (2e pers.)', de: 'Imperativ (2. Pers.)', nl: 'Gebiedende wijs (2e pers.)', ar: 'فِعْل أَمْر' },
  'Masdar': { fr: 'Nom d’action (masdar)', de: 'Verbalnomen (Masdar)', nl: 'Verbaalzelfstandig naamwoord (masdar)', ar: 'مَصْدَر' },
  'Fiil-i Mâzî': { fr: 'Verbe accompli (mâdî)', de: 'Perfekt (Mâdî)', nl: 'Voltooid werkwoord (mâdî)', ar: 'فِعْل مَاضٍ' },
  'Masdar (Mef‘ûlün leh)': { fr: 'Masdar (complément de cause)', de: 'Masdar (Kausalobjekt)', nl: 'Masdar (oorzaaksbepaling)', ar: 'مَصْدَر (مَفْعُول لِأَجْلِه)' },
  'İsim (Mübâlağa)': { fr: 'Nom intensif (mubâlagha)', de: 'Intensivnomen (Mubâlagha)', nl: 'Intensief naamwoord (mubâlagha)', ar: 'صِيغَة مُبَالَغَة' },
  'İsim / Masdar': { fr: 'Nom / masdar', de: 'Nomen / Masdar', nl: 'Naamwoord / masdar', ar: 'اِسْم / مَصْدَر' },
  'İsim (Cemî) + Zamir': { fr: 'Nom (pluriel) + pronom', de: 'Nomen (Plural) + Pronomen', nl: 'Naamwoord (meervoud) + voornaamwoord', ar: 'اِسْم (جَمْع) + ضَمِير' },
  'Masdar/İsim': { fr: 'Masdar / nom', de: 'Masdar / Nomen', nl: 'Masdar / naamwoord', ar: 'مَصْدَر / اِسْم' },
  'Emr-i Gâib': { fr: 'Impératif indirect (3e pers.)', de: 'Jussiv / Imperativ (3. Pers.)', nl: 'Indirecte gebiedende wijs (3e pers.)', ar: 'أَمْر غَائِب (بِلَامِ الْأَمْر)' },
  'İsm-i Tafdîl': { fr: 'Élatif / superlatif (ism at-tafdîl)', de: 'Elativ (Ism at-tafdîl)', nl: 'Elatief / overtreffende trap', ar: 'اِسْم تَفْضِيل' },
  'Fiil-i Muzâri Meçhûl': { fr: 'Verbe inaccompli passif', de: 'Imperfekt Passiv', nl: 'Onvoltooid lijdend werkwoord', ar: 'فِعْل مُضَارِع مَبْنِيّ لِلْمَجْهُول' },
  'Fiil-i Mâzî (Meçhul)': { fr: 'Verbe accompli (passif)', de: 'Perfekt (Passiv)', nl: 'Voltooid werkwoord (passief)', ar: 'فِعْل مَاضٍ مَبْنِيّ لِلْمَجْهُول' },
  'İsm-i Tafdîl + Zamir': { fr: 'Élatif + pronom', de: 'Elativ + Pronomen', nl: 'Elatief + voornaamwoord', ar: 'اِسْم تَفْضِيل + ضَمِير' },
  'Fiil-i Muzâri (Meçhul)': { fr: 'Verbe inaccompli (passif)', de: 'Imperfekt (Passiv)', nl: 'Onvoltooid werkwoord (passief)', ar: 'فِعْل مُضَارِع (مَجْهُول)' },
  'Zarf (Zaman)': { fr: 'Adverbe de temps (zarf zamân)', de: 'Zeitadverb (Zarf zamân)', nl: 'Bijwoord van tijd (zarf zamân)', ar: 'ظَرْف زَمَان' },
  'İsim (Cemî)': { fr: 'Nom (pluriel)', de: 'Nomen (Plural)', nl: 'Naamwoord (meervoud)', ar: 'اِسْم (جَمْع)' },
  'Fiil-i Muzâri (Meczûm)': { fr: 'Verbe inaccompli (apocopé / majzûm)', de: 'Imperfekt (Jussiv / Majzûm)', nl: 'Onvoltooid werkwoord (jussief)', ar: 'فِعْل مُضَارِع (مَجْزُوم)' },
  'İsim / Sıfat': { fr: 'Nom / adjectif', de: 'Nomen / Adjektiv', nl: 'Naamwoord / adjectief', ar: 'اِسْم / صِفَة' },
  'Masdar/İsim + Zamir': { fr: 'Masdar / nom + pronom', de: 'Masdar / Nomen + Pronomen', nl: 'Masdar / naamwoord + voornaamwoord', ar: 'مَصْدَر / اِسْم + ضَمِير' },
  'İsm-i Fâil (Tefe‘‘ul)': { fr: 'Participe actif (forme V / tafa‘‘ul)', de: 'Partizip Aktiv (V. Stamm / Tafa‘‘ul)', nl: 'Actief deelwoord (vorm V / tafa‘‘ul)', ar: 'اِسْم فَاعِل (تَفَعُّل)' },
  'Emr-i Hâzır + Zamir': { fr: 'Impératif + pronom', de: 'Imperativ + Pronomen', nl: 'Gebiedende wijs + voornaamwoord', ar: 'فِعْل أَمْر + ضَمِير' },
  'İsm-i İşâret (Mekân)': { fr: 'Démonstratif de lieu', de: 'Ortsdemonstrativum', nl: 'Aanwijzend bijwoord van plaats', ar: 'اِسْم إِشَارَة لِلْمَكَان' },
  'Harf-i Müşebbeh bi’l-Fiil + Zamir': { fr: 'Particule de type inna + pronom', de: 'Verbähnliche Partikel (Inna) + Pronomen', nl: 'Werkwoordachtig partikel (inna) + pronomen', ar: 'حَرْف مُشَبَّه بِالْفِعْل + ضَمِير' },
  'İsm-i Âlet': { fr: 'Nom d’instrument (ism al-âla)', de: 'Instrumentalnomen (Ism al-âla)', nl: 'Werktuignaamwoord (ism al-âla)', ar: 'اِسْم آلَة' },
  'Masdar (Mufâ‘ale)': { fr: 'Masdar (forme III / mufâ‘ala)', de: 'Masdar (III. Stamm / Mufâ‘ala)', nl: 'Masdar (vorm III / mufâ‘ala)', ar: 'مَصْدَر (مُفَاعَلَة)' },
  'İsim / Sıfat (Rubâî)': { fr: 'Nom / adjectif (quadrilitère)', de: 'Nomen / Adjektiv (vierradikalig)', nl: 'Naamwoord / adjectief (vierradicaal)', ar: 'اِسْم / صِفَة (رُبَاعِيّ)' },
  'İsm-i Âlem / Sıfat': { fr: 'Nom propre / épithète', de: 'Eigenname / Beiname', nl: 'Eigennaam / bijnaam', ar: 'عَلَم / صِفَة' },
  'İsim (Mübâlağa, Cemî)': { fr: 'Nom intensif (pluriel)', de: 'Intensivnomen (Plural)', nl: 'Intensief naamwoord (meervoud)', ar: 'صِيغَة مُبَالَغَة (جَمْع)' },
  'Masdar-ı Mîmî': { fr: 'Masdar à préfixe mîm (masdar mîmî)', de: 'Mîm-Masdar (Masdar mîmî)', nl: 'Mîm-masdar (masdar mîmî)', ar: 'مَصْدَر مِيمِيّ' },
  'Emr-i Hâzır (Müennes)': { fr: 'Impératif (féminin)', de: 'Imperativ (feminin)', nl: 'Gebiedende wijs (vrouwelijk)', ar: 'فِعْل أَمْر (مُؤَنَّث)' },
};

const TENSE_TABLE: Record<string, Quad> = {
  'Mâzî': { fr: 'Accompli (mâdî)', de: 'Perfekt (Mâdî)', nl: 'Voltooid (mâdî)', ar: 'مَاضٍ' },
  'Muzârî': { fr: 'Inaccompli (mudâri‘)', de: 'Imperfekt (Mudâri‘)', nl: 'Onvoltooid (mudâri‘)', ar: 'مُضَارِع' },
  '—': { fr: '—', de: '—', nl: '—', ar: '—' },
  'Muzârî (Meçhul)': { fr: 'Inaccompli (passif)', de: 'Imperfekt (Passiv)', nl: 'Onvoltooid (passief)', ar: 'مُضَارِع (مَجْهُول)' },
  'Emir': { fr: 'Impératif (amr)', de: 'Imperativ (Amr)', nl: 'Gebiedende wijs (amr)', ar: 'أَمْر' },
  'Mâzî (Şart cevabı)': { fr: 'Accompli (apodose conditionnelle)', de: 'Perfekt (Nachsatz / Bedingungsantwort)', nl: 'Voltooid (antwoordzin voorwaarde)', ar: 'مَاضٍ (جَوَاب الشَّرْط)' },
  'Mâzî (Şart)': { fr: 'Accompli (protase conditionnelle)', de: 'Perfekt (Bedingungssatz)', nl: 'Voltooid (voorwaarde)', ar: 'مَاضٍ (شَرْط)' },
  'Mâzî (Meçhul)': { fr: 'Accompli (passif)', de: 'Perfekt (Passiv)', nl: 'Voltooid (passief)', ar: 'مَاضٍ (مَجْهُول)' },
  'Muzârî (Lâm-ı Emir)': { fr: 'Inaccompli (lâm d’injonction)', de: 'Imperfekt (Befehls-Lâm)', nl: 'Onvoltooid (gebiedend lâm)', ar: 'مُضَارِع (بِلَامِ الْأَمْر)' },
  'Mâzî (Câmid)': { fr: 'Accompli (verbe figé / jâmid)', de: 'Perfekt (unflektierbar / Jâmid)', nl: 'Voltooid (onverbuigbaar / jâmid)', ar: 'مَاضٍ (جَامِد)' },
  'Mâzî (Şart/Vasfi)': { fr: 'Accompli (conditionnel / descriptif)', de: 'Perfekt (konditional / deskriptiv)', nl: 'Voltooid (voorwaardelijk / beschrijvend)', ar: 'مَاضٍ (شَرْطِيّ / وَصْفِيّ)' },
};

const NUMBER_TABLE: Record<string, Quad> = {
  'Müfred + Cemî zamir': { fr: 'Singulier + pronom pluriel', de: 'Singular + Pluralpronomen', nl: 'Enkelvoud + meervoudig voornaamwoord', ar: 'مُفْرَد + ضَمِير جَمْع' },
  'Müfred + Mütekellim yâsı': { fr: 'Singulier + yâ’ de 1re pers.', de: 'Singular + Yâ’ der 1. Person', nl: 'Enkelvoud + yâ’ van de 1e pers.', ar: 'مُفْرَد + يَاء الْمُتَكَلِّم' },
  'Müfred + Gâib zamiri': { fr: 'Singulier + pronom 3e pers.', de: 'Singular + Pronomen 3. Pers.', nl: 'Enkelvoud + voornaamwoord 3e pers.', ar: 'مُفْرَد + ضَمِير غَائِب' },
  'Müfred': { fr: 'Singulier', de: 'Singular', nl: 'Enkelvoud', ar: 'مُفْرَد' },
  'Müfred (Mütekellim)': { fr: 'Singulier (1re pers.)', de: 'Singular (1. Pers.)', nl: 'Enkelvoud (1e pers.)', ar: 'مُفْرَد (مُتَكَلِّم)' },
  'Müfred fâil + Cemî mef‘ûl': { fr: 'Sujet sing. + objet plur.', de: 'Subjekt Sing. + Objekt Plur.', nl: 'Onderwerp enk. + voorwerp mv.', ar: 'فَاعِل مُفْرَد + مَفْعُول جَمْع' },
  'Tesniye': { fr: 'Duel', de: 'Dual', nl: 'Tweevoud (dualis)', ar: 'مُثَنَّى' },
  'Cemî': { fr: 'Pluriel', de: 'Plural', nl: 'Meervoud', ar: 'جَمْع' },
  'Tesniye + Mef‘ûl': { fr: 'Duel + objet', de: 'Dual + Objekt', nl: 'Tweevoud + voorwerp', ar: 'مُثَنَّى + مَفْعُول' },
  '—': { fr: '—', de: '—', nl: '—', ar: '—' },
  'Müfred (Hâl)': { fr: 'Singulier (état / hâl)', de: 'Singular (Zustand / Hâl)', nl: 'Enkelvoud (toestand / hâl)', ar: 'مُفْرَد (حَال)' },
  'Cemî (Mükesser)': { fr: 'Pluriel brisé (taksîr)', de: 'Gebrochener Plural (Taksîr)', nl: 'Gebroken meervoud (taksîr)', ar: 'جَمْع تَكْسِير' },
  'Müfred (Topluluk)': { fr: 'Singulier (collectif)', de: 'Singular (Kollektiv)', nl: 'Enkelvoud (collectief)', ar: 'مُفْرَد (اِسْم جَمْع)' },
  'Cemî (Topluluk)': { fr: 'Pluriel (collectif)', de: 'Plural (Kollektiv)', nl: 'Meervoud (collectief)', ar: 'جَمْع (دَالّ عَلَى الْجَمَاعَة)' },
  'Müfred + Mütekellim mef‘ûlü': { fr: 'Singulier + objet 1re pers.', de: 'Singular + Objekt 1. Pers.', nl: 'Enkelvoud + voorwerp 1e pers.', ar: 'مُفْرَد + مَفْعُول الْمُتَكَلِّم' },
  'Müfred + Mef‘ûl (-î)': { fr: 'Singulier + objet (-î)', de: 'Singular + Objekt (-î)', nl: 'Enkelvoud + voorwerp (-î)', ar: 'مُفْرَد + مَفْعُول (-ي)' },
  'Müfred fâil + Muhatap mef‘ûlü': { fr: 'Sujet sing. + objet 2e pers.', de: 'Subjekt Sing. + Objekt 2. Pers.', nl: 'Onderwerp enk. + voorwerp 2e pers.', ar: 'فَاعِل مُفْرَد + مَفْعُول مُخَاطَب' },
  'Müfred fâil + Gâib mef‘ûlü': { fr: 'Sujet sing. + objet 3e pers.', de: 'Subjekt Sing. + Objekt 3. Pers.', nl: 'Onderwerp enk. + voorwerp 3e pers.', ar: 'فَاعِل مُفْرَد + مَفْعُول غَائِب' },
  'Sayı (3–10)': { fr: 'Numéral (3–10)', de: 'Zahlwort (3–10)', nl: 'Telwoord (3–10)', ar: 'عَدَد (٣–١٠)' },
  'Müfred fâil + Mef‘ûl (-hu)': { fr: 'Sujet sing. + objet (-hu)', de: 'Subjekt Sing. + Objekt (-hu)', nl: 'Onderwerp enk. + voorwerp (-hu)', ar: 'فَاعِل مُفْرَد + مَفْعُول (-هُ)' },
  'Müfred (Muhatap)': { fr: 'Singulier (2e pers.)', de: 'Singular (2. Pers.)', nl: 'Enkelvoud (2e pers.)', ar: 'مُفْرَد (مُخَاطَب)' },
  'Sayı (10)': { fr: 'Numéral (10)', de: 'Zahlwort (10)', nl: 'Telwoord (10)', ar: 'عَدَد (١٠)' },
  'Cemî (Mütekellim)': { fr: 'Pluriel (1re pers.)', de: 'Plural (1. Pers.)', nl: 'Meervoud (1e pers.)', ar: 'جَمْع (مُتَكَلِّم)' },
  'Cemî + Mef‘ûl (-hu)': { fr: 'Pluriel + objet (-hu)', de: 'Plural + Objekt (-hu)', nl: 'Meervoud + voorwerp (-hu)', ar: 'جَمْع + مَفْعُول (-هُ)' },
  'Müfred + Cemî mef‘ûl': { fr: 'Singulier + objet pluriel', de: 'Singular + Pluralobjekt', nl: 'Enkelvoud + meervoudig voorwerp', ar: 'مُفْرَد + مَفْعُول جَمْع' },
  'Müfred + Mef‘ûl (-hu)': { fr: 'Singulier + objet (-hu)', de: 'Singular + Objekt (-hu)', nl: 'Enkelvoud + voorwerp (-hu)', ar: 'مُفْرَد + مَفْعُول (-هُ)' },
  'Müfred fâil + Mef‘ûl (-î)': { fr: 'Sujet sing. + objet (-î)', de: 'Subjekt Sing. + Objekt (-î)', nl: 'Onderwerp enk. + voorwerp (-î)', ar: 'فَاعِل مُفْرَد + مَفْعُول (-ي)' },
  'Müfred + 2 Mef‘ûl': { fr: 'Singulier + double objet', de: 'Singular + doppeltes Objekt', nl: 'Enkelvoud + dubbel voorwerp', ar: 'مُفْرَد + مَفْعُولَان' },
  'Müfred (İsm-i Cins)': { fr: 'Singulier (nom générique)', de: 'Singular (Gattungsname)', nl: 'Enkelvoud (soortnaam)', ar: 'مُفْرَد (اِسْم جِنْس)' },
  'Cemî (Ukûd)': { fr: 'Pluriel (dizaines / ‘uqûd)', de: 'Plural (Zehner / ‘Uqûd)', nl: 'Meervoud (tientallen / ‘uqûd)', ar: 'جَمْع (أَلْفَاظ الْعُقُود)' },
  'Cemî (Muhatap)': { fr: 'Pluriel (2e pers.)', de: 'Plural (2. Pers.)', nl: 'Meervoud (2e pers.)', ar: 'جَمْع (مُخَاطَب)' },
  'Müfred + Tesniye zamir': { fr: 'Singulier + pronom duel', de: 'Singular + Dualpronomen', nl: 'Enkelvoud + duaal voornaamwoord', ar: 'مُفْرَد + ضَمِير مُثَنَّى' },
  'Müfred + Mef‘ûl (-hâ)': { fr: 'Singulier + objet (-hâ)', de: 'Singular + Objekt (-hâ)', nl: 'Enkelvoud + voorwerp (-hâ)', ar: 'مُفْرَد + مَفْعُول (-هَا)' },
  'Müfred + Mef‘ûl (-nî)': { fr: 'Singulier + objet (-nî)', de: 'Singular + Objekt (-nî)', nl: 'Enkelvoud + voorwerp (-nî)', ar: 'مُفْرَد + مَفْعُول (-نِي)' },
  'Müfred + Mef‘ûl (-ka)': { fr: 'Singulier + objet (-ka)', de: 'Singular + Objekt (-ka)', nl: 'Enkelvoud + voorwerp (-ka)', ar: 'مُفْرَد + مَفْعُول (-كَ)' },
  'Cemî (Müzekker Sâlim)': { fr: 'Pluriel masculin régulier', de: 'Gesunder maskuliner Plural', nl: 'Regelmatig mannelijk meervoud', ar: 'جَمْع مُذَكَّر سَالِم' },
  'Sayı (3)': { fr: 'Numéral (3)', de: 'Zahlwort (3)', nl: 'Telwoord (3)', ar: 'عَدَد (٣)' },
  'Cemî (Müennes Sâlim)': { fr: 'Pluriel féminin régulier', de: 'Gesunder femininer Plural', nl: 'Regelmatig vrouwelijk meervoud', ar: 'جَمْع مُؤَنَّث سَالِم' },
  'Müfred + Mef‘ûl (-kum)': { fr: 'Singulier + objet (-kum)', de: 'Singular + Objekt (-kum)', nl: 'Enkelvoud + voorwerp (-kum)', ar: 'مُفْرَد + مَفْعُول (-كُمْ)' },
  'Müfred (Muhataba)': { fr: 'Singulier (2e pers. fém.)', de: 'Singular (2. Pers. fem.)', nl: 'Enkelvoud (2e pers. vr.)', ar: 'مُفْرَد (مُخَاطَبَة)' },
};

const GENDER_TABLE: Record<string, Quad> = {
  'Müzekker': { fr: 'Masculin', de: 'Maskulin', nl: 'Mannelijk', ar: 'مُذَكَّر' },
  'Ortak': { fr: 'Commun (masc./fém.)', de: 'Gemeinsam (mask./fem.)', nl: 'Gemeenschappelijk', ar: 'مُشْتَرَك' },
  'Müennes': { fr: 'Féminin', de: 'Feminin', nl: 'Vrouwelijk', ar: 'مُؤَنَّث' },
  '—': { fr: '—', de: '—', nl: '—', ar: '—' },
  'Müzekker (madûd müennes)': { fr: 'Masculin (compté féminin)', de: 'Maskulin (Gezähltes feminin)', nl: 'Mannelijk (getelde vrouwelijk)', ar: 'مُذَكَّر (الْمَعْدُود مُؤَنَّث)' },
  'Müzekker/Müennes': { fr: 'Masculin / Féminin', de: 'Maskulin / Feminin', nl: 'Mannelijk / Vrouwelijk', ar: 'مُذَكَّر / مُؤَنَّث' },
  'Müennes (lafzî)': { fr: 'Féminin (formel / lafzî)', de: 'Feminin (formal / lafzî)', nl: 'Vrouwelijk (formeel / lafzî)', ar: 'مُؤَنَّث لَفْظِيّ' },
  'Müennes (جمع تكسير için)': { fr: 'Féminin (accord de pluriel brisé)', de: 'Feminin (für gebrochenen Plural)', nl: 'Vrouwelijk (voor gebroken meervoud)', ar: 'مُؤَنَّث (لِجَمْعِ التَّكْسِير)' },
  'Müennes/Muhatap': { fr: 'Féminin / 2e pers.', de: 'Feminin / 2. Pers.', nl: 'Vrouwelijk / 2e pers.', ar: 'مُؤَنَّث / مُخَاطَب' },
};

const CASE_TABLE: Record<string, Quad> = {
  'Mebnî (feth üzere)': { fr: 'Invariable (sur la fatha)', de: 'Indeklinabel (auf Fatha)', nl: 'Onverbuigbaar (op fatha)', ar: 'مَبْنِيّ عَلَى الْفَتْح' },
  'Merfû': { fr: 'Nominatif / indicatif (marfû‘)', de: 'Nominativ / Indikativ (Marfû‘)', nl: 'Nominatief / indicatief (marfû‘)', ar: 'مَرْفُوع' },
  'Mebnî (sükûn üzere)': { fr: 'Invariable (sur le sukûn)', de: 'Indeklinabel (auf Sukûn)', nl: 'Onverbuigbaar (op sukûn)', ar: 'مَبْنِيّ عَلَى السُّكُون' },
  'Mebnî (zamm üzere)': { fr: 'Invariable (sur la damma)', de: 'Indeklinabel (auf Damma)', nl: 'Onverbuigbaar (op damma)', ar: 'مَبْنِيّ عَلَى الضَّمّ' },
  'Mecrûr': { fr: 'Génitif (majrûr)', de: 'Genitiv (Majrûr)', nl: 'Genitief (majrûr)', ar: 'مَجْرُور' },
  'Merfû (takdîren)': { fr: 'Nominatif / indicatif (virtuel)', de: 'Nominativ / Indikativ (implizit)', nl: 'Nominatief / indicatief (impliciet)', ar: 'مَرْفُوع تَقْدِيراً' },
  'Merfû (sübût-i nûn)': { fr: 'Indicatif (maintien du nûn)', de: 'Indikativ (Erhalt des Nûn)', nl: 'Indicatief (behoud van de nûn)', ar: 'مَرْفُوع بِثُبُوتِ النُّون' },
  'Meczûm / Mebnî': { fr: 'Apocopé (majzûm) / invariable', de: 'Jussiv (Majzûm) / indeklinabel', nl: 'Jussief / onverbuigbaar', ar: 'مَجْزُوم / مَبْنِيّ' },
  'Mebnî': { fr: 'Invariable (mabnî)', de: 'Indeklinabel (Mabnî)', nl: 'Onverbuigbaar (mabnî)', ar: 'مَبْنِيّ' },
  'Mebnî (mahallen merfû)': { fr: 'Invariable (en position de nominatif)', de: 'Indeklinabel (syntaktisch Nominativ)', nl: 'Onverbuigbaar (syntactisch nominatief)', ar: 'مَبْنِيّ فِي مَحَلّ رَفْع' },
  'Mahallen mecrûr': { fr: 'Génitif par position (mahallan)', de: 'Syntaktisch im Genitiv', nl: 'Syntactisch in de genitief', ar: 'فِي مَحَلّ جَرّ' },
  'Mebnî (kesre üzere)': { fr: 'Invariable (sur la kasra)', de: 'Indeklinabel (auf Kasra)', nl: 'Onverbuigbaar (op kasra)', ar: 'مَبْنِيّ عَلَى الْكَسْر' },
  'Mansûb': { fr: 'Accusatif / subjonctif (mansûb)', de: 'Akkusativ / Konjunktiv (Mansûb)', nl: 'Accusatief / conjunctief (mansûb)', ar: 'مَنْصُوب' },
  'Mahalli yok': { fr: 'Sans fonction casuelle', de: 'Ohne syntaktische Kasusstelle', nl: 'Zonder syntactische naamvalsfunctie', ar: 'لَا مَحَلَّ لَهُ مِنَ الْإِعْرَاب' },
  'Mecrûr / Merfû (bağlama göre)': { fr: 'Génitif / nominatif (selon contexte)', de: 'Genitiv / Nominativ (kontextabhängig)', nl: 'Genitief / nominatief (naar context)', ar: 'مَجْرُور / مَرْفُوع (بِحَسَبِ السِّيَاق)' },
  'Mansûb / Mecrûr': { fr: 'Accusatif / génitif', de: 'Akkusativ / Genitiv', nl: 'Accusatief / genitief', ar: 'مَنْصُوب / مَجْرُور' },
  'Mütâbî (öncekine uyar)': { fr: 'Apposition accordée au nom précédent', de: 'Kongruent mit dem Bezugswort', nl: 'Volgt naamval van het voorafgaande woord', ar: 'تَابِع لِمَا قَبْلَهُ' },
  'Mansûb / Merfû': { fr: 'Accusatif / nominatif', de: 'Akkusativ / Nominativ', nl: 'Accusatief / nominatief', ar: 'مَنْصُوب / مَرْفُوع' },
  'Merfû (Elif ile)': { fr: 'Nominatif (par l’alif)', de: 'Nominativ (mit Alif)', nl: 'Nominatief (met alif)', ar: 'مَرْفُوع بِالْأَلِف' },
  'Merfû (Vâv ile)': { fr: 'Nominatif (par le wâw)', de: 'Nominativ (mit Wâw)', nl: 'Nominatief (met wâw)', ar: 'مَرْفُوع بِالْوَاو' },
  'Mecrûr (Yâ ile)': { fr: 'Génitif (par le yâ’)', de: 'Genitiv (mit Yâ’)', nl: 'Genitief (met yâ’)', ar: 'مَجْرُور بِالْيَاء' },
  'Mansûb (Elif ile)': { fr: 'Accusatif (par l’alif)', de: 'Akkusativ (mit Alif)', nl: 'Accusatief (met alif)', ar: 'مَنْصُوب بِالْأَلِف' },
  'Gayr-i munsarif (fetha ile mecrûr) / Merfû': { fr: 'Diptote (génitif par fatha) / nominatif', de: 'Diptoton (Genitiv mit Fatha) / Nominativ', nl: 'Diptoot (genitief met fatha) / nominatief', ar: 'مَمْنُوع مِنَ الصَّرْف (مَجْرُور بِالْفَتْحَة) / مَرْفُوع' },
  'Gayr-i munsarif (fetha ile mecrûr)': { fr: 'Diptote (génitif par fatha)', de: 'Diptoton (Genitiv mit Fatha)', nl: 'Diptoot (genitief met fatha)', ar: 'مَمْنُوع مِنَ الصَّرْف (مَجْرُور بِالْفَتْحَة)' },
  'Gayr-i munsarif (te’nîs tâlı erkek ismi)': { fr: 'Diptote (nom masculin à tâ’ féminin)', de: 'Diptoton (maskuliner Name mit Tâ’ marbûta)', nl: 'Diptoot (mannelijke naam met tâ’ marbûta)', ar: 'مَمْنُوع مِنَ الصَّرْف (عَلَم مُذَكَّر مَخْتُوم بِتَاءِ التَّأْنِيث)' },
  'Gayr-i munsarif': { fr: 'Diptote (mamnû‘ min as-sarf)', de: 'Diptoton (Mamnû‘ min as-sarf)', nl: 'Diptoot (mamnû‘ min as-sarf)', ar: 'مَمْنُوع مِنَ الصَّرْف' },
  'Merfû / Mecrûr': { fr: 'Nominatif / génitif', de: 'Nominativ / Genitiv', nl: 'Nominatief / genitief', ar: 'مَرْفُوع / مَجْرُور' },
  'Mecrûr / Merfû': { fr: 'Génitif / nominatif', de: 'Genitiv / Nominativ', nl: 'Genitief / nominatief', ar: 'مَجْرُور / مَرْفُوع' },
  'Gayr-i munsarif (takdîrî)': { fr: 'Diptote (flexion virtuelle)', de: 'Diptoton (implizit)', nl: 'Diptoot (impliciet)', ar: 'مَمْنُوع مِنَ الصَّرْف (تَقْدِيرِيّ)' },
  'Gayr-i munsarif (takdîren mecrûr)': { fr: 'Diptote (génitif virtuel)', de: 'Diptoton (impliziter Genitiv)', nl: 'Diptoot (impliciete genitief)', ar: 'مَمْنُوع مِنَ الصَّرْف (مَجْرُور تَقْدِيراً)' },
  'Merfû / Gayr-i munsarif': { fr: 'Nominatif / diptote', de: 'Nominativ / Diptoton', nl: 'Nominatief / diptoot', ar: 'مَرْفُوع / مَمْنُوع مِنَ الصَّرْف' },
  'Mecrûr (takdîrî)': { fr: 'Génitif (virtuel)', de: 'Genitiv (implizit)', nl: 'Genitief (impliciet)', ar: 'مَجْرُور تَقْدِيراً' },
  'Mebnî (mahallen mansûb)': { fr: 'Invariable (en position d’accusatif)', de: 'Indeklinabel (syntaktisch Akkusativ)', nl: 'Onverbuigbaar (syntactisch accusatief)', ar: 'مَبْنِيّ فِي مَحَلّ نَصْب' },
  'Merfû (takdîrî)': { fr: 'Nominatif (virtuel)', de: 'Nominativ (implizit)', nl: 'Nominatief (impliciet)', ar: 'مَرْفُوع تَقْدِيراً' },
  'Mebnî (kesre/tenvin üzere)': { fr: 'Invariable (sur kasra / tanwîn)', de: 'Indeklinabel (auf Kasra / Tanwîn)', nl: 'Onverbuigbaar (op kasra / tanwîn)', ar: 'مَبْنِيّ عَلَى الْكَسْرِ الْمُنَوَّن' },
  'Mansûb (Yâ ile)': { fr: 'Accusatif (par le yâ’)', de: 'Akkusativ (mit Yâ’)', nl: 'Accusatief (met yâ’)', ar: 'مَنْصُوب بِالْيَاء' },
  'İsmi mahallen mansûb': { fr: 'Son nom en position d’accusatif', de: 'Sein Nomen syntaktisch im Akkusativ', nl: 'Zijn naamwoord syntactisch accusatief', ar: 'اِسْمُهَا فِي مَحَلّ نَصْب' },
  'Mebnî (mahallen mecrûr)': { fr: 'Invariable (en position de génitif)', de: 'Indeklinabel (syntaktisch Genitiv)', nl: 'Onverbuigbaar (syntactisch genitief)', ar: 'مَبْنِيّ فِي مَحَلّ جَرّ' },
  'Mebnî (takdîrî feth)': { fr: 'Invariable (fatha virtuelle)', de: 'Indeklinabel (implizite Fatha)', nl: 'Onverbuigbaar (impliciete fatha)', ar: 'مَبْنِيّ عَلَى فَتْحٍ مُقَدَّر' },
  'Mebnî (hazf-i nûn)': { fr: 'Invariable (chute du nûn)', de: 'Indeklinabel (Wegfall des Nûn)', nl: 'Onverbuigbaar (wegval van de nûn)', ar: 'مَبْنِيّ عَلَى حَذْفِ النُّون' },
  'Mebnî (takdîrî)': { fr: 'Invariable (virtuel)', de: 'Indeklinabel (implizit)', nl: 'Onverbuigbaar (impliciet)', ar: 'مَبْنِيّ تَقْدِيراً' },
  'Meczûm': { fr: 'Apocopé / jussif (majzûm)', de: 'Jussiv (Majzûm)', nl: 'Jussief (majzûm)', ar: 'مَجْزُوم' },
  'Mahallen mansûb': { fr: 'Accusatif par position', de: 'Syntaktisch im Akkusativ', nl: 'Syntactisch in de accusatief', ar: 'فِي مَحَلّ نَصْب' },
  'Mecrûr (takdîren mef‘ûl)': { fr: 'Génitif (objet virtuel)', de: 'Genitiv (implizites Objekt)', nl: 'Genitief (impliciet voorwerp)', ar: 'مَجْرُور (مَفْعُول تَقْدِيراً)' },
  'Mahallen merfû': { fr: 'Nominatif par position', de: 'Syntaktisch im Nominativ', nl: 'Syntactisch in de nominatief', ar: 'فِي مَحَلّ رَفْع' },
  'Merfû / Meczûm': { fr: 'Indicatif / jussif', de: 'Indikativ / Jussiv', nl: 'Indicatief / jussief', ar: 'مَرْفُوع / مَجْزُوم' },
};

/** Ordered classical Arabic Sarf & I'rab terminology replacements for pattern & role formulas. */
const TERM_PHRASES: [string, Quad][] = [
  // Multi-word Turkish grammar constructions first (longest match first)
  ['Dua cümlesi (Cümle-i duâiyye)', { fr: 'Formule de bénédiction (du‘â’)', de: 'Segensformel (Du‘â’)', nl: 'Zegenwensformule (du‘â’)', ar: 'جُمْلَة دُعَائِيَّة' }],
  ['Cümle-i mu‘terıza (ara dua)', { fr: 'Incidende de bénédiction', de: 'Einschub (Segensformel)', nl: 'Tussenzin (zegenwens)', ar: 'جُمْلَة مُعْتَرِضَة (دُعَائِيَّة)' }],
  ['Cinsini nefyeden لَا’nın ismi', { fr: 'Nom du lâ de négation absolue', de: 'Nomen des kategorisch verneinenden Lâ', nl: 'Naamwoord van het ontkennende lâ', ar: 'اِسْم لَا النَّافِيَة لِلْجِنْس' }],
  ['Mahzuf mübtedânın haberi', { fr: 'Prédicat d’un sujet sous-entendu', de: 'Prädikat eines ausgelassenen Subjekts', nl: 'Gezegde van een weggelaten onderwerp', ar: 'خَبَر لِمُبْتَدَأٍ مَحْذُوف' }],
  ['Uzak mekân işaret zarfı (mukaddem haber)', { fr: 'Adverbe démonstratif de lieu éloigné (prédicat antéposé)', de: 'Demonstratives Ortsadverb der Ferne (vorangestelltes Prädikat)', nl: 'Aanwijzend plaatsbijwoord van verte (vooropgeplaatst gezegde)', ar: 'ظَرْف مَكَان لِلْبَعِيد (خَبَر مُقَدَّم)' }],
  ['Harf-i müşebbehe bi’l-fiil', { fr: 'Particule de type inna', de: 'Verbähnliche Partikel (Inna)', nl: 'Werkwoordachtig partikel (inna)', ar: 'حَرْف مُشَبَّه بِالْفِعْل' }],
  ['Müşebbehe bi’l-fiil', { fr: 'Particule de type inna', de: 'Verbähnliche Partikel', nl: 'Werkwoordachtig partikel', ar: 'مُشَبَّه بِالْفِعْل' }],
  ['İsim cümlesini nasb/ref‘ eden edat', { fr: 'Particule régissant la phrase nominale (inna)', de: 'Partikel des Nominalsatzes (Inna)', nl: 'Partikel van de nominale zin (inna)', ar: 'حَرْف نَاسِخ (نَاصِب لِلِاسْم رَافِع لِلْخَبَر)' }],
  ['Terâhî (sıralı gecikme) bildiren atıf harfi', { fr: 'Conjonction de succession différée (thumma)', de: 'Konjunktion der zeitlichen Abfolge (Thumma)', nl: 'Voegwoord van opeenvolging (thumma)', ar: 'حَرْف عَطْف لِلتَّرْتِيب وَالتَّرَاخِي' }],
  ['Cer veya Muzârî nasbeden harf (gizli أَنْ ile)', { fr: 'Préposition ou particule du subjonctif (avec an implicite)', de: 'Präposition oder Konjunktivpartikel (mit implizitem an)', nl: 'Voorzetsel of conjunctiefpartikel (met impliciete an)', ar: 'حَرْف جَرّ أَوْ غَايَة وَنَصْب (بِأَنْ مُضْمَرَة)' }],
  ['İzâ-i fücâiyye (ansızınlık edatı)', { fr: 'Idhâ de soudaineté (fujâ’iyya)', de: 'Idhâ der Plötzlichkeit (Fujâ’iyya)', nl: 'Idhâ van plotselingheid (fujâ’iyya)', ar: 'إِذَا الْفُجَائِيَّة' }],
  ['Emir fiil (kesre ile iltikâ-i sâkineyn)', { fr: 'Impératif (kasra de liaison)', de: 'Imperativ (Kasra zur Konsonantentrennung)', nl: 'Gebiedende wijs (verbindingskasra)', ar: 'فِعْل أَمْر (حُرِّك بِالْكَسْرِ لِالْتِقَاءِ السَّاكِنَيْن)' }],
  ['Tahzîz (kınamalı soru) edatı', { fr: 'Particule d’incitation / reproche (tahdîd)', de: 'Aufforderungs-/Tadelpartikel (Tahdîd)', nl: 'Aansporings-/verwijtpartikel (tahdîd)', ar: 'حَرْف تَحْضِيض' }],
  ['Olumsuzluk veya yasaklama harfi', { fr: 'Particule de négation ou de prohibition', de: 'Negations- oder Verbotspartikel', nl: 'Ontkennings- of verbodspartikel', ar: 'حَرْف نَفْي أَوْ نَهْي' }],
  ['Olumsuzluk harfi veya mevsûl', { fr: 'Particule négative ou pronom relatif', de: 'Negationspartikel oder Relativpronomen', nl: 'Ontkenningspartikel of betrekkelijk voornaamwoord', ar: 'حَرْف نَفْي أَوْ اِسْم مَوْصُول' }],
  ['Geçmiş zamanı kapsayan zarf', { fr: 'Adverbe temporel englobant le passé (qattu)', de: 'Zeitadverb für die gesamte Vergangenheit (Qattu)', nl: 'Tijdsbijwoord voor het gehele verleden (qattu)', ar: 'ظَرْف زَمَان لِاسْتِغْرَاقِ الْمَاضِي' }],
  ['Gelecek zaman şart zarfı', { fr: 'Conjonction temporelle conditionnelle (idhâ)', de: 'Zukunftsbezogene Bedingungskonjunktion (Idhâ)', nl: 'Toekomstgericht voorwaardelijk voegwoord (idhâ)', ar: 'ظَرْف لِمَا يُسْتَقْبَلُ مِنَ الزَّمَانِ (شَرْطِيّ)' }],
  ['Zaman şart zarfı', { fr: 'Adverbe conditionnel de temps', de: 'Temporale Bedingungspartikel', nl: 'Temporeel voorwaardelijk bijwoord', ar: 'ظَرْف زَمَان شَرْطِيّ' }],
  ['Harf-i Şart (gayr-i câzim)', { fr: 'Particule conditionnelle (non apocopante)', de: 'Bedingungspartikel (nicht jussiv)', nl: 'Voorwaardelijk partikel (niet-jussief)', ar: 'حَرْف شَرْط غَيْر جَازِم' }],
  ['Harf-i Cerr + Soru edatı (elif düşmüştür)', { fr: 'Préposition + particule interrogative (alif élidé)', de: 'Präposition + Fragepartikel (Alif elidiert)', nl: 'Voorzetsel + vraagpartikel (alif weggevallen)', ar: 'حَرْف جَرّ + اِسْم اِسْتِفْهَام (حُذِفَتْ أَلِفُه)' }],
  ['Mübtedâ (مِنْ-i zâide ile lafzen mecrûr)', { fr: 'Sujet nominal (au génitif formel par min explétif)', de: 'Subjekt (formal im Genitiv nach pleonastischem min)', nl: 'Onderwerp (formeel genitief na versterkend min)', ar: 'مُبْتَدَأ مَجْرُور لَفْظاً بِمِنْ الزَّائِدَة' }],
  ['Muzârî meçhul fiil', { fr: 'Verbe inaccompli passif', de: 'Imperfekt Passiv', nl: 'Onvoltooid lijdend werkwoord', ar: 'فِعْل مُضَارِع مَبْنِيّ لِلْمَجْهُول' }],
  ['Meçhul muzârî fiil', { fr: 'Verbe inaccompli passif', de: 'Imperfekt Passiv', nl: 'Onvoltooid lijdend werkwoord', ar: 'فِعْل مُضَارِع مَبْنِيّ لِلْمَجْهُول' }],
  ['Meçhul mâzî fiil', { fr: 'Verbe accompli passif', de: 'Perfekt Passiv', nl: 'Voltooid lijdend werkwoord', ar: 'فِعْل مَاضٍ مَبْنِيّ لِلْمَجْهُول' }],
  ['Nâkıs mâzî fiil', { fr: 'Verbe défectif accompli (kâna)', de: 'Defektives Perfektverb (Kâna)', nl: 'Koppelwerkwoord voltooid (kâna)', ar: 'فِعْل مَاضٍ نَاقِص' },],
  ['Nâkıs muzârî fiil', { fr: 'Verbe défectif inaccompli', de: 'Defektives Imperfektverb', nl: 'Koppelwerkwoord onvoltooid', ar: 'فِعْل مُضَارِع نَاقِص' }],
  ['Câmid Nâkıs Fiil', { fr: 'Verbe figé défectif', de: 'Unflektierbares defektives Verb', nl: 'Onverbuigbaar koppelwerkwoord', ar: 'فِعْل جَامِد نَاقِص' }],
  ['Câmid Zem Fiili', { fr: 'Verbe figé de blâme (bi’sa)', de: 'Unflektierbares Tadelverb (Bi’sa)', nl: 'Onverbuigbaar afkeuringswerkwoord (bi’sa)', ar: 'فِعْل جَامِد لِلذَّمّ' }],
  ['Zem (yergi) fiili', { fr: 'Verbe de blâme (dhamm)', de: 'Tadelverb (Dhamm)', nl: 'Afkeuringswerkwoord (dhamm)', ar: 'فِعْل ذَمّ' }],
  ['Ecvef / Nâkıs fiil', { fr: 'Verbe concave / défectif', de: 'Hohles / defektives Verb', nl: 'Hol / defectief werkwoord', ar: 'فِعْل أَجْوَف / نَاقِص' }],
  ['Tefe‘‘ul mâzî fiil', { fr: 'Accompli (forme V / tafa‘‘ul)', de: 'Perfekt (V. Stamm / Tafa‘‘ul)', nl: 'Voltooid (vorm V / tafa‘‘ul)', ar: 'فِعْل مَاضٍ (تَفَعُّل)' }],
  ['Tef‘îl mâzî fiil', { fr: 'Accompli (forme II / taf‘îl)', de: 'Perfekt (II. Stamm / Taf‘îl)', nl: 'Voltooid (vorm II / taf‘îl)', ar: 'فِعْل مَاضٍ (تَفْعِيل)' }],
  ['Muzârî vezninde', { fr: 'sur le schème du verbe inaccompli', de: 'nach dem Imperfektmuster', nl: 'naar het onvoltooid werkwoordspatroon', ar: 'على وَزْنِ الْفِعْلِ الْمُضَارِع' }],
  ['Mâzî fiil', { fr: 'Verbe accompli', de: 'Perfektverb', nl: 'Voltooid werkwoord', ar: 'فِعْل مَاضٍ' }],
  ['Muzârî fiil', { fr: 'Verbe inaccompli', de: 'Imperfektverb', nl: 'Onvoltooid werkwoord', ar: 'فِعْل مُضَارِع' }],
  ['Emir fiil', { fr: 'Impératif', de: 'Imperativ', nl: 'Gebiedende wijs', ar: 'فِعْل أَمْر' }],
  ['Şart fiili', { fr: 'Verbe conditionnel', de: 'Bedingungsverb', nl: 'Voorwaardelijk werkwoord', ar: 'فِعْل الشَّرْط' }],
  ['Sıla fiili', { fr: 'Verbe de proposition relative', de: 'Verb des Relativsatzes', nl: 'Werkwoord van betrekkelijke bijzin', ar: 'فِعْل الصِّلَة' }],
  ['Şurû‘ fiili', { fr: 'Verbe inchoatif (shurû‘)', de: 'Inchoatives Verb (Schurû‘)', nl: 'Beginwerkwoord (shurû‘)', ar: 'فِعْل شُرُوع' }],
  ['Dua/Tazîm fiili', { fr: 'Verbe de glorification', de: 'Verherrlichungsverb', nl: 'Verheerlijkingswerkwoord', ar: 'فِعْل تَعْظِيم وَدُعَاء' }],
  ['Tazîm/Senâ fiili', { fr: 'Verbe de glorification et louange', de: 'Lob- und Verherrlichungsverb', nl: 'Lof- en verheerlijkingswerkwoord', ar: 'فِعْل تَعْظِيم وَثَنَاء' }],
  ['Tazîm fiili', { fr: 'Verbe de glorification', de: 'Verherrlichungsverb', nl: 'Verheerlijkingswerkwoord', ar: 'فِعْل تَعْظِيم' }],
  ['Nâkıs fiil', { fr: 'Verbe défectif', de: 'Defektives Verb', nl: 'Koppelwerkwoord (nâqis)', ar: 'فِعْل نَاقِص' }],
  ['Kâffe ile fâilsiz fiil', { fr: 'Verbe neutre suivi de mâ kâffa', de: 'Verb mit hemmendem Mâ (kâffa)', nl: 'Werkwoord met remmend mâ (kâffa)', ar: 'فِعْل مَكْفُوف بِمَا الْكَافَّة' }],
  ['Nâib-i Mef‘ûl-i Mutlak (Sayı)', { fr: 'Substitut d’objet absolu (nombre)', de: 'Ersatz des absoluten Objekts (Zahl)', nl: 'Vervanger van absoluut voorwerp (aantal)', ar: 'نَائِب عَنِ الْمَفْعُولِ الْمُطْلَق (عَدَد)' }],
  ['Mef‘ûl-i Mutlak', { fr: 'Objet absolu (maf‘ûl mutlaq)', de: 'Absolutes Objekt (Maf‘ûl mutlaq)', nl: 'Absoluut voorwerp (maf‘ûl mutlaq)', ar: 'مَفْعُول مُطْلَق' }],
  ['Mef‘ûlün bih', { fr: 'Complément d’objet direct', de: 'Akkusativobjekt (Maf‘ûl bihi)', nl: 'Lijdend voorwerp (maf‘ûl bihi)', ar: 'مَفْعُول بِه' }],
  ['Mef‘ûlün leh', { fr: 'Complément de cause (maf‘ûl li-ajlih)', de: 'Kausalobjekt (Maf‘ûl li-ajlih)', nl: 'Oorzaaksbepaling (maf‘ûl li-ajlih)', ar: 'مَفْعُول لِأَجْلِه' }],
  ['Mef‘ûlün fîh', { fr: 'Complément circonstanciel (maf‘ûl fîh)', de: 'Adverbialobjekt (Maf‘ûl fîh)', nl: 'Bijwoordelijke bepaling (maf‘ûl fîh)', ar: 'مَفْعُول فِيه' }],
  ['İkinci mef‘ûl', { fr: 'Second complément d’objet', de: 'Zweites Objekt', nl: 'Tweede voorwerp', ar: 'مَفْعُول بِه ثَانٍ' }],
  ['2. mef‘ûl', { fr: '2e objet', de: '2. Objekt', nl: '2e voorwerp', ar: 'مَفْعُول ثَانٍ' }],
  ['Nâib-i fâil', { fr: 'Sujet passif (nâ’ib al-fâ‘il)', de: 'Passivsubjekt (Nâ’ib al-fâ‘il)', nl: 'Passief onderwerp (nâ’ib al-fâ‘il)', ar: 'نَائِب فَاعِل' }],
  ['Muzâfun ileyh', { fr: 'Complément du nom (mudâf ilayh)', de: 'Genitivattribut (Mudâf ilayh)', nl: 'Genitiefbepaling (mudâf ilayh)', ar: 'مُضَاف إِلَيْه' }],
  ['Mecrûr muzâf', { fr: 'Nom annexé au génitif', de: 'Annexiertes Nomen im Genitiv', nl: 'Geannexeerd naamwoord in genitief', ar: 'مَجْرُور مُضَاف' }],
  ['Mülhak bi-cem‘i müzekker', { fr: 'Assimilé au pluriel masculin régulier', de: 'Dem maskulinen Plural angeglichen', nl: 'Gelijkgesteld aan mannelijk meervoud', ar: 'مُلْحَق بِجَمْعِ الْمُذَكَّر السَّالِم' }],
  ['Mülhak bi-cem‘', { fr: 'Assimilé au pluriel régulier', de: 'Dem regelmäßigen Plural angeglichen', nl: 'Gelijkgesteld aan regelmatig meervoud', ar: 'مُلْحَق بِالْجَمْع' }],
  ['Esmâ-i Hamse', { fr: 'Cinq noms (al-asmâ’ al-khamsa)', de: 'Fünf Nomina (al-Asmâ’ al-chamsa)', nl: 'Vijf naamwoorden (al-asmâ’ al-khamsa)', ar: 'الْأَسْمَاء الْخَمْسَة' }],
  ['Lafza-i Celâl', { fr: 'Nom de Majesté (Allâh)', de: 'Name der Majestät (Allâh)', nl: 'Naam van Majesteit (Allâh)', ar: 'لَفْظ الْجَلَالَة' }],
  ['Hemze-i vasıl', { fr: 'Hamza de liaison (wasl)', de: 'Verbindungs-Hamza (Wasl)', nl: 'Verbindingshamza (wasl)', ar: 'هَمْزَة وَصْل' }],
  ['Nûn-u vikâye', { fr: 'Nûn de protection (wiqâya)', de: 'Schutz-Nûn (Wiqâya)', nl: 'Beschermings-nûn (wiqâya)', ar: 'نُون الْوِقَايَة' }],
  ['Vâvü’l-cemâ‘a', { fr: 'Wâw du pluriel', de: 'Wâw des Plurals', nl: 'Wâw van het meervoud', ar: 'وَاو الْجَمَاعَة' }],
  ['Elifü’l-isneyn', { fr: 'Alif du duel', de: 'Alif des Duals', nl: 'Alif van het tweevoud', ar: 'أَلِف الِاثْنَيْن' }],
  ['Yâü’l-muhâtaba', { fr: 'Yâ’ de la 2e pers. fém.', de: 'Yâ’ der 2. Pers. fem.', nl: 'Yâ’ van de 2e pers. vr.', ar: 'يَاء الْمُخَاطَبَة' }],
  ['Te’nîs tâsı', { fr: 'Tâ’ du féminin', de: 'Feminin-Tâ’', nl: 'Vrouwelijke tâ’', ar: 'تَاء التَّأْنِيث' }],
  ['Te’kîd-i ma‘nevî', { fr: 'Renforcement sémantique (tawkîd)', de: 'Bedeutungsverstärkung (Tawkîd)', nl: 'Betekenisversterking (tawkîd)', ar: 'تَوْكِيد مَعْنَوِيّ' }],
  ['Atf-ı beyân', { fr: 'Apposition explicative (‘atf al-bayân)', de: 'Erklärende Apposition (‘Atf al-bayân)', nl: 'Verklarende bijstelling (‘atf al-bayân)', ar: 'عَطْف بَيَان' }],
  ['Vâv-ı hâliyye/âtıfe', { fr: 'Wâw circonstanciel / de coordination', de: 'Zustands-/Koordinations-Wâw', nl: 'Toestands-/nevenschikkend wâw', ar: 'وَاو حَالِيَّة / عَاطِفَة' }],
  ['Vâv-ı hâliyye', { fr: 'Wâw circonstanciel (hâliyya)', de: 'Zustands-Wâw (Hâliyya)', nl: 'Toestands-wâw (hâliyya)', ar: 'وَاو حَالِيَّة' }],
  ['Vâv-ı âtıfe', { fr: 'Wâw de coordination', de: 'Koordinations-Wâw', nl: 'Nevenschikkend wâw', ar: 'وَاو عَاطِفَة' }],
  ['Atıf vâvı', { fr: 'Wâw de coordination', de: 'Koordinations-Wâw', nl: 'Nevenschikkend wâw', ar: 'وَاو الْعَطْف' }],
  ['Fâ-i atıf', { fr: 'Fâ’ de coordination', de: 'Koordinations-Fâ’', nl: 'Nevenschikkend fâ’', ar: 'فَاء عَاطِفَة' }],
  ['Cevab-ı şart fâsı', { fr: 'Fâ’ d’apodose conditionnelle', de: 'Fâ’ des Bedingungsnachsatzes', nl: 'Fâ’ van de antwoordzin', ar: 'فَاء جَوَاب الشَّرْط' }],
  ['Atıf fâsı', { fr: 'Fâ’ de coordination', de: 'Koordinations-Fâ’', nl: 'Nevenschikkend fâ’', ar: 'فَاء الْعَطْف' }],
  ['Lâm-ı müzahleka', { fr: 'Lâm d’insistance (muzahlaqa)', de: 'Verstärkungs-Lâm (Muzahlaqa)', nl: 'Nadruk-lâm (muzahlaqa)', ar: 'اللَّام الْمُزَحْلَقَة' }],
  ['Lâm-ı Emir', { fr: 'Lâm d’injonction', de: 'Befehls-Lâm', nl: 'Gebiedend lâm', ar: 'لَام الْأَمْر' }],
  ['Lâm-ı emir', { fr: 'Lâm d’injonction', de: 'Befehls-Lâm', nl: 'Gebiedend lâm', ar: 'لَام الْأَمْر' }],
  ['Harf-i Cerr', { fr: 'Préposition (harf jarr)', de: 'Präposition (Harf Jarr)', nl: 'Voorzetsel (harf jarr)', ar: 'حَرْف جَرّ' }],
  ['Harf-i Masdar', { fr: 'Particule infinitive', de: 'Infinitivpartikel', nl: 'Infinitiefpartikel', ar: 'حَرْف مَصْدَرِيّ' }],
  ['Harf-i Te’kîd', { fr: 'Particule d’insistance', de: 'Bekräftigungspartikel', nl: 'Bekrachtigingspartikel', ar: 'حَرْف تَوْكِيد' }],
  ['Harf-i Nefy', { fr: 'Particule de négation', de: 'Negationspartikel', nl: 'Ontkenningspartikel', ar: 'حَرْف نَفْي' }],
  ['Harf-i Gâye', { fr: 'Particule de limite', de: 'Grenzpartikel', nl: 'Grenspartikel', ar: 'حَرْف غَايَة' }],
  ['Harf-i Nidâ', { fr: 'Particule vocative', de: 'Vokativpartikel', nl: 'Roeppartikel (vocatief)', ar: 'حَرْف نِدَاء' }],
  ['Harf-i Cevâb', { fr: 'Particule de réponse', de: 'Antwortpartikel', nl: 'Antwoordpartikel', ar: 'حَرْف جَوَاب' }],
  ['Harf-i Atıf', { fr: 'Conjonction de coordination', de: 'Konjunktion', nl: 'Voegwoord', ar: 'حَرْف عَطْف' }],
  ['Harf-i Tahzîz', { fr: 'Particule d’incitation', de: 'Aufforderungspartikel', nl: 'Aansporingspartikel', ar: 'حَرْف تَحْضِيض' }],
  ['Harf-i Tahkîk', { fr: 'Particule de confirmation', de: 'Bestätigungspartikel', nl: 'Bevestigingspartikel', ar: 'حَرْف تَحْقِيق' }],
  ['Harf-i İstifham', { fr: 'Particule interrogative', de: 'Fragepartikel', nl: 'Vraagpartikel', ar: 'حَرْف اِسْتِفْهَام' }],
  ['İstisnâ Edatı', { fr: 'Particule d’exception', de: 'Ausnahmepartikel', nl: 'Uitzonderingspartikel', ar: 'أَدَاة اِسْتِثْنَاء' }],
  ['Hasr (sınırlama) edatı', { fr: 'Particule de restriction (hasr)', de: 'Einschränkungspartikel (Hasr)', nl: 'Beperkingspartikel (hasr)', ar: 'أَدَاة حَصْر' }],
  ['Hasr / İstisnâ edatı', { fr: 'Particule de restriction / exception', de: 'Einschränkungs-/Ausnahmepartikel', nl: 'Beperkings-/uitzonderingspartikel', ar: 'أَدَاة حَصْر / اِسْتِثْنَاء' }],
  ['Te’kîd edatı', { fr: 'Particule d’insistance', de: 'Bekräftigungspartikel', nl: 'Bekrachtigingspartikel', ar: 'أَدَاة تَوْكِيد' }],
  ['Tekîd ve tahkîk harfleri', { fr: 'Particules d’insistance et confirmation', de: 'Bekräftigungs- und Bestätigungspartikeln', nl: 'Bekrachtigings- en bevestigingspartikels', ar: 'حَرْفَا تَوْكِيد وَتَحْقِيق' }],
  ['Tahkîk edatı', { fr: 'Particule de confirmation', de: 'Bestätigungspartikel', nl: 'Bevestigingspartikel', ar: 'أَدَاة تَحْقِيق' }],
  ['Tahkîk harfi', { fr: 'Particule de confirmation', de: 'Bestätigungspartikel', nl: 'Bevestigingspartikel', ar: 'حَرْف تَحْقِيق' }],
  ['Te’kîd harfi', { fr: 'Particule d’insistance', de: 'Bekräftigungspartikel', nl: 'Bekrachtigingspartikel', ar: 'حَرْف تَوْكِيد' }],
  ['Şart edatı', { fr: 'Particule conditionnelle', de: 'Bedingungspartikel', nl: 'Voorwaardelijk partikel', ar: 'أَدَاة شَرْط' }],
  ['Şart harfi', { fr: 'Particule conditionnelle', de: 'Bedingungspartikel', nl: 'Voorwaardelijk partikel', ar: 'حَرْف شَرْط' }],
  ['Nidâ (seslenme) edatı', { fr: 'Particule vocative', de: 'Vokativpartikel', nl: 'Roeppartikel (vocatief)', ar: 'أَدَاة نِدَاء' }],
  ['Onay / Cevap harfi', { fr: 'Particule d’approbation / réponse', de: 'Zustimmungs-/Antwortpartikel', nl: 'Bevestigings-/antwoordpartikel', ar: 'حَرْف جَوَاب وَتَصْدِيق' }],
  ['Atıf harfi (terdîd/şek)', { fr: 'Conjonction d’alternative / doute', de: 'Konjunktion der Alternative / Ungewissheit', nl: 'Voegwoord van keuze / twijfel', ar: 'حَرْف عَطْف (لِلتَّخْيِير أَوِ الشَّكّ)' }],
  ['Atıf harfi', { fr: 'Conjonction de coordination', de: 'Konjunktion', nl: 'Voegwoord', ar: 'حَرْف عَطْف' }],
  ['Nefy harfi', { fr: 'Particule de négation', de: 'Negationspartikel', nl: 'Ontkenningspartikel', ar: 'حَرْف نَفْي' }],
  ['Nefy/Nehy harfi', { fr: 'Particule de négation / prohibition', de: 'Negations-/Verbotspartikel', nl: 'Ontkennings-/verbodspartikel', ar: 'حَرْف نَفْي / نَهْي' }],
  ['Kasem harfi + Muksemün bih', { fr: 'Particule de serment + objet du serment', de: 'Schwurpartikel + Schwurobjekt', nl: 'Eedpartikel + voorwerp van de eed', ar: 'حَرْف قَسَم + مُقْسَم بِه' }],
  ['Teşbih harfi (İnne kardeşlerinden)', { fr: 'Particule de comparaison (sœur de inna)', de: 'Vergleichspartikel (Schwester von Inna)', nl: 'Vergelijkingspartikel (zuster van inna)', ar: 'حَرْف تَشْبِيه (مِنْ أَخَوَات إِنَّ)' }],
  ['Teşbih harfi + Masdar mâ’sı', { fr: 'Particule de comparaison + mâ infinitif', de: 'Vergleichspartikel + Infinitiv-Mâ', nl: 'Vergelijkingspartikel + infinitief-mâ', ar: 'حَرْف تَشْبِيه + مَا الْمَصْدَرِيَّة' }],
  ['İstidrâk harfi', { fr: 'Particule adversative (istidrâk)', de: 'Einschränkende Konjunktion (Istidrâk)', nl: 'Tegenstellend voegwoord (istidrâk)', ar: 'حَرْف اِسْتِدْرَاك' }],
  ['Soru harfi', { fr: 'Particule interrogative', de: 'Fragepartikel', nl: 'Vraagpartikel', ar: 'حَرْف اِسْتِفْهَام' }],
  ['Cezm ve nefy edatı', { fr: 'Particule négative apocopante (lam)', de: 'Negierende Jussivpartikel (Lam)', nl: 'Ontkennend jussiefpartikel (lam)', ar: 'حَرْف نَفْي وَجَزْم' }],
  ['Zarf-ı Zamân/Mekân', { fr: 'Adverbe de temps / lieu', de: 'Zeit-/Ortsadverb', nl: 'Bijwoord van tijd / plaats', ar: 'ظَرْف زَمَان / مَكَان' }],
  ['Zarf-ı Zamân', { fr: 'Adverbe de temps', de: 'Zeitadverb', nl: 'Bijwoord van tijd', ar: 'ظَرْف زَمَان' }],
  ['Zarf-ı Mekân', { fr: 'Adverbe de lieu', de: 'Ortsadverb', nl: 'Bijwoord van plaats', ar: 'ظَرْف مَكَان' }],
  ['Zarf-ı mekân', { fr: 'Adverbe de lieu', de: 'Ortsadverb', nl: 'Bijwoord van plaats', ar: 'ظَرْف مَكَان' }],
  ['Zarf-ı Şart', { fr: 'Adverbe conditionnel', de: 'Bedingungsadverb', nl: 'Voorwaardelijk bijwoord', ar: 'ظَرْف شَرْط' }],
  ['Zamir-i Munfasıl', { fr: 'Pronom isolé', de: 'Selbstständiges Pronomen', nl: 'Zelfstandig voornaamwoord', ar: 'ضَمِير مُنْفَصِل' }],
  ['Fasıl zamiri', { fr: 'Pronom de séparation (fasl)', de: 'Trennpronomen (Fasl)', nl: 'Scheidingsvoornaamwoord (fasl)', ar: 'ضَمِير فَصْل' }],
  ['İsm-i İşâret', { fr: 'Pronom démonstratif', de: 'Demonstrativpronomen', nl: 'Aanwijzend voornaamwoord', ar: 'اِسْم إِشَارَة' }],
  ['İsm-i işâret', { fr: 'Pronom démonstratif', de: 'Demonstrativpronomen', nl: 'Aanwijzend voornaamwoord', ar: 'اِسْم إِشَارَة' }],
  ['İsm-i Mevsûl', { fr: 'Pronom relatif', de: 'Relativpronomen', nl: 'Betrekkelijk voornaamwoord', ar: 'اِسْم مَوْصُول' }],
  ['İsm-i Tafdîl', { fr: 'Élatif / superlatif', de: 'Elativ / Superlativ', nl: 'Elatief / overtreffende trap', ar: 'اِسْم تَفْضِيل' }],
  ['İsm-i Fâili', { fr: 'Participe actif', de: 'Partizip Aktiv', nl: 'Actief deelwoord', ar: 'اِسْم فَاعِل' }],
  ['İsm-i Fâil', { fr: 'Participe actif', de: 'Partizip Aktiv', nl: 'Actief deelwoord', ar: 'اِسْم فَاعِل' }],
  ['İsm-i Mef‘ûl', { fr: 'Participe passif', de: 'Partizip Passiv', nl: 'Voltooid deelwoord', ar: 'اِسْم مَفْعُول' }],
  ['İsm-i Mekân', { fr: 'Nom de lieu', de: 'Ortsnomen', nl: 'Plaatsnaamwoord', ar: 'اِسْم مَكَان' }],
  ['İsm-i Âlet', { fr: 'Nom d’instrument', de: 'Instrumentalnomen', nl: 'Werktuignaamwoord', ar: 'اِسْم آلَة' }],
  ['İsm-i Cins', { fr: 'Nom générique', de: 'Gattungsname', nl: 'Soortnaam', ar: 'اِسْم جِنْس' }],
  ['İsm-i Cem‘', { fr: 'Nom collectif', de: 'Kollektivnomen', nl: 'Verzamelnaamwoord', ar: 'اِسْم جَمْع' }],
  ['İsm-i fiil', { fr: 'Nom verbal interjectif', de: 'Verbalnomen', nl: 'Verbaalnaamwoord', ar: 'اِسْم فِعْل' }],
  ['A‘cemî İsim', { fr: 'Nom d’origine non arabe', de: 'Fremdname (A‘jamî)', nl: 'Niet-Arabische eigennaam', ar: 'اِسْم أَعْجَمِيّ' }],
  ['A‘cemî', { fr: 'Nom non arabe', de: 'Fremdname (A‘jamî)', nl: 'Niet-Arabische naam', ar: 'أَعْجَمِيّ' }],
  ['Haber (mukaddem)', { fr: 'Prédicat antéposé', de: 'Vorangestelltes Prädikat', nl: 'Vooropgeplaatst gezegde', ar: 'خَبَر مُقَدَّم' }],
  ['mâzî fiil', { fr: 'verbe accompli', de: 'Perfektverb', nl: 'voltooid werkwoord', ar: 'فِعْل مَاضٍ' }],
  ['Muzârî', { fr: 'inaccompli', de: 'Imperfekt', nl: 'onvoltooid', ar: 'فِعْل مُضَارِع' }],
  ['Mübtedâ-i muahhar', { fr: 'Sujet nominal postposé', de: 'Nachgestelltes Subjekt', nl: 'Achteropgeplaatst onderwerp', ar: 'مُبْتَدَأ مُؤَخَّر' }],
  ['Münâdâ (müfred alem)', { fr: 'Vocatif (nom propre singulier)', de: 'Vokativ (einzelner Eigenname)', nl: 'Vocatief (enkelvoudige eigennaam)', ar: 'مُنَادَى (مُفْرَد عَلَم)' }],
  ['Cevab-ı şart', { fr: 'Apodose conditionnelle', de: 'Bedingungsnachsatz', nl: 'Antwoordzin van voorwaarde', ar: 'جَوَاب الشَّرْط' }],
  ['Şartın cevabı', { fr: 'Apodose conditionnelle', de: 'Bedingungsnachsatz', nl: 'Antwoordzin van voorwaarde', ar: 'جَوَاب الشَّرْط' }],
  ['Şart/İzâ fiili', { fr: 'Verbe conditionnel (après idhâ)', de: 'Bedingungsverb (nach idhâ)', nl: 'Voorwaardelijk werkwoord (na idhâ)', ar: 'فِعْل الشَّرْط (بَعْدَ إِذَا)' }],
  ['İf‘âl masdarı', { fr: 'Masdar de forme IV (if‘âl)', de: 'Masdar (IV. Stamm / If‘âl)', nl: 'Masdar (vorm IV / if‘âl)', ar: 'مَصْدَر إِفْعَال' }],
  ['İfti‘âl masdarı', { fr: 'Masdar de forme VIII (ifti‘âl)', de: 'Masdar (VIII. Stamm / Ifti‘âl)', nl: 'Masdar (vorm VIII / ifti‘âl)', ar: 'مَصْدَر اِفْتِعَال' }],
  ['Meçhul Tef‘îl', { fr: 'Passif forme II (taf‘îl)', de: 'Passiv II. Stamm (Taf‘îl)', nl: 'Passief vorm II (taf‘îl)', ar: 'مَجْهُول تَفْعِيل' }],
  ['Meçhul İf‘âl', { fr: 'Passif forme IV (if‘âl)', de: 'Passiv IV. Stamm (If‘âl)', nl: 'Passief vorm IV (if‘âl)', ar: 'مَجْهُول إِفْعَال' }],
  ['Meçhul İfti‘âl', { fr: 'Passif forme VIII (ifti‘âl)', de: 'Passiv VIII. Stamm (Ifti‘âl)', nl: 'Passief vorm VIII (ifti‘âl)', ar: 'مَجْهُول اِفْتِعَال' }],
  ['İf‘âl Muzâaf', { fr: 'Forme IV géminée', de: 'IV. Stamm geminiert', nl: 'Vorm IV verdubbeld', ar: 'إِفْعَال مُضَاعَف' }],
  ['İf‘âl Ecvef', { fr: 'Forme IV concave', de: 'IV. Stamm hohl', nl: 'Vorm IV hol', ar: 'إِفْعَال أَجْوَف' }],
  ['Muzâaf İfti‘âl', { fr: 'Forme VIII géminée', de: 'VIII. Stamm geminiert', nl: 'Vorm VIII verdubbeld', ar: 'اِفْتِعَال مُضَاعَف' }],
  ['Kasem cevabı', { fr: 'Réponse au serment', de: 'Schwurnachsatz', nl: 'Antwoord op de eed', ar: 'جَوَاب الْقَسَم' }],
  ['Muzârî vezninde', { fr: 'Sur le schème de l’inaccompli', de: 'Im Schema des Imperfekts', nl: 'Op het patroon van het imperfekt', ar: 'عَلَى وَزْنِ الْمُضَارِع' }],
  ['مفعول anlamında', { fr: 'Au sens passif (maf‘ûl)', de: 'In passiver Bedeutung (Maf‘ûl)', nl: 'In passieve betekenis (maf‘ûl)', ar: 'بِمَعْنَى مَفْعُول' }],
  ['يَا yerine', { fr: 'Substitué au vocatif yâ', de: 'Anstelle des Vokativs yâ', nl: 'Ter vervanging van vocatief yâ', ar: 'عِوَضاً عَنْ يَاء النِّدَاء' }],
  ['Sayı temyîzi', { fr: 'Spécificatif numéral', de: 'Zahl-Tamyîz', nl: 'Telwoord-tamyîz', ar: 'تَمْيِيز الْعَدَد' }],
  ['hâl/sıfat cümlesi', { fr: 'Proposition circonstancielle / qualificative', de: 'Zustands-/Attributsatz', nl: 'Toestands-/bijvoeglijke bijzin', ar: 'جُمْلَة حَالِيَّة / نَعْتِيَّة' }],
  ['Sıfat cümlesi', { fr: 'Proposition qualificative', de: 'Attributsatz', nl: 'Bijvoeglijke bijzin', ar: 'جُمْلَة صِفَة' }],
  ['ara açıklama', { fr: 'Incidente explicative', de: 'Erklärender Einschub', nl: 'Verklarende tussenzin', ar: 'جُمْلَة اِعْتِرَاضِيَّة تَوْضِيحِيَّة' }],
  ['ara cümle', { fr: 'Incidente', de: 'Einschub', nl: 'Tussenzin', ar: 'جُمْلَة اِعْتِرَاضِيَّة' }],
  ['mukaddem haber', { fr: 'Prédicat antéposé', de: 'Vorangestelltes Prädikat', nl: 'Vooropgeplaatst gezegde', ar: 'خَبَر مُقَدَّم' }],
  ['fiili mahzuf', { fr: 'Verbe sous-entendu', de: 'Ausgelassenes Verb', nl: 'Weggelaten werkwoord', ar: 'فِعْلُه مَحْذُوف' }],
  ['cümleye muzâf', { fr: 'Annexé à une proposition', de: 'An einen Satz annexiert', nl: 'Geannexeerd aan een zin', ar: 'مُضَاف إِلَى الْجُمْلَة' }],
  ['üzerine matûf', { fr: 'Coordonné à ce qui précède', de: 'Dem Vorherigen beigeordnet', nl: 'Nevengeschikt aan het voorgaande', ar: 'مَعْطُوف عَلَيْه' }],
  ['Mecrûr bi-', { fr: 'Au génitif après ', de: 'Im Genitiv nach ', nl: 'In genitief na ', ar: 'مَجْرُور بِـ ' }],
  ['sonrası mecrûr', { fr: 'au génitif après', de: 'im Genitiv nach', nl: 'in genitief na', ar: 'مَجْرُور بَعْدَ' }],
  ['sonrası istisnâ/hasr', { fr: 'exception / restriction après', de: 'Ausnahme / Einschränkung nach', nl: 'uitzondering / beperking na', ar: 'اِسْتِثْنَاء / حَصْر بَعْدَ' }],
  ['sonrası', { fr: 'après', de: 'nach', nl: 'na', ar: 'بَعْدَ' }],
  ['ve muzâf', { fr: 'et annexé (mudâf)', de: 'und annexiert (Mudâf)', nl: 'en geannexeerd (mudâf)', ar: 'وَمُضَاف' }],
  ['için, ve muzâf', { fr: '— et annexé', de: '— und annexiert', nl: '— en geannexeerd', ar: 'وَمُضَاف' }],
  ['için', { fr: 'pour', de: 'für', nl: 'voor', ar: 'لِـ' }],
  ['mâ-ba‘di', { fr: 'complément suivant', de: 'nachfolgendes Glied', nl: 'volgend zinsdeel', ar: 'مَا بَعْدَه' }],
  ['İnne ve ismi', { fr: 'Inna et son nom', de: 'Inna und sein Nomen', nl: 'Inna en zijn naamwoord', ar: 'إِنَّ وَاسْمُهَا' }],
  ['İnne ismi', { fr: 'Nom de inna', de: 'Nomen von Inna', nl: 'Naamwoord van inna', ar: 'اِسْم إِنَّ' }],
  ['haberi', { fr: 'prédicat', de: 'Prädikat', nl: 'gezegde', ar: 'خَبَر' }],
  ['ismi', { fr: 'nom', de: 'Nomen', nl: 'naamwoord', ar: 'اِسْم' }],
  ['İsmi', { fr: 'Son nom', de: 'Sein Nomen', nl: 'Zijn naamwoord', ar: 'اِسْمُه' }],
  ['cevabı', { fr: 'apodose', de: 'Nachsatz', nl: 'antwoordzin', ar: 'جَوَاب' }],
  ['Atıf/İsti’nâf', { fr: 'Coordination / reprise', de: 'Koordination / Neuansatz', nl: 'Nevenschikking / hervatting', ar: 'عَطْف / اِسْتِئْنَاف' }],
  ['Ma‘tûf fiil', { fr: 'Verbe coordonné', de: 'Beigeordnetes Verb', nl: 'Nevengeschikt werkwoord', ar: 'فِعْل مَعْطُوف' }],
  ['Ma‘tûf', { fr: 'Coordonné (ma‘tûf)', de: 'Beigeordnet (Ma‘tûf)', nl: 'Nevengeschikt (ma‘tûf)', ar: 'مَعْطُوف' }],
  ['Mef‘ûl/Hikâye', { fr: 'Objet / citation', de: 'Objekt / Zitat', nl: 'Voorwerp / citaat', ar: 'مَفْعُول / حِكَايَة' }],
  ['Mef‘ûl', { fr: 'Objet (maf‘ûl)', de: 'Objekt (Maf‘ûl)', nl: 'Voorwerp (maf‘ûl)', ar: 'مَفْعُول' }],
  ['Fâil', { fr: 'Sujet (fâ‘il)', de: 'Subjekt (Fâ‘il)', nl: 'Onderwerp (fâ‘il)', ar: 'فَاعِل' }],
  ['Mübtedâ', { fr: 'Sujet nominal (mubtada’)', de: 'Nominalsubjekt (Mubtada’)', nl: 'Nominaal onderwerp (mubtada’)', ar: 'مُبْتَدَأ' }],
  ['Haber', { fr: 'Prédicat (khabar)', de: 'Prädikat (Chabar)', nl: 'Gezegde (khabar)', ar: 'خَبَر' }],
  ['Sıfat', { fr: 'Qualificatif (na‘t)', de: 'Attribut (Na‘t)', nl: 'Bijvoeglijke bepaling (na‘t)', ar: 'صِفَة / نَعْت' }],
  ['Bedel', { fr: 'Apposition (badal)', de: 'Apposition (Badal)', nl: 'Bijstelling (badal)', ar: 'بَدَل' }],
  ['Temyîz', { fr: 'Spécificatif (tamyîz)', de: 'Spezifikativ (Tamyîz)', nl: 'Specificatie (tamyîz)', ar: 'تَمْيِيز' }],
  ['Muzâf', { fr: 'Annexé (mudâf)', de: 'Annexiert (Mudâf)', nl: 'Geannexeerd (mudâf)', ar: 'مُضَاف' }],
  ['Mecrûr', { fr: 'Génitif (majrûr)', de: 'Genitiv (Majrûr)', nl: 'Genitief (majrûr)', ar: 'مَجْرُور' }],
  ['Merfû', { fr: 'Nominatif (marfû‘)', de: 'Nominativ (Marfû‘)', nl: 'Nominatief (marfû‘)', ar: 'مَرْفُوع' }],
  ['merfû', { fr: 'nominatif', de: 'Nominativ', nl: 'nominatief', ar: 'مَرْفُوع' }],
  ['mansûb', { fr: 'accusatif', de: 'Akkusativ', nl: 'accusatief', ar: 'مَنْصُوب' }],
  ['mecrûr', { fr: 'génitif', de: 'Genitiv', nl: 'genitief', ar: 'مَجْرُور' }],
  ['sıfat', { fr: 'qualificatif', de: 'Attribut', nl: 'bijvoeglijk', ar: 'صِفَة' }],
  ['mübtedâ', { fr: 'sujet nominal', de: 'Nominalsubjekt', nl: 'onderwerp', ar: 'مُبْتَدَأ' }],
  ['fâil', { fr: 'sujet', de: 'Subjekt', nl: 'onderwerp', ar: 'فَاعِل' }],
  ['mütekellim', { fr: '1re pers.', de: '1. Pers.', nl: '1e pers.', ar: 'مُتَكَلِّم' }],
  ['gizli', { fr: 'implicite', de: 'verdeckt', nl: 'impliciet', ar: 'مُسْتَتِر' }],
  ['hâl', { fr: 'état (hâl)', de: 'Zustand (Hâl)', nl: 'toestand (hâl)', ar: 'حَال' }],
  ['Hâl', { fr: 'Complément d’état (hâl)', de: 'Zustandsakkusativ (Hâl)', nl: 'Toestandsbepaling (hâl)', ar: 'حَال' }],
  ['Zamir', { fr: 'Pronom', de: 'Pronomen', nl: 'Voornaamwoord', ar: 'ضَمِير' }],
  ['zamir', { fr: 'pronom', de: 'Pronomen', nl: 'voornaamwoord', ar: 'ضَمِير' }],
  ['Fiil', { fr: 'Verbe', de: 'Verb', nl: 'Werkwoord', ar: 'فِعْل' }],
  ['Zarf', { fr: 'Adverbe (zarf)', de: 'Adverb (Zarf)', nl: 'Bijwoord (zarf)', ar: 'ظَرْف' }],
  ['Atıf', { fr: 'Coordination', de: 'Koordination', nl: 'Nevenschikking', ar: 'عَطْف' }],
  ['Te’kîd', { fr: 'Insistance', de: 'Bekräftigung', nl: 'Bekrachtiging', ar: 'تَوْكِيد' }],
  ['Nefy', { fr: 'Négation', de: 'Negation', nl: 'Ontkenning', ar: 'نَفْي' }],
  ['Nehy', { fr: 'Prohibition', de: 'Verbot', nl: 'Verbod', ar: 'نَهْي' }],
  ['Şart', { fr: 'Condition', de: 'Bedingung', nl: 'Voorwaarde', ar: 'شَرْط' }],
  ['Cezm', { fr: 'Jussif (jazm)', de: 'Jussiv (Jazm)', nl: 'Jussief (jazm)', ar: 'جَزْم' }],
  ['Cer', { fr: 'Génitif (jarr)', de: 'Genitiv (Jarr)', nl: 'Genitief (jarr)', ar: 'جَرّ' }],
  ['Kasem', { fr: 'Serment', de: 'Schwur', nl: 'Eed', ar: 'قَسَم' }],
  ['Tahzîz', { fr: 'Incitation', de: 'Aufforderung', nl: 'Aansporing', ar: 'تَحْضِيض' }],
  ['Masdariyye', { fr: 'Infinitif (masdariyya)', de: 'Infinitivpartikel (Masdariyya)', nl: 'Infinitief (masdariyya)', ar: 'مَصْدَرِيَّة' }],
  ['İstifhamiyye', { fr: 'Interrogatif', de: 'Interrogativ', nl: 'Vragend', ar: 'اِسْتِفْهَامِيَّة' }],
  ['İstifham', { fr: 'Interrogation', de: 'Frage', nl: 'Vraag', ar: 'اِسْتِفْهَام' }],
  ['Muhaffefe', { fr: 'Allégée (mukhaffafa)', de: 'Erleichtert (Muchaffafa)', nl: 'Verlicht (mukhaffafa)', ar: 'مُخَفَّفَة' }],
  ['Tef‘îl', { fr: 'Forme II (taf‘îl)', de: 'II. Stamm (Taf‘îl)', nl: 'Vorm II (taf‘îl)', ar: 'تَفْعِيل' }],
  ['Mufâ‘ale', { fr: 'Forme III (mufâ‘ala)', de: 'III. Stamm (Mufâ‘ala)', nl: 'Vorm III (mufâ‘ala)', ar: 'مُفَاعَلَة' }],
  ['İf‘âl', { fr: 'Forme IV (if‘âl)', de: 'IV. Stamm (If‘âl)', nl: 'Vorm IV (if‘âl)', ar: 'إِفْعَال' }],
  ['Tefe‘‘ul', { fr: 'Forme V (tafa‘‘ul)', de: 'V. Stamm (Tafa‘‘ul)', nl: 'Vorm V (tafa‘‘ul)', ar: 'تَفَعُّل' }],
  ['İnfi‘âl', { fr: 'Forme VII (infi‘âl)', de: 'VII. Stamm (Infi‘âl)', nl: 'Vorm VII (infi‘âl)', ar: 'اِنْفِعَال' }],
  ['İfti‘âl', { fr: 'Forme VIII (ifti‘âl)', de: 'VIII. Stamm (Ifti‘âl)', nl: 'Vorm VIII (ifti‘âl)', ar: 'اِفْتِعَال' }],
  ['İf‘ilâl', { fr: 'Forme IX (if‘ilâl)', de: 'IX. Stamm (If‘ilâl)', nl: 'Vorm IX (if‘ilâl)', ar: 'اِفْعِلَال' }],
  ['İstif‘âl', { fr: 'Forme X (istif‘âl)', de: 'X. Stamm (Istif‘âl)', nl: 'Vorm X (istif‘âl)', ar: 'اِسْتِفْعَال' }],
  ['Ecvef', { fr: 'Concave (ajwaf)', de: 'Hohl (Ajwaf)', nl: 'Hol (ajwaf)', ar: 'أَجْوَف' }],
  ['Nâkıs', { fr: 'Défectif (nâqis)', de: 'Defektiv (Nâqis)', nl: 'Defectief (nâqis)', ar: 'نَاقِص' }],
  ['Misâl', { fr: 'Assimilé (mithâl)', de: 'Assimiliert (Mithâl)', nl: 'Geassimileerd (mithâl)', ar: 'مِثَال' }],
  ['Mehmûz', { fr: 'Hamzé (mahmûz)', de: 'Hamziert (Mahmûz)', nl: 'Met hamza (mahmûz)', ar: 'مَهْمُوز' }],
  ['Muzâaf', { fr: 'Géminé (mudâ‘af)', de: 'Geminiert (Mudâ‘af)', nl: 'Verdubbeld (mudâ‘af)', ar: 'مُضَاعَف' }],
  ['Masdar', { fr: 'Masdar', de: 'Masdar', nl: 'Masdar', ar: 'مَصْدَر' }],
  ['Meçhul', { fr: 'Passif', de: 'Passiv', nl: 'Passief', ar: 'مَبْنِيّ لِلْمَجْهُول' }],
  ['Mübâlağa', { fr: 'Intensif (mubâlagha)', de: 'Intensivform (Mubâlagha)', nl: 'Intensief (mubâlagha)', ar: 'مُبَالَغَة' }],
  ['Tasgîr', { fr: 'Diminutif (tasghîr)', de: 'Diminutiv (Tasghîr)', nl: 'Verkleinwoord (tasghîr)', ar: 'تَصْغِير' }],
  ['Nisbe', { fr: 'Relation (nisba)', de: 'Herkunftsname (Nisba)', nl: 'Herkomstnaam (nisba)', ar: 'نِسْبَة' }],
  ['Tesniye', { fr: 'Duel', de: 'Dual', nl: 'Tweevoud', ar: 'مُثَنَّى' }],
  ['Maksûr', { fr: 'Terminé par alif maqsûra', de: 'Auf Alif maqsûra (Maqsûr)', nl: 'Eindigend op alif maqsûra', ar: 'مَقْصُور' }],
  ['Udûl', { fr: 'Dérivation ‘udûl', de: 'Ableitung ‘Udûl', nl: 'Afleiding ‘udûl', ar: 'عُدُول' }],
  ['İ‘lâl', { fr: 'Mutation vocalique (i‘lâl)', de: 'Lautwandel (I‘lâl)', nl: 'Klankverandering (i‘lâl)', ar: 'إِعْلَال' }],
  ['Lakap', { fr: 'Surnom (laqab)', de: 'Beiname (Laqab)', nl: 'Bijnaam (laqab)', ar: 'لَقَب' }],
  ['tahdîs', { fr: 'transmission (tahdîth)', de: 'Überlieferung (Tahdîth)', nl: 'overlevering (tahdîth)', ar: 'تَحْدِيث' }],
  ['takdirî', { fr: 'virtuel', de: 'implizit', nl: 'impliciet', ar: 'تَقْدِيرِيّ' }],
  ['zâid', { fr: 'explétif', de: 'pleonastisch', nl: 'versterkend', ar: 'زَائِد' }],
  ['Lâm', { fr: 'Lâm', de: 'Lâm', nl: 'Lâm', ar: 'لَام' }],
  ['muzâf', { fr: 'annexé', de: 'annexiert', nl: 'geannexeerd', ar: 'مُضَاف' }],
];

/** Exact scholarly translations for the 5 kelimeler.json words not in fullWordLexicon.json. */
export const EXTRA_MORPHOLOGIES: Record<string, Quad> = {
  '2. bab (ضَرَبَ), جَذَبَ kelimesinin maklûb (harf değişimli) eş anlamlısı': {
    fr: '2e classe (ضَرَبَ), métathèse synonyme de جَذَبَ (tirer)',
    de: '2. Klasse (ضَرَبَ), Metathese-Synonym von جَذَبَ (ziehen)',
    nl: '2e klasse (ضَرَبَ), metathese-synoniem van جَذَبَ (trekken)',
    ar: 'الباب الثاني (ضَرَبَ)، مقلوب لغوي مرادف لـ «جَذَبَ»',
  },
  'Mecrûr (ب harf-i cerri ile)': {
    fr: 'Génitif (régi par la préposition ب)',
    de: 'Genitiv (nach der Präposition ب)',
    nl: 'Genitief (na het voorzetsel ب)',
    ar: 'مجرور بحرف الجر (الباء)',
  },
  'Mâtûf, mansûb': {
    fr: 'Coordonné, à l’accusatif',
    de: 'Beigeordnet, im Akkusativ',
    nl: 'Nevengeschikt, in de accusatief',
    ar: 'معطوف منصوب',
  },
  'İfti‘âl babı (اِقْتَصَدَ), mansûb': {
    fr: 'Forme VIII (اِقْتَصَدَ), à l’accusatif',
    de: 'VIII. Stamm (اِقْتَصَدَ), im Akkusativ',
    nl: 'Vorm VIII (اِقْتَصَدَ), in de accusatief',
    ar: 'باب الافتعال (اِقْتَصَدَ)، منصوب',
  },
  '4. bab (عَلِمَ) veya 3. bab (مَنَعَ) – dipnotta Münzirî ve Kāmus zaptı verilir': {
    fr: '4e classe (عَلِمَ) ou 3e classe (مَنَعَ) — vocalisation d’al-Mundhirî et du Qâmûs en note',
    de: '4. Klasse (عَلِمَ) oder 3. Klasse (مَنَعَ) — Vokalisation nach al-Mundhirî und al-Qâmûs in der Fußnote',
    nl: '4e klasse (عَلِمَ) of 3e klasse (مَنَعَ) — vocalisatie van al-Mundhirî en al-Qâmûs in de voetnoot',
    ar: 'الباب الرابع (عَلِمَ) أو الثالث (مَنَعَ) — ضُبط في الحاشية عن المنذري والقاموس',
  },
};

/** Exact translations for high-frequency / distinctive classical I'rab reason sentences. */
const SPECIAL_REASONS: Record<string, Quad> = {
  'Tef‘îl bâbından mâzî fiil; -nâ mef‘ûl zamiridir': {
    fr: 'Verbe accompli de forme II (taf‘îl) ; -nâ est le pronom complément d’objet (1re pers. plur.).',
    de: 'Perfektverb im II. Stamm (Taf‘îl); -nâ ist das Objektpronomen (1. Pers. Plur.).',
    nl: 'Voltooid werkwoord in vorm II (taf‘îl); -nâ is het lijdendvoorwerpspronomen (1e pers. mv.).',
    ar: 'فعل ماضٍ من باب التفعيل، والضمير «نا» مفعول به في محل نصب.',
  },
  'Tef‘îl bâbı mâzî fiil; -î mütekellim mef‘ûlüdür': {
    fr: 'Verbe accompli de forme II (taf‘îl) ; -î est le pronom complément de 1re pers. sing.',
    de: 'Perfektverb im II. Stamm (Taf‘îl); -î ist das Objektpronomen der 1. Pers. Sing.',
    nl: 'Voltooid werkwoord in vorm II (taf‘îl); -î is het voorwerpspronomen van de 1e pers. enk.',
    ar: 'فعل ماضٍ من باب التفعيل، وياء المتكلم ضمير متصل في محل نصب مفعول به.',
  },
  'Tef‘îl bâbı mâzî fiil; -hu mef‘ûldür': {
    fr: 'Verbe accompli de forme II (taf‘îl) ; -hu est le pronom complément d’objet (3e pers. masc.).',
    de: 'Perfektverb im II. Stamm (Taf‘îl); -hu ist das Objektpronomen (3. Pers. Mask.).',
    nl: 'Voltooid werkwoord in vorm II (taf‘îl); -hu is het voorwerpspronomen (3e pers. m.).',
    ar: 'فعل ماضٍ من باب التفعيل، والهاء ضمير متصل في محل نصب مفعول به.',
  },
  'İf‘âl bâbı mâzî fiil; şeyhe okuma/arz tahammül lafzıdır': {
    fr: 'Verbe accompli de forme IV (if‘âl) ; formule de transmission indiquant la récitation devant le cheikh (‘ard).',
    de: 'Perfektverb im IV. Stamm (If‘âl); Überlieferungsformel für den Vortrag vor dem Scheich (‘Ard).',
    nl: 'Voltooid werkwoord in vorm IV (if‘âl); overleveringsformule voor voordracht bij de sjeik (‘ard).',
    ar: 'فعل ماضٍ من باب الإفعال؛ من ألفاظ التحمل الدالة على القراءة والعرض على الشيخ.',
  },
  'Semâ yoluyla bizzat işitmeyi bildirir': {
    fr: 'Indique l’audition directe auprès du maître (samâ‘).',
    de: 'Bezeichnet das unmittelbare Hören beim Lehrer (Samâ‘).',
    nl: 'Duidt op rechtstreeks aanhoren bij de leraar (samâ‘).',
    ar: 'يدلّ على التحمل المباشر بطريق السماع من الشيخ.',
  },
  'Sonrasındaki ismi veya râviyi mecrûr kılar': {
    fr: 'Régit au génitif le nom ou le transmetteur qui suit.',
    de: 'Setzt das nachfolgende Nomen oder den Überlieferer in den Genitiv.',
    nl: 'Plaatst het volgende naamwoord of de overleveraar in de genitief.',
    ar: 'يجرّ الاسم أو الراوي الواقع بعده.',
  },
  'Hz. Peygamber anıldığında söylenen salavât-ı şerîfe sembolüdür': {
    fr: 'Formule de bénédiction et de salut prononcée à la mention du Prophète ﷺ.',
    de: 'Segens- und Grußformel bei der Erwähnung des Propheten ﷺ.',
    nl: 'Zegen- en vredeswens bij het noemen van de Profeet ﷺ.',
    ar: 'صيغة الصلاة والسلام على النبي ﷺ عند ذكره.',
  },
  'Yüce Yaratıcının has ismidir; bağlama göre harekelenir': {
    fr: 'Nom propre du Créateur Très-Haut ; sa flexion dépend de sa fonction syntaxique.',
    de: 'Eigenname des Erhabenen Schöpfers; die Kasusendung richtet sich nach dem Kontext.',
    nl: 'Eigennaam van de Verheven Schepper; de naamval hangt af van de zinsfunctie.',
    ar: 'اسم الجلالة عَلَمٌ على الذات الإلهية، يُعرَب بحسب موقعه في الجملة.',
  },
  'İki özel isim arasında yer aldığında hemzesiz yazılır ve önceki râvinin harekesine uyar': {
    fr: 'Entre deux noms propres, s’écrit sans alif (بن) et s’accorde au cas du transmetteur précédent.',
    de: 'Zwischen zwei Eigennamen ohne Alif (بن) geschrieben; richtet sich im Kasus nach dem vorangehenden Namen.',
    nl: 'Tussen twee eigennamen zonder alif (بن) geschreven; volgt de naamval van de voorafgaande naam.',
    ar: 'تُحذف همزته بين علمين ويتبع حركة الراوي قبله صفةً أو بدلاً.',
  },
  'Hadisin senedini merfû olarak Hz. Peygamber’e ulaştırdıklarını ifade eder': {
    fr: 'Indique que les transmetteurs font remonter la chaîne (marfû‘) jusqu’au Prophète ﷺ.',
    de: 'Zeigt an, dass die Überlieferer die Kette (marfû‘) bis zum Propheten ﷺ zurückführen.',
    nl: 'Geeft aan dat de overleveraars de keten (marfû‘) terugvoeren tot de Profeet ﷺ.',
    ar: 'يدلّ على أن الراويين يرفعان الإسناد إلى النبي ﷺ.',
  },
};

export function translateFormulaText(input: string, lang: TargetLang): string {
  if (!input || input === '—') return '—';
  let out = input;
  for (const [trPhrase, quad] of TERM_PHRASES) {
    if (out.includes(trPhrase)) {
      out = out.split(trPhrase).join(quad[lang]);
    }
  }
  // Clean up Arabic pronoun suffixes when in Arabic UI
  if (lang === 'ar') {
    out = out
      .replace(/\(-nâ\)/g, '(-نَا)')
      .replace(/\(-î\)/g, '(-ي)')
      .replace(/\(-hu\)/g, '(-هُ)')
      .replace(/\(-hi\)/g, '(-هِ)')
      .replace(/\(-hâ\)/g, '(-هَا)')
      .replace(/\(-humâ\)/g, '(-هُمَا)')
      .replace(/\(-hum\)/g, '(-هُمْ)')
      .replace(/\(-him\)/g, '(-هِمْ)')
      .replace(/\(-ka\)/g, '(-كَ)')
      .replace(/\(-kum\)/g, '(-كُمْ)')
      .replace(/\(-nî\)/g, '(-نِي)')
      .replace(/\(-tu\)/g, '(-تُ)')
      .replace(/\(-ta\)/g, '(-تَ)')
      .replace(/\(-tum\)/g, '(-تُمْ)')
      .replace(/\(-ya\)/g, '(-يَ)');
  }
  return out;
}

export function localizeGrammarReason(
  lang: TargetLang,
  opts: {
    rawReason?: string;
    partOfSpeech?: string;
    pattern?: string;
    tense?: string;
    role?: string;
    caseState?: string;
  }
): string {
  const { rawReason, partOfSpeech, pattern, tense, role, caseState } = opts;
  if (rawReason && SPECIAL_REASONS[rawReason]) {
    return SPECIAL_REASONS[rawReason][lang];
  }

  const posLoc = partOfSpeech ? (POS_TABLE[partOfSpeech]?.[lang] ?? translateFormulaText(partOfSpeech, lang)) : '';
  const patLoc = pattern && pattern !== '—' ? translateFormulaText(pattern, lang) : '';
  const tenseLoc = tense && tense !== '—' ? (TENSE_TABLE[tense]?.[lang] ?? translateFormulaText(tense, lang)) : '';
  const roleLoc = role ? translateFormulaText(role, lang) : '';
  const caseLoc = caseState && caseState !== '—' ? (CASE_TABLE[caseState]?.[lang] ?? translateFormulaText(caseState, lang)) : '';

  if (lang === 'fr') {
    const parts: string[] = [];
    if (posLoc) parts.push(posLoc);
    if (tenseLoc) parts.push(tenseLoc);
    if (patLoc) parts.push(`schème ${patLoc}`);
    const head = parts.join(' · ');
    const tailParts: string[] = [];
    if (roleLoc) tailParts.push(`fonction : ${roleLoc}`);
    if (caseLoc) tailParts.push(`cas/état : ${caseLoc}`);
    return [head, tailParts.join(' ; ')].filter(Boolean).join(' — ');
  }
  if (lang === 'de') {
    const parts: string[] = [];
    if (posLoc) parts.push(posLoc);
    if (tenseLoc) parts.push(tenseLoc);
    if (patLoc) parts.push(`Muster ${patLoc}`);
    const head = parts.join(' · ');
    const tailParts: string[] = [];
    if (roleLoc) tailParts.push(`Funktion: ${roleLoc}`);
    if (caseLoc) tailParts.push(`Kasus/Zustand: ${caseLoc}`);
    return [head, tailParts.join('; ')].filter(Boolean).join(' — ');
  }
  if (lang === 'nl') {
    const parts: string[] = [];
    if (posLoc) parts.push(posLoc);
    if (tenseLoc) parts.push(tenseLoc);
    if (patLoc) parts.push(`patroon ${patLoc}`);
    const head = parts.join(' · ');
    const tailParts: string[] = [];
    if (roleLoc) tailParts.push(`functie: ${roleLoc}`);
    if (caseLoc) tailParts.push(`naamval/staat: ${caseLoc}`);
    return [head, tailParts.join('; ')].filter(Boolean).join(' — ');
  }
  // Arabic
  const parts: string[] = [];
  if (posLoc) parts.push(posLoc);
  if (tenseLoc) parts.push(tenseLoc);
  if (patLoc) parts.push(`على وزن ${patLoc}`);
  const head = parts.join(' · ');
  const tailParts: string[] = [];
  if (roleLoc) tailParts.push(`الإعراب: ${roleLoc}`);
  if (caseLoc) tailParts.push(`الحالة: ${caseLoc}`);
  return [head, tailParts.join('؛ ')].filter(Boolean).join(' — ');
}

export function buildGrammarPackForLang(lang: TargetLang): GrammarPack {
  const pick = (table: Record<string, Quad>): Record<string, string> => {
    const res: Record<string, string> = {};
    for (const [k, v] of Object.entries(table)) {
      res[k] = v[lang];
    }
    return res;
  };
  return {
    pos: pick(POS_TABLE),
    tense: pick(TENSE_TABLE),
    number: pick(NUMBER_TABLE),
    gender: pick(GENDER_TABLE),
    caseState: pick(CASE_TABLE),
    patterns: {},
    roles: {},
    reasons: pick(SPECIAL_REASONS),
    morphologies: pick(EXTRA_MORPHOLOGIES),
    translateFormula: (input: string) => translateFormulaText(input, lang),
    localizeReason: (opts) => localizeGrammarReason(lang, opts),
  };
}
