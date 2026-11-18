import type {
  HadithItem,
  IsnadNode,
  IsnadTreeData,
  IsnadTreeEdge,
  IsnadTreeNode,
} from '../types';
import { getLexiconKey, normalizeArabicSearch } from './arabic';

const NO_PDF_BIO = "PDF'te bilgi yok";

const TDV_KNOWN_BIOS: Array<{ match: RegExp; bioTr: string }> = [
  {
    match: /Ebû Dâvûd|أبو داود/i,
    bioTr:
      'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889). TDV İslâm Ansiklopedisi maddesine göre es-Sünen’i 500.000 hadis arasından 4800 (4800-5274) hadis seçerek telif etmiştir.',
  },
  {
    match: /Ahmed b\. Hanbel|أحمد بن حنبل/i,
    bioTr:
      'TDV Ebû Dâvûd maddesine göre Bağdat’taki en büyük hocasıdır; fıkıh ve ilim çizgisinde kendisinden çok etkilenmiştir.',
  },
  {
    match: /Müsedded|مُسَدَّد/i,
    bioTr:
      'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki önde gelen hocaları arasında anılır.',
  },
  {
    match: /Kuteybe|قُتَيْبَة/i,
    bioTr:
      'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.',
  },
  {
    match: /Ka‘nebî|الْقَعْنَبِي/i,
    bioTr:
      'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında geçer.',
  },
  {
    match: /Süleyman b\. Harb|سُلَيْمَانُ بْنُ حَرْب/i,
    bioTr:
      'Süleyman b. Harb; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un önde gelen hocalarından biri olarak yer alır.',
  },
  {
    match: /Ebû Bekir.*Şeybe|Osmân.*Şeybe|أَبِي شَيْبَة/i,
    bioTr:
      'İbn Ebî Şeybe kardeşler (Ebû Bekir ve Osmân); TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.',
  },
  {
    match: /Nüfeylî|النُّفَيْلِي/i,
    bioTr:
      'en-Nüfeylî; TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Harrân’daki başlıca hocalarındandır.',
  },
  {
    match: /Hz\. Peygamber|رسول الله/i,
    bioTr:
      'Hadisin ilk kaynağı Hz. Peygamber Muhammed Mustafa (ﷺ).',
  },
];

function resolveNarratorBio(nameTr: string, nameAr: string, note?: string): string {
  if (note && note.trim().length > 0 && !note.startsWith('Ek bilgi')) {
    return note.trim();
  }
  const combined = `${nameTr} ${nameAr}`;
  for (const item of TDV_KNOWN_BIOS) {
    if (item.match.test(combined)) {
      return note && note.trim() ? `${note.trim()} (${item.bioTr})` : item.bioTr;
    }
  }
  return note && note.trim() ? note.trim() : NO_PDF_BIO;
}

const TAHAMMUL_MARKERS: Array<{ pattern: RegExp; ar: string; tr: string }> = [
  { pattern: /وَحَدَّثَنَا/, ar: 'وَحَدَّثَنَا', tr: 'Tahvîl · Bize tahdîs etti' },
  { pattern: /حَدَّثَنَا/, ar: 'حَدَّثَنَا', tr: 'Bize tahdîs etti' },
  { pattern: /حَدَّثَنِي/, ar: 'حَدَّثَنِي', tr: 'Bana tahdîs etti' },
  { pattern: /حَدَّثَهُ/, ar: 'حَدَّثَهُ', tr: 'Ona tahdîs etti' },
  { pattern: /أَخْبَرَنَا/, ar: 'أَخْبَرَنَا', tr: 'Bize ihbâr etti' },
  { pattern: /أَخْبَرَنِي/, ar: 'أَخْبَرَنِي', tr: 'Bana ihbâr etti' },
  { pattern: /سَمِعَ|سَمِعْتُ/, ar: 'سَمِعَ', tr: 'Bizzat işitti (Semâ)' },
  { pattern: /رَفَعَاهُ/, ar: 'رَفَعَاهُ جَمِيعاً', tr: 'İkisi birlikte ref‘ etti' },
  { pattern: /عَنِ|عَنْ/, ar: 'عَنْ', tr: 'An’ane (Naklen)' },
  { pattern: /قَالَا|قَالُوا|قَالَتْ|قَالَ/, ar: 'قَالَ', tr: 'Dedi / Buyurdu' },
];

