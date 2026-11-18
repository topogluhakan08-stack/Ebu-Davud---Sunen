import type { HadithItem, IsnadNode } from '../types';

export type GlossaryCategory = 'sened_sihhat' | 'telif_turleri' | 'tahkik_hasiye';

export interface GlossaryEntry {
  id: string;
  category: GlossaryCategory;
  categoryLabelTr: string;
  termTr: string;
  termAr: string;
  termFr: string;
  definitionTr: string;
  exampleInApp: string;
  relatedRoute: string;
  relatedLabel: string;
}

export const GLOSSARY_TERMS: GlossaryEntry[] = [
  {
    id: 'isnad',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'İsnad (Sened)',
    termAr: 'الإِسْنَادُ / السَّنَدُ',
    termFr: 'Chaîne de transmission (Isnâd)',
    definitionTr:
      'Hadis metnini Hz. Peygamber’e ﷺ veya ilk söyleyene ulaştıran râviler zinciridir. İsnad tenkidi, hadisin sıhhatini ve râvilerin birbirinden semâ (duyma) imkânını belirlemenin temel ölçüsüdür.',
    exampleInApp:
      'Her hadis kartında "İsnad Zinciri" sekmesinde Musannif’ten (Ebû Dâvûd) Sahâbî ve Hz. Peygamber’e ﷺ kadar tabakalar halinde gösterilir.',
    relatedRoute: '/hadisler?hadith=4740',
    relatedLabel: 'Hadis 4740 İsnadına Bak',
  },
  {
    id: 'metin',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Metin',
    termAr: 'المَتْنُ',
    termFr: 'Texte du hadith (Matn)',
    definitionTr:
      'İsnad zincirinin sonunda nakledilen söz, fiil veya takrîr muhtevasıdır. Lafızların harekesi, nüsha farkları ve kök anlamları doğrudan fıkhî ve ahlâkî hükme temel teşkil eder.',
    exampleInApp:
      'Kitâbü’l-Edeb’deki 38 hadisin tamamında (4740–4777) metin, isnaddan ayrı olarak harekeli ve tıklanabilir kök analizli biçimde sunulmuştur.',
    relatedRoute: '/hadisler',
    relatedLabel: '38 Hadis Metnini İncele',
  },
  {
    id: 'mursel',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Mürsel Hadis',
    termAr: 'الحَدِيثُ المُرْسَلُ',
    termFr: 'Hadith interrompu au Compagnon (Mursal)',
    definitionTr:
      'Tâbiînin, arada sahâbîyi zikretmeksizin doğrudan “Resûlullah ﷺ şöyle buyurdu” diyerek naklettiği rivayettir. Ebû Dâvûd, sahih ve muttasıl bir hadis bulunmadığında mürsel rivayetle amel edilebileceğini Mekke Mektubu’nda belirtir.',
    exampleInApp:
      'es-Sünen nüshalarında ~600 mürsel hadis yer alır; ayrıca Ebû Dâvûd müstakil "Kitâbü’l-Merâsîl" eserini telif etmiştir (Hadis 4750 notuna da bakınız).',
    relatedRoute: '/sunen',
    relatedLabel: 'es-Sünen Metodunu Gör',
  },
  {
    id: 'musned',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Müsned Hadis',
    termAr: 'الحَدِيثُ المُسْنَدُ',
    termFr: 'Hadith à chaîne complète (Musnad)',
    definitionTr:
      'Başından sonuna kadar hiçbir râvi düşüklüğü olmaksızın Hz. Peygamber’e ﷺ kesintisiz ulaşan (merfû ve muttasıl) rivayettir. Mürsel hadisin zıddı olarak anılır.',
    exampleInApp:
      'Ebû Dâvûd Mekke Mektubu’nda “Ben bir konuda sahih/müsned hadis varken mürseli delil almam” ilkesini vurgular.',
    relatedRoute: '/sunen#telif-metod',
    relatedLabel: 'Mekke Mektubu 6 İlke',
  },
  {
    id: 'muttasil',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Muttasıl (İttisâl)',
    termAr: 'المُتَّصِلُ',
    termFr: 'Chaîne ininterrompue (Muttasil)',
    definitionTr:
      'Seneddeki her râvinin bir üstündeki hocasından hadisi bizzat işiterek veya geçerli bir tahammül yoluyla almış olmasıyla oluşan kesintisiz isnad yapısıdır.',
    exampleInApp:
      'Hadis 4750’de Ebû Dâvûd, Bekr tariki ile 4749 arasındaki ittisâl farkına dikkat çekerek "Bu iki hadisin daha sahihidir" (أصحّ الحديثين) der.',
    relatedRoute: '/hadisler?hadith=4750',
    relatedLabel: 'Hadis 4750 Kıyasını Gör',
  },
  {
    id: 'sahih',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Sahih Hadis',
    termAr: 'الحَدِيثُ الصَّحِيحُ',
    termFr: 'Hadith authentique (Sahîh)',
    definitionTr:
      'Adâlet ve zabt sahibi râvilerin muttasıl bir senedle, şâz ve illetten uzak olarak naklettiği en yüksek sıhhat derecesindeki hadistir. Buhârî ve Müslim’in ortak rivayetleri "Müttefekun aleyh" sayılır.',
    exampleInApp:
      'Kitâbü’l-Edeb’de 4740, 4746, 4748, 4752, 4753, 4762, 4771 ve 4774 gibi çok sayıda hadis Buhârî ve Müslim’de de tahric edilmiştir.',
    relatedRoute: '/hadisler?bab=1',
    relatedLabel: 'Buhârî/Müslim Ortak Hadisleri',
  },
  {
    id: 'hasen',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Hasen Hadis',
    termAr: 'الحَدِيثُ الحَسَنُ',
    termFr: 'Hadith bon (Hasan)',
    definitionTr:
      'Râvilerinin zabt (hafıza) derecesi sahih ricaline göre biraz daha hafif olmakla birlikte adâlet ve ittisâl şartlarını taşıyan, şâz ve münker olmayan makbul hadistir. Ebû Dâvûd ve Tirmizî bu terimi hadis usulünde yerleştiren öncülerdendir.',
    exampleInApp:
      'Ebû Dâvûd, es-Sünen’de bir hadis hakkında "sâlih" veya sükût ettiğinde İbnü’s-Salâh gibi âlimler o rivayetin en az hasen derecesinde olduğunu belirtir.',
    relatedRoute: '/sunen#sihhat-raviler',
    relatedLabel: 'es-Sünen Sıhhat Basamakları',
  },
  {
    id: 'munker',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Münker Hadis',
    termAr: 'الحَدِيثُ المُنْكَرُ',
    termFr: 'Hadith rejeté / singulier (Munkar)',
    definitionTr:
      'Zayıf bir râvinin güvenilir (sika) râvilere aykırı olarak tek başına naklettiği rivayettir. Ebû Dâvûd, babda başka rivayet yoksa mecburen zikrettiği şiddetli zayıf veya münker hadisleri mutlaka "münkerdir" diye açıklar.',
    exampleInApp:
      'Mekke Mektubu’nda “Üzerinde sükût ettiğim her hadis sâlihtir” ilkesinin karşısında yer alan açık tenkit hükmüdür.',
    relatedRoute: '/sunen#telif-metod',
    relatedLabel: 'Sükût ve Münker Kuralı',
  },
  {
    id: 'zayif',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Zayıf Hadis',
    termAr: 'الحَدِيثُ الضَّعِيفُ',
    termFr: 'Hadith faible (Da‘îf)',
    definitionTr:
      'Sahih veya hasen şartlarından birini taşımayan rivayettir. Ebû Dâvûd’a göre isnadı çok zayıf olmayan hadis bile fakihlerin re’y ve kıyasından evlâ görülüp fıkıh tartışması için es-Sünen’e alınabilmiştir.',
    exampleInApp:
      'es-Sünen’de hakkında tenkit bulunan hadisler Ebû Dâvûd veya şârihler (Münzirî, İbn Kayyim, el-Elbânî) tarafından ayrıca işaretlenir.',
    relatedRoute: '/sunen#sihhat-raviler',
    relatedLabel: 'Zayıf ve Re’y Yaklaşımı',
  },
  {
    id: 'sukut',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Ebû Dâvûd’un Sükûtu',
    termAr: 'سُكُوتُ أَبِي دَاوُدَ',
    termFr: 'Silence d’Abû Dâwûd',
    definitionTr:
      'Ebû Dâvûd’un bir hadisi naklettikten sonra senedi veya sıhhati hakkında olumsuz bir açıklama yapmamasıdır. Kendisi bunun “sâlih” (delil/amel edilmeye elverişli) sayılacağını ifade etmiştir.',
    exampleInApp:
      'Hadislerin büyük çoğunluğunda sükût ederken, 4750 gibi yerlerde "وهذا أصحّ الحديثين" diyerek doğrudan tercih belirtir.',
    relatedRoute: '/sunen',
    relatedLabel: 'Sükût İlkesini İncele',
  },
  {
    id: 'ahkam',
    category: 'telif_turleri',
    categoryLabelTr: 'Kitap & Telif Türleri',
    termTr: 'Ahkâm Hadisleri',
    termAr: 'أَحَادِيثُ الأَحْكَامِ',
    termFr: 'Hadiths juridiques (Ahkâm)',
    definitionTr:
      'İbadetler, muamelat, cezalar, haram-helal ve aile hukuku gibi amelî fıkıh hükümlerine kaynaklık eden rivayetlerdir. "Sünen" türü eserler özellikle ahkâm hadislerini fıkıh bablarına göre derler.',
    exampleInApp:
      'Ebû Dâvûd 500.000 hadisten ahkâm ağırlıklı 4.800 hadis seçmiş; "Kitâbü’l-Edeb" ve "Zühd" gibi ahlâk bölümlerini de eserin sonuna eklemiştir.',
    relatedRoute: '/ebu-davud#fikih-zuhd',
    relatedLabel: 'Fıkhî Kimlik ve Ahkâm',
  },
  {
    id: 'cerh-tadil',
    category: 'sened_sihhat',
    categoryLabelTr: 'Sened & Sıhhat',
    termTr: 'Cerh ve Ta‘dîl',
    termAr: 'الجَرْحُ وَالتَّعْدِيلُ',
    termFr: 'Critique et accréditation des transmetteurs',
    definitionTr:
      'Hadis râvilerinin dürüstlük (adâlet) ve hafıza/dikkat (zabt) yönünden incelenip güvenilir (sika, sadûk) veya zayıf/metrûk şeklinde değerlendirilmesi ilmidir.',
    exampleInApp:
      'Ebû Dâvûd hem müellif hem cerh-ta‘dîl otoritesidir; "Suâlâtü Ebî Ubeyd el-Âcurrî" ve "Tesmiyetü’l-ihve" eserleri bu alanda temel kaynaktır.',
    relatedRoute: '/ebu-davud#hadisciligi',
    relatedLabel: 'Ebû Dâvûd’un Tenkitleri',
  },
  {
    id: 'tahric',
    category: 'tahkik_hasiye',
    categoryLabelTr: 'Tahkik & Hâşiye',
    termTr: 'Tahrîc',
    termAr: 'التَّخْرِيجُ',
    termFr: 'Référencement dans les recueils (Takhrîj)',
    definitionTr:
      'Bir hadisin başka hangi temel hadis kaynaklarında (Buhârî, Müslim, Tirmizî, Nesâî, İbn Mâce, Ahmed b. Hanbel vb.) hangi bab ve hadis numarasıyla geçtiğini tespit etmektir.',
    exampleInApp:
      'Muhammed Avvâme tahkikinde ve her hadis kartının üstündeki "Buhârî / Müslim / Nesâî / Tuhfe [4605]" rozetlerinde görülür.',
    relatedRoute: '/hadisler',
    relatedLabel: 'Tahrîc Rozetlerini Gör',
  },
  {
    id: 'mustahrec',
    category: 'telif_turleri',
    categoryLabelTr: 'Kitap & Telif Türleri',
    termTr: 'Müstahrec',
    termAr: 'المُسْتَخْرَجُ',
    termFr: 'Recueil à chaînes parallèles (Mustakhraj)',
    definitionTr:
      'Bir âlimin, daha önce telif edilmiş bir hadis kitabındaki (örneğin Sünen-i Ebî Dâvûd) hadisleri, o kitabın müellifine uğramadan kendi hocaları üzerinden aynı şeyhte birleşen başka senedlerle yeniden rivayet etmesidir.',
    exampleInApp:
      'es-Sünen üzerine yapılan müstahrecler arasında Ebû Nuaym el-İsfahânî ve Kasım b. Asbağ’ın çalışmaları öne çıkar.',
    relatedRoute: '/sunen#serh-kitapligi',
    relatedLabel: 'es-Sünen Üzerine Çalışmalar',
  },
  {
    id: 'zevaid',
    category: 'telif_turleri',
    categoryLabelTr: 'Kitap & Telif Türleri',
    termTr: 'Zevâid',
    termAr: 'الزَّوَائِدُ',
    termFr: 'Ajouts de hadiths (Zawâ’id)',
    definitionTr:
      'Bir hadis kitabının, diğer temel kaynaklarda (örneğin Sahîhayn veya Kütüb-i Sitte’nin geri kalanında) bulunmayan fazla rivayetlerini müstakil olarak toplayan eser türüdür.',
    exampleInApp:
      'Mısırlı muhaddisler tarafından es-Sünen’in Sahîhayn’a veya diğer sünenlere zevâidi üzerine çalışmalar yapılmıştır.',
    relatedRoute: '/sunen#serh-kitapligi',
    relatedLabel: 'Şerh ve Çalışma Kitaplığı',
  },
  {
    id: 'serh',
    category: 'telif_turleri',
    categoryLabelTr: 'Kitap & Telif Türleri',
    termTr: 'Şerh',
    termAr: 'الشَّرْحُ',
    termFr: 'Commentaire savant (Sharh)',
    definitionTr:
      'Hadis metinlerindeki garîb kelimeleri, sarf-nahiv inceliklerini, râvi ihtilaflarını ve fıkhî hükümleri ayrıntılı biçimde açıklayan telif türüdür.',
    exampleInApp:
      'es-Sünen’in ilk şerhi Hattâbî’nin "Meâlimü’s-Sünen"idir; ardından İbn Kayyim, Azîmâbâdî (Avnü’l-Ma‘bûd) ve Sehârenpûrî (Bezlül-mechûd) gelir.',
    relatedRoute: '/sunen#serh-kitapligi',
    relatedLabel: '9 Büyük es-Sünen Şerhi',
  },
  {
    id: 'ihtisar',
    category: 'telif_turleri',
    categoryLabelTr: 'Kitap & Telif Türleri',
    termTr: 'İhtisar (Muhtasar)',
    termAr: 'الاِخْتِصَارُ / المُخْتَصَرُ',
    termFr: 'Abrégé (Ikhtisâr / Mukhtasar)',
    definitionTr:
      'Uzun bir hadis eserindeki tekrar eden senedleri veya benzer tarikleri çıkararak özlü hale getirme ve ezber/okuma kolaylığı sağlama metodudur.',
    exampleInApp:
      'Zekiyyüddin el-Münzirî’nin "Muhtasaru Süneni Ebî Dâvûd" eseri (haşiyelerdeki "[4605]" gibi Münzirî numaralandırmasının kaynağıdır).',
    relatedRoute: '/sunen#serh-kitapligi',
    relatedLabel: 'Münzirî Muhtasarı ve Çalışmalar',
  },
  {
    id: 'hasiye-rumuz',
    category: 'tahkik_hasiye',
    categoryLabelTr: 'Tahkik & Hâşiye',
    termTr: 'Tahkîk, Tashîh ve Nüsha Rumuzları (ك، ص، د، م)',
    termAr: 'التَّحْقِيقُ وَالرُّمُوزُ',
    termFr: 'Édition critique et sigles des manuscrits',
    definitionTr:
      'Muhammed Avvâme’nin es-Sünen tahkikinde metnin altındaki dipnotlarda (hâşiyelerde) elyazması nüshalar arasındaki lafız ve bab başlığı farklarını belirtmek için kullandığı kısaltmalardır (ör. ك ve ص yazma nüshaları, خ ve ع râvi rivayetleri).',
    exampleInApp:
      'Örneğin 4. Bab başlığında "* ـ [باب ما يقال عند الغضب]: من حاشية ك فقط" notu yalnızca (ك) nüshasının hâşiyesinde bulunduğunu gösterir.',
    relatedRoute: '/hadisler?bab=4',
    relatedLabel: 'Hadis 4747 Hâşiyesini Gör',
  },
];

