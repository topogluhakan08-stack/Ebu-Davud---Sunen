import type { GlossaryAndIsnadPack } from './lexiconTypes';

export const GLOSSARY_PACK_DE: GlossaryAndIsnadPack = {
  categories: {
    sened_sihhat: 'Isnād & Authentizität',
    telif_turleri: 'Werkgattungen & Sammlungen',
    tahkik_hasiye: 'Textkritik & Randglossen',
  },
  layers: {
    prophet: 'Quelle · Prophetentum ﷺ',
    sahabi: 'Gefährte (Ṣaḥābī)',
    tabiin: 'Nachfolger (Tābiʿī)',
    etba: 'Nachfolger-Generation / Scheich',
    musannif: 'Verfasser (Abū Dāwūd)',
  },
  terms: {
    isnad: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Überliefererkette (Isnād / Sanad)',
      definition:
        'Die Kette der Überlieferer, die den Hadithtext bis zum Propheten ﷺ oder zum ersten Sprecher zurückführt. Die Isnād-Kritik ist das zentrale Maß zur Prüfung der Authentizität und der unmittelbaren Hörverbindung (Samāʿ).',
      exampleInApp:
        'In jeder Hadithkarte zeigt der Tab „Isnād-Kette“ die Generationen vom Verfasser (Abū Dāwūd) bis zum Gefährten und zum Propheten ﷺ.',
      relatedLabel: 'Isnād von Hadith 4740 ansehen',
    },
    metin: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Hadithtext (Matn)',
      definition:
        'Der am Ende der Überliefererkette überlieferte Wortlaut einer Aussage, Handlung oder stillschweigenden Billigung. Vokalisierung, Handschriftenvarianten und Wortwurzeln bilden die Grundlage für rechtliche und ethische Schlüsse.',
      exampleInApp:
        'Bei allen 38 Hadithen des Kitāb al-Adab (4740–4777) ist der Matn getrennt vom Isnād, vollständig vokalisiert und Wort für Wort analysierbar.',
      relatedLabel: 'Alle 38 Hadithtexte erkunden',
    },
    mursel: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Mursal-Hadith (ohne Gefährten-Glied)',
      definition:
        'Eine Überlieferung, in der ein Nachfolger (Tābiʿī) unmittelbar vom Propheten ﷺ berichtet, ohne den Gefährten dazwischen zu nennen. In seinem Brief an die Mekkaner erklärt Abū Dāwūd, dass man nach einem Mursal handeln darf, wenn kein verbundener authentischer Hadith vorliegt.',
      exampleInApp:
        'In den Sunan finden sich rund 600 Mursal-Hadithe; zudem verfasste Abū Dāwūd das eigenständige Werk Kitāb al-Marāsīl (vgl. Fußnote zu Hadith 4750).',
      relatedLabel: 'Methodik der Sunan ansehen',
    },
    musned: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Musnad-Hadith (vollständige Kette)',
      definition:
        'Eine ununterbrochen bis zum Propheten ﷺ zurückgeführte Überlieferung (marfūʿ und muttaṣil) ohne fehlendes Glied. Sie steht im Gegensatz zum Mursal-Hadith.',
      exampleInApp:
        'Im Mekka-Brief betont Abū Dāwūd, dass er keinen Mursal als Beleg anführt, solange es zum Thema einen authentischen Musnad-Hadith gibt.',
      relatedLabel: '6 Prinzipien des Mekka-Briefes',
    },
    muttasil: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Ununterbrochene Kette (Muttaṣil / Ittiṣāl)',
      definition:
        'Eine lückenlose Überlieferungskette, in der jeder Überlieferer den Hadith unmittelbar von seinem Lehrer durch direktes Hören oder eine anerkannte Empfangsform übernommen hat.',
      exampleInApp:
        'Bei Hadith 4750 vergleicht Abū Dāwūd den Ittiṣāl des Überlieferungsweges von Bakr mit 4749 und urteilt: „Dies ist der authentischere der beiden Hadithe“ (أصحّ الحديثين).',
      relatedLabel: 'Vergleich in Hadith 4750 ansehen',
    },
    sahih: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Authentischer Hadith (Ṣaḥīḥ)',
      definition:
        'Hadith höchsten Authentizitätsgrades, überliefert von rechtschaffenen (ʿadl) und gedächtnisstarken (ḍabṭ) Überlieferern über eine lückenlose Kette, frei von Abweichung (Schudhūdh) und verborgenem Mangel (ʿIlla). Gemeinsame Hadithe von al-Buchārī und Muslim gelten als „Muttafaq ʿalaih“.',
      exampleInApp:
        'Im Kitāb al-Adab sind zahlreiche Hadithe (4740, 4746, 4748, 4752, 4753, 4762, 4771, 4774) auch bei al-Buchārī und Muslim verzeichnet.',
      relatedLabel: 'Gemeinsame Hadithe bei Buchārī & Muslim',
    },
    hasen: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Guter Hadith (Ḥasan)',
      definition:
        'Annehmbare Überlieferung mit Rechtschaffenheit und Kettenkontinuität, frei von Anomalie und Verwerfung, bei der die Einprägsamkeit eines Überlieferers leicht unter dem Ṣaḥīḥ-Grad liegt. Abū Dāwūd und at-Tirmidhī prägten diesen Fachbegriff maßgeblich.',
      exampleInApp:
        'Bezeichnet Abū Dāwūd einen Hadith als „ṣāliḥ“ oder schweigt darüber, werten Gelehrte wie Ibn aṣ-Ṣalāḥ ihn mindestens als Ḥasan.',
      relatedLabel: 'Authentizitätsstufen der Sunan',
    },
    munker: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Verworfener / singulärer Hadith (Munkar)',
      definition:
        'Einzelüberlieferung eines schwachen Überlieferers im Widerspruch zu verlässlichen Gewährsleuten (Thiqa). Wenn in einem Kapitel kein anderer Text existiert, führt Abū Dāwūd ihn an, kennzeichnet ihn aber ausdrücklich als Munkar.',
      exampleInApp:
        'Das ausdrückliche Kritikurteil als Gegenpol zum Grundsatz im Mekka-Brief: „Jeder Hadith, über den ich schweige, ist tauglich (ṣāliḥ)“.',
      relatedLabel: 'Schweige- und Munkar-Regel',
    },
    zayif: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Schwacher Hadith (Ḍaʿīf)',
      definition:
        'Eine Überlieferung, die eine Bedingung von Ṣaḥīḥ oder Ḥasan nicht erfüllt. Für Abū Dāwūd ist ein nicht extrem schwacher Hadith dennoch der bloßen juristischen Eigenmeinung (Raʾy) vorzuziehen und kann im Fiqh diskutiert werden.',
      exampleInApp:
        'Kritisierte Überlieferungen in den Sunan werden von Abū Dāwūd selbst oder von Kommentatoren (al-Mundhirī, Ibn al-Qayyim, al-Albānī) besonders vermerkt.',
      relatedLabel: 'Umgang mit Ḍaʿīf und Raʾy',
    },
    sukut: {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Das Schweigen Abū Dāwūds (Sukūt)',
      definition:
        'Die Praxis Abū Dāwūds, nach einem Hadith keinen einschränkenden Kommentar abzugeben. Er selbst erläuterte, dass solche Hadithe als „ṣāliḥ“ (für Beweisführung und Praxis geeignet) gelten.',
      exampleInApp:
        'Bei den meisten Hadithen schweigt er, während er etwa bei 4750 mit „وهذا أصحّ الحديثين“ ausdrücklich eine Vorzugsbewertung abgibt.',
      relatedLabel: 'Prinzip des Schweigens ansehen',
    },
    ahkam: {
      categoryLabel: 'Werkgattungen & Sammlungen',
      term: 'Rechtshadithe (Aḥkām)',
      definition:
        'Überlieferungen, die praktische Rechtsnormen (Gottesdienst, Handelsrecht, Familien- und Strafrecht) begründen. Werke der Gattung „Sunan“ ordnen vor allem Aḥkām-Hadithe nach Fiqh-Kapiteln.',
      exampleInApp:
        'Aus 500.000 Hadithen wählte Abū Dāwūd 4.800 überwiegend rechtliche Hadithe aus und fügte am Ende Ethikbücher wie das Kitāb al-Adab an.',
      relatedLabel: 'Juristisches Profil & Aḥkām',
    },
    'cerh-tadil': {
      categoryLabel: 'Isnād & Authentizität',
      term: 'Überliefererkritik (al-Dscharḥ wa-t-Taʿdīl)',
      definition:
        'Die Wissenschaft zur Prüfung der moralischen Integrität (ʿAdāla) und Gedächtnistreue (Ḍabṭ) von Überlieferern, um sie als verlässlich (Thiqa, Ṣadūq) oder schwach/verworfen einzustufen.',
      exampleInApp:
        'Abū Dāwūd war selbst eine Autorität im Dscharḥ wa-t-Taʿdīl; Werke wie Suʾālāt Abī ʿUbaid al-Ādschurrī und Tasmiyat al-ichwa gelten als Standardquellen.',
      relatedLabel: 'Überliefererkritik Abū Dāwūds',
    },
    tahric: {
      categoryLabel: 'Textkritik & Randglossen',
      term: 'Quellennachweis (Tachrīdsch)',
      definition:
        'Der Nachweis, in welchen weiteren Hauptsammlungen (al-Buchārī, Muslim, at-Tirmidhī, an-Nasāʾī, Ibn Mādscha, Aḥmad) ein Hadith mit welcher Kapitel- und Nummernzählung vorkommt.',
      exampleInApp:
        'Sichtbar in der kritischen Edition von Muḥammad ʿAwwāma sowie in den Quellen-Abzeichen „al-Buchārī / Muslim / an-Nasāʾī [4605]“ oben auf jeder Karte.',
      relatedLabel: 'Tachrīdsch-Abzeichen ansehen',
    },
    mustahrec: {
      categoryLabel: 'Werkgattungen & Sammlungen',
      term: 'Parallelketten-Sammlung (Mustachradsch)',
      definition:
        'Ein Werk, in dem ein Gelehrter die Hadithe einer früheren Sammlung (etwa der Sunan Abī Dāwūd) über eigene Überliefererketten neu anführt, die sich erst beim Lehrer des ursprünglichen Verfassers treffen.',
      exampleInApp:
        'Zu den Mustachradsch-Werken über die Sunan gehören die Arbeiten von Abū Nuʿaim al-Iṣfahānī und Qāsim b. Aṣbagh.',
      relatedLabel: 'Studien zu den Sunan',
    },
    zevaid: {
      categoryLabel: 'Werkgattungen & Sammlungen',
      term: 'Zusatzüberlieferungen (Zawāʾid)',
      definition:
        'Werkgattung, die gezielt jene Hadithe einer Sammlung zusammenstellt, die in anderen Referenzwerken (etwa den beiden Ṣaḥīḥ-Werken oder den übrigen Sechs Büchern) nicht enthalten sind.',
      exampleInApp:
        'Ägyptische Hadithgelehrte verfassten eigene Zawāʾid-Studien zu den Sunan gegenüber den Ṣaḥīḥain und anderen Sunan.',
      relatedLabel: 'Kommentar- und Studienbibliothek',
    },
    serh: {
      categoryLabel: 'Werkgattungen & Sammlungen',
      term: 'Gelehrtenkommentar (Scharḥ)',
      definition:
        'Ausführliche Erläuterung seltener Wörter (Gharīb), morphologisch-syntaktischer Feinheiten, Überlieferervarianten und juristischer Folgerungen der Hadithe.',
      exampleInApp:
        'Der erste Kommentar der Sunan ist Maʿālim as-Sunan von al-Chaṭṭābī, gefolgt von Ibn al-Qayyim, al-ʿAẓīmābādī (ʿAun al-Maʿbūd) und as-Sahāranpūrī (Badhl al-madschhūd).',
      relatedLabel: '9 große Sunan-Kommentare',
    },
    ihtisar: {
      categoryLabel: 'Werkgattungen & Sammlungen',
      term: 'Kurzfassung (Ichtiṣār / Muchtasar)',
      definition:
        'Methode zur Straffung eines umfangreichen Hadithwerks durch Weglassen wiederholter Ketten und paralleler Wege, um Lektüre und Auswendiglernen zu erleichtern.',
      exampleInApp:
        'Zakiyy ad-Dīn al-Mundhirīs Muchtasar Sunan Abī Dāwūd ist die Quelle der eingeklammerten Zählungen wie [4605] in den Randglossen.',
      relatedLabel: 'Al-Mundhirīs Kurzfassung & Studien',
    },
    'hasiye-rumuz': {
      categoryLabel: 'Textkritik & Randglossen',
      term: 'Textkritik & Handschriftensiglen (ك، ص، د، م)',
      definition:
        'Abkürzungen im kritischen Apparat (Ḥāschiya) der Edition von Muḥammad ʿAwwāma, die Wortlaut- und Kapitelabweichungen zwischen Handschriften (z. B. ك und ص) sowie Überlieferungsrezensionen anzeigen.',
      exampleInApp:
        'In Kapitel 4 weist der Vermerk „من حاشية ك فقط“ darauf hin, dass die Überschrift nur am Rand der Handschrift (ك) steht.',
      relatedLabel: 'Glosse zu Hadith 4747 ansehen',
    },
  },
  isnadUi: {
    treeTitle: 'Klassischer Isnād-Baum',
    narratorNodeUnit: 'Überlieferer',
    multiTarikBadge: 'Mehrere Wege',
    cautionBadge: 'Isnād-Hinweis',
    dirProphetToMusannif: 'Vom Propheten ﷺ zu Abū Dāwūd',
    dirMusannifToProphet: 'Von Abū Dāwūd zur Quelle',
    zoomInAria: 'Isnād-Diagramm vergrößern',
    zoomOutAria: 'Isnād-Diagramm verkleinern',
    resetZoomAria: 'Isnād-Zoom zurücksetzen',
    collapseBtn: 'Verkleinern',
    fullscreenBtn: 'Vollbild',
    tabakaSuffix: 'Schicht',
    dragHint: 'Ziehen · Zoomen · Für Details auf einen Überlieferer klicken',
    closeBtn: 'Schließen',
    closeNarratorAria: 'Überliefererdetails schließen',
    whoIsLabel: 'Kurzprofil (PDF-Quellen):',
    otherHadithsPrefix: 'Weitere Hadithe mit diesem Überlieferer',
    otherHadithsUnit: 'Hadithe',
    noOtherHadiths:
      'In diesem Abschnitt mit 38 Hadithen kommt dieser Überlieferer in keiner weiteren Überlieferung vor.',
    moreHadithsSuffix: 'weitere Hadithe',
    fullArabicIsnadHeader: 'Vollständiger arabischer Isnād-Text',
    fullscreenDialogAria: 'Isnād-Baum im Vollbildmodus',
    exampleInAppLabel: 'Beispiel in der Anwendung:',
    noPdfBio: 'Keine biografischen Angaben im PDF',
    branchTarik: 'Weg',
    branchKol: 'Zweig',
  },
  isnadNotes: {
    'Musannif (ö. 275/889)': 'Verfasser / Kompilator (gest. 275/889)',
    'Hâşiye k: eş-Şa‘îrî nisbesi eklenir': 'Randglosse (ك): Die Nisba asch-Schaʿīrī wird ergänzt.',
    'Hz. Peygamber’e 7–9/10 yıl hizmet eden sahâbî':
      'Gefährte, der dem Propheten ﷺ sieben bis zehn Jahre diente.',
    'Kābûs, İbn Abbâs’a yetişememiş, babası vasıtasıyla rivayet etmiştir':
      'Qābūs traf Ibn ʿAbbās nicht mehr direkt und überlieferte über seinen Vater.',
    'Râvi Ebû Merhûm’un adını Abdürrahîm b. Meymûn olarak açıklar':
      'Nennt den Namen von Abū Marḥūm als ʿAbd ar-Raḥīm b. Maimūn.',
    'Diğer nüshalarda kardeşi Ebû Bekir b. Ebî Şeybe geçer':
      'Andere Handschriften nennen seinen Bruder Abū Bakr b. Abī Schaiba.',
    'Ebû Dâvûd’un Bağdat’taki başlıca hocası (el-Müsned V, 152)':
      'Wichtigster Lehrer Abū Dāwūds in Bagdad (al-Musnad V, 152).',
    '“Bu iki rivayetin en sahihidir” değerlendirmesini yapar':
      'Fällt das Urteil: „Dies ist die authentischere der beiden Überlieferungen.“',
    'Mürsel tarik; Ebû Dâvûd, Ebû Harb’ın Ebû Zer’den doğrudan semâının mahfuz olmadığını belirterek bu tariki tercih eder':
      'Mursal-Weg; Abū Dāwūd bevorzugt diesen Weg, da ein direktes Hören Abū Ḥarbs von Abū Dharr nicht gesichert ist.',
    'Ebû Dâvûd’un iki hocası lafız değil mâna birliğiyle nakleder':
      'Beide Lehrer Abū Dāwūds überliefern sinngemäß übereinstimmend.',
    'Selm el-Alevî hakkındaki cerh ve nisbe açıklamasını ekler':
      'Fügt die Überliefererkritik und Nisba-Erklärung zu Salm al-ʿAlawī hinzu.',
    'Zayıf râvi; Benî Alî b. Sûd nisbesine mensuptur':
      'Schwacher Überlieferer; trägt die Nisba der Banū ʿAlī b. Sūd.',
    'Şu‘be’den yalnızca bu hadisi rivayet ettiği hâşiyede sorulur':
      'In der Randglosse wird gefragt, ob er von Schuʿba allein diesen Hadith überlieferte.',
    'Ebû’l-Velîd/Hafs’ın “haddesenâ” lafzını Muhammed b. Kesîr’in “ahberenâ” lafzından ayırmaya özen gösterir':
      'Unterscheidet sorgfältig zwischen „ḥaddathanā“ (Abū l-Walīd/Ḥafṣ) und „achbaranā“ (Muḥammad b. Kathīr).',
    'Keyhârânî veya Kûhârânî şeklinde nisbe edilir; İbrâhim b. Nâfi‘in dayısıdır':
      'Trägt die Nisba Kaihārānī oder Kūhārānī; Onkel mütterlicherseits von Ibrāhīm b. Nāfiʿ.',
  },
  cautionReasons: {
    'Mübhem râvî (عَنْ رَجُلٍ)': 'Unbenannter Überlieferer (عَنْ رَجُلٍ)',
    'Tarîk 1’de mübhem râvî (عَنْ رَجُلٍ)': 'Unbenannter Überlieferer in Weg 1 (عَنْ رَجُلٍ)',
    'Nüsha/şeyh farkı notu (Osmân / Ebû Bekir)':
      'Handschriften-/Lehrervariante (ʿUthmān / Abū Bakr)',
    'Mürsel isnad (Bekr -> Ebû Zer arası inkıtâ)':
      'Mursal-Isnād (Unterbrechung zwischen Bakr und Abū Dharr)',
    'Dipnotta zayıf/eleştirilen râvî kaydı':
      'Hinweis in der Fußnote auf schwachen/kritisierten Überlieferer',
    'İhtiyatlı ref‘ (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)':
      'Vorsichtige Zuschreibung an den Propheten ﷺ (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)',
  },
  tdvKnownBios: {
    'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889). TDV İslâm Ansiklopedisi maddesine göre es-Sünen’i 500.000 hadis arasından 4800 (4800-5274) hadis seçerek telif etmiştir.':
      'Abū Dāwūd Sulaimān b. al-Aschʿath as-Sidschistānī (202–275 / 817–889). Laut TDV-Artikel stellte er die Sunan durch Auswahl von 4.800 (4.800–5.274) aus 500.000 Hadithen zusammen.',
    'TDV Ebû Dâvûd maddesine göre Bağdat’taki en büyük hocasıdır; fıkıh ve ilim çizgisinde kendisinden çok etkilenmiştir.':
      'Laut TDV-Artikel sein bedeutendster Lehrer in Bagdad, der seine juristische und wissenschaftliche Ausrichtung prägte.',
    'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki önde gelen hocaları arasında anılır.':
      'Musaddad b. Musarhad; im TDV-Artikel unter den führenden Lehrern Abū Dāwūds in Basra genannt.',
    'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.':
      'Qutaiba b. Saʿīd; im TDV-Artikel als einer der wichtigsten Lehrer Abū Dāwūds aufgeführt.',
    'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında geçer.':
      'ʿAbdullāh b. Maslama al-Qaʿnabī; im TDV-Artikel unter den bedeutenden Lehrern Abū Dāwūds erwähnt.',
    'Süleyman b. Harb; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un önde gelen hocalarından biri olarak yer alır.':
      'Sulaimān b. Ḥarb; im TDV-Artikel als einer der hervorragenden Lehrer Abū Dāwūds genannt.',
    'İbn Ebî Şeybe kardeşler (Ebû Bekir ve Osmân); TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.':
      'Die Brüder Ibn Abī Schaiba (Abū Bakr und ʿUthmān); im TDV-Artikel unter den namhaften Lehrern Abū Dāwūds gezählt.',
    'en-Nüfeylî; TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Harrân’daki başlıca hocalarındandır.':
      'An-Nufailī; laut TDV-Artikel einer der Hauptlehrer Abū Dāwūds in Harrān.',
    'Hadisin ilk kaynağı Hz. Peygamber Muhammed Mustafa (ﷺ).':
      'Ursprungsquelle des Hadiths: der Prophet Muḥammad (ﷺ).',
  },
  narratorBios: {
    "PDF'te bilgi yok": 'Keine biografischen Angaben im PDF.',
    'İsnadda adı zikredilmeyen mübhem râvî (4745 ve 4757 no.lu hadislerde geçer).':
      'Unbenannter Überlieferer (Mubham) im Isnād (Hadithe 4745 und 4757).',
    'İsnadlarda (ör. Ömer b. Yûnus, Hafs b. Ömer, Abdullah b. Ömer) yer alır; râvî detayı açısından bakınız: Ebû Dâvûd maddesi / PDF.':
      'Name in den Überliefererketten (z. B. ʿUmar b. Yūnus, Ḥafṣ b. ʿUmar, ʿAbdullāh b. ʿUmar); siehe Artikel Abū Dāwūd / PDF.',
    'Sahâbî Enes b. Mâlik (r.a.); 4740-4742 ve 4771. hadislerde Hz. Peygamber’e 10 (veya 7-9) yıl hizmet ettiğini nakleder.':
      'Gefährte Anas b. Mālik (Allāh habe Wohlgefallen an ihm); berichtet in 4740–4742 und 4771 von seinem zehn- (bzw. sieben- bis neun-)jährigen Dienst beim Propheten ﷺ.',
    'Süleyman b. Harb (Ebû Dâvûd’un Basra ve Mekke’deki önde gelen şeyhlerindendir; TDV Ebû Dâvûd maddesi) veya Süleyman el-A‘meş.':
      'Sulaimān b. Ḥarb (bedeutender Lehrer Abū Dāwūds in Basra und Mekka, TDV-Artikel) oder Sulaimān al-Aʿmasch.',
    'İsnadlarda Muhammed b. el-Münkedir, Muhammed b. Amr, Muhammed b. Kesîr, Muhammed b. Osmân ve Muhammed b. es-Sabbâh gibi râvîlerin adıdır.':
      'Vorname von Überlieferern wie Muḥammad b. al-Munkadir, Muḥammad b. ʿAmr, Muḥammad b. Kathīr, Muḥammad b. ʿUthmān und Muḥammad b. aṣ-Ṣabbāḥ.',
    'Sahâbî Ebû Hüreyre (r.a.); 4743, 4748 ve 4757. hadislerin sahâbî râvîsidir.':
      'Gefährte Abū Huraira; Überlieferer der Hadithe 4743, 4748 und 4757.',
    'Ebû Dâvûd’un Harrânlı şeyhi en-Nüfeylî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Harrân’daki başlıca hocalarından biri olarak anılır.':
      'An-Nufailī aus Harrān, im TDV-Artikel als einer der wichtigsten Lehrer Abū Dāwūds in Harrān genannt.',
    '4744’te İbn Abbâs (sahâbî), 4760’ta Ebû Dâvûd’un şeyhi Abbâs el-Anberî olarak geçer.':
      'Bezeichnet in 4744 den Gefährten Ibn ʿAbbās und in 4760 Abū Dāwūds Lehrer ʿAbbās al-ʿAnbarī.',
    'TDV Ebû Dâvûd maddesine göre Ahmed b. Hanbel (Ebû Dâvûd’un Bağdat’taki en büyük hocası), ayrıca isnadlarda Ahmed b. Amr b. es-Serh, Ahmed b. Menî‘ ve Ahmed b. Yûnus yer alır.':
      'Laut TDV-Artikel Aḥmad b. Ḥanbal (größter Lehrer Abū Dāwūds in Bagdad); in den Ketten erscheinen auch Aḥmad b. ʿAmr b. as-Sarḥ, Aḥmad b. Manīʿ und Aḥmad b. Yūnus.',
    'Kuteybe b. Saîd TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.':
      'Qutaiba b. Saʿīd, im TDV-Artikel unter den Hauptlehrern Abū Dāwūds genannt.',
    '4745’te Muâz b. Enes el-Cühenî, 4747’de Sahâbî Muâz b. Cebel (r.a.).':
      'Muʿādh b. Anas al-Dschuhanī (4745) und der Gefährte Muʿādh b. Dschabal (4747).',
    'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889); es-Sünen musannifi.':
      'Abū Dāwūd Sulaimān b. al-Aschʿath as-Sidschistānī (202–275 / 817–889), Verfasser der Sunan.',
    'Osmân b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.':
      'ʿUthmān b. Abī Schaiba, im TDV-Artikel zu den namhaften Lehrern Abū Dāwūds gezählt.',
    'Osmân b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde hocaları arasında zikredilir.':
      'ʿUthmān b. Abī Schaiba, im TDV-Artikel unter seinen Lehrern genannt.',
    'Ebû Bekir ve Osmân kardeşlerin dedesi; TDV Ebû Dâvûd maddesinde “İbn Ebî Şeybe kardeşler” Ebû Dâvûd’un hocaları arasında geçer.':
      'Großvater der Brüder Abū Bakr und ʿUthmān (Ibn Abī Schaiba), im TDV-Artikel als Lehrer Abū Dāwūds angeführt.',
    '4777 no.lu hadis dipnotunda “وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ” diyerek ihtiyatlı ref‘ ifadesi kullanan meşhur tâbiîn âlimi.':
      'Berühmter Gelehrter der Nachfolger-Generation, der in Hadith 4777 vorsichtig formuliert: „Ich kenne ihn nur vom Propheten ﷺ.“',
    '4747’de râvî Cerîr b. Abdülhamîd; 4776’da Sahâbî Cerîr b. Abdullah el-Becelî (r.a.).':
      'Überlieferer Dscharīr b. ʿAbd al-Ḥamīd (4747) und Gefährte Dscharīr b. ʿAbdillāh al-Badschelī (4776).',
    'Sahâbî Muâz b. Cebel’in (r.a.) babası; hadis 4747’de geçer.':
      'Vater des Gefährten Muʿādh b. Dschabal; erscheint in Hadith 4747.',
    'Ebû Bekir b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde hocaları arasında geçer.':
      'Abū Bakr b. Abī Schaiba, im TDV-Artikel unter Abū Dāwūds Lehrern aufgeführt.',
    '4748. hadisin sahâbî râvîsi Süleyman b. Surad (r.a.).':
      'Gefährte Sulaimān b. Ṣurad, Überlieferer von Hadith 4748.',
    'TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Bağdat’taki en büyük hocası, fıkıh ve hadis üstadı Ahmed b. Hanbel.':
      'Laut TDV-Artikel Aḥmad b. Ḥanbal, Abū Dāwūds größter Lehrer für Fiqh und Hadith in Bagdad.',
    'Süleyman b. Harb, TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarındandır.':
      'Sulaimān b. Ḥarb, laut TDV-Artikel einer der bedeutendsten Lehrer Abū Dāwūds.',
    '4750’de Tâbiî Ebu’l-Esved ed-Düelî, 4770’te Sahâbî Mikdâd b. el-Esved (r.a.).':
      'Nachfolger Abū l-Aswad ad-Duʾalī (4750) und Gefährte al-Miqdād b. al-Aswad (4770).',
    'Sahâbî Ebû Zer el-Gıfârî (r.a.); 4749 ve 4750 (mürsel tarîk) hadislerinin kaynağıdır.':
      'Gefährte Abū Dharr al-Ghifārī; Quelle der Hadithe 4749 und 4750 (Mursal-Weg).',
    '4751 no.lu hadiste “San‘a halkının vâizi (el-Kâss) Ebû Vâil” olarak nitelenir.':
      'In Hadith 4751 als „Abū Wāʾil, der Prediger (al-Qāṣṣ) der Bewohner von Sanaa“ bezeichnet.',
    'Hadis 4751’de “أَهْلِ صَنْعَاءَ الْقَاصَّ” ifadesiyle Ebû Vâil’in sıfatıdır.':
      'Beiname Abū Wāʾils in Hadith 4751 („Prediger der Bewohner von Sanaa“).',
    '4751’de babası ve dedesiyle Yemen’de geçen olayın anlatıcısı Urve b. Muhammed es-Sa‘dî; 4752’de Urve b. ez-Zübeyr.':
      'ʿUrwa b. Muḥammad as-Saʿdī, Erzähler der Begebenheit im Jemen (4751), sowie ʿUrwa b. az-Zubair (4752).',
    '4751’de “ceddî” Atıyye b. Sa‘d / Urve bağlantısı; ayrıca Ebû Mes‘ûd el-Bedrî (4764).':
      'Verbindung zu ʿAṭiyya b. Saʿd (4751); ferner Abū Masʿūd al-Badrī (4764).',
    'Müminlerin annesi Hz. Âişe (r.anhâ); 4752, 4753, 4758, 4759 ve 4774 no.lu hadisleri nakleder.':
      'Die Mutter der Gläubigen ʿĀʾischa; überliefert die Hadithe 4752, 4753, 4758, 4759 und 4774.',
    'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki meşhur hocalarından biri olarak anılır.':
      'Musaddad b. Musarhad, im TDV-Artikel als berühmter Lehrer Abū Dāwūds in Basra erwähnt.',
    '4756 no.lu hadis dipnotunda Selm el-Alevî’nin hadis âlimlerince zayıf görüldüğü ve yıldızları gözlemleme kıssası kaydedilir.':
      'Die Fußnote zu Hadith 4756 vermerkt, dass Salm al-ʿAlawī von Hadithkritikern als schwach eingestuft wird, und erwähnt seine Sternenbeobachtung.',
    '4756. hadis dipnotuna göre astronomi/yıldızlarla ilgilendiği için bu lakabı almıştır.':
      'Laut Fußnote zu Hadith 4756 erhielt er diesen Beinamen wegen seines Interesses an den Gestirnen.',
    'Süfyân es-Sevrî (4757, 4768) ve Süfyân b. Uyeyne (4758).':
      'Sufyān ath-Thaurī (4757, 4768) und Sufyān b. ʿUyaina (4758).',
    'Yahyâ b. Ebî Kesîr (4757); ayrıca TDV Ebû Dâvûd maddesinde Yahyâ b. Maîn Ebû Dâvûd’un hocası olarak geçer.':
      'Yaḥyā b. Abī Kathīr (4757); im TDV-Artikel wird auch Yaḥyā b. Maʿīn als Lehrer Abū Dāwūds genannt.',
    'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında anılır.':
      'ʿAbdullāh b. Maslama al-Qaʿnabī, im TDV-Artikel unter den Hauptlehrern Abū Dāwūds aufgeführt.',
    'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un başlıca şeyhlerinden biri olarak anılır.':
      'Qutaiba b. Saʿīd, im TDV-Artikel als einer der führenden Lehrer Abū Dāwūds genannt.',
    '4766 no.lu hadis dipnotunda “Keyhârânî veya Kûhârânî” nisbesiyle İbrâhim b. Nâfi‘in dayısı İbn Ya‘kûb olduğu belirtilir.':
      'Die Fußnote zu Hadith 4766 bestimmt Ibn Yaʿqūb (Nisba Kaihārānī oder Kūhārānī) als Onkel mütterlicherseits von Ibrāhīm b. Nāfiʿ.',
    '4766 no.lu hadis dipnotuna göre “Keyhârânî” veya “Kûhârânî” biçiminde nisbe edilir; İbrâhim b. Nâfi‘in dayısıdır.':
      'Laut Fußnote zu Hadith 4766 lautet seine Nisba Kaihārānī oder Kūhārānī; Onkel mütterlicherseits von Ibrāhīm b. Nāfiʿ.',
    'Sahâbî Ebü’d-Derdâ (r.a.) ve eşi/râvîsi Ümmü’d-Derdâ (4766).':
      'Der Gefährte Abū d-Dardāʾ und seine Gattin/Überlieferin Umm ad-Dardāʾ (4766).',
    '4767 no.lu hadisin sahâbî râvîsi Ebû Ümâme el-Bâhilî (r.a.).':
      'Der Gefährte Abū Umāma al-Bāhilī, Überlieferer von Hadith 4767.',
    '4768 no.lu hadisin sahâbî râvîsi Hârise b. Vehb el-Huzâî (r.a.).':
      'Der Gefährte Ḥāritha b. Wahb al-Chuzāʿī, Überlieferer von Hadith 4768.',
    '4772 no.lu hadisin sahâbî râvîsi Ebû Bekre (Nüfey‘ b. el-Hâris r.a.).':
      'Der Gefährte Abū Bakra (Nufaiʿ b. al-Ḥārith), Überlieferer von Hadith 4772.',
    '4774 no.lu hadisin sahâbî râvîsi Abdullah b. Mugaffel (r.a.).':
      'Der Gefährte ʿAbdullāh b. Mughaffal, Überlieferer von Hadith 4774.',
    '4777 no.lu hadisin sahâbî râvîsi Sa‘d b. Ebî Vakkās (r.a.).':
      'Der Gefährte Saʿd b. Abī Waqqāṣ, Überlieferer von Hadith 4777.',
    '4751 no.lu hadiste Urve’nin dedesi; sahâbî veya tâbiî olarak geçer.':
      'Großvater ʿUrwas in Hadith 4751; wird als Gefährte oder Nachfolger geführt.',
    '4763. hadisin sahâbî râvîsi İmrân b. Husayn (Ebû Nüceyd r.a.).':
      'Der Gefährte ʿImrān b. Ḥuṣain (Abū Nudschayd), Überlieferer von Hadith 4763.',
    '4763. hadiste İmrân b. Husayn ile konuşan Büşeyr b. Ka‘b.':
      'Buschair b. Kaʿb, Gesprächspartner von ʿImrān b. Ḥuṣain in Hadith 4763.',
    'Sahâbî İmrân b. Husayn’ın (r.a.) künyesi Ebû Nüceyd’dir (4763).':
      'Abū Nudschayd ist die Kunya des Gefährten ʿImrān b. Ḥuṣain (4763).',
    'Sahâbî Mikdâd b. el-Esved (r.a.); 4770. hadiste aşırı övgü karşısında yüzüne toprak serpmiştir.':
      'Der Gefährte al-Miqdād b. al-Aswad; warf in Hadith 4770 einem übermäßigen Lobredner Staub ins Gesicht.',
  },
};
