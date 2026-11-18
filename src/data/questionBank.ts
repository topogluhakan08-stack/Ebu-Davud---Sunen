import hadislerRaw from './hadisler.json';
import ebuDavudRaw from './ebu-davud.json';
import sunenRaw from './sunen.json';
import { BABS, getBabById } from './babs';
import { GLOSSARY_TERMS } from './glossaryData';
import type {
  EbuDavudData,
  HadithItem,
  IsnadNode,
  SunenData,
} from '../types';
import { getLexiconKey } from '../utils/arabic';

export type QuestionCategory =
  | 'hadisler'
  | 'ebu_davud'
  | 'sunen'
  | 'sozluk'
  | 'bab_temalari';

export type QuestionGameType =
  | 'multiple_choice'
  | 'arabic_blank'
  | 'matching'
  | 'word_order'
  | 'isnad_order'
  | 'which_bab'
  | 'audio_listening'
  | 'true_false'
  | 'city_map';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface QuizBankItem {
  id: string;
  category: QuestionCategory;
  gameType: QuestionGameType;
  prompt: string;
  arabicPrompt?: string;
  babId?: number;
  hadithId?: number;
  // Standard MC / arabic_blank / which_bab / audio_listening
  options?: string[];
  correctIndex?: number;
  // arabic_blank extra fields
  blankSentenceAr?: string;
  // true_false
  correctBool?: boolean;
  // matching (4 pairs)
  pairs?: MatchingPair[];
  // word_order & isnad_order (ordered array from first to last)
  orderedItems?: string[];
  orderDirectionLabel?: string;
  // city_map
  targetCityId?: string;
  hint?: string;
  explanation: string;
  sourceRef: string;
  needs_review?: boolean;
}

const HADITHS = hadislerRaw as HadithItem[];
const EBU_DAVUD = ebuDavudRaw as EbuDavudData;
const SUNEN = sunenRaw as SunenData;

function truncate(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 1).trim()}…`;
}

function detPick<T>(arr: T[], startIdx: number, count: number): T[] {
  const uniquePool = Array.from(new Set(arr));
  const out: T[] = [];
  if (uniquePool.length === 0) return out;
  const used = new Set<number>();
  const step = uniquePool.length % 7 === 0 ? 3 : 7;
  let cursor = Math.abs(startIdx) % uniquePool.length;
  for (let i = 0; i < uniquePool.length && out.length < count; i++) {
    while (used.has(cursor)) {
      cursor = (cursor + 1) % uniquePool.length;
    }
    used.add(cursor);
    out.push(uniquePool[cursor]);
    cursor = (cursor + step) % uniquePool.length;
  }
  return out;
}

function stableOptionOrder(correct: string, distractors: string[], seed: number): {
  options: string[];
  correctIndex: number;
} {
  const uniqueDistractors = Array.from(new Set(distractors)).filter((d) => d && d !== correct);
  const items = [correct, ...uniqueDistractors.slice(0, 3)];
  const pos = Math.abs(seed) % items.length;
  const arranged = [...items.slice(1)];
  arranged.splice(pos, 0, correct);
  return {
    options: arranged,
    correctIndex: pos,
  };
}

// ---------------------------------------------------------------------------
// 1. HADİSLER KATEGORİSİ: 38 Hadisin her biri için 6 soru = 228 soru (>= 190)
// ---------------------------------------------------------------------------
function buildHadithQuestions(): QuizBankItem[] {
  const list: QuizBankItem[] = [];
  const allWordsPool = HADITHS.flatMap((h) => h.words);

  HADITHS.forEach((h, hIdx) => {
    const bab = getBabById(h.babId) ?? BABS[0];
    const sahabiNode = h.isnadChain.find((n) => n.layer === 'sahabi');
    const primaryWord = h.words[0];
    const secondaryWord = h.words[1] || h.words[0];

    // Q1: Which Bab OR Audio Listening (alternating so both types have rich coverage)
    if (hIdx % 2 === 0) {
      const otherBabs = detPick(
        BABS.filter((b) => b.id !== bab.id).map((b) => `${b.numberLabel}: ${b.titleTr}`),
        hIdx + 3,
        3
      );
      const correctBabOpt = `${bab.numberLabel}: ${bab.titleTr}`;
      const { options, correctIndex } = stableOptionOrder(correctBabOpt, otherBabs, h.id + 1);
      list.push({
        id: `had-${h.id}-bab`,
        category: 'hadisler',
        gameType: 'which_bab',
        babId: h.babId,
        hadithId: h.id,
        prompt: `Hadis #${h.id} Kitâbü’l-Edeb’in hangi babında yer alır? "${truncate(h.translationTr, 165)}"`,
        arabicPrompt: h.matnAr,
        options,
        correctIndex,
        hint: `PDF s. ${h.pdfPage} · Anahtar kavram: ${bab.keyArabicTerms[0]}`,
        explanation: `Hadis #${h.id} (PDF s. ${h.pdfPage}), ${bab.numberLabel} (${bab.titleTr}) babında yer alır.`,
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id} · ${bab.numberLabel}`,
        needs_review: h.needs_review,
      });
    } else {
      const otherTrs = detPick(
        HADITHS.filter((x) => x.id !== h.id).map((x) => truncate(x.translationTr, 130)),
        hIdx + 5,
        3
      );
      const correctTr = truncate(h.translationTr, 130);
      const { options, correctIndex } = stableOptionOrder(correctTr, otherTrs, h.id + 2);
      list.push({
        id: `had-${h.id}-audio`,
        category: 'hadisler',
        gameType: 'audio_listening',
        babId: h.babId,
        hadithId: h.id,
        prompt: `Arapça kaydı dinleyin ve Hadis #${h.id}’in doğru Türkçe tercümesini seçin:`,
        arabicPrompt: h.matnAr,
        options,
        correctIndex,
        hint: `${bab.numberLabel}: ${bab.titleTr}`,
        explanation: `Dinlediğiniz metin Hadis #${h.id}’tir: "${truncate(h.translationTr, 160)}"`,
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id}`,
        needs_review: h.needs_review,
      });
    }

    // Q2: Arabic Fill-in-the-Blank inside matnAr
    if (primaryWord) {
      const matnTokens = h.matnAr.split(/\s+/);
      const targetKey = getLexiconKey(primaryWord.arabic);
      const matchTok = matnTokens.find((t) => getLexiconKey(t) === targetKey);
      const blanked = matchTok
        ? h.matnAr.replace(matchTok, ' [ ــــــــ ] ')
        : `${truncate(h.matnAr, 90)} [ ــــــــ ]`;
      const otherArWords = detPick(
        allWordsPool
          .filter((w) => getLexiconKey(w.arabic) !== targetKey)
          .map((w) => w.arabic),
        hIdx * 3 + 2,
        3
      );
      const { options, correctIndex } = stableOptionOrder(primaryWord.arabic, otherArWords, h.id + 3);
      list.push({
        id: `had-${h.id}-blank`,
        category: 'hadisler',
        gameType: 'arabic_blank',
        babId: h.babId,
        hadithId: h.id,
        prompt: `Hadis #${h.id} Arapça metnindeki boşluğu ("${primaryWord.meaningTr}") doğru kelimeyle tamamlayın:`,
        blankSentenceAr: blanked,
        options,
        correctIndex,
        hint: `Kök: ${primaryWord.root} · Okunuş: [${primaryWord.transliteration}]`,
        explanation: `Boşluğa "${primaryWord.arabic}" (${primaryWord.meaningTr}) kelimesi gelir. Kök: ${primaryWord.root}.`,
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id}`,
        needs_review: primaryWord.needs_review || h.needs_review,
      });
    }

    // Q3: Word Meaning / Root Analysis Multiple Choice
    if (secondaryWord) {
      const otherMeanings = detPick(
        allWordsPool
          .filter((w) => w.meaningTr !== secondaryWord.meaningTr)
          .map((w) => w.meaningTr),
        hIdx * 5 + 1,
        3
      );
      const { options, correctIndex } = stableOptionOrder(
        secondaryWord.meaningTr,
        otherMeanings,
        h.id + 4
      );
      list.push({
        id: `had-${h.id}-word`,
        category: 'hadisler',
        gameType: 'multiple_choice',
        babId: h.babId,
        hadithId: h.id,
        prompt: `Hadis #${h.id} içinde geçen "${secondaryWord.arabic}" (${secondaryWord.transliteration}) kelimesinin Türkçe anlamı nedir?`,
        arabicPrompt: secondaryWord.arabic,
        options,
        correctIndex,
        hint: `Kök: ${secondaryWord.root} · Tür: ${secondaryWord.partOfSpeech}`,
        explanation: `${secondaryWord.arabic} (${secondaryWord.transliteration}), ${secondaryWord.root} kökünden gelir ve "${secondaryWord.meaningTr}" demektir (${secondaryWord.morphology}).`,
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id} Kelime Analizi`,
        needs_review: secondaryWord.needs_review,
      });
    }

    // Q4: Isnad Chain Ordering (Prophet ﷺ -> ... -> Ebû Dâvûd)
    const orderedChain = [...h.isnadChain]
      .reverse()
      .slice(0, 6)
      .map((n: IsnadNode) => `${n.nameTr}`);
    list.push({
      id: `had-${h.id}-isnad-order`,
      category: 'hadisler',
      gameType: 'isnad_order',
      babId: h.babId,
      hadithId: h.id,
      prompt: `Hadis #${h.id}’in râvîlerini Hz. Peygamber’den (ﷺ) Ebû Dâvûd’a doğru doğru sıraya dizin:`,
      orderedItems: orderedChain,
      orderDirectionLabel: 'Hz. Peygamber ﷺ (1. Sıra) → Musannif Ebû Dâvûd (Son Sıra)',
      hint: sahabiNode ? `Sahâbî tabakasında ${sahabiNode.nameTr} yer alır.` : undefined,
      explanation: `Hadis #${h.id} sened sırası: ${orderedChain.join(' → ')}.`,
      sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id} İsnadı`,
      needs_review: h.needs_review,
    });

    // Q5: Word Order (for concise Arabic sentences) OR Matching / Lesson MC
    const cleanMatnWords = h.matnAr
      .replace(/[«»"'().,،؛:؟!]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    if (cleanMatnWords.length >= 4 && cleanMatnWords.length <= 7) {
      list.push({
        id: `had-${h.id}-wordorder`,
        category: 'hadisler',
        gameType: 'word_order',
        babId: h.babId,
        hadithId: h.id,
        prompt: `Hadis #${h.id}’in Arapça metnini doğru sırayla dizin ("${truncate(h.translationTr, 95)}"):`,
        orderedItems: cleanMatnWords,
        orderDirectionLabel: 'Sağdan sola (1. kelimeden son kelimeye)',
        hint: `İlk kelime: ${cleanMatnWords[0]}`,
        explanation: `Doğru sıralama: ${h.matnAr}`,
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id}`,
        needs_review: h.needs_review,
      });
    } else if (h.words.length >= 4) {
      const sampleWords = h.words.slice(0, 4);
      list.push({
        id: `had-${h.id}-match`,
        category: 'hadisler',
        gameType: 'matching',
        babId: h.babId,
        hadithId: h.id,
        prompt: `Hadis #${h.id}’te geçen Arapça kelimeleri Türkçe anlamlarıyla eşleştirin:`,
        pairs: sampleWords.map((w, idx) => ({
          id: `p-${h.id}-${idx}`,
          left: w.arabic,
          right: w.meaningTr,
        })),
        hint: `Bu hadis ${bab.numberLabel} (${bab.titleTr}) içindedir.`,
        explanation: sampleWords.map((w) => `${w.arabic}: ${w.meaningTr}`).join(' · '),
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id}`,
      });
    } else {
      const lessonCorrect = h.lessonsTr[0] || bab.subtitleTr;
      const otherLessons = detPick(
        HADITHS.filter((x) => x.id !== h.id && x.lessonsTr.length > 0).map((x) => x.lessonsTr[0]),
        hIdx + 9,
        3
      );
      const { options, correctIndex } = stableOptionOrder(lessonCorrect, otherLessons, h.id + 5);
      list.push({
        id: `had-${h.id}-lesson`,
        category: 'hadisler',
        gameType: 'multiple_choice',
        babId: h.babId,
        hadithId: h.id,
        prompt: `Hadis #${h.id}’ten çıkarılan başlıca hikmet/hüküm aşağıdakilerden hangisidir?`,
        options,
        correctIndex,
        explanation: lessonCorrect,
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id}`,
      });
    }

    // Q6: True / False OR Narrator Multiple Choice
    if (hIdx % 2 === 0 && sahabiNode) {
      const otherSahabis = detPick(
        Array.from(
          new Set(
            HADITHS.map((x) => x.isnadChain.find((n) => n.layer === 'sahabi')?.nameTr).filter(
              (n): n is string => Boolean(n && n !== sahabiNode.nameTr)
            )
          )
        ),
        hIdx + 4,
        3
      );
      const { options, correctIndex } = stableOptionOrder(sahabiNode.nameTr, otherSahabis, h.id + 6);
      list.push({
        id: `had-${h.id}-sahabi`,
        category: 'hadisler',
        gameType: 'multiple_choice',
        babId: h.babId,
        hadithId: h.id,
        prompt: `Hadis #${h.id} ("${truncate(h.translationTr, 90)}") hangi sahâbî (veya ilk râvî) kanalıyla nakledilmiştir?`,
        options,
        correctIndex,
        hint: `Sened: ${truncate(h.isnadAr, 85)}`,
        explanation: `Hadis #${h.id}’in sahâbî tabakasında ${sahabiNode.nameTr} (${sahabiNode.nameAr}) yer almaktadır.`,
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id}`,
      });
    } else {
      const makeTrue = hIdx % 4 === 1;
      const shownPage = makeTrue ? h.pdfPage : h.pdfPage === 279 ? 264 : h.pdfPage + 3;
      const shownBab = makeTrue ? bab : BABS[(bab.id + 2) % BABS.length];
      list.push({
        id: `had-${h.id}-tf`,
        category: 'hadisler',
        gameType: 'true_false',
        babId: h.babId,
        hadithId: h.id,
        prompt: makeTrue
          ? `Doğru mu Yanlış mı? Hadis #${h.id} (${truncate(h.translationTr, 85)}), ${bab.numberLabel} (${bab.titleTr}) içinde ve PDF s. ${h.pdfPage}’te yer alır.`
          : `Doğru mu Yanlış mı? Hadis #${h.id}, ${shownBab.numberLabel} (${shownBab.titleTr}) içinde ve PDF s. ${shownPage}’te yer alır.`,
        correctBool: makeTrue,
        explanation: `Hadis #${h.id}, ${bab.numberLabel} (${bab.titleTr}) içinde ve PDF sayfa ${h.pdfPage}’te yer almaktadır.`,
        sourceRef: `PDF s. ${h.pdfPage} · Hadis #${h.id}`,
      });
    }
  });

  return list;
}