export interface NarratorDirectoryItem {
  key: string;
  nameTr: string;
  nameAr: string;
  layer: IsnadNode['layer'];
  notes: string[];
  hadithIds: number[];
}

export function extractNarratorDirectory(hadiths: HadithItem[]): NarratorDirectoryItem[] {
  const map = new Map<string, NarratorDirectoryItem>();

  for (const hadith of hadiths) {
    for (const node of hadith.isnadChain) {
      const normalizedKey = node.nameTr
        .replace(/\s*\(.*?\)\s*/g, '')
        .trim()
        .toLocaleLowerCase('tr');

      const existing = map.get(normalizedKey);
      if (existing) {
        if (!existing.hadithIds.includes(hadith.id)) {
          existing.hadithIds.push(hadith.id);
        }
        if (node.note && !existing.notes.includes(node.note)) {
          existing.notes.push(node.note);
        }
      } else {
        map.set(normalizedKey, {
          key: normalizedKey,
          nameTr: node.nameTr,
          nameAr: node.nameAr,
          layer: node.layer,
          notes: node.note ? [node.note] : [],
          hadithIds: [hadith.id],
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.hadithIds.length !== a.hadithIds.length) {
      return b.hadithIds.length - a.hadithIds.length;
    }
    return a.nameTr.localeCompare(b.nameTr, 'tr');
  });
}
