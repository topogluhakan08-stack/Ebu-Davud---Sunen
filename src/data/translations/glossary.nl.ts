import type { GlossaryAndIsnadPack } from './lexiconTypes';

export const GLOSSARY_PACK_NL: GlossaryAndIsnadPack = {
  categories: {
    sened_sihhat: 'Overleveringsketen & Authenticiteit',
    telif_turleri: 'Genres & Verzamelingen',
    tahkik_hasiye: 'Tekstkritiek & Kanttekeningen',
  },
  layers: {
    prophet: 'Bron · Profetie ﷺ',
    sahabi: 'Metgezel (Sahabi)',
    tabiin: 'Opvolger (Tabi‘i)',
    etba: 'Volgende generatie / Sjeik',
    musannif: 'Samensteller (Aboe Dawoed)',
  },
  terms: {
    isnad: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Overleveringsketen (Isnad / Sanad)',
      definition:
        'De reeks overleveraars die een hadithtekst terugvoert tot de Profeet ﷺ of de oorspronkelijke spreker. Isnad-kritiek is de kernmaatstaf om authenticiteit en rechtstreekse overdracht (sama‘) tussen leraar en leerling te beoordelen.',
      exampleInApp:
        'In elke hadithkaart toont het tabblad "Isnad-keten" de generaties van de samensteller (Aboe Dawoed) tot aan de Metgezel en de Profeet ﷺ.',
      relatedLabel: 'Bekijk de isnad van hadith 4740',
    },
    metin: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Hadithtekst (Matn)',
      definition:
        'De overgeleverde inhoud aan het einde van de keten: een uitspraak, handeling of stilzwijgende instemming. Vocalisatie, handschriftvarianten en woordwortels vormen de directe basis voor juridische en ethische duiding.',
      exampleInApp:
        'Bij alle 38 hadiths van Kitab al-Adab (4740–4777) staat de matn los van de isnad, volledig gevocaliseerd en woord voor woord aanklikbaar.',
      relatedLabel: 'Verken alle 38 hadithteksten',
    },
    mursel: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Moersal-hadith (zonder Metgezel)',
      definition:
        'Een overlevering waarin een Opvolger (Tabi‘i) rechtstreeks van de Profeet ﷺ verhaalt zonder de tussenliggende Metgezel te noemen. In zijn Brief aan de Mekkanen stelt Aboe Dawoed dat een moersal bruikbaar is wanneer een doorlopende authentieke hadith ontbreekt.',
      exampleInApp:
        'De Soenan bevat ongeveer 600 moersal-hadiths; daarnaast schreef Aboe Dawoed het afzonderlijke werk Kitab al-Marasil (zie voetnoot bij hadith 4750).',
      relatedLabel: 'Bekijk de methode van de Soenan',
    },
    musned: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Moesnad-hadith (volledige keten)',
      definition:
        'Een overlevering die zonder onderbreking en zonder ontbrekende schakel terugreikt tot de Profeet ﷺ (marfoe‘ en moettasil). Wordt gebruikt tegenover de moersal-hadith.',
      exampleInApp:
        'In de Brief van Mekka benadrukt Aboe Dawoed dat hij geen moersal aanvoert zolang er over het onderwerp een authentieke moesnad-hadith bestaat.',
      relatedLabel: '6 principes uit de Brief van Mekka',
    },
    muttasil: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Ononderbroken keten (Moettasil / Ittisal)',
      definition:
        'Een aaneengesloten overleveringsketen waarin elke overleveraar de hadith persoonlijk van zijn directe leraar heeft ontvangen via rechtstreeks gehoor of een geldige overdrachtsvorm.',
      exampleInApp:
        'Bij hadith 4750 vergelijkt Aboe Dawoed de ittisal van Bakrs keten met 4749 en oordeelt: "Dit is de meest authentieke van de twee" (أصحّ الحديثين).',
      relatedLabel: 'Bekijk de vergelijking bij hadith 4750',
    },
    sahih: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Authentieke hadith (Sahih)',
      definition:
        'Hadith van de hoogste graad van betrouwbaarheid, doorlopend overgeleverd door rechtschapen (‘adl) en nauwkeurige (dabt) overleveraars, vrij van afwijking (sjoedhoedh) en verborgen gebrek (‘illa). Gedeelde hadiths van al-Boechari en Moeslim heten "Moettafaq ‘alaih".',
      exampleInApp:
        'In Kitab al-Adab komen talrijke hadiths (4740, 4746, 4748, 4752, 4753, 4762, 4771, 4774) ook voor bij al-Boechari en Moeslim.',
      relatedLabel: 'Gedeelde hadiths bij Boechari & Moeslim',
    },
    hasen: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Goede hadith (Hasan)',
      definition:
        'Aanvaardbare overlevering met betrouwbaarheid en doorlopende keten, vrij van afwijking en verwerping, waarbij de geheugenprecisie iets lager is dan bij sahih. Aboe Dawoed en at-Tirmidhi hebben deze term mede gevestigd.',
      exampleInApp:
        'Wanneer Aboe Dawoed een hadith "salih" noemt of erover zwijgt, beschouwen geleerden als Ibn as-Salah deze doorgaans als minstens hasan.',
      relatedLabel: 'Authenticiteitsgraden in de Soenan',
    },
    munker: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Verworpen / afwijkende hadith (Moenkar)',
      definition:
        'Alleenstaande overlevering van een zwakke overleveraar die botst met betrouwbare overleveraars (thiqa). Als een hoofdstuk geen andere tekst heeft, vermeldt Aboe Dawoed hem maar wijst hij uitdrukkelijk op zijn moenkar-status.',
      exampleInApp:
        'Het expliciete kritische oordeel tegenover de regel in de Brief van Mekka: "Elke hadith waarover ik zwijg is bruikbaar (salih)."',
      relatedLabel: 'Regel van zwijgen en moenkar',
    },
    zayif: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Zwakke hadith (Da‘if)',
      definition:
        'Een overlevering die niet aan alle voorwaarden van sahih of hasan voldoet. Volgens Aboe Dawoed weegt een niet-extreem zwakke hadith nog altijd zwaarder dan louter persoonlijke rechtsmening (ra’y) en mag hij voor fiqh-bespreking worden opgenomen.',
      exampleInApp:
        'Bekritiseerde hadiths in de Soenan worden door Aboe Dawoed zelf of door commentatoren (al-Moendhiri, Ibn al-Qayyim, al-Albani) afzonderlijk gemarkeerd.',
      relatedLabel: 'Benadering van da‘if en ra’y',
    },
    sukut: {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Het zwijgen van Aboe Dawoed (Soekoet)',
      definition:
        'Het feit dat Aboe Dawoed na een hadith geen afwijzend oordeel over de keten of status toevoegt. Hij lichtte toe dat zulke overleveringen "salih" (geschikt voor bewijsvoering en praktijk) zijn.',
      exampleInApp:
        'Bij de meeste hadiths zwijgt hij, terwijl hij bijv. in 4750 uitdrukkelijk voorkeur uitspreekt: "وهذا أصحّ الحديثين".',
      relatedLabel: 'Bestudeer het principe van soekoet',
    },
    ahkam: {
      categoryLabel: 'Genres & Verzamelingen',
      term: 'Rechtshadiths (Ahkam)',
      definition:
        'Overleveringen die praktische rechtsregels (aanbidding, handel, familierecht, strafrecht) onderbouwen. Verzamelingen van het type "Soenan" ordenen vooral ahkam-hadiths volgens fiqh-hoofdstukken.',
      exampleInApp:
        'Uit 500.000 hadiths selecteerde Aboe Dawoed 4.800 overwegend juridische hadiths, aangevuld met ethische boeken zoals Kitab al-Adab.',
      relatedLabel: 'Juridisch profiel & ahkam',
    },
    'cerh-tadil': {
      categoryLabel: 'Keten & Authenticiteit',
      term: 'Overleveraarskritiek (Djarh wa Ta‘dil)',
      definition:
        'De discipline die de morele integriteit (‘adala) en geheugennauwkeurigheid (dabt) van overleveraars onderzoekt om hen als betrouwbaar (thiqa, sadoeq) of zwak/verworpen te kwalificeren.',
      exampleInApp:
        'Aboe Dawoed was zelf een gezaghebbend criticus; werken als Soe’alat Abi ‘Oebayd al-Adjoerri en Tasmiyat al-ichwa zijn standaardbronnen.',
      relatedLabel: 'Kritiek van Aboe Dawoed',
    },
    tahric: {
      categoryLabel: 'Tekstkritiek & Kanttekeningen',
      term: 'Bronverwijzing (Tachridj)',
      definition:
        'Het vaststellen in welke andere hoofdverzamelingen (al-Boechari, Moeslim, at-Tirmidhi, an-Nasa’i, Ibn Madjah, Ahmad) een hadith voorkomt, met hoofdstuk- en nummervermelding.',
      exampleInApp:
        'Zichtbaar in de kritische editie van Moehammad ‘Awwama en op de bronbadges "al-Boechari / Moeslim / an-Nasa’i [4605]" bovenaan elke kaart.',
      relatedLabel: 'Bekijk de tachridj-badges',
    },
    mustahrec: {
      categoryLabel: 'Genres & Verzamelingen',
      term: 'Parallelketen-verzameling (Moestachradj)',
      definition:
        'Een werk waarin een geleerde de hadiths van een eerdere verzameling (zoals Soenan Abi Dawoed) via eigen ketens opnieuw overlevert die buiten de oorspronkelijke auteur om bij diens leraar samenkomen.',
      exampleInApp:
        'Tot de moestachradj-werken op de Soenan behoren de werken van Aboe Noe‘aim al-Isfahani en Qasim b. Asbagh.',
      relatedLabel: 'Studies over de Soenan',
    },
    zevaid: {
      categoryLabel: 'Genres & Verzamelingen',
      term: 'Aanvullende hadiths (Zawa’id)',
      definition:
        'Genre dat afzonderlijk de hadiths bijeenbrengt die wel in een bepaalde verzameling staan maar ontbreken in andere kernverzamelingen (zoals de twee Sahihs of de overige Zes Boeken).',
      exampleInApp:
        'Egyptische hadithgeleerden stelden zawa’id-werken samen voor de Soenan ten opzichte van de Sahihayn en andere Soenan.',
      relatedLabel: 'Bibliotheek van commentaren & studies',
    },
    serh: {
      categoryLabel: 'Genres & Verzamelingen',
      term: 'Geleerdencommentaar (Sjarh)',
      definition:
        'Uitvoerige toelichting op zeldzame woorden (gharib), morfologie, syntaxis, overleveringsverschillen en juridische gevolgtrekkingen van hadiths.',
      exampleInApp:
        'Het eerste commentaar op de Soenan is Ma‘alim as-Soenan van al-Chattabi, gevolgd door Ibn al-Qayyim, al-‘Azimabadi (‘Awn al-Ma‘boed) en as-Saharanpoeri (Badhl al-madjhoed).',
      relatedLabel: '9 grote Soenan-commentaren',
    },
    ihtisar: {
      categoryLabel: 'Genres & Verzamelingen',
      term: 'Samenvatting (Ichtisar / Moechtasar)',
      definition:
        'Methode om een omvangrijke hadithverzameling te bekorten door herhaalde ketens en parallelle wegen weg te laten ter bevordering van studie en memorisatie.',
      exampleInApp:
        'Moechtasar Soenan Abi Dawoed van Zakiyy ad-Din al-Moendhiri is de bron van de genummerde verwijzingen zoals [4605] in de voetnoten.',
      relatedLabel: 'Al-Moendhiri’s verkorting & studies',
    },
    'hasiye-rumuz': {
      categoryLabel: 'Tekstkritiek & Kanttekeningen',
      term: 'Tekstkritiek & handschriftsigla (ك، ص، د، م)',
      definition:
        'Afkortingen in het kritisch apparaat (hasjiya) van Moehammad ‘Awwama’s editie die tekst- en titelvarianten tussen handschriften (bijv. ك en ص) en recensies aangeven.',
      exampleInApp:
        'In hoofdstuk 4 geeft de noot "من حاشية ك فقط" aan dat de titel alleen in de marge van handschrift (ك) staat.',
      relatedLabel: 'Bekijk de noot bij hadith 4747',
    },
  },
  isnadUi: {
    treeTitle: 'Klassieke isnad-boom',
    narratorNodeUnit: 'overleveraars',
    multiTarikBadge: 'Meerdere wegen',
    cautionBadge: 'Isnad-noot',
    dirProphetToMusannif: 'Van de Profeet ﷺ naar Aboe Dawoed',
    dirMusannifToProphet: 'Van Aboe Dawoed naar de bron',
    zoomInAria: 'Isnad-schema inzoomen',
    zoomOutAria: 'Isnad-schema uitzoomen',
    resetZoomAria: 'Isnad-zoom resetten',
    collapseBtn: 'Verkleinen',
    fullscreenBtn: 'Volledig scherm',
    tabakaSuffix: 'Laag',
    dragHint: 'Slepen · Zoomen · Klik op een overleveraar voor details',
    closeBtn: 'Sluiten',
    closeNarratorAria: 'Overleveraardetails sluiten',
    whoIsLabel: 'Biografische noot (PDF-bronnen):',
    otherHadithsPrefix: 'Andere hadiths met deze overleveraar',
    otherHadithsUnit: 'hadiths',
    noOtherHadiths:
      'In deze selectie van 38 hadiths komt deze overleveraar in geen andere overlevering voor.',
    moreHadithsSuffix: 'meer hadiths',
    fullArabicIsnadHeader: 'Volledige Arabische isnad-tekst',
    fullscreenDialogAria: 'Isnad-boom op volledig scherm',
    exampleInAppLabel: 'Voorbeeld in de app:',
    noPdfBio: 'Geen biografische gegevens in de PDF',
    branchTarik: 'Weg',
    branchKol: 'Tak',
  },
  isnadNotes: {
    'Musannif (ö. 275/889)': 'Samensteller (overl. 275/889)',
    'Hâşiye k: eş-Şa‘îrî nisbesi eklenir': 'Kanttekening (ك): de nisba asj-Sja‘iri wordt toegevoegd.',
    'Hz. Peygamber’e 7–9/10 yıl hizmet eden sahâbî':
      'Metgezel die de Profeet ﷺ zeven tot tien jaar diende.',
    'Kābûs, İbn Abbâs’a yetişememiş, babası vasıtasıyla rivayet etmiştir':
      'Qaboes heeft Ibn ‘Abbas niet rechtstreeks ontmoet en levert over via zijn vader.',
    'Râvi Ebû Merhûm’un adını Abdürrahîm b. Meymûn olarak açıklar':
      'Identificeert Aboe Marhoem als ‘Abd ar-Rahim b. Maymoen.',
    'Diğer nüshalarda kardeşi Ebû Bekir b. Ebî Şeybe geçer':
      'Andere handschriften vermelden zijn broer Aboe Bakr b. Abi Sjayba.',
    'Ebû Dâvûd’un Bağdat’taki başlıca hocası (el-Müsned V, 152)':
      'Voornaamste leermeester van Aboe Dawoed in Bagdad (al-Moesnad V, 152).',
    '“Bu iki rivayetin en sahihidir” değerlendirmesini yapar':
      'Spreekt het oordeel uit: "Dit is de meest authentieke van de twee overleveringen."',
    'Mürsel tarik; Ebû Dâvûd, Ebû Harb’ın Ebû Zer’den doğrudan semâının mahfuz olmadığını belirterek bu tariki tercih eder':
      'Moersal-keten; Aboe Dawoed verkiest deze weg omdat rechtstreeks gehoor van Aboe Harb bij Aboe Dharr niet vaststaat.',
    'Ebû Dâvûd’un iki hocası lafız değil mâna birliğiyle nakleder':
      'Beide leraren van Aboe Dawoed leveren naar betekenis eensluidend over.',
    'Selm el-Alevî hakkındaki cerh ve nisbe açıklamasını ekler':
      'Voegt de overleveraarskritiek en nisba-uitleg over Salm al-‘Alawi toe.',
    'Zayıf râvi; Benî Alî b. Sûd nisbesine mensuptur':
      'Zwakke overleveraar; verbonden met de nisba Banoe ‘Ali b. Soed.',
    'Şu‘be’den yalnızca bu hadisi rivayet ettiği hâşiyede sorulur':
      'In de voetnoot wordt gevraagd of hij van Sjoe‘ba uitsluitend deze hadith overleverde.',
    'Ebû’l-Velîd/Hafs’ın “haddesenâ” lafzını Muhammed b. Kesîr’in “ahberenâ” lafzından ayırmaya özen gösterir':
      'Maakt nauwgezet onderscheid tussen "haddathana" (Aboe l-Walid/Hafs) en "achbarana" (Moehammad b. Kathir).',
    'Keyhârânî veya Kûhârânî şeklinde nisbe edilir; İbrâhim b. Nâfi‘in dayısıdır':
      'Draagt de nisba Kayharani of Koeharani; oom van moederszijde van Ibrahim b. Nafi‘.',
  },
  cautionReasons: {
    'Mübhem râvî (عَنْ رَجُلٍ)': 'Onbenoemde overleveraar (عَنْ رَجُلٍ)',
    'Tarîk 1’de mübhem râvî (عَنْ رَجُلٍ)': 'Onbenoemde overleveraar in weg 1 (عَنْ رَجُلٍ)',
    'Nüsha/şeyh farkı notu (Osmân / Ebû Bekir)':
      'Handschrift-/leraarvariant (‘Oethman / Aboe Bakr)',
    'Mürsel isnad (Bekr -> Ebû Zer arası inkıtâ)':
      'Moersal-isnad (onderbreking tussen Bakr en Aboe Dharr)',
    'Dipnotta zayıf/eleştirilen râvî kaydı':
      'Voetnootvermelding van een zwakke of bekritiseerde overleveraar',
    'İhtiyatlı ref‘ (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)':
      'Voorzichtige toeschrijving aan de Profeet ﷺ (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)',
  },
  tdvKnownBios: {
    'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889). TDV İslâm Ansiklopedisi maddesine göre es-Sünen’i 500.000 hadis arasından 4800 (4800-5274) hadis seçerek telif etmiştir.':
      'Aboe Dawoed Soelayman b. al-Asj‘ath as-Sidjistani (202–275 / 817–889). Volgens het TDV-artikel stelde hij de Soenan samen door 4.800 (4.800–5.274) hadiths uit 500.000 te selecteren.',
    'TDV Ebû Dâvûd maddesine göre Bağdat’taki en büyük hocasıdır; fıkıh ve ilim çizgisinde kendisinden çok etkilenmiştir.':
      'Volgens het TDV-artikel zijn belangrijkste leraar in Bagdad, die zijn juridische en wetenschappelijke koers sterk beïnvloedde.',
    'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki önde gelen hocaları arasında anılır.':
      'Moesaddad b. Moesarhad; in het TDV-artikel genoemd onder Aboe Dawoeds voornaamste leraren in Basra.',
    'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.':
      'Qoetayba b. Sa‘id; in het TDV-artikel vermeld als een van de voornaamste leraren van Aboe Dawoed.',
    'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında geçer.':
      '‘Abdoellah b. Maslama al-Qa‘nabi; in het TDV-artikel genoemd onder de belangrijke leraren van Aboe Dawoed.',
    'Süleyman b. Harb; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un önde gelen hocalarından biri olarak yer alır.':
      'Soelayman b. Harb; in het TDV-artikel opgenomen onder de vooraanstaande leraren van Aboe Dawoed.',
    'İbn Ebî Şeybe kardeşler (Ebû Bekir ve Osmân); TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.':
      'De broers Ibn Abi Sjayba (Aboe Bakr en ‘Oethman); in het TDV-artikel gerekend tot de voorname leraren van Aboe Dawoed.',
    'en-Nüfeylî; TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Harrân’daki başlıca hocalarındandır.':
      'An-Noefayli; volgens het TDV-artikel een van Aboe Dawoeds hoofdleraren in Harran.',
    'Hadisin ilk kaynağı Hz. Peygamber Muhammed Mustafa (ﷺ).':
      'Oorspronkelijke bron van de hadith: de Profeet Moehammad (ﷺ).',
  },
  narratorBios: {
    "PDF'te bilgi yok": 'Geen biografische gegevens in de PDF.',
    'İsnadda adı zikredilmeyen mübhem râvî (4745 ve 4757 no.lu hadislerde geçer).':
      'Onbenoemde overleveraar (moebham) in de keten (hadiths 4745 en 4757).',
    'İsnadlarda (ör. Ömer b. Yûnus, Hafs b. Ömer, Abdullah b. Ömer) yer alır; râvî detayı açısından bakınız: Ebû Dâvûd maddesi / PDF.':
      'Naam in de ketens (bijv. ‘Oemar b. Joenoes, Hafs b. ‘Oemar, ‘Abdoellah b. ‘Oemar); zie het artikel Aboe Dawoed / PDF.',
    'Sahâbî Enes b. Mâlik (r.a.); 4740-4742 ve 4771. hadislerde Hz. Peygamber’e 10 (veya 7-9) yıl hizmet ettiğini nakleder.':
      'Metgezel Anas b. Malik; verhaalt in 4740–4742 en 4771 dat hij de Profeet ﷺ tien (of zeven tot negen) jaar diende.',
    'Süleyman b. Harb (Ebû Dâvûd’un Basra ve Mekke’deki önde gelen şeyhlerindendir; TDV Ebû Dâvûd maddesi) veya Süleyman el-A‘meş.':
      'Soelayman b. Harb (vooraanstaand leraar van Aboe Dawoed in Basra en Mekka, TDV-artikel) of Soelayman al-A‘masj.',
    'İsnadlarda Muhammed b. el-Münkedir, Muhammed b. Amr, Muhammed b. Kesîr, Muhammed b. Osmân ve Muhammed b. es-Sabbâh gibi râvîlerin adıdır.':
      'Voornaam van overleveraars als Moehammad b. al-Moenkadir, Moehammad b. ‘Amr, Moehammad b. Kathir, Moehammad b. ‘Oethman en Moehammad b. as-Sabbah.',
    'Sahâbî Ebû Hüreyre (r.a.); 4743, 4748 ve 4757. hadislerin sahâbî râvîsidir.':
      'Metgezel Aboe Hoerayra; overleveraar van de hadiths 4743, 4748 en 4757.',
    'Ebû Dâvûd’un Harrânlı şeyhi en-Nüfeylî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Harrân’daki başlıca hocalarından biri olarak anılır.':
      'An-Noefayli uit Harran, in het TDV-artikel genoemd als een van Aboe Dawoeds belangrijkste leraren aldaar.',
    '4744’te İbn Abbâs (sahâbî), 4760’ta Ebû Dâvûd’un şeyhi Abbâs el-Anberî olarak geçer.':
      'Verwijst in 4744 naar de Metgezel Ibn ‘Abbas en in 4760 naar Aboe Dawoeds leraar ‘Abbas al-‘Anbari.',
    'TDV Ebû Dâvûd maddesine göre Ahmed b. Hanbel (Ebû Dâvûd’un Bağdat’taki en büyük hocası), ayrıca isnadlarda Ahmed b. Amr b. es-Serh, Ahmed b. Menî‘ ve Ahmed b. Yûnus yer alır.':
      'Volgens het TDV-artikel Ahmad b. Hanbal (grootste leraar van Aboe Dawoed in Bagdad); daarnaast komen Ahmad b. ‘Amr b. as-Sarh, Ahmad b. Mani‘ en Ahmad b. Joenoes voor.',
    'Kuteybe b. Saîd TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.':
      'Qoetayba b. Sa‘id, in het TDV-artikel vermeld onder Aboe Dawoeds belangrijkste leraren.',
    '4745’te Muâz b. Enes el-Cühenî, 4747’de Sahâbî Muâz b. Cebel (r.a.).':
      'Moe‘adh b. Anas al-Djoehani (4745) en de Metgezel Moe‘adh b. Djabal (4747).',
    'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889); es-Sünen musannifi.':
      'Aboe Dawoed Soelayman b. al-Asj‘ath as-Sidjistani (202–275 / 817–889), samensteller van de Soenan.',
    'Osmân b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.':
      '‘Oethman b. Abi Sjayba, in het TDV-artikel gerekend tot de vooraanstaande leraren van Aboe Dawoed.',
    'Osmân b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde hocaları arasında zikredilir.':
      '‘Oethman b. Abi Sjayba, in het TDV-artikel genoemd onder zijn leraren.',
    'Ebû Bekir ve Osmân kardeşlerin dedesi; TDV Ebû Dâvûd maddesinde “İbn Ebî Şeybe kardeşler” Ebû Dâvûd’un hocaları arasında geçer.':
      'Grootvader van de broers Aboe Bakr en ‘Oethman (Ibn Abi Sjayba), genoemd als leraren van Aboe Dawoed in het TDV-artikel.',
    '4777 no.lu hadis dipnotunda “وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ” diyerek ihtiyatlı ref‘ ifadesi kullanan meşhur tâbiîn âlimi.':
      'Beroemde geleerde van de Opvolgers die bij hadith 4777 de voorzichtige formule gebruikt: "Ik ken hem alleen van de Profeet ﷺ."',
    '4747’de râvî Cerîr b. Abdülhamîd; 4776’da Sahâbî Cerîr b. Abdullah el-Becelî (r.a.).':
      'Overleveraar Djarir b. ‘Abd al-Hamid (4747) en Metgezel Djarir b. ‘Abdillah al-Badjali (4776).',
    'Sahâbî Muâz b. Cebel’in (r.a.) babası; hadis 4747’de geçer.':
      'Vader van de Metgezel Moe‘adh b. Djabal; genoemd in hadith 4747.',
    'Ebû Bekir b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde hocaları arasında geçer.':
      'Aboe Bakr b. Abi Sjayba, genoemd onder Aboe Dawoeds leraren in het TDV-artikel.',
    '4748. hadisin sahâbî râvîsi Süleyman b. Surad (r.a.).':
      'Metgezel Soelayman b. Soerad, overleveraar van hadith 4748.',
    'TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Bağdat’taki en büyük hocası, fıkıh ve hadis üstadı Ahmed b. Hanbel.':
      'Volgens het TDV-artikel Ahmad b. Hanbal, Aboe Dawoeds grootste meester in fiqh en hadith te Bagdad.',
    'Süleyman b. Harb, TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarındandır.':
      'Soelayman b. Harb, volgens het TDV-artikel een van de voornaamste leraren van Aboe Dawoed.',
    '4750’de Tâbiî Ebu’l-Esved ed-Düelî, 4770’te Sahâbî Mikdâd b. el-Esved (r.a.).':
      'Opvolger Aboe l-Aswad ad-Doe’ali (4750) en Metgezel al-Miqdad b. al-Aswad (4770).',
    'Sahâbî Ebû Zer el-Gıfârî (r.a.); 4749 ve 4750 (mürsel tarîk) hadislerinin kaynağıdır.':
      'Metgezel Aboe Dharr al-Ghifari; bron van de hadiths 4749 en 4750 (moersal-keten).',
    '4751 no.lu hadiste “San‘a halkının vâizi (el-Kâss) Ebû Vâil” olarak nitelenir.':
      'In hadith 4751 aangeduid als "Aboe Wa’il, de prediker (al-Qass) van de mensen van Sanaa".',
    'Hadis 4751’de “أَهْلِ صَنْعَاءَ الْقَاصَّ” ifadesiyle Ebû Vâil’in sıfatıdır.':
      'Bijnaam van Aboe Wa’il in hadith 4751 ("prediker van de inwoners van Sanaa").',
    '4751’de babası ve dedesiyle Yemen’de geçen olayın anlatıcısı Urve b. Muhammed es-Sa‘dî; 4752’de Urve b. ez-Zübeyr.':
      '‘Oerwa b. Moehammad as-Sa‘di, verteller van de gebeurtenis in Jemen (4751), en ‘Oerwa b. az-Zoebayr (4752).',
    '4751’de “ceddî” Atıyye b. Sa‘d / Urve bağlantısı; ayrıca Ebû Mes‘ûd el-Bedrî (4764).':
      'Verbinding met ‘Atiyya b. Sa‘d (4751); tevens Aboe Mas‘oed al-Badri (4764).',
    'Müminlerin annesi Hz. Âişe (r.anhâ); 4752, 4753, 4758, 4759 ve 4774 no.lu hadisleri nakleder.':
      'Moeder der gelovigen ‘A’isja; levert de hadiths 4752, 4753, 4758, 4759 en 4774 over.',
    'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki meşhur hocalarından biri olarak anılır.':
      'Moesaddad b. Moesarhad, in het TDV-artikel vermeld als beroemd leraar van Aboe Dawoed in Basra.',
    '4756 no.lu hadis dipnotunda Selm el-Alevî’nin hadis âlimlerince zayıf görüldüğü ve yıldızları gözlemleme kıssası kaydedilir.':
      'De voetnoot bij hadith 4756 vermeldt dat Salm al-‘Alawi door hadithcritici als zwak wordt beschouwd en noemt zijn sterrenwaarneming.',
    '4756. hadis dipnotuna göre astronomi/yıldızlarla ilgilendiği için bu lakabı almıştır.':
      'Volgens de voetnoot bij hadith 4756 kreeg hij deze bijnaam vanwege zijn belangstelling voor de sterren.',
    'Süfyân es-Sevrî (4757, 4768) ve Süfyân b. Uyeyne (4758).':
      'Soefyan ath-Thawri (4757, 4768) en Soefyan b. ‘Oeyayna (4758).',
    'Yahyâ b. Ebî Kesîr (4757); ayrıca TDV Ebû Dâvûd maddesinde Yahyâ b. Maîn Ebû Dâvûd’un hocası olarak geçer.':
      'Jahja b. Abi Kathir (4757); het TDV-artikel noemt tevens Jahja b. Ma‘in als leraar van Aboe Dawoed.',
    'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında anılır.':
      '‘Abdoellah b. Maslama al-Qa‘nabi, in het TDV-artikel gerekend tot de voornaamste leraren van Aboe Dawoed.',
    'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un başlıca şeyhlerinden biri olarak anılır.':
      'Qoetayba b. Sa‘id, in het TDV-artikel genoemd als een van Aboe Dawoeds voornaamste sjeiks.',
    '4766 no.lu hadis dipnotunda “Keyhârânî veya Kûhârânî” nisbesiyle İbrâhim b. Nâfi‘in dayısı İbn Ya‘kûb olduğu belirtilir.':
      'De voetnoot bij hadith 4766 vermeldt Ibn Ja‘qoeb (nisba Kayharani of Koeharani) als oom van moederszijde van Ibrahim b. Nafi‘.',
    '4766 no.lu hadis dipnotuna göre “Keyhârânî” veya “Kûhârânî” biçiminde nisbe edilir; İbrâhim b. Nâfi‘in dayısıdır.':
      'Volgens de voetnoot bij hadith 4766 luidt zijn nisba Kayharani of Koeharani; oom van moederszijde van Ibrahim b. Nafi‘.',
    'Sahâbî Ebü’d-Derdâ (r.a.) ve eşi/râvîsi Ümmü’d-Derdâ (4766).':
      'Metgezel Aboe d-Darda’ en zijn echtgenote/overleveraar Oemm ad-Darda’ (4766).',
    '4767 no.lu hadisin sahâbî râvîsi Ebû Ümâme el-Bâhilî (r.a.).':
      'Metgezel Aboe Oemama al-Bahili, overleveraar van hadith 4767.',
    '4768 no.lu hadisin sahâbî râvîsi Hârise b. Vehb el-Huzâî (r.a.).':
      'Metgezel Haritha b. Wahb al-Choeza‘i, overleveraar van hadith 4768.',
    '4772 no.lu hadisin sahâbî râvîsi Ebû Bekre (Nüfey‘ b. el-Hâris r.a.).':
      'Metgezel Aboe Bakra (Noefay‘ b. al-Harith), overleveraar van hadith 4772.',
    '4774 no.lu hadisin sahâbî râvîsi Abdullah b. Mugaffel (r.a.).':
      'Metgezel ‘Abdoellah b. Moeghaffal, overleveraar van hadith 4774.',
    '4777 no.lu hadisin sahâbî râvîsi Sa‘d b. Ebî Vakkās (r.a.).':
      'Metgezel Sa‘d b. Abi Waqqas, overleveraar van hadith 4777.',
    '4751 no.lu hadiste Urve’nin dedesi; sahâbî veya tâbiî olarak geçer.':
      'Grootvader van ‘Oerwa in hadith 4751; wordt vermeld als Metgezel of Opvolger.',
    '4763. hadisin sahâbî râvîsi İmrân b. Husayn (Ebû Nüceyd r.a.).':
      'Metgezel ‘Imran b. Hoesayn (Aboe Noedjayd), overleveraar van hadith 4763.',
    '4763. hadiste İmrân b. Husayn ile konuşan Büşeyr b. Ka‘b.':
      'Boesjayr b. Ka‘b, gesprekspartner van ‘Imran b. Hoesayn in hadith 4763.',
    'Sahâbî İmrân b. Husayn’ın (r.a.) künyesi Ebû Nüceyd’dir (4763).':
      'Aboe Noedjayd is de koenya van de Metgezel ‘Imran b. Hoesayn (4763).',
    'Sahâbî Mikdâd b. el-Esved (r.a.); 4770. hadiste aşırı övgü karşısında yüzüne toprak serpmiştir.':
      'Metgezel al-Miqdad b. al-Aswad; strooide in hadith 4770 stof in het gezicht van een overdreven lofprijzer.',
  },
};