/**
 * Extracts ordered tahammül verbs/prepositions from an isnadAr string.
 */
export function extractTahammulSequence(isnadAr: string): Array<{ ar: string; tr: string }> {
  const result: Array<{ ar: string; tr: string }> = [];
  if (!isnadAr) return result;
  const clauses = isnadAr.split(/[،,:]+/).map((s) => s.trim()).filter(Boolean);
  for (const clause of clauses) {
    for (const marker of TAHAMMUL_MARKERS) {
      if (marker.pattern.test(clause)) {
        result.push({ ar: marker.ar, tr: marker.tr });
        break;
      }
    }
  }
  return result;
}

function splitBranchText(
  nameTr: string,
  nameAr: string
): Array<{ nameTr: string; nameAr: string; label?: string }> {
  // Explicit parallel tarîk delimiter: ' · ' or '/'
  if (nameTr.includes(' · ') || nameAr.includes(' / ')) {
    const trParts = nameTr.split(/\s*·\s*/).map((s) => s.replace(/^(ve|ile)\s+/i, '').trim());
    const arParts = nameAr.split(/\s*\/\s*/).map((s) => s.trim());
    const count = Math.max(trParts.length, arParts.length);
    return Array.from({ length: count }, (_, idx) => ({
      nameTr: trParts[idx] || trParts[0],
      nameAr: arParts[idx] || arParts[0],
      label: `Tarîk ${idx + 1}`,
    }));
  }

  // Dual or triple teachers joined in same node (e.g. "Ebû Bekir ve Osmân (İbn Ebî Şeybe kardeşler)")
  if (/ ve |, /.test(nameTr) && !/^(Ebû|Hz\.)/.test(nameTr.trim()) === false) {
    if (nameTr.includes(' ve ') && !nameTr.includes('kardeşler')) {
      const trParts = nameTr.split(/\s+ve\s+/).map((s) => s.trim());
      const arParts = nameAr.split(/\s+وَ/).map((s, i) => (i > 0 ? s.trim() : s.trim()));
      if (trParts.length >= 2 && trParts.length <= 3 && !trParts[0].includes('(')) {
        return trParts.map((tp, idx) => ({
          nameTr: tp,
          nameAr: arParts[idx] || nameAr,
          label: `Kol ${idx + 1}`,
        }));
      }
    }
  }

  // Handle İbn Ebî Şeybe kardeşler + triple teachers cleanly
  if (nameTr.includes('Osmân, Ebû Bekir') && nameTr.includes('Muhammed b. es-Sabbâh')) {
    return [
      { nameTr: 'Osmân b. Ebî Şeybe', nameAr: 'عُثْمَانُ ابْنُ أَبِي شَيْبَةَ', label: 'Kol 1' },
      { nameTr: 'Ebû Bekir b. Ebî Şeybe', nameAr: 'أَبُو بَكْرٍ ابْنُ أَبِي شَيْبَةَ', label: 'Kol 2' },
      { nameTr: 'Muhammed b. es-Sabbâh el-Bezzâz', nameAr: 'مُحَمَّدُ بْنُ الصَّبَّاحِ', label: 'Kol 3' },
    ];
  }
  if (nameTr.includes('Ebû Bekir ve Osmân (İbn Ebî Şeybe kardeşler)')) {
    return [
      { nameTr: 'Ebû Bekir b. Ebî Şeybe', nameAr: 'أَبُو بَكْرٍ بْنُ أَبِي شَيْبَةَ', label: 'Kol 1' },
      { nameTr: 'Osmân b. Ebî Şeybe', nameAr: 'عُثْمَانُ بْنُ أَبِي شَيْبَةَ', label: 'Kol 2' },
    ];
  }
  if (nameTr.includes('Ebû’l-Velîd et-Tayâlisî ve Hafs b. Ömer')) {
    return [
      { nameTr: 'Ebû’l-Velîd et-Tayâlisî', nameAr: 'أَبُو الْوَلِيدِ الطَّيَالِسِيُّ', label: 'Tarîk 1' },
      { nameTr: 'Hafs b. Ömer', nameAr: 'حَفْصُ بْنُ عُمَرَ', label: 'Tarîk 1b' },
    ];
  }
  if (nameTr.includes('Yûnus (b. Ubeyd) ve Humeyd')) {
    return [
      { nameTr: 'Yûnus b. Ubeyd', nameAr: 'يُونُسُ بْنُ عُبَيْدٍ', label: 'Kol 1' },
      { nameTr: 'Humeyd et-Tavîl', nameAr: 'حُمَيْدٌ الطَّوِيلُ', label: 'Kol 2' },
    ];
  }
  if (nameTr.includes('Ebû Muâviye ve Vekî‘')) {
    return [
      { nameTr: 'Ebû Muâviye ed-Darîr', nameAr: 'أَبُو مُعَاوِيَةَ', label: 'Kol 1' },
      { nameTr: 'Vekî‘ b. el-Cerrâh', nameAr: 'وَكِيعٌ', label: 'Kol 2' },
    ];
  }

  if (nameTr.includes('Bekr b. Halef & el-Hasen b. Ali')) {
    return [
      { nameTr: 'Bekr b. Halef', nameAr: 'بَكْرُ بْنُ خَلَفٍ', label: 'Kol 1' },
      { nameTr: 'el-Hasen b. Ali', nameAr: 'الْحَسَنُ بْنُ عَلِيٍّ', label: 'Kol 2' },
    ];
  }

  if (nameTr.includes(' & ')) {
    const trParts = nameTr
      .replace(/\(.*?\)/g, '')
      .split(/\s*&\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
    const arParts = nameAr.split(/\s+وَ/).map((s) => s.trim());
    if (trParts.length >= 2) {
      return trParts.map((tp, idx) => ({
        nameTr: tp,
        nameAr: arParts[idx] || nameAr,
        label: `Kol ${idx + 1}`,
      }));
    }
  }

  return [{ nameTr, nameAr }];
}

function getCautionForHadithNode(
  hadithId: number,
  node: IsnadNode,
  nameTr: string
): { isUncertain: boolean; reason?: string } {
  if (
    node.note &&
    /mürsel|mübhem|zayıf|ihtiyat|şüphe|fark/i.test(node.note)
  ) {
    return { isUncertain: true, reason: node.note };
  }
  if (hadithId === 4745 && /mübhem|bir zat/i.test(nameTr)) {
    return { isUncertain: true, reason: 'Mübhem râvî (عَنْ رَجُلٍ)' };
  }
  if (hadithId === 4757 && /bir adamdan|mübhem/i.test(nameTr)) {
    return { isUncertain: true, reason: 'Tarîk 1’de mübhem râvî (عَنْ رَجُلٍ)' };
  }
  if (hadithId === 4746 && node.layer === 'etba' && /Osmân/i.test(nameTr)) {
    return { isUncertain: true, reason: 'Nüsha/şeyh farkı notu (Osmân / Ebû Bekir)' };
  }
  if (hadithId === 4750 && (node.layer === 'tabiin' || node.layer === 'sahabi')) {
    return { isUncertain: true, reason: 'Mürsel isnad (Bekr -> Ebû Zer arası inkıtâ)' };
  }
  if (hadithId === 4756 && /Selm/i.test(nameTr)) {
    return { isUncertain: true, reason: 'Dipnotta zayıf/eleştirilen râvî kaydı' };
  }
  if (hadithId === 4777 && /A‘meş|Mus‘ab/i.test(nameTr)) {
    return { isUncertain: true, reason: 'İhtiyatlı ref‘ (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)' };
  }
  return { isUncertain: false };
}

/**
 * Automatically converts a HadithItem's `isnadChain` + `isnadAr` into a structured
 * classical Hadis Usûlü vertical tree (ordered from Hz. Peygamber ﷺ at top to Musannif Ebû Dâvûd at bottom),
 * splitting multi-teacher/tahvîl chains into converging branches and marking mürsel/mübhem/caution edges dashed.
 */
export function buildIsnadTree(hadith: Pick<HadithItem, 'id' | 'isnadChain' | 'isnadAr'>): IsnadTreeData {
  // Reverse chain so Prophet ﷺ is layerOrder 0 (top), down to Musannif at bottom
  const prophetToMusannif = [...hadith.isnadChain].reverse();
  const tahammuls = extractTahammulSequence(hadith.isnadAr);

  const treeNodes: IsnadTreeNode[] = [];
  const layerGroups: IsnadTreeNode[][] = [];

  prophetToMusannif.forEach((rawNode, layerIdx) => {
    const branches = splitBranchText(rawNode.nameTr, rawNode.nameAr);
    const layerNodes: IsnadTreeNode[] = branches.map((b, bIdx) => {
      const caution = getCautionForHadithNode(hadith.id, rawNode, b.nameTr);
      return {
        id: branches.length > 1 ? `${rawNode.id}__b${bIdx}` : rawNode.id,
        sourceChainNodeId: rawNode.id,
        nameAr: b.nameAr,
        nameTr: b.nameTr,
        layer: rawNode.layer,
        layerOrder: layerIdx,
        branchIndex: bIdx,
        branchCount: branches.length,
        branchLabel: b.label,
        note: rawNode.note,
        bioTr: resolveNarratorBio(b.nameTr, b.nameAr, rawNode.note),
        isUncertain: caution.isUncertain,
        uncertainReason: caution.reason,
      };
    });
    layerGroups.push(layerNodes);
    treeNodes.push(...layerNodes);
  });

  const edges: IsnadTreeEdge[] = [];
  // Build directional edges from upper layer (closer to Prophet ﷺ) down to lower layer (closer to Ebû Dâvûd)
  for (let i = 0; i < layerGroups.length - 1; i++) {
    const upperNodes = layerGroups[i];
    const lowerNodes = layerGroups[i + 1];

    // Corresponding tahammul index from Ebû Dâvûd side
    const revIndex = Math.max(0, layerGroups.length - 2 - i);
    const fallbackTahammul =
      tahammuls[revIndex] ||
      (upperNodes[0]?.layer === 'prophet'
        ? { ar: 'قَالَ', tr: 'Buyurdu' }
        : { ar: 'عَنْ', tr: 'Naklen' });

    if (upperNodes.length === lowerNodes.length && upperNodes.length > 1) {
      // Parallel tarîk continuation (e.g. 4757 Tarîk 1 & Tarîk 2)
      upperNodes.forEach((u, idx) => {
        const l = lowerNodes[idx];
        const dashed = Boolean(u.isUncertain || l.isUncertain);
        edges.push({
          id: `e-${u.id}-${l.id}`,
          fromId: u.id,
          toId: l.id,
          tahammulAr: fallbackTahammul.ar,
          tahammulTr: fallbackTahammul.tr,
          dashed,
          warningLabel: dashed ? u.uncertainReason || l.uncertainReason : undefined,
        });
      });
    } else if (upperNodes.length === 1 && lowerNodes.length >= 1) {
      // Single narrator branching out to multiple students (or 1-to-1)
      lowerNodes.forEach((l, idx) => {
        let edgeTahammul = fallbackTahammul;
        // Special accurate tahammül distinction on #4766 (حَدَّثَنَا vs أَخْبَرَنَا)
        if (hadith.id === 4766 && upperNodes[0].nameAr.includes('شُعْبَة') && lowerNodes.length === 2) {
          edgeTahammul =
            idx === 0
              ? { ar: 'حَدَّثَنَا', tr: 'Bize tahdîs etti' }
              : { ar: 'أَخْبَرَنَا', tr: 'Bize ihbâr etti' };
        }
        const dashed = Boolean(upperNodes[0].isUncertain || l.isUncertain);
        edges.push({
          id: `e-${upperNodes[0].id}-${l.id}`,
          fromId: upperNodes[0].id,
          toId: l.id,
          tahammulAr: edgeTahammul.ar,
          tahammulTr: edgeTahammul.tr,
          dashed,
          warningLabel: dashed
            ? upperNodes[0].uncertainReason || l.uncertainReason
            : undefined,
        });
      });
    } else {
      // Converging multiple teachers into Musannif or single downstream node
      upperNodes.forEach((u, idx) => {
        const target = lowerNodes[Math.min(idx, lowerNodes.length - 1)];
        let edgeTahammul = fallbackTahammul;
        if (idx > 0 && /حَدَّثَنَا/.test(hadith.isnadAr) && upperNodes.length > 1) {
          edgeTahammul = { ar: 'وَحَدَّثَنَا', tr: 'Diğer tarîk · Bize tahdîs etti' };
        }
        const dashed = Boolean(u.isUncertain || target.isUncertain);
        edges.push({
          id: `e-${u.id}-${target.id}`,
          fromId: u.id,
          toId: target.id,
          tahammulAr: edgeTahammul.ar,
          tahammulTr: edgeTahammul.tr,
          dashed,
          warningLabel: dashed ? u.uncertainReason || target.uncertainReason : undefined,
        });
      });
    }
  }

  return {
    hadithId: hadith.id,
    nodes: treeNodes,
    edges,
    hasBranching: treeNodes.some((n) => n.branchCount > 1),
    hasCaution: treeNodes.some((n) => n.isUncertain) || edges.some((e) => e.dashed),
  };
}

/**
 * Finds all other hadiths (4740-4777) in which a given narrator appears.
 */
export function findHadithsByNarrator(
  node: Pick<IsnadTreeNode, 'nameTr' | 'nameAr' | 'layer'>,
  allHadiths: HadithItem[],
  excludeHadithId?: number
): Array<{ hadithId: number; babId: number }> {
  if (node.layer === 'prophet') {
    return allHadiths
      .filter((h) => h.id !== excludeHadithId)
      .map((h) => ({ hadithId: h.id, babId: h.babId }));
  }

  const cleanTr = node.nameTr
    .replace(/\(.*?\)/g, '')
    .replace(/^(el-|en-|er-|es-|eş-|et-|ez-)/i, '')
    .trim()
    .toLowerCase();

  const arTokens = node.nameAr
    .split(/\s+/)
    .map((t) => normalizeArabicSearch(getLexiconKey(t)))
    .filter((t) => t.length >= 3 && t !== 'عبد' && t !== 'ابو' && t !== 'ابي' && t !== 'ابن');

  const matches: Array<{ hadithId: number; babId: number }> = [];

  for (const h of allHadiths) {
    if (h.id === excludeHadithId) continue;
    const hit = h.isnadChain.some((n) => {
      if (node.layer === 'musannif' && n.layer === 'musannif') return true;
      const nTr = n.nameTr.replace(/\(.*?\)/g, '').toLowerCase();
      if (cleanTr.length >= 4 && nTr.includes(cleanTr)) return true;
      const nAr = normalizeArabicSearch(n.nameAr);
      if (arTokens.length >= 2) {
        return arTokens.every((t) => nAr.includes(t));
      }
      return arTokens.length === 1 && nAr.includes(arTokens[0]);
    });
    if (hit) {
      matches.push({ hadithId: h.id, babId: h.babId });
    }
  }
  return matches;
}