// ---------------------------------------------------------------------------
// 2. EBÛ DÂVÛD TDV KATEGORİSİ: >= 64 PDF-tabanlı soru (14 şehir haritası dahil)
// ---------------------------------------------------------------------------
function buildEbuDavudQuestions(): QuizBankItem[] {
  const items: QuizBankItem[] = [
    {
      id: 'ed-1-fullname',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd es-Sicistânî’nin tam künye ve nesebi aşağıdakilerden hangisidir?',
      options: [
        'Ebû Dâvûd Süleymân b. el-Eş‘as b. İshâk es-Sicistânî el-Ezdî',
        'Ebû Dâvûd Muhammed b. İsmâîl b. İbrâhîm el-Cu‘fî',
        'Ebû Dâvûd Ahmed b. Şuayb b. Alî el-Horâsânî',
        'Ebû Dâvûd Müslim b. el-Haccâc el-Kuşeyrî',
      ],
      correctIndex: 0,
      explanation: `TDV İslâm Ansiklopedisi’ne göre tam adı ${EBU_DAVUD.meta.fullNameTr}’dır.`,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, c. 10, s. 119',
    },
    {
      id: 'ed-2-birth-death',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’un doğum ve vefat tarihleri hangisidir?',
      options: [
        '202 (817-18) doğum — 16 Şevval 275 (21 Şubat 889) vefat',
        '194 (810) doğum — 256 (870) vefat',
        '209 (824) doğum — 279 (892) vefat',
        '215 (830) doğum — 303 (915) vefat',
      ],
      correctIndex: 0,
      explanation: '202 (817-18) yılında Sicistan’da doğdu (203 rivayeti de vardır); 16 Şevval 275’te (21 Şubat 889) Basra’da vefat etti.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, c. 10, s. 119',
    },
    {
      id: 'ed-3-sicistan',
      category: 'ebu_davud',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? TDV maddesine göre Sicistan, Basra yakınlarındaki küçük bir köyün adıdır.',
      correctBool: false,
      explanation: EBU_DAVUD.biography.sijistanNote,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-4-nisbe',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ailesi aslen Yemen’in Ezd kabilesine dayanan Ebû Dâvûd, “Sicistanlı” anlamında hangi ikinci nisbeyle de anılır?',
      options: ['es-Siczî', 'el-Kûfî', 'el-Mısrî', 'et-Tarsûsî'],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.lineageNisbe,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-5-siffin',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’un büyük dedesi İmrân hakkında TDV maddesinde hangi tarihî rivayet nakledilir?',
      options: [
        'Sıffîn’de Hz. Ali’nin yanında yer aldığı ve bu savaşta öldüğü',
        'Mekke’nin fethinde sancaktarlık yaptığı',
        'Basra’nın ilk kadısı olarak tayin edildiği',
        'Tarsus kalesinin inşasına katıldığı',
      ],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.ancestry,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-6-age18',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd kaç yaşında ilim yolculuğuna çıkarak ilk olarak Bağdat’a, ardından Basra’ya gitmiştir?',
      options: ['18 yaşında', '12 yaşında', '25 yaşında', '30 yaşında'],
      correctIndex: 0,
      explanation: 'Hadis bilgisini artırmak maksadıyla on sekiz yaşında seyahate çıkarak önce Bağdat’a, daha sonra Basra’ya gitti.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-7-basra-teacher',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Basra’da en çok faydalandığı hocası kabul edilen hadis hâfızı kimdir?',
      options: [
        'Müslim b. İbrâhim el-Ezdî',
        'Hişâm b. Ammâr',
        'Hayve b. Şüreyh',
        'Ebû Tevbe el-Halebî',
      ],
      correctIndex: 0,
      explanation: 'Basra’da en çok faydalandığı hocası kabul edilen Müslim b. İbrâhim el-Ezdî başta olmak üzere Tebûzekî, Ârim el-Basrî ve Ebü’l-Velîd et-Tayâlisî’den hadis okudu.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-8-teachers-count',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'İbn Hacer el-Askalânî’ye göre Ebû Dâvûd’un yaklaşık kaç hocası vardır?',
      options: ['300 kadar', '75 kadar', '1.200 kadar', '50 kadar'],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.teachersCountNote,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-9-gassani',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’un hocalarını “Tesmiyetü şüyûḫi Ebî Dâvûd” adlı risâlesinde bir araya getiren âlim kimdir?',
      options: [
        'Ebû Ali el-Gassânî',
        'Ebû Ubeyd el-Âcurrî',
        'Hattâbî',
        'İbn Mende',
      ],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.teachersListNote,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-10-son-abdullah',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Sonraları “İbn Ebû Dâvûd” adıyla tanınan oğlu Abdullah kaç yılında doğmuştur?',
      options: ['230 (844-45)', '202 (817-18)', '255 (869)', '215 (830)'],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.sonAbdullah,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-11-brother',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd ile oğlu Abdullah’ın ilim seyahatlerinin bir kısmında onlara arkadaşlık eden kardeşi kimdir?',
      options: ['Muhammed b. Eş‘as', 'Ali b. Eş‘as', 'İshâk b. Eş‘as', 'Bişr b. Eş‘as'],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.brotherMuhammed,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-12-three-masters',
      category: 'ebu_davud',
      gameType: 'matching',
      prompt: 'Ebû Dâvûd’un üç büyük hadis üstadı hakkındaki değerlendirmelerini eşleştirin:',
      pairs: [
        { id: 'tm1', left: 'Yahyâ b. Maîn', right: 'En çok hadis toplayıp ezberleyen' },
        { id: 'tm2', left: 'Ahmed b. Hanbel', right: 'Hadislerin fıkhını en iyi anlayan' },
        { id: 'tm3', left: 'Ali b. Medînî', right: 'Hadislerdeki gizli kusurları (illet) en iyi bilen' },
        { id: 'tm4', left: 'Müslim b. İbrâhim el-Ezdî', right: 'Basra’da en çok faydalandığı hocası' },
      ],
      explanation: 'Ebû Dâvûd: Yahyâ b. Maîn’i hıfzda, Ahmed b. Hanbel’i fıkıhta, Ali b. Medînî’yi ilelde önde görmüştür.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-13-mesail',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’un Bağdat’ta Ahmed b. Hanbel’den öğrendiği fıkıh ve usûl cevaplarını derlediği eserin adı nedir?',
      options: [
        'Mesâʾilü’l-İmâm Aḥmed b. Ḥanbel',
        'el-Merâsîl',
        'Kitâbü’z-Zühd',
        'Tesmiyetü’l-iḫve',
      ],
      correctIndex: 0,
      explanation: 'Ahmed b. Hanbel’in ilim meclislerinden öğrendiklerini fıkıh bablarına göre Mesâʾilü’l-İmâm Aḥmed b. Ḥanbel adıyla derledi.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-14-age40',
      category: 'ebu_davud',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ahmed b. Hanbel’in es-Sünen’i inceleyip beğendiği rivayeti doğru kabul edilirse, Ebû Dâvûd es-Sünen’i kırk yaşına gelmeden kaleme almış demektir.',
      correctBool: true,
      explanation: 'Ahmed b. Hanbel 241/855’te vefat ettiğinden, es-Sünen’i inceleyip beğenmiş olması eserin 40 yaş öncesinde yazıldığını gösterir.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-15-tarsus-20',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd tahsil hayatı boyunca muhtelif şehirlerde kaldı; özellikle Tarsus’ta ne kadar süre ikamet etti?',
      options: ['Yirmi yıl', 'İki yıl', 'Beş yıl', 'Kırk yıl'],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.tarsusAndLaterYears,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-16-zanj-muvaffak',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: '868–883 yılları arasındaki Zenc hareketi yüzünden harap olan Basra’yı yeniden ilimle canlandırmak üzere Ebû Dâvûd’u Basra’ya yerleşmeye davet eden kimdir?',
      options: [
        'Halife Mu‘temid-Alellah’ın kardeşi Emîr Ebû Ahmed el-Muvaffak',
        'Abbâsî Halifesi Me’mûn',
        'Tarsus Valisi Ahmed b. Tolun',
        'Sicistan Emîri Ya‘kūb b. Leys',
      ],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.basraSettlementAndZanj,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119-120',
    },
    {
      id: 'ed-17-private-lesson',
      category: 'ebu_davud',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ebû Dâvûd, Emîr el-Muvaffak’ın çocuklarına özel olarak es-Sünen okutma teklifini hemen kabul etmiştir.',
      correctBool: false,
      explanation: EBU_DAVUD.fiqhAndMethodology.emirMuvaffakStoryTr,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-18-burial',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Basra’da vefat eden Ebû Dâvûd kimin kabrinin yanına defnedilmiştir?',
      options: [
        'Süfyân es-Sevrî',
        'Hasan-ı Basrî',
        'Ahmed b. Hanbel',
        'Şu‘be b. Haccâc',
      ],
      correctIndex: 0,
      explanation: EBU_DAVUD.biography.deathAndBurial,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-19-students-match',
      category: 'ebu_davud',
      gameType: 'matching',
      prompt: 'Ebû Dâvûd’un çevresi ve talebelerini rolleriyle eşleştirin:',
      pairs: [
        { id: 'st1', left: 'el-Lü’lüî & İbn Dâse', right: 'Basra’da es-Sünen’i en meşhur rivayet edenler' },
        { id: 'st2', left: 'Ebû Îsâ et-Tirmizî', right: 'Kütüb-i Sitte müelliflerinden olan talebesi' },
        { id: 'st3', left: 'Ebû Ubeyd el-Âcurrî', right: 'Cerh ve ta‘dîl sorularını sorup Suâlât’ı derleyen' },
        { id: 'st4', left: 'Abdullah (İbn Ebû Dâvûd)', right: 'Seyahatlerine katılan hâfız oğlu' },
      ],
      explanation: 'Tirmizî, Âcurrî, Lü’lüî, İbn Dâse ve oğlu Abdullah başlıca talebelerindendir.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-20-critique-method',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd râvîleri tenkit ederken hangi ilkeyi benimsemiştir?',
      options: [
        'Genel suçlamalara itibar etmez, hangi sebeplerle cerh edildiklerinin açıkça söylenmesini isterdi',
        'Akrabalarını ve yakınlarını tenkitten daima muaf tutardı',
        'Buhârî’nin hadis aldığı râvîleri asla eleştirmezdi',
        'Sadece meçhul râvîleri tenkit eder, yalan isnadında bulunmazdı',
      ],
      correctIndex: 0,
      explanation: 'Kesin bilgi sahibi olmadığı kimseler hakkında konuşmaz, cerh sebeplerinin açıkça söylenmesini ister ve yakını bile olsa (oğlu Abdullah’a dair rivayet gibi) müsamaha göstermezdi.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-21-yakub-kasib',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’un, değersiz bulduğunu göstermek üzere rivayetlerinin yazılı olduğu kâğıtlarla kitaplarını kapladığı râvî (Ṣaḥîḥ-i Buḫârî’de 2 rivayeti olan) kimdir?',
      options: [
        'Ya‘kūb b. Humeyd b. Kâsib',
        'Müslim b. İbrâhim el-Ezdî',
        'Kuteybe b. Saîd',
        'Hişâm b. Ammâr',
      ],
      correctIndex: 0,
      explanation: 'Zehebî’nin Mîzânü’l-i‘tidâl’de (IV, 451) aktardığına göre Ebû Dâvûd, Ya‘kūb b. Humeyd b. Kâsib’in kâğıtlarıyla kitaplarını ciltletmiştir.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-22-numbers',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd hayatı boyunca yazdığı 500.000 hadisten kaçını es-Sünen’e seçmiştir; ayrıca Muhammed b. Mahled’e göre kaç hadisi rahatlıkla müzakere edebilirdi?',
      options: [
        '4.800 hadis seçti · 100.000 hadis müzakere edebilirdi',
        '7.275 hadis seçti · 200.000 hadis müzakere edebilirdi',
        '4.000 hadis seçti · 50.000 hadis müzakere edebilirdi',
        '5.274 hadis seçti · 300.000 hadis müzakere edebilirdi',
      ],
      correctIndex: 0,
      explanation: '500.000 hadisten 4.800 rivayeti es-Sünen’e seçmiş; Muhammed b. Mahled’e göre 100.000 hadisi rahatlıkla müzakere edebilirdi.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-23-ibn-mende',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Hadislerin sağlamını sakatından dört muhaddisin ayırabildiğini söyleyen Ebû Abdullah İbn Mende hangi sırayı vermiştir?',
      options: [
        'Buhârî, Müslim, Ebû Dâvûd ve Nesâî',
        'Mâlik, Şâfiî, Ahmed b. Hanbel ve Tirmizî',
        'Ebû Dâvûd, İbn Mâce, Dârimî ve Hâkim',
        'Sevrî, Evzâî, Leys ve Şu‘be',
      ],
      correctIndex: 0,
      explanation: 'İbn Mende sırasıyla Buhârî, Müslim, Ebû Dâvûd ve Nesâî’nin adını verirdi.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-24-praises-match',
      category: 'ebu_davud',
      gameType: 'matching',
      prompt: 'Âlimlerin Ebû Dâvûd hakkındaki övgü sözlerini sahipleriyle eşleştirin:',
      pairs: [
        { id: 'pr1', left: 'Mûsâ b. Hârûn', right: 'Onun hadis için yaratıldığını söyledi' },
        { id: 'pr2', left: 'Hâkim en-Nîsâbûrî', right: 'Asrın hadis imamı olarak niteledi' },
        { id: 'pr3', left: 'Ebû Bekir el-Hallâl', right: 'Hadisin sıhhat ve kaynağında en yetkili otorite dedi' },
        { id: 'pr4', left: 'Muhammed b. Mahled', right: '100.000 hadisi müzakere edebileceğini belirtti' },
      ],
      explanation: 'TDV maddesinde sekiz ayrı muhaddisin Ebû Dâvûd hakkındaki övgüleri zikredilir.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-25-fiqh-madhhab',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Herhangi bir mezhebi taklit etmediği halde Sübkî onu hangi mezhep fukahası arasında saymış, İbn Ebû Ya‘lâ ve Şîrâzî ise hangi mezhebe dâhil etmiştir?',
      options: [
        'Sübkî Şâfiî; İbn Ebû Ya‘lâ ve Şîrâzî Hanbelî fukahası arasında saymıştır',
        'Sübkî Hanefî; Şîrâzî Mâlikî fukahası arasında saymıştır',
        'Her ikisi de Zâhirî mezhebinden saymıştır',
        'Yalnızca Mâlikî fakihi olarak kabul etmişlerdir',
      ],
      correctIndex: 0,
      explanation: EBU_DAVUD.fiqhAndMethodology.fiqhAffiliationTr,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    {
      id: 'ed-26-selefiyye',
      category: 'ebu_davud',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ebû Dâvûd Kur’ân’dan sonra sünneti ön planda tutma konusunda Selefiyye metodunu benimsemiş ve zâhidâne hayatında Ahmed b. Hanbel’i örnek almıştır.',
      correctBool: true,
      explanation: EBU_DAVUD.fiqhAndMethodology.selefiyyeAndZuhdTr,
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    },
    // Sayings & 4 Hadiths (7 questions)
    ...EBU_DAVUD.sayingsAndFourHadiths.map((q, idx): QuizBankItem => {
      if (idx % 2 === 0) {
        const distractors = detPick(
          EBU_DAVUD.sayingsAndFourHadiths
            .filter((x) => x.id !== q.id)
            .map((x) => x.textTr),
          idx + 2,
          3
        );
        const { options, correctIndex } = stableOptionOrder(q.textTr, distractors, idx + 40);
        return {
          id: `ed-saying-${q.id}`,
          category: 'ebu_davud',
          gameType: 'audio_listening',
          prompt: `Ebû Dâvûd maddesinde aktarılan bu Arapça söz/hadisin (${q.titleTr}) Türkçe karşılığı nedir?`,
          arabicPrompt: q.textAr,
          options,
          correctIndex,
          explanation: `${q.titleTr}: "${q.textAr}" → "${q.textTr}".`,
          sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
        };
      }
      const words = q.textAr.replace(/[.,،]/g, '').split(/\s+/).filter(Boolean);
      if (words.length <= 8) {
        return {
          id: `ed-saying-order-${q.id}`,
          category: 'ebu_davud',
          gameType: 'word_order',
          prompt: `Ebû Dâvûd’a nispet edilen/seçtiği şu ifadeyi doğru sıraya dizin: "${q.textTr}"`,
          orderedItems: words,
          orderDirectionLabel: 'Sağdan sola doğru sıralayın',
          explanation: `${q.titleTr}: ${q.textAr} (${q.textTr})`,
          sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
        };
      }
      return {
        id: `ed-saying-tf-${q.id}`,
        category: 'ebu_davud',
        gameType: 'true_false',
        prompt: `Doğru mu Yanlış mı? "${q.textTr}" hadisi, Ebû Dâvûd’un İslâm’ı anlamak için yeterli gördüğü dört temel hadisten biridir.`,
        correctBool: q.kind === 'four_hadiths',
        explanation: `${q.titleTr}: "${q.textTr}".`,
        sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
      };
    }),
    // All 14 Historical Cities -> Interactive City Map Questions!
    ...EBU_DAVUD.cities.map((city, idx): QuizBankItem => ({
      id: `ed-citymap-${city.id}`,
      category: 'ebu_davud',
      gameType: 'city_map',
      targetCityId: city.id,
      prompt: `Haritada işaretli 14 şehir arasından bulun: (${idx + 1}/14) ${city.roleTr}. Dönem/Olay: ${city.yearText} — ${city.teachersOrEvents[0]}.`,
      hint: `Bölge: ${city.region} · Arapça adı: ${city.nameAr}`,
      explanation: `${city.nameTr} (${city.nameAr}): ${city.detailsTr}`,
      sourceRef: 'TDV · Ebû Dâvûd Seyahatleri, s. 119-120',
    })),
    // Works & Editions & Studies (18 questions)
    {
      id: 'ed-work-merasil',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’un 544 mürsel hadisi ihtiva eden ve sahasının ilk orijinal eseri kabul edilen kitabı hangisidir?',
      options: ['el-Merâsîl', 'Kitâbü’z-Zühd', 'Kitâbü’l-Ba‘s ve’n-nüşûr', 'Kitâbü’l-Kader'],
      correctIndex: 0,
      explanation: 'el-Merâsîl, 544 mürsel hadisi ihtiva eden sahasının ilk ve orijinal eseridir (ilk defa Kahire 1310’da basılmıştır).',
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 120',
    },
    {
      id: 'ed-work-acurri',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'İbn Hacer’in Tehẕîbü’t-Tehẕîb’de çok faydalandığı, talebesi Ebû Ubeyd el-Âcurrî tarafından derlenen beş cüzlük cerh-ta‘dîl eseri hangisidir?',
      options: [
        'İcâbâtühû ‘alâ su’âlâti Ebî ‘Ubeyd el-Âcurrî',
        'Tesmiyetü iḫve elleẕîne ruviye ‘anhümü’l-ḥadîs̱',
        'Risâletü Ebî Dâvûd ilâ ehli Mekke',
        'Delâilü’n-nübüvve',
      ],
      correctIndex: 0,
      explanation: '3. cüzü Köprülü Ktp. nr. 292’de (nşr. Medine 1403), 4. ve 5. cüzleri Bibliothèque Nationale nr. 2085’tedir; 1-2. cüzler kayıptır.',
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 120-121',
    },
    {
      id: 'ed-work-mekke-ms',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Risâletü Ebî Dâvûd ilâ ehli Mekke’nin günümüze ulaşan yegâne yazma nüshası nerededir?',
      options: [
        'Dârü’l-kütübi’z-Zâhiriyye (Hadis, nr. 348, vr. 188a-191b)',
        'Fas Karaviyyîn Kütüphanesi (nr. 80/133)',
        'Süleymaniye Kütüphanesi (Lâleli, nr. 2089)',
        'Bibliothèque Nationale (nr. 2085)',
      ],
      correctIndex: 0,
      explanation: 'Yegâne nüshası Dârü’l-kütübi’z-Zâhiriyye Hadis nr. 348’dedir; ilk defa Zâhid Kevserî (Kahire 1369), sonra M. Lutfî es-Sabbâğ (Beyrut 1394, 1405) neşretmiştir.',
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 121',
    },
    {
      id: 'ed-work-zuhd',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’un Kitâbü’z-Zühd adlı eserinin Mağrib hattıyla yazılmış bir nüshası hangi kütüphanede bulunmaktadır?',
      options: [
        'Fas Karaviyyîn Kütüphanesi (nr. 80/133)',
        'Köprülü Kütüphanesi (nr. 292)',
        'Dârü’l-kütübi’l-Mısriyye (nr. 286)',
        'Süleymaniye Hekimoğlu (nr. 200)',
      ],
      correctIndex: 0,
      explanation: 'Mağrib hattıyla yazılmış bir nüshası Fas’ta Karaviyyîn Kütüphanesi’ndedir (nr. 80/133).',
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 121',
    },
    {
      id: 'ed-work-bas',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ölümden sonra diriliş hakkındaki rivayetleri toplayan Kitâbü’l-Ba‘s̱ ve’n-nüşûr’u 1407/1987’de Beyrut’ta el-Ba‘s̱ adıyla kim neşretmiştir?',
      options: [
        'Ebû Hâcer M. Saîd b. Besyûnî Zağlûl',
        'Muhammed Behcet el-Baytâr',
        'Zâhid Kevserî',
        'Muhammed Avvâme',
      ],
      correctIndex: 0,
      explanation: 'Brockelmann Dımaşk’ta nüshasının bulunduğunu bildirmiş; Ebû Hâcer M. Saîd b. Besyûnî Zağlûl el-Ba‘s̱ adıyla (Beyrut 1407/1987) neşretmiştir.',
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 121',
    },
    {
      id: 'ed-work-ihve',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Kendisinden hadis rivayet edilen kardeşleri konu edinen ve Zâhiriyye Mecmua nr. 129’da bulunan risâle hangisidir?',
      options: [
        'Tesmiyetü iḫve elleẕîne ruviye ‘anhümü’l-ḥadîs̱',
        'Aḫbârü’l-ḫavâric',
        'et-Teferrüd fi’s-sünen',
        'Nâsiḫu’l-Ḳurʾân ve mensûḫuh',
      ],
      correctIndex: 0,
      explanation: 'Tesmiyetü iḫve (Tesmiyetü’l-iḫve min ehli’l-emṣâr) Zâhiriyye Mecmua nr. 129, vr. 216a-223b’dedir.',
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 121',
    },
    {
      id: 'ed-work-kader',
      category: 'ebu_davud',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ebû Dâvûd’un "er-Red ‘ale’l-Kaderiyye" adıyla da anılan Kitâbü’l-Kader eserinin günümüze eksiksiz üç yazma nüshası ulaşmıştır.',
      correctBool: false,
      explanation: 'TDV maddesine göre Kitâbü’l-Kader’in günümüze gelip gelmediği bilinmemektedir.',
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 121',
    },
    {
      id: 'ed-work-match',
      category: 'ebu_davud',
      gameType: 'matching',
      prompt: 'Ebû Dâvûd’un eserleri ile konularını/nüsha bilgilerini eşleştirin:',
      pairs: [
        { id: 'wk1', left: 'el-Merâsîl', right: '544 mürsel hadis · ilk ve orijinal eser' },
        { id: 'wk2', left: 'Mesâilü’l-İmâm Ahmed', right: 'Reşîd Rızâ takdimli Kahire 1353 baskısı' },
        { id: 'wk3', left: 'Kitâbü’z-Zühd', right: 'Fas Karaviyyîn Ktp. Mağrib hatlı nüsha' },
        { id: 'wk4', left: 'Risâle ilâ ehli Mekke', right: 'es-Sünen’i tanıtan usul mektubu' },
      ],
      explanation: 'TDV Ebû Dâvûd maddesinde 9 ana eser ve 10 diğer eser tek tek sıralanır.',
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 120-121',
    },
    {
      id: 'ed-other-works',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Aşağıdakilerden hangisi TDV maddesinde Ebû Dâvûd’a nispet edilen diğer eserler arasında yer ALMAZ?',
      options: [
        'Ṣaḥîḥu’l-Câmi‘i’ṣ-Ṣaġīr',
        'Nâsiḫu’l-Ḳurʾân ve mensûḫuh',
        'Delâʾilü’n-nübüvve & Feżâʾilü’l-enṣâr',
        'Aḫbârü’l-ḫavâric & el-Âdâbü’ş-şerʿiyye',
      ],
      correctIndex: 0,
      explanation: `Diğer eserleri: ${EBU_DAVUD.works.otherWorks.join(', ')}.`,
      sourceRef: 'TDV · Ebû Dâvûd Eserleri, s. 121',
    },
    {
      id: 'ed-study-celludi',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd hakkında "Aḫbâru Ebî Dâvûd" adlı çalışmayı kaleme alan erken dönem müellifi kimdir?',
      options: [
        'Ebû Ahmed el-Cellûdî (ö. 302/914-15)',
        'Takıyyüddin el-Mezâhirî en-Nedvî',
        'Muhammed Lutfî es-Sabbâğ',
        'Muavvad b. Bilâl el-Avfî',
      ],
      correctIndex: 0,
      explanation: 'Ebû Ahmed el-Cellûdî (ö. 302/914-15) Aḫbâru Ebî Dâvûd’u yazmıştır.',
      sourceRef: 'TDV · Ebû Dâvûd Hakkında Yapılan Çalışmalar, s. 121',
    },
    {
      id: 'ed-study-sabran',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Muhammed Sabrân Efendi el-Endonîsî’nin 1396/1976’da Mekke Ümmülkurâ Üniversitesi’nde basılan yüksek lisans tezi hangi konudadır?',
      options: [
        'Sünen-i Ebî Dâvûd’daki metrûk ve meçhul râvîler ile rivayetleri',
        'Ebû Dâvûd’un Sicistan yıllarındaki şahsî vakıfları',
        'Kitâbü’l-Edeb’deki nahiv incelikleri',
        'Zenc isyanının Basra ekonomisine etkileri',
      ],
      correctIndex: 0,
      explanation: EBU_DAVUD.studiesAboutHim[1].title,
      sourceRef: 'TDV · Ebû Dâvûd Hakkında Yapılan Çalışmalar, s. 121',
    },
    {
      id: 'ed-study-match',
      category: 'ebu_davud',
      gameType: 'matching',
      prompt: 'Ebû Dâvûd hakkında yazılan modern ve klasik çalışmaları müellifleriyle eşleştirin:',
      pairs: [
        { id: 'sm1', left: 'Ebû Ahmed el-Cellûdî', right: 'Aḫbâru Ebî Dâvûd' },
        { id: 'sm2', left: 'Takıyyüddin en-Nedvî', right: 'Ebû Dâvûd el-imâm el-ḥâfıẓ el-faḳīh (1978)' },
        { id: 'sm3', left: 'Muavvad b. Bilâl el-Avfî', right: 'Ebû Dâvûd es-Sicistânî ve es̱eruhû fî ‘ilmi’l-ḥadîs̱' },
        { id: 'sm4', left: 'Muhammed Lutfî es-Sabbâğ', right: 'Ebû Dâvûd: Ḥayâtühû ve Sünenüh (1405/1985)' },
      ],
      explanation: 'TDV Ebû Dâvûd maddesinin sonunda 5 müstakil çalışma anılır.',
      sourceRef: 'TDV · Ebû Dâvûd, c. 10, s. 121',
    },
    {
      id: 'ed-author-tdv',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'TDV İslâm Ansiklopedisi’ndeki hem "Ebû Dâvûd es-Sicistânî" (1994, c. 10) hem de "es-Sünen" (2010, c. 38) maddelerinin müellifi kimdir?',
      options: ['M. Yaşar Kandemir', 'İsmail Lütfi Çakan', 'Hayreddin Karaman', 'Talat Koçyiğit'],
      correctIndex: 0,
      explanation: `Her iki madde de Prof. Dr. ${EBU_DAVUD.meta.author} tarafından kaleme alınmıştır.`,
      sourceRef: 'TDV · İslâm Ansiklopedisi c. 10 & c. 38',
    },
    {
      id: 'ed-tf-kufe221',
      category: 'ebu_davud',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ebû Dâvûd 221 (836) yılında Kûfe’de Hasan b. Rebî‘ el-Becelî ve Ahmed b. Yûnus el-Yerbûî’den, 222 (837)’de ise Humus’ta Hayve b. Şüreyh ve Yezîd b. Abdürabbih’ten hadis aldı.',
      correctBool: true,
      explanation: 'TDV biyografisinde Kûfe (221/836) ve Humus (222/837) tarihleri bu hocalarla birlikte açıkça zikredilir.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-tf-horasan-belh',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'TDV maddesine göre Horasan’da İshak b. Râhûye’den ders alan Ebû Dâvûd, Belh’te ve Mısır’da kimlerden hadis tahsil etmiştir?',
      options: [
        'Belh’te Kuteybe b. Saîd’den · Mısır’da Ahmed b. Sâlih’ten',
        'Belh’te Hişâm b. Ammâr’dan · Mısır’da en-Nüfeylî’den',
        'Belh’te Ebû Tevbe’den · Mısır’da Ka‘nebî’den',
        'Belh’te Tebûzekî’den · Mısır’da Süleyman b. Harb’den',
      ],
      correctIndex: 0,
      explanation: 'Horasan’da İshak b. Râhûye, Belh’te Kuteybe b. Saîd, Mısır’da Ahmed b. Sâlih, Mekke’de Ka‘nebî ve Süleyman b. Harb’den ders almıştır.',
      sourceRef: 'TDV · Ebû Dâvûd es-Sicistânî, s. 119',
    },
    {
      id: 'ed-timeline-order',
      category: 'ebu_davud',
      gameType: 'isnad_order',
      prompt: 'Ebû Dâvûd’un hayatındaki dönüm noktalarını kronolojik sıraya dizin (en erkenden vefatına):',
      orderedItems: [
        '202/817-18: Sicistan’da doğumu ve ilk tahsili',
        '18 yaş (~220/835): Bağdat ve Basra’ya seyahat başlangıcı',
        '221–222 / 836–837: Kûfe ve Humus hadis meclisleri',
        '230 / 844-45: Oğlu Abdullah’ın doğumu',
        'Tarsus’ta 20 yıl ikamet ve Zenc sonrası Basra’ya yerleşme',
        '16 Şevval 275 / 21 Şubat 889: Basra’da vefatı',
      ],
      orderDirectionLabel: 'Kronolojik Sıra (202/817 -> 275/889)',
      explanation: 'Sicistan doğumu -> 18 yaşında Bağdat/Basra -> Kûfe 221 -> Humus 222 -> Oğlu Abdullah 230 -> Tarsus/Basra -> 275 vefat.',
      sourceRef: 'TDV · Ebû Dâvûd Biyografisi, s. 119-120',
    },
    {
      id: 'ed-bib-zehebi',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Oğlu Abdullah hakkında yalancı dediğine ve Ya‘kūb b. Humeyd’in kâğıtlarıyla kitap ciltlettiğine dair rivayetler hangi klasik rical kaynağında zikredilmiştir?',
      options: [
        'Zehebî, Mîzânü’l-i‘tidâl',
        'Kettânî, er-Risâletü’l-müstetrafe',
        'Brockelmann, GAL',
        'İbn Ebû Ya‘lâ, Tabakātü’l-Hanâbile',
      ],
      correctIndex: 0,
      explanation: 'Her iki rivayet TDV maddesinde Zehebî’nin Mîzânü’l-i‘tidâl’ine (II, 433; IV, 451) atıfla zikredilir.',
      sourceRef: 'TDV · Ebû Dâvûd, s. 120',
    },
    {
      id: 'ed-praises-two',
      category: 'ebu_davud',
      gameType: 'multiple_choice',
      prompt: 'Târîḫu Herât müellifi olup Ebû Dâvûd’u ince kusurlara kadar rivayetleri bilen müttaki bir muhaddis olarak tanıtan âlim kimdir?',
      options: ['İbn Yâsîn', 'İbrâhim b. Uvreme el-İsfahânî', 'Ebû Bekir b. Sadaka', 'İbn Hibbân'],
      correctIndex: 0,
      explanation: 'Târîḫu Herât müellifi İbn Yâsîn onu ince kusurlara varıncaya kadar rivayetleri çok iyi bilen büyük bir muhaddis olarak tanıtmıştır.',
      sourceRef: 'TDV · Ebû Dâvûd, s. 120',
    },
    {
      id: 'ed-waqfs',
      category: 'ebu_davud',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ebû Dâvûd’un ailesi, kurdukları vakıflar uzun yıllar devam etmiş zengin bir aileydi.',
      correctBool: true,
      explanation: EBU_DAVUD.biography.familyWealth,
      sourceRef: 'TDV · Ebû Dâvûd, s. 119',
    },
    {
      id: 'ed-buhari-alims',
      category: 'ebu_davud',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ebû Dâvûd’un ders aldığı hocaların çoğu aynı zamanda Buhârî ve Müslim’in de hocalarıydı.',
      correctBool: true,
      explanation: 'TDV maddesi: "Çoğu Buhârî ve Müslim’in de hocası olan birçok âlimden istifade etti."',
      sourceRef: 'TDV · Ebû Dâvûd, s. 119',
    },
  ];
  return items;
}

// ---------------------------------------------------------------------------
// 3. es-SÜNEN TDV KATEGORİSİ: >= 56 PDF-tabanlı soru
// ---------------------------------------------------------------------------
function buildSunenQuestions(): QuizBankItem[] {
  const items: QuizBankItem[] = [
    {
      id: 'sn-1-rank',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'M. Reşâd Halîfe’nin atfıyla es-Sünen, Kütüb-i Sitte içinde kaçıncı kitap olarak kabul edilir?',
      options: ['Üçüncü kitap', 'Birinci kitap', 'Beşinci kitap', 'Altıncı kitap'],
      correctIndex: 0,
      explanation: SUNEN.authenticityAndStructure.generalGradingAndRankTr,
      sourceRef: 'TDV · es-Sünen, c. 38, s. 145',
    },
    {
      id: 'sn-2-rey-kiyas',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd, sahih hadis bulamadığı fıkhî konularda Hz. Peygamber’e (ﷺ) aidiyeti muhtemel zayıf hadisi neye tercih etmiştir?',
      options: [
        'Fakihlerin re’y ve kıyasına',
        'Sadece Basra örfüne',
        'Yunan mantığına',
        'Sıhhat yönünden Buhârî’ye',
      ],
      correctIndex: 0,
      explanation: SUNEN.authenticityAndStructure.reyAndKiyasPreferenceTr,
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    // Mekke Letter 6 Principles
    ...SUNEN.compilationAndPurpose.mekkeLetter.principles.map((p, idx): QuizBankItem => {
      const distractors = detPick(
        SUNEN.compilationAndPurpose.mekkeLetter.principles
          .filter((x) => x.order !== p.order)
          .map((x) => x.titleTr),
        idx + 1,
        3
      );
      const { options, correctIndex } = stableOptionOrder(p.titleTr, distractors, idx + 70);
      return {
        id: `sn-mekke-p${p.order}`,
        category: 'sunen',
        gameType: 'multiple_choice',
        prompt: `Ebû Dâvûd’un Mekke halkına mektubundaki ${p.order}. telif ilkesi aşağıdakilerden hangisinin açıklamasıdır? "${p.detailTr}"`,
        options,
        correctIndex,
        explanation: `${p.order}. İlke — ${p.titleTr}: ${p.detailTr}`,
        sourceRef: 'TDV · es-Sünen (Mekke Mektubu), s. 145',
      };
    }),
    {
      id: 'sn-3-mekke-editor',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'TDV es-Sünen maddesinde Mekke Mektubu (Risâle ilâ ehli Mekke fî vaṣfi Sünenih) hangi muhakkik neşriyle anılmaktadır?',
      options: [
        'Muhammed Lutfî es-Sabbâğ (Beyrut 1394)',
        'Wensinck (Leiden 1936)',
        'Muhammed Avvâme (Beyrut 1998)',
        'Necati Yeniel (İstanbul 1987)',
      ],
      correctIndex: 0,
      explanation: 'Mekke Mektubu (nşr. Muhammed Lutfî es-Sabbâğ, Beyrut 1394) esas alınmıştır.',
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    {
      id: 'sn-4-suffice',
      category: 'sunen',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ebû Dâvûd, sahih isnadlı rivayetleri derlediği için Resûlullah’ın (ﷺ) sünneti konusunda sadece es-Sünen ile yetinilebileceğini ifade etmiştir.',
      correctBool: true,
      explanation: SUNEN.compilationAndPurpose.specialNotes.sufficeWithSunenTr,
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    {
      id: 'sn-5-silence-munker',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’un Mekke Mektubu’nda belirttiği "münker ve sükût kuralı" neyi ifade eder?',
      options: [
        'Şiddetli zayıf/münker hadisi mutlaka açıklar; üzerinde sükût ettiği rivayetler delil/sâlih olarak kullanılabilir',
        'Sükût ettiği her hadisi terk edilmesi gereken münker sayar',
        'Münker hadisleri kitabından tamamen çıkarmıştır',
        'Sadece mürsel hadisler hakkında açıklama yapmıştır',
      ],
      correctIndex: 0,
      explanation: SUNEN.compilationAndPurpose.specialNotes.munkerAndSilenceRuleTr,
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    {
      id: 'sn-6-mursel-600',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'Ebû Dâvûd’a göre es-Sünen’deki 4.800 hadisten yaklaşık kaçı mürseldir ve bu sayı el-Merâsîl ile nasıl bir bağ kurar?',
      options: [
        'Yaklaşık 600 mürsel · el-Merâsîl de 600’e yakın rivayetle es-Sünen’in tekmilesi kabul edilir',
        'Yaklaşık 50 mürsel · el-Merâsîl sadece zühd hadisleridir',
        'Yaklaşık 2.400 mürsel · el-Merâsîl Tirmizî’nin eseridir',
        'Hiç mürsel yoktur',
      ],
      correctIndex: 0,
      explanation: `${SUNEN.compilationAndPurpose.specialNotes.ahkamScopeTr} Köprülü Ktp. nr. 363’teki kayıt ("Hâzâ âhirü’l-merâsîl min Kitâbi’s-Sünen") el-Merâsîl’in es-Sünen’in tekmilesi olduğunu gösterir.`,
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    {
      id: 'sn-7-colophon',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'Köprülü Kütüphanesi nr. 363’teki yazma nüshanın sonunda geçen "Hâzâ âhirü’l-merâsîl min Kitâbi’s-Sünen" kaydı neyi ispatlamaktadır?',
      options: [
        'el-Merâsîl’in es-Sünen’in devamı / tekmilesi olduğunu',
        'es-Sünen’in yalnızca Kahire’de yazıldığını',
        'Kitâbü’l-Edeb’in sonradan eklendiğini',
        'Hattâbî şerhinin eksik kaldığını',
      ],
      correctIndex: 0,
      explanation: SUNEN.compilationAndPurpose.specialNotes.elMerasilConnectionTr,
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    {
      id: 'sn-8-buhari-muslim-share',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'es-Sünen’deki rivayetlerin ne kadarı Buhârî ve/veya Müslim’in de rivayet ettiği hadislerden oluşur?',
      options: ['Yarısından fazlası (%50+)', 'Yalnızca %5’i', 'Tamamı (%100)', 'Üçte biri (%33)'],
      correctIndex: 0,
      explanation: SUNEN.authenticityAndStructure.tiers[0].detailTr,
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    {
      id: 'sn-9-five-tiers-match',
      category: 'sunen',
      gameType: 'matching',
      prompt: 'es-Sünen’deki rivayet katmanlarını özellikleriyle eşleştirin:',
      pairs: [
        { id: 't1', left: '1. Katman (%50+)', right: 'Buhârî ve/veya Müslim ortak rivayetleri' },
        { id: 't2', left: '2. Katman (Ceyyid)', right: 'İsnadı sâlih ve güçlü hadisler' },
        { id: 't3', left: '3. Katman (Leyyin)', right: 'İki veya daha fazla leyyin tarikle makbul olanlar' },
        { id: 't4', left: '5. Katman (Çok Zayıf)', right: 'Zayıflığı müellif tarafından genellikle açıklananlar' },
      ],
      explanation: SUNEN.authenticityAndStructure.tiersSummaryTr,
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    {
      id: 'sn-10-bab-quirk',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'TDV es-Sünen maddesinde bab adlandırmasıyla ilgili dikkat çekilen özellik hangi iki kitap üzerinden örneklendirilir?',
      options: [
        'Kitâbü’l-Luḳaṭa ve Kitâbü’l-Mehdî (bazı bablarda isim görülmemesi)',
        'Kitâbü’l-İmân ve Kitâbü’l-İlim',
        'Kitâbü’l-Cihâd ve Kitâbü’l-Büyû‘',
        'Kitâbü’l-Fiten ve Kitâbü’l-Melâhim',
      ],
      correctIndex: 0,
      explanation: SUNEN.authenticityAndStructure.babNamingQuirkTr,
      sourceRef: 'TDV · es-Sünen, s. 145',
    },
    // 3 Rawis
    ...SUNEN.authenticityAndStructure.rawis.map((r, idx): QuizBankItem => {
      const others = SUNEN.authenticityAndStructure.rawis
        .filter((x) => x.id !== r.id)
        .map((x) => x.nameTr);
      const { options, correctIndex } = stableOptionOrder(
        r.nameTr,
        [...others, 'Hattâbî'],
        idx + 80
      );
      return {
        id: `sn-rawi-${r.id}`,
        category: 'sunen',
        gameType: 'multiple_choice',
        prompt: `es-Sünen’in şu meşhur râvîsi kimdir? "${r.detailTr}" (${r.citation})`,
        options,
        correctIndex,
        explanation: `${r.nameTr}: ${r.detailTr}`,
        sourceRef: `TDV · es-Sünen (${r.citation}), s. 145`,
      };
    }),
    // 4 Edition Counts
    ...SUNEN.editionStats.map((ed, idx): QuizBankItem => {
      const statsStr = `${ed.books} kitap · ${ed.babs} bab · ${ed.hadiths} hadis`;
      const distractors = SUNEN.editionStats
        .filter((x) => x.id !== ed.id)
        .map((x) => `${x.books} kitap · ${x.babs} bab · ${x.hadiths} hadis`);
      const { options, correctIndex } = stableOptionOrder(statsStr, distractors, idx + 90);
      return {
        id: `sn-edstat-${ed.id}`,
        category: 'sunen',
        gameType: 'multiple_choice',
        prompt: `${ed.editionName} (${ed.yearText}) neşrinde es-Sünen’in kitap, bab ve hadis sayısı kaçtır?`,
        options,
        correctIndex,
        explanation: ed.detailsTr,
        sourceRef: 'TDV · es-Sünen Neşirleri, s. 145-146',
      };
    }),
    {
      id: 'sn-edstat-match',
      category: 'sunen',
      gameType: 'matching',
      prompt: 'es-Sünen neşirlerini ve fihristini sayısal verileriyle eşleştirin:',
      pairs: [
        { id: 'es1', left: 'Wensinck (el-Mu‘cemü’l-müfehres)', right: '40 kitap · 1889 bab · 4800 hadis' },
        { id: 'es2', left: 'M. Muhyiddin Abdülhamîd (Kahire)', right: '35 kitap · 1871 bab · 5274 hadis' },
        { id: 'es3', left: 'Muhammed Avvâme (Beyrut 1998)', right: '36 kitap · 1850 bab · 5232 hadis' },
        { id: 'es4', left: 'Liechtenstein (1421/2000)', right: '42 kitap · 1885 bab · 5276 hadis' },
      ],
      explanation: 'Dört temel sayım arasında kitap (35–42), bab (1850–1889) ve hadis (4800–5276) farkları bulunur.',
      sourceRef: 'TDV · es-Sünen Neşirleri, s. 145-146',
    },
    {
      id: 'sn-avvame-basis',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'Muhammed Avvâme 1419/1998 Beyrut neşrinde hangi âlimin nüshasını esas almıştır?',
      options: [
        'İbn Hacer el-Askalânî nüshasını',
        'Wensinck fihristini',
        'İbn Dâse’nin yalnızca 1. cüzünü',
        'Azîmâbâdî’nin taşbaskısını',
      ],
      correctIndex: 0,
      explanation: 'İbn Hacer el-Askalânî nüshasını esas alan Muhammed Avvâme neşrinde (I-V, Beyrut) 36 kitap, 1850 bab ve 5232 hadis yer alır.',
      sourceRef: 'TDV · es-Sünen Neşirleri, s. 146',
    },
    // Print Cities
    ...SUNEN.printCities.slice(0, 6).map((pc, idx): QuizBankItem => {
      const distractors = detPick(
        SUNEN.printCities.filter((x) => x.id !== pc.id).map((x) => `${x.cityTr} (${x.countryTr})`),
        idx + 2,
        3
      );
      const correct = `${pc.cityTr} (${pc.countryTr})`;
      const { options, correctIndex } = stableOptionOrder(correct, distractors, idx + 110);
      return {
        id: `sn-city-${pc.id}`,
        category: 'sunen',
        gameType: 'multiple_choice',
        prompt: `es-Sünen’in şu baskı özellikleriyle öne çıkan yayın merkezi hangisidir? "${pc.highlightTr}" (${pc.editions[0]})`,
        options,
        correctIndex,
        explanation: `${pc.cityTr}: ${pc.editions.join(' | ')}`,
        sourceRef: 'TDV · es-Sünen Baskıları, s. 146',
      };
    }),
    // 9 Major Commentaries
    ...SUNEN.commentaries.map((com, idx): QuizBankItem => {
      const distractors = detPick(
        SUNEN.commentaries.filter((x) => x.id !== com.id).map((x) => `${x.author} — ${x.title}`),
        idx + 3,
        3
      );
      const correct = `${com.author} — ${com.title}`;
      const { options, correctIndex } = stableOptionOrder(correct, distractors, idx + 130);
      return {
        id: `sn-com-${com.id}`,
        category: 'sunen',
        gameType: 'multiple_choice',
        prompt: `es-Sünen şerhlerinden hangisi şu özelliklere sahiptir? "${truncate(com.summaryTr, 175)}"`,
        options,
        correctIndex,
        hint: `Kapsam: ${com.madhhabOrScope}`,
        explanation: `${com.author}, ${com.title}: ${com.summaryTr}`,
        sourceRef: 'TDV · es-Sünen Şerhleri, s. 146',
      };
    }),
    {
      id: 'sn-com-match-1',
      category: 'sunen',
      gameType: 'matching',
      prompt: 'es-Sünen şerhlerini müellifleriyle eşleştirin (Grup 1):',
      pairs: [
        { id: 'cm1', left: 'Hattâbî', right: 'Meʿâlimü’s-Sünen (İlk hadis şerhi)' },
        { id: 'cm2', left: 'Süyûtî', right: 'Mirḳātü’ṣ-ṣuʿûd ilâ Süneni Ebî Dâvûd' },
        { id: 'cm3', left: 'Azîmâbâdî', right: 'ʿAvnü’l-maʿbûd' },
        { id: 'cm4', left: 'Halîl Ahmed Sehârenpûrî', right: 'Beẕlü’l-mechûd (20 cilt · Hanefî)' },
      ],
      explanation: 'Hattâbî, Süyûtî, Azîmâbâdî ve Sehârenpûrî şerhleri TDV es-Sünen maddesinde ayrıntıyla tanıtılır.',
      sourceRef: 'TDV · es-Sünen Şerhleri, s. 146',
    },
    {
      id: 'sn-com-match-2',
      category: 'sunen',
      gameType: 'matching',
      prompt: 'es-Sünen şerh ve çalışmalarını müellifleriyle eşleştirin (Grup 2):',
      pairs: [
        { id: 'cm5', left: 'M. Hattâb es-Sübkî', right: 'el-Menhelü’l-ʿazbü’l-mevrûd' },
        { id: 'cm6', left: 'Muhammed b. Abdülhâdî es-Sindî', right: 'Fetḥu’l-vedûd ʿalâ Süneni Ebî Dâvûd' },
        { id: 'cm7', left: 'Münzirî', right: 'Muḫtaṣaru Süneni Ebî Dâvûd (el-Müctebâ)' },
        { id: 'cm8', left: 'İbn Kayyim el-Cevziyye', right: 'Tehẕîbü Muḫtaṣarı Süneni Ebî Dâvûd' },
      ],
      explanation: 'Sübkî, Sindî, Münzirî ve İbn Kayyim çalışmaları es-Sünen literatürünün temel taşlarındandır.',
      sourceRef: 'TDV · es-Sünen Şerh & İhtisarları, s. 146',
    },
    // Incomplete works (5 questions)
    ...SUNEN.incompleteWorks.map((inc, idx): QuizBankItem => {
      const distractors = detPick(
        SUNEN.incompleteWorks.filter((x) => x.id !== inc.id).map((x) => x.author),
        idx + 1,
        3
      );
      const { options, correctIndex } = stableOptionOrder(inc.author, distractors, idx + 150);
      return {
        id: `sn-inc-${inc.id}`,
        category: 'sunen',
        gameType: 'multiple_choice',
        prompt: `Yarım kalmış es-Sünen çalışmalarından "${inc.title}" (${inc.extentOrNoteTr}) kime aittir?`,
        options,
        correctIndex,
        explanation: `${inc.author} — ${inc.title}: ${inc.extentOrNoteTr} (${inc.manuscriptOrCitation}).`,
        sourceRef: 'TDV · es-Sünen Yarım Kalmış Çalışmalar, s. 146',
      };
    }),
    // Abridgements & Studies (9 questions)
    ...SUNEN.abridgementsAndStudies.map((st, idx): QuizBankItem => {
      const distractors = detPick(
        SUNEN.abridgementsAndStudies.filter((x) => x.id !== st.id).map((x) => `${x.author} — ${x.title}`),
        idx + 2,
        3
      );
      const correct = `${st.author} — ${st.title}`;
      const { options, correctIndex } = stableOptionOrder(correct, distractors, idx + 170);
      return {
        id: `sn-study-${st.id}`,
        category: 'sunen',
        gameType: 'multiple_choice',
        prompt: `es-Sünen üzerine yapılan bu "${st.kindLabelTr}" çalışması hangisidir? "${truncate(st.summaryTr, 160)}"`,
        options,
        correctIndex,
        explanation: `${st.author}, ${st.title}: ${st.summaryTr} (${st.publicationInfo}).`,
        sourceRef: 'TDV · es-Sünen İhtisar & Araştırmaları, s. 146-147',
      };
    }),
    {
      id: 'sn-tf-gayetul-maksud',
      category: 'sunen',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Azîmâbâdî, önce "Ġāyetü’l-maḳṣûd" adlı geniş şerhe başlamış, bitiremeyeceğini düşününce onu "ʿAvnü’l-maʿbûd" adıyla ihtisar etmiştir.',
      correctBool: true,
      explanation: SUNEN.commentaries[5].summaryTr,
      sourceRef: 'TDV · es-Sünen, s. 146',
    },
    {
      id: 'sn-tf-seharenpuri-sources',
      category: 'sunen',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Halîl Ahmed Sehârenpûrî, Beẕlü’l-mechûd’u Şâfiî mezhebi fıkhına göre kaleme almış ve M. Zekeriyyâ Kandehlevî ona ta‘lik yazmamıştır.',
      correctBool: false,
      explanation: 'Sehârenpûrî Beẕlü’l-mechûd’u Hanefî mezhebi görüşleri doğrultusunda yazmış ve M. Zekeriyyâ Kandehlevî’nin ta‘likleriyle 20 cilt yayımlanmıştır.',
      sourceRef: 'TDV · es-Sünen, s. 146',
    },
    {
      id: 'sn-tf-subki-hacc',
      category: 'sunen',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Mahmûd Muhammed Hattâb es-Sübkî’nin dört mezhep fıkhına göre yazdığı el-Menhelü’l-ʿazbü’l-mevrûd şerhi Kitâbü’l-Ḥacc’a kadar gelebilmiş, oğlunun tekmilesine rağmen tamamlanamamıştır.',
      correctBool: true,
      explanation: SUNEN.commentaries[7].summaryTr,
      sourceRef: 'TDV · es-Sünen, s. 146',
    },
    {
      id: 'sn-tf-robson',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'James Robson’ın es-Sünen nüshaları ve rivayet tarihi üzerine yazdığı "The Transmission of Abu Dawud’s Sunan" makalesini Türkçe’ye kim çevirmiştir?',
      options: ['Talat Koçyiğit', 'İsmail Lütfi Çakan', 'M. Yaşar Kandemir', 'Necati Yeniel'],
      correctIndex: 0,
      explanation: 'Talat Koçyiğit tarafından çevrilip AÜİFD V/4 (1956), s. 173-182’de yayımlanmıştır.',
      sourceRef: 'TDV · es-Sünen, s. 146-147',
    },
    {
      id: 'sn-tf-turkish-translation',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: 'es-Sünen’i I-XV cilt halinde Türkçe’ye çevirip şerheden (1987-2000) iki müellif kimlerdir?',
      options: [
        'Necati Yeniel & Hüseyin Kayapınar (İsmail L. Çakan mukaddimesiyle)',
        'Talat Koçyiğit & İsmail Cerrahoğlu',
        'Hayreddin Karaman & Bekir Topaloğlu',
        'Ahmed Davudoğlu & Kamil Miras',
      ],
      correctIndex: 0,
      explanation: 'Necati Yeniel & Hüseyin Kayapınar, Süneni Ebî Dâvûd Terceme ve Şerhi (I-XV, İstanbul 1987-2000).',
      sourceRef: 'TDV · es-Sünen, s. 147',
    },
    {
      id: 'sn-ibnul-iraki',
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: '7 cilt olmasına rağmen yalnızca sehiv secdesi bahsine kadar şerhedilebilen şerhin müellifi kimdir?',
      options: ['İbnü’l-Irâkī', 'Ömer b. Reslân el-Bulkīnî', 'Ahmed b. Hüseyin er-Remlî', 'Nevevî'],
      correctIndex: 0,
      explanation: SUNEN.commentaries[1].summaryTr,
      sourceRef: 'TDV · es-Sünen, s. 146',
    },
  ];

  return items;
}

// ---------------------------------------------------------------------------
// 4. USÛL SÖZLÜĞÜ KATEGORİSİ: >= 34 soru
// ---------------------------------------------------------------------------
function buildGlossaryQuestions(): QuizBankItem[] {
  const items: QuizBankItem[] = [];

  // All 18 terms from GLOSSARY_TERMS
  GLOSSARY_TERMS.forEach((term, idx) => {
    const distractors = detPick(
      GLOSSARY_TERMS.filter((x) => x.id !== term.id).map((x) => x.termTr),
      idx + 2,
      3
    );
    const { options, correctIndex } = stableOptionOrder(term.termTr, distractors, idx + 200);
    items.push({
      id: `gl-term-${term.id}`,
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: `Hadis usûlünde şu tanım hangi kavrama aittir? "${truncate(term.definitionTr, 190)}"`,
      arabicPrompt: term.termAr,
      options,
      correctIndex,
      hint: `Kategori: ${term.categoryLabelTr}`,
      explanation: `${term.termTr} (${term.termAr}): ${term.definitionTr}`,
      sourceRef: `Hadis Usûlü Sözlüğü · ${term.categoryLabelTr}`,
    });
  });

  // Matching groups for glossary terms
  items.push(
    {
      id: 'gl-match-sihhat',
      category: 'sozluk',
      gameType: 'matching',
      prompt: 'Hadis sıhhat derecelerini Arapça karşılıklarıyla eşleştirin:',
      pairs: [
        { id: 'gs1', left: 'الحَدِيثُ الصَّحِيحُ', right: 'Adâlet, zabt ve ittisâl tam · Şâz ve illetsiz' },
        { id: 'gs2', left: 'الحَدِيثُ الحَسَنُ', right: 'Zabtı hafifçe azalmış ama makbul rivayet' },
        { id: 'gs3', left: 'الحَدِيثُ المُرْسَلُ', right: 'Tâbiînin sahâbîyi atlayarak naklettiği rivayet' },
        { id: 'gs4', left: 'الحَدِيثُ المُنْكَرُ', right: 'Zayıf râvînin sika râvîlere aykırı tek rivayeti' },
      ],
      explanation: 'Sahîh, Hasen, Mürsel ve Münker hadis usûlünün temel sıhhat/ittisâl terimleridir.',
      sourceRef: 'Hadis Usûlü Sözlüğü · Sened & Sıhhat',
    },
    {
      id: 'gl-match-telif',
      category: 'sozluk',
      gameType: 'matching',
      prompt: 'Hadis literatüründeki telif ve çalışma türlerini eşleştirin:',
      pairs: [
        { id: 'gt1', left: 'Şerh (الشَّرْح)', right: 'Kelime, isnad ve fıkhî hükümleri açıklayan çalışma' },
        { id: 'gt2', left: 'İhtisar (الاِخْتِصَار)', right: 'Tekrarları çıkararak kitabı özlü hale getirme' },
        { id: 'gt3', left: 'Müstahrec (المُسْتَخْرَج)', right: 'Kitaptaki hadisleri kendi hocaları üzerinden yeniden rivayet' },
        { id: 'gt4', left: 'Tahrîc (التَّخْرِيج)', right: 'Hadisin Kütüb-i Sitte vb. kaynaklardaki yerini gösterme' },
      ],
      explanation: 'Şerh, İhtisar, Müstahrec ve Tahrîc es-Sünen literatüründe sıkça karşılaşılan telif türleridir.',
      sourceRef: 'Hadis Usûlü Sözlüğü · Telif Türleri',
    },
    {
      id: 'gl-match-tahammul',
      category: 'sozluk',
      gameType: 'matching',
      prompt: 'İsnad ağaçlarında geçen Arapça tahammül sîgalarını (nakil lafızlarını) anlamlarıyla eşleştirin:',
      pairs: [
        { id: 'th1', left: 'حَدَّثَنَا', right: 'Bize tahdîs etti (hocadan doğrudan duyma)' },
        { id: 'th2', left: 'أَخْبَرَنَا', right: 'Bize ihbâr etti (arz/kıraat yoluyla alma)' },
        { id: 'th3', left: 'عَنْ', right: 'An’ane ile nakil (...’den rivayetle)' },
        { id: 'th4', left: 'وَحَدَّثَنَا', right: 'Tahvîl: ikinci bir tarîk / sened koluna geçiş' },
      ],
      explanation: 'İsnad şemalarında okların üzerinde bu klasik tahammül lafızları gösterilmektedir.',
      sourceRef: 'Hadis Usûlü · Tahammül Sîgaları',
    }
  );

  // Additional Arabic Usul & Sarf/Irab & Sigil questions (13 questions -> total 34)
  const extraGlossary: QuizBankItem[] = [
    {
      id: 'gl-ex-rumuz-kaf',
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: 'Muhammed Avvâme tahkikinde hâşiyelerde görülen "(ك)" ve "(ص)" rumuzları neyi ifade eder?',
      options: [
        'Karşılaştırılan elyazması es-Sünen nüshalarını',
        'Hadislerin sadece Kûfe ve Basra’da rivayet edildiğini',
        'Kitabın sayfa başlıklarını',
        'Münzirî’nin kısalttığı kelimeleri',
      ],
      correctIndex: 0,
      explanation: '(ك) ve (ص) gibi harfler tahkikte başvurulan yazma nüsha rumuzlarıdır; örneğin 4. Bab başlığı yalnızca (ك) nüshasının hâşiyesinde yer alır.',
      sourceRef: 'PDF s. 268 · Muhammed Avvâme Tahkiki Hâşiyeleri',
    },
    {
      id: 'gl-ex-tuhfe-bracket',
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: 'Hâşiyelerde ve başlıklarda görülen "[4605]" gibi köşeli parantezli numaralar (ör. Hadis #4740) hangi eserdeki numaralandırmaya işaret eder?',
      options: [
        'Mizzî / Münzirî geleneğindeki paralel numaralandırmaya',
        'PDF’teki toplam sayfa sayısına',
        'Buhârî’nin sadece Edeb bölümüne',
        'Muhammed Avvâme’nin doğum tarihine',
      ],
      correctIndex: 0,
      explanation: 'Avvâme tahkikinde her hadisin yanında diğer meşhur tasniflerdeki (özellikle Münzirî Muhtasarı) karşılık numaraları köşeli parantezle verilir.',
      sourceRef: 'PDF s. 264 · Tahkik & Hâşiye Sistemi',
    },
    {
      id: 'gl-ex-mubhem',
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: 'İsnadda râvînin açık adının yerine "عَنْ رَجُلٍ" (bir adamdan) denilmesi hadis usûlünde nasıl adlandırılır? (Örn. Hadis #4745 ve #4757)',
      options: ['Mübhem râvî', 'Müttefekun aleyh', 'Müstahrec', 'Müdelles'],
      correctIndex: 0,
      explanation: 'Senedde ismi zikredilmeyip "racül / biri" şeklinde kapalı bırakılan râvîye "mübhem râvî" denir.',
      sourceRef: 'PDF s. 267, 271 · Hadis #4745 & #4757',
    },
    {
      id: 'gl-ex-tahvil',
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: 'Hadis senedinde iki ayrı isnad kolunun birleştiği noktada kullanılan "ح" (Tahvîl) veya "وَحَدَّثَنَا" işareti ne anlama gelir?',
      options: [
        'Bir senedden diğer paralel isnad koluna (tarîke) geçiş yapıldığını',
        'Hadisin zayıf olduğunu',
        'Sahâbînin sözünün bittiğini',
        'Babın sona erdiğini',
      ],
      correctIndex: 0,
      explanation: 'Tahvîl, aynı hadisin başka bir hoca/sened zinciriyle (ör. Hadis #4757, #4766, #4774) ikinci bir koldan aktarıldığını gösterir.',
      sourceRef: 'Hadis Usûlü · Tahvîl ve Tarîk',
    },
    {
      id: 'gl-ex-merfu',
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: 'İhtiyatla "وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ" (Onu ancak Nebî’den ﷺ bilirim) ifadesiyle ref‘ edilen (bkz. Hadis #4777) rivayette geçen "ref‘" ne demektir?',
      options: [
        'Sözün Hz. Peygamber’e (ﷺ) nispet edilmesi (merfû kılınması)',
        'Râvînin hadisi tamamen ezberden okuması',
        'Kelimenin sonunun kesralı okunması',
        'Metnin bab başlığına eklenmesi',
      ],
      correctIndex: 0,
      explanation: 'Bir rivayetin Hz. Peygamber’e (ﷺ) dayandırılmasına ref‘, bu tür hadise merfû hadis denir.',
      sourceRef: 'PDF s. 279 · Hadis #4777',
    },
    {
      id: 'gl-ex-sarf-root',
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: 'Arapça dilbilgisinde kelimelerin kökünü, veznini (kalıbını), mâzi-muzâri-emir yapısını ve çekimlerini inceleyen ilim dalı hangisidir?',
      options: ['Sarf (Morfoloji)', 'İ‘râb (Nahiv/Sentaks)', 'Cerh ve Ta‘dîl', 'Tahrîc'],
      correctIndex: 0,
      explanation: 'Sarf kelimenin kök ve yapı (vezin, sîga) özelliklerini; nahiv/i‘râb ise cümle içindeki görev ve son hareke durumunu inceler.',
      sourceRef: 'Arapça Sarf & Nahiv Usûlü',
    },
    {
      id: 'gl-ex-irab-states',
      category: 'sozluk',
      gameType: 'matching',
      prompt: 'Arapça i‘râb hâllerini cümledeki tipik görevleriyle eşleştirin:',
      pairs: [
        { id: 'ir1', left: 'Merfû (مَرْفُوع)', right: 'Fâil, Mübtedâ ve Haber' },
        { id: 'ir2', left: 'Mansûb (مَنْصُوب)', right: 'Mef‘ûlün bih, Hâl ve İnne ismi' },
        { id: 'ir3', left: 'Mecrûr (مَجْرُور)', right: 'Harf-i cerden sonra gelen isim veya Muzâfun ileyh' },
        { id: 'ir4', left: 'Meczûm (مَجْزُوم)', right: 'Emir lâmı (فَلْيَقْعُدْ) veya nehiy (لَا تَغْضَبْ) alan muzâri' },
      ],
      explanation: 'Kitâbü’l-Edeb’deki her kelimenin i‘râb kartında bu dört temel hâl ve mebnîlik açıkça analiz edilmiştir.',
      sourceRef: 'Arapça İ‘râb Çözümlemesi',
    },
    {
      id: 'gl-ex-blank-haddesena',
      category: 'sozluk',
      gameType: 'arabic_blank',
      prompt: 'İsnad başlangıcında "Bize Ebû Bekir b. Ebî Şeybe rivayet etti" anlamındaki boşluğu doldurun:',
      blankSentenceAr: '[ ــــــــ ] أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ',
      options: ['حَدَّثَنَا', 'مُنْكَرٌ', 'عَلَى', 'يُوضَعُ'],
      correctIndex: 0,
      explanation: 'حَدَّثَنَا (ḥaddethanā) "bize tahdîs/rivayet etti" anlamındaki en yaygın tahammül sîgasıdır.',
      sourceRef: 'Hadis Usûlü · Tahammül Lafızları',
    },
    {
      id: 'gl-ex-tf-mursal',
      category: 'sozluk',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Ebû Dâvûd, bir konuda sahih ve muttasıl (müsned) hadis varken bile mürsel rivayeti ona tercih eder.',
      correctBool: false,
      explanation: 'Tam aksine, sahih ve muttasıl bir hadis bulunmadığı zaman mürsel ile amel edilebileceğini belirtir.',
      sourceRef: 'Hadis Usûlü Sözlüğü · Mürsel & Müsned',
    },
    {
      id: 'gl-ex-tf-muttasil',
      category: 'sozluk',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Hadis #4750’de Ebû Dâvûd, bir üst tarikle kıyaslayarak Bekr tariki için "وهذا أصحّ الحديثين" (Bu ikisinden daha sahihidir) değerlendirmesi yapmıştır.',
      correctBool: true,
      explanation: 'Hadis #4750 metninin sonunda Ebû Dâvûd bizzat bu tercihi zikretmektedir.',
      sourceRef: 'PDF s. 269 · Hadis #4750',
    },
    {
      id: 'gl-ex-tf-hasen',
      category: 'sozluk',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Hadis usûlünde "Hasen" terimini yaygınlaştıran öncü âlimler arasında Ebû Dâvûd ve talebesi Tirmizî de yer alır.',
      correctBool: true,
      explanation: 'Ebû Dâvûd’un "sâlih" ve sükût yaklaşımı ile Tirmizî’nin "hasen" tasnifi usûl tarihinde belirleyici olmuştur.',
      sourceRef: 'Hadis Usûlü Sözlüğü · Hasen',
    },
    {
      id: 'gl-ex-tf-zevaid',
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: 'Bir hadis kitabının Sahîhayn’da (Buhârî ve Müslim) bulunmayan fazla rivayetlerini ayrı toplayan çalışma türüne ne denir?',
      options: ['Zevâid', 'Müsned', 'Cerh ve Ta‘dîl', 'Hâşiye'],
      correctIndex: 0,
      explanation: 'İbnü’l-Mülakkın’ın es-Sünen’in Sahîhayn üzerine zevâidini şerhetmesi buna örnektir.',
      sourceRef: 'Hadis Usûlü Sözlüğü · Zevâid',
    },
    {
      id: 'gl-ex-tf-mursal-blank',
      category: 'sozluk',
      gameType: 'arabic_blank',
      prompt: 'Hadis ıstılahında "Sağlam/Sahih hadis" anlamındaki tamlamanın eksik kelimesini tamamlayın:',
      blankSentenceAr: 'الحَدِيثُ [ ــــــــ ]',
      options: ['الصَّحِيحُ', 'المُرْتَفِعُ', 'المَتْرُوكُ', 'البَاطِلُ'],
      correctIndex: 0,
      explanation: 'الحَدِيثُ الصَّحِيحُ (el-Hadîsü’s-Sahîh) en yüksek sıhhat derecesini ifade eder.',
      sourceRef: 'Hadis Usûlü Sözlüğü · Sahih',
    },
  ];

  return [...items, ...extraGlossary];
}

// ---------------------------------------------------------------------------
// 5. BABLARIN TEMALARI KATEGORİSİ: >= 30 soru
// ---------------------------------------------------------------------------
function buildBabThemeQuestions(): QuizBankItem[] {
  const items: QuizBankItem[] = [];

  // All 11 babs: title/subtitle & range + Arabic terms
  BABS.forEach((bab, idx) => {
    const distractors = detPick(
      BABS.filter((b) => b.id !== bab.id).map((b) => `${b.numberLabel}: ${b.titleTr}`),
      idx + 2,
      3
    );
    const correct = `${bab.numberLabel}: ${bab.titleTr}`;
    const { options, correctIndex } = stableOptionOrder(correct, distractors, idx + 300);

    items.push({
      id: `bt-bab-${bab.id}-theme`,
      category: 'bab_temalari',
      gameType: 'which_bab',
      babId: bab.id,
      prompt: `Kitâbü’l-Edeb’de "${bab.subtitleTr}" temasını ve (${bab.keyArabicTerms.join(' · ')}) kavramlarını işleyen bab hangisidir?`,
      arabicPrompt: bab.titleAr,
      options,
      correctIndex,
      hint: `Hadis aralığı: #${bab.hadithStart}–${bab.hadithEnd} · PDF s. ${bab.pdfPages}`,
      explanation: `${bab.numberLabel} (${bab.titleTr} — ${bab.titleAr}), Hadis #${bab.hadithStart}–${bab.hadithEnd} arasını içerir.`,
      sourceRef: `PDF s. ${bab.pdfPages} · ${bab.numberLabel}`,
    });

    // Range question for each bab
    const rangeStr =
      bab.hadithStart === bab.hadithEnd
        ? `Hadis #${bab.hadithStart} (1 hadis · PDF s. ${bab.pdfPages})`
        : `Hadis #${bab.hadithStart}–${bab.hadithEnd} (${bab.hadithCount} hadis · PDF s. ${bab.pdfPages})`;
    const rangeDistractors = detPick(
      BABS.filter((b) => b.id !== bab.id).map((b) =>
        b.hadithStart === b.hadithEnd
          ? `Hadis #${b.hadithStart} (1 hadis · PDF s. ${b.pdfPages})`
          : `Hadis #${b.hadithStart}–${b.hadithEnd} (${b.hadithCount} hadis · PDF s. ${b.pdfPages})`
      ),
      idx + 4,
      3
    );
    const rangeOpt = stableOptionOrder(rangeStr, rangeDistractors, idx + 320);
    items.push({
      id: `bt-bab-${bab.id}-range`,
      category: 'bab_temalari',
      gameType: 'multiple_choice',
      babId: bab.id,
      prompt: `${bab.numberLabel} (${bab.titleTr}) hangi hadis numaralarını ve PDF sayfalarını kapsar?`,
      options: rangeOpt.options,
      correctIndex: rangeOpt.correctIndex,
      explanation: `${bab.numberLabel}: ${rangeStr}.`,
      sourceRef: `PDF s. ${bab.pdfPages} · ${bab.numberLabel}`,
    });
  });

  // 8 thematic matching, manuscript footnote, and true/false questions (total 30)
  items.push(
    {
      id: 'bt-fn-bab1',
      category: 'bab_temalari',
      gameType: 'multiple_choice',
      babId: 1,
      prompt: '1. Bab başlığındaki "[وحسن الهدي] (ve güzel hâl/gidişat)" ziyadesi elyazması nüshalar açısından nerede yer almaktadır?',
      arabicPrompt: 'باب في الحلم [وحسن الهَدْي] وأخلاق النبي ﷺ',
      options: [
        'Yalnızca (ك) nüshasının hâşiyesinde',
        'Sadece (ص) nüshasının metninde',
        'Hiçbir elyazmasında yoktur, modern ilavedir',
        'Sadece Münzirî Muhtasarı’ndadır',
      ],
      correctIndex: 0,
      explanation: 'Muhammed Avvâme tahkikinde 1. Bab başlığındaki "[وحسن الهدي]" ziyadesinin yalnız (ك) nüshasının hâşiyesinde yer aldığı belirtilir.',
      sourceRef: 'PDF s. 264 · 1. Bab Hâşiyesi',
    },
    {
      id: 'bt-fn-bab4',
      category: 'bab_temalari',
      gameType: 'true_false',
      babId: 4,
      prompt: 'Doğru mu Yanlış mı? 4. Bab başlığı olan "[باب ما يقال عند الغضب] (Öfke Anında Söylenecek Söz Babı)" yalnızca (ك) nüshasının hâşiyesinde bulunmaktadır.',
      correctBool: true,
      explanation: 'PDF s. 268 hâşiyesinde 4. Bab başlığının sadece (ك) nüshasının kenar notunda yer aldığı kayıtlıdır.',
      sourceRef: 'PDF s. 268 · 4. Bab Hâşiyesi',
    },
    {
      id: 'bt-fn-bab9',
      category: 'bab_temalari',
      gameType: 'true_false',
      babId: 9,
      prompt: 'Doğru mu Yanlış mı? 9. Bab başlığı "[باب في كراهية الرفعة من الأمور]" yalnızca (ص) nüshasında yer alır, diğer bütün nüshalarda eksiktir.',
      correctBool: false,
      explanation: 'Tam tersine, (ص) dışındaki tüm ana nüshalarda bu bab başlığı yer almaktadır.',
      sourceRef: 'PDF s. 276 · 9. Bab Hâşiyesi',
    },
    {
      id: 'bt-match-groups-1',
      category: 'bab_temalari',
      gameType: 'matching',
      prompt: 'Kitâbü’l-Edeb’in ilk beş babını ana Arapça kavramlarıyla eşleştirin:',
      pairs: [
        { id: 'bm1', left: 'Bab 1 (4740–4742)', right: 'الحِلْم (Hilim) & Nebevî ahlâk' },
        { id: 'bm2', left: 'Bab 2 (4743)', right: 'الوَقَار والسَّمْت (Vakar ve ölçülü hâl)' },
        { id: 'bm3', left: 'Bab 3 (4744–4746)', right: 'كَظَمَ غَيْظًا (Öfkeyi yutmak)' },
        { id: 'bm4', left: 'Bab 4 (4747–4751)', right: 'أَعُوذُ بِاللَّهِ / فَلْيَتَوَضَّأْ (Öfke ilâcı)' },
      ],
      explanation: 'İlk 4 bab içsel denge, vakar, öfkeyi yutma ve öfke anında nebevî tedavi silsilesini işler.',
      sourceRef: 'PDF s. 264–270 · Bab 1–4',
    },
    {
      id: 'bt-match-groups-2',
      category: 'bab_temalari',
      gameType: 'matching',
      prompt: 'Kitâbü’l-Edeb’in son altı babını ana temalarıyla eşleştirin:',
      pairs: [
        { id: 'bm5', left: 'Bab 6 (4755–4761)', right: 'حُسْنُ العِشْرَة (Güzel muaşeret · 7 hadis)' },
        { id: 'bm6', left: 'Bab 7 (4762–4764)', right: 'الحَيَاء خَيْرٌ كُلُّهُ (Hayâ)' },
        { id: 'bm7', left: 'Bab 8 (4765–4768)', right: 'حُسْنُ الخُلُق (Mizanda ağır gelen güzel ahlâk)' },
        { id: 'bm8', left: 'Bab 11 (4774–4777)', right: 'الرِّفْق وَالتُّؤَدَة (Yumuşaklık ve teennî)' },
      ],
      explanation: 'Bab 6–11 arası sosyal nezaket, hayâ, güzel ahlâk, tevazu, övgü ölçüsü ve rıfk konularını işler.',
      sourceRef: 'PDF s. 270–279 · Bab 6–11',
    },
    {
      id: 'bt-largest-bab',
      category: 'bab_temalari',
      gameType: 'multiple_choice',
      babId: 6,
      prompt: 'İncelenen 11 bab arasında 7 hadisle (4755–4761) en fazla hadis içeren bab hangisidir?',
      options: [
        'Bab 6: Güzel Muaşeret (7 hadis)',
        'Bab 4: Öfke Anında Söylenecek Söz (5 hadis)',
        'Bab 8: Güzel Ahlâk (4 hadis)',
        'Bab 11: Rıfk / Yumuşaklık (4 hadis)',
      ],
      correctIndex: 0,
      explanation: 'Bab 6 (4755–4761) toplam 7 hadisle en kalabalık babtır; en az hadis ise 1 hadisle (4743) Bab 2 (Vakar)’dır.',
      sourceRef: 'PDF s. 270–273 · Bab 6',
    },
    {
      id: 'bt-single-bab',
      category: 'bab_temalari',
      gameType: 'multiple_choice',
      babId: 2,
      prompt: '11 bab arasında yalnızca 1 hadis (Hadis #4743) içeren bab hangisidir?',
      options: [
        'Bab 2: Vakar (باب في الوقار)',
        'Bab 9: Yüksek Makam Hırsından Kaçınma',
        'Bab 5: Emirde Aşırıya Kaçmama',
        'Bab 7: Hayâ',
      ],
      correctIndex: 0,
      explanation: 'Bab 2 yalnızca İbn Abbâs’tan rivayet edilen #4743 numaralı Vakar hadisini içerir (PDF s. 266).',
      sourceRef: 'PDF s. 266 · Bab 2',
    },
    {
      id: 'bt-page-span',
      category: 'bab_temalari',
      gameType: 'true_false',
      prompt: 'Doğru mu Yanlış mı? Kitâbü’l-Edeb’in bu bölümündeki 38 hadisin tamamı (4740–4777), Muhammed Avvâme tahkikinin 264–279. sayfaları arasında yer alır.',
      correctBool: true,
      explanation: '11 bab ve 38 hadis (4740–4777) PDF sayfa 264’ten 279’a kadar kesintisiz yer almaktadır.',
      sourceRef: 'PDF s. 264–279',
    }
  );

  return items;
}

export const QUESTION_BANK: QuizBankItem[] = [
  ...buildHadithQuestions(),
  ...buildEbuDavudQuestions(),
  ...buildSunenQuestions(),
  ...buildGlossaryQuestions(),
  ...buildBabThemeQuestions(),
];

export function getQuestionBankStats() {
  const byCategory: Record<QuestionCategory, number> = {
    hadisler: 0,
    ebu_davud: 0,
    sunen: 0,
    sozluk: 0,
    bab_temalari: 0,
  };
  const byGameType: Record<QuestionGameType, number> = {
    multiple_choice: 0,
    arabic_blank: 0,
    matching: 0,
    word_order: 0,
    isnad_order: 0,
    which_bab: 0,
    audio_listening: 0,
    true_false: 0,
    city_map: 0,
  };

  for (const q of QUESTION_BANK) {
    byCategory[q.category]++;
    byGameType[q.gameType]++;
  }

  return {
    total: QUESTION_BANK.length,
    byCategory,
    byGameType,
  };
}
