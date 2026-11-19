import type { GlossaryAndIsnadPack } from './lexiconTypes';

export const GLOSSARY_PACK_FR: GlossaryAndIsnadPack = {
  categories: {
    sened_sihhat: 'Chaîne (Sanad) & Authenticité',
    telif_turleri: 'Genres d’ouvrages & Recueils',
    tahkik_hasiye: 'Édition critique & Gloses',
  },
  layers: {
    prophet: 'Source · Prophétie ﷺ',
    sahabi: 'Compagnon (Sahâbî)',
    tabiin: 'Successeur (Tâbi‘î)',
    etba: 'Suivant / Maître (Shaykh)',
    musannif: 'Compilateur (Abû Dâwûd)',
  },
  terms: {
    isnad: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Chaîne de transmission (Isnâd / Sanad)',
      definition:
        'Chaîne des transmetteurs reliant le texte du hadith au Prophète ﷺ ou à son premier locuteur. La critique de l’isnâd est le critère fondamental pour établir l’authenticité et vérifier la possibilité d’audition directe (samâ‘) entre chaque maître et élève.',
      exampleInApp:
        'Dans chaque carte de hadith, l’onglet « Chaîne d’isnâd » présente les strates depuis le compilateur (Abû Dâwûd) jusqu’au Compagnon et au Prophète ﷺ.',
      relatedLabel: 'Voir l’isnâd du hadith 4740',
    },
    metin: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Texte du hadith (Matn)',
      definition:
        'Contenu rapporté au terme de la chaîne de transmission : parole, acte ou approbation tacite. La vocalisation exacte, les variantes manuscrites et les racines lexicales fondent directement la portée juridique et morale.',
      exampleInApp:
        'Pour les 38 hadiths du Kitâb al-Adab (4740–4777), le matn est séparé de l’isnâd, entièrement vocalisé et doté d’une analyse lexicale mot à mot.',
      relatedLabel: 'Explorer les 38 textes de hadiths',
    },
    mursel: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Hadith mursal (interrompu au Compagnon)',
      definition:
        'Récit rapporté par un Successeur (Tâbi‘î) directement du Prophète ﷺ sans mentionner le Compagnon intermédiaire. Dans sa Lettre aux gens de La Mecque, Abû Dâwûd précise qu’on peut agir selon un mursal en l’absence de hadith authentique continu.',
      exampleInApp:
        'Les Sunan renferment environ 600 hadiths mursal ; Abû Dâwûd a aussi composé un ouvrage indépendant intitulé Kitâb al-Marâsîl (voir la note du hadith 4750).',
      relatedLabel: 'Voir la méthode des Sunan',
    },
    musned: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Hadith musnad (chaîne complète)',
      definition:
        'Tradition remontant sans interruption jusqu’au Prophète ﷺ (marfû‘ et muttasil), sans aucun maillon manquant. Il est employé en opposition au hadith mursal.',
      exampleInApp:
        'Dans sa Lettre aux gens de La Mecque, Abû Dâwûd souligne qu’il n’invoque pas un mursal lorsqu’un hadith musnad authentique existe sur la question.',
      relatedLabel: '6 principes de la Lettre de La Mecque',
    },
    muttasil: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Chaîne ininterrompue (Muttasil / Ittisâl)',
      definition:
        'Structure de transmission continue dans laquelle chaque transmetteur a reçu le hadith de son maître immédiat par audition directe ou mode de réception agréé.',
      exampleInApp:
        'Au hadith 4750, Abû Dâwûd compare l’ittisâl de la voie de Bakr avec celle du 4749 et déclare : « C’est le plus authentique des deux récits » (أصحّ الحديثين).',
      relatedLabel: 'Voir la comparaison du hadith 4750',
    },
    sahih: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Hadith authentique (Sahîh)',
      definition:
        'Tradition du plus haut degré d’authenticité, transmise par des rapporteurs probes (‘adl) et précis (dabt) via une chaîne continue, exempte d’anomalie (shudhûdh) et de défaut caché (‘illa). Les récits communs à al-Boukhârî et Mouslim sont dits « Muttafaq ‘alayh ».',
      exampleInApp:
        'Dans le Kitâb al-Adab, de nombreux hadiths (4740, 4746, 4748, 4752, 4753, 4762, 4771, 4774) figurent également chez al-Boukhârî et Mouslim.',
      relatedLabel: 'Hadiths communs à Boukhârî et Mouslim',
    },
    hasen: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Hadith bon (Hasan)',
      definition:
        'Tradition recevable réunissant probité et continuité de chaîne, exempte d’anomalie et de rejet, mais dont la précision mémorielle d’un transmetteur est légèrement inférieure au degré sahîh. Abû Dâwûd et at-Tirmidhî ont contribué à fixer ce terme.',
      exampleInApp:
        'Lorsque Abû Dâwûd qualifie un hadith de « sâlih » ou garde le silence à son sujet, des savants comme Ibn as-Salâh estiment qu’il atteint au moins le rang hasan.',
      relatedLabel: 'Degrés d’authenticité dans les Sunan',
    },
    munker: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Hadith rejeté / singulier (Munkar)',
      definition:
        'Récit isolé rapporté par un transmetteur faible en contradiction avec des rapporteurs fiables (thiqa). Lorsqu’aucune autre tradition n’existe sur un chapitre, Abû Dâwûd le cite mais signale explicitement son caractère munkar.',
      exampleInApp:
        'C’est le jugement critique explicite qui fait contrepoids à la règle de la Lettre de La Mecque : « Tout hadith sur lequel je me tais est recevable (sâlih) ».',
      relatedLabel: 'Règle du silence et du munkar',
    },
    zayif: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Hadith faible (Da‘îf)',
      definition:
        'Tradition ne remplissant pas l’une des conditions du sahîh ou du hasan. Selon Abû Dâwûd, un hadith faible sans faiblesse extrême demeure préférable à l’opinion personnelle (ra’y) des juristes et peut être retenu pour la discussion juridique.',
      exampleInApp:
        'Les récits critiqués des Sunan sont signalés par Abû Dâwûd lui-même ou par les commentateurs (al-Mundhirî, Ibn al-Qayyim, al-Albânî).',
      relatedLabel: 'Approche du da‘îf et du ra’y',
    },
    sukut: {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Le silence d’Abû Dâwûd (Sukût)',
      definition:
        'Fait qu’Abû Dâwûd rapporte un hadith dans ses Sunan sans formuler de critique sur sa chaîne ou sa validité. Il a lui-même expliqué que ce silence indique que le récit est « sâlih » (apte à servir d’argument ou de pratique).',
      exampleInApp:
        'Il garde le silence sur la majorité des récits, tandis qu’au hadith 4750 il formule une préférence explicite : « Et celui-ci est le plus authentique des deux ».',
      relatedLabel: 'Étudier le principe du silence',
    },
    ahkam: {
      categoryLabel: 'Genres d’ouvrages & Recueils',
      term: 'Hadiths juridiques (Ahkâm)',
      definition:
        'Traditions fondant les règles pratiques du droit islamique (adorations, transactions, droit familial, peines). Les recueils de type « Sunan » classent avant tout les hadiths d’ahkâm selon les chapitres du fiqh.',
      exampleInApp:
        'Parmi 500 000 hadiths, Abû Dâwûd a sélectionné 4 800 récits centrés sur les ahkâm, en ajoutant vers la fin des livres d’éthique tels que le Kitâb al-Adab.',
      relatedLabel: 'Identité juridique et ahkâm',
    },
    'cerh-tadil': {
      categoryLabel: 'Chaîne & Authenticité',
      term: 'Critique et accréditation des transmetteurs (Jarh wa Ta‘dîl)',
      definition:
        'Discipline évaluant l’intégrité morale (‘adâla) et la précision mémorielle (dabt) des rapporteurs afin de les qualifier de fiables (thiqa, sadûq) ou de faibles/rejetés.',
      exampleInApp:
        'Abû Dâwûd est une autorité majeure du jarh wa ta‘dîl ; ses Su’âlât Abî ‘Ubayd al-Âjurrî et Tasmiyat al-ikhwa constituent des références fondamentales.',
      relatedLabel: 'Critiques d’Abû Dâwûd',
    },
    tahric: {
      categoryLabel: 'Édition critique & Gloses',
      term: 'Référencement des sources (Takhrîj)',
      definition:
        'Identification des autres grands recueils (al-Boukhârî, Mouslim, at-Tirmidhî, an-Nasâ’î, Ibn Mâjah, Ahmad) dans lesquels figure un hadith, avec mention des chapitres et numéros.',
      exampleInApp:
        'Visible dans l’édition critique de Muhammad ‘Awwâma et sur les badges « al-Boukhârî / Mouslim / an-Nasâ’î [4605] » en haut de chaque carte.',
      relatedLabel: 'Voir les badges de takhrîj',
    },
    mustahrec: {
      categoryLabel: 'Genres d’ouvrages & Recueils',
      term: 'Recueil à chaînes parallèles (Mustakhraj)',
      definition:
        'Ouvrage dans lequel un savant rapporte les hadiths d’un recueil antérieur (comme les Sunan d’Abû Dâwûd) par ses propres chaînes de transmission, qui rejoignent le maître de l’auteur sans passer par ce dernier.',
      exampleInApp:
        'Parmi les mustakhraj sur les Sunan figurent les travaux d’Abû Nu‘aym al-Isfahânî et de Qâsim b. Asbagh.',
      relatedLabel: 'Travaux consacrés aux Sunan',
    },
    zevaid: {
      categoryLabel: 'Genres d’ouvrages & Recueils',
      term: 'Ajouts de hadiths (Zawâ’id)',
      definition:
        'Genre rassemblant séparément les hadiths présents dans un recueil donné mais absents d’autres recueils de référence (tels que les deux Sahîh ou le reste des Six Livres).',
      exampleInApp:
        'Des traditionnistes égyptiens ont compilé les zawâ’id des Sunan par rapport aux Sahîhayn et aux autres Sunan.',
      relatedLabel: 'Bibliothèque des commentaires et études',
    },
    serh: {
      categoryLabel: 'Genres d’ouvrages & Recueils',
      term: 'Commentaire savant (Sharh)',
      definition:
        'Ouvrage expliquant en détail le vocabulaire rare (gharîb), la morphologie, la syntaxe, les divergences de chaînes et les enseignements juridiques des hadiths.',
      exampleInApp:
        'Le premier commentaire des Sunan est Ma‘âlim as-Sunan d’al-Khattâbî, suivi par Ibn al-Qayyim, al-‘Azîmâbâdî (‘Awn al-Ma‘bûd) et as-Sahâranpûrî (Badhl al-majhûd).',
      relatedLabel: '9 grands commentaires des Sunan',
    },
    ihtisar: {
      categoryLabel: 'Genres d’ouvrages & Recueils',
      term: 'Abrégé (Ikhtisâr / Mukhtasar)',
      definition:
        'Méthode consistant à condenser un grand recueil en supprimant les chaînes répétées ou parallèles afin d’en faciliter la lecture et la mémorisation.',
      exampleInApp:
        'Le Mukhtasar Sunan Abî Dâwûd de Zakiyy ad-Dîn al-Mundhirî est la source des numéros entre crochets tels que [4605] dans les gloses.',
      relatedLabel: 'Abrégé d’al-Mundhirî et études',
    },
    'hasiye-rumuz': {
      categoryLabel: 'Édition critique & Gloses',
      term: 'Édition critique et sigles manuscrits (ك، ص، د، م)',
      definition:
        'Abréviations employées dans les notes infrapaginales (hâshiya) de l’édition critique de Muhammad ‘Awwâma pour indiquer les variantes de texte ou d’intitulés entre les manuscrits (par ex. ك et ص) et les recensions.',
      exampleInApp:
        'Au chapitre 4, la note « من حاشية ك فقط » signale que l’intitulé ne figure qu’en marge du manuscrit (ك).',
      relatedLabel: 'Voir la glose du hadith 4747',
    },
  },
  isnadUi: {
    treeTitle: 'Arbre classique d’isnâd',
    narratorNodeUnit: 'transmetteurs',
    multiTarikBadge: 'Voies multiples',
    cautionBadge: 'Note d’isnâd',
    dirProphetToMusannif: 'Du Prophète ﷺ vers Abû Dâwûd',
    dirMusannifToProphet: 'D’Abû Dâwûd vers la source',
    zoomInAria: 'Agrandir le schéma d’isnâd',
    zoomOutAria: 'Réduire le schéma d’isnâd',
    resetZoomAria: 'Réinitialiser le zoom de l’isnâd',
    collapseBtn: 'Réduire',
    fullscreenBtn: 'Plein écran',
    tabakaSuffix: 'Strate',
    dragHint: 'Glisser · Zoomer · Cliquer sur un transmetteur pour ses détails',
    closeBtn: 'Fermer',
    closeNarratorAria: 'Fermer la fiche du transmetteur',
    whoIsLabel: 'Notice (sources PDF) :',
    otherHadithsPrefix: 'Autres hadiths contenant ce transmetteur',
    otherHadithsUnit: 'hadiths',
    noOtherHadiths:
      'Aucun autre récit de cette section de 38 hadiths ne mentionne ce transmetteur.',
    moreHadithsSuffix: 'autres hadiths',
    fullArabicIsnadHeader: 'Texte arabe intégral de l’isnâd',
    fullscreenDialogAria: 'Arbre d’isnâd en plein écran',
    exampleInAppLabel: 'Exemple dans l’application :',
    noPdfBio: 'Aucune information biographique dans le PDF',
    branchTarik: 'Voie',
    branchKol: 'Branche',
  },
  isnadNotes: {
    'Musannif (ö. 275/889)': 'Compilateur (m. 275/889)',
    'Hâşiye k: eş-Şa‘îrî nisbesi eklenir': 'Glose du manuscrit (ك) : ajout de la nisba ash-Sha‘îrî.',
    'Hz. Peygamber’e 7–9/10 yıl hizmet eden sahâbî':
      'Compagnon ayant servi le Prophète ﷺ durant sept à dix ans.',
    'Kābûs, İbn Abbâs’a yetişememiş, babası vasıtasıyla rivayet etmiştir':
      'Qâbûs n’a pas rencontré Ibn ‘Abbâs directement et rapporte par l’intermédiaire de son père.',
    'Râvi Ebû Merhûm’un adını Abdürrahîm b. Meymûn olarak açıklar':
      'Identifie le transmetteur Abû Marhûm comme étant ‘Abd ar-Rahîm b. Maymûn.',
    'Diğer nüshalarda kardeşi Ebû Bekir b. Ebî Şeybe geçer':
      'D’autres manuscrits mentionnent son frère Abû Bakr b. Abî Shayba.',
    'Ebû Dâvûd’un Bağdat’taki başlıca hocası (el-Müsned V, 152)':
      'Principal maître d’Abû Dâwûd à Bagdad (al-Musnad V, 152).',
    '“Bu iki rivayetin en sahihidir” değerlendirmesini yapar':
      'Formule le jugement : « C’est la plus authentique des deux traditions ».',
    'Mürsel tarik; Ebû Dâvûd, Ebû Harb’ın Ebû Zer’den doğrudan semâının mahfuz olmadığını belirterek bu tariki tercih eder':
      'Voie mursal ; Abû Dâwûd privilégie cette chaîne en indiquant que l’audition directe d’Abû Harb auprès d’Abû Dharr n’est pas établie.',
    'Ebû Dâvûd’un iki hocası lafız değil mâna birliğiyle nakleder':
      'Les deux maîtres d’Abû Dâwûd rapportent le récit avec concordance de sens.',
    'Selm el-Alevî hakkındaki cerh ve nisbe açıklamasını ekler':
      'Ajoute la critique biographique et l’explication de la nisba de Salm al-‘Alawî.',
    'Zayıf râvi; Benî Alî b. Sûd nisbesine mensuptur':
      'Transmetteur faible ; affilié par nisba aux Banû ‘Alî b. Sûd.',
    'Şu‘be’den yalnızca bu hadisi rivayet ettiği hâşiyede sorulur':
      'La glose s’interroge sur le fait qu’il n’ait rapporté de Shu‘ba que ce seul hadith.',
    'Ebû’l-Velîd/Hafs’ın “haddesenâ” lafzını Muhammed b. Kesîr’in “ahberenâ” lafzından ayırmaya özen gösterir':
      'Distinction scrupuleuse entre « haddathanâ » (Abû l-Walîd/Hafs) et « akhbaranâ » (Muhammad b. Kathîr).',
    'Keyhârânî veya Kûhârânî şeklinde nisbe edilir; İbrâhim b. Nâfi‘in dayısıdır':
      'Nisba attestée sous les formes Kayhârânî ou Kûhârânî ; oncle maternel d’Ibrâhîm b. Nâfi‘.',
  },
  cautionReasons: {
    'Mübhem râvî (عَنْ رَجُلٍ)': 'Transmetteur anonyme (عَنْ رَجُلٍ)',
    'Tarîk 1’de mübhem râvî (عَنْ رَجُلٍ)': 'Transmetteur anonyme dans la voie 1 (عَنْ رَجُلٍ)',
    'Nüsha/şeyh farkı notu (Osmân / Ebû Bekir)':
      'Variante de manuscrit/maître (‘Uthmân / Abû Bakr)',
    'Mürsel isnad (Bekr -> Ebû Zer arası inkıtâ)':
      'Isnâd mursal (interruption entre Bakr et Abû Dharr)',
    'Dipnotta zayıf/eleştirilen râvî kaydı':
      'Mention en note d’un transmetteur faible ou critiqué',
    'İhtiyatlı ref‘ (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)':
      'Attribution prudente au Prophète ﷺ (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)',
  },
  tdvKnownBios: {
    'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889). TDV İslâm Ansiklopedisi maddesine göre es-Sünen’i 500.000 hadis arasından 4800 (4800-5274) hadis seçerek telif etmiştir.':
      'Abû Dâwûd Sulaymân b. al-Ash‘ath as-Sijistânî (202–275 / 817–889). Selon l’article TDV, il composa ses Sunan en sélectionnant 4 800 hadiths (4 800–5 274 selon les recensions) parmi 500 000.',
    'TDV Ebû Dâvûd maddesine göre Bağdat’taki en büyük hocasıdır; fıkıh ve ilim çizgisinde kendisinden çok etkilenmiştir.':
      'Selon l’article TDV, son plus grand maître à Bagdad ; il marqua profondément sa méthode juridique et scientifique.',
    'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki önde gelen hocaları arasında anılır.':
      'Musaddad b. Musarhad ; cité dans l’article TDV parmi les maîtres majeurs d’Abû Dâwûd à Bassora.',
    'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.':
      'Qutayba b. Sa‘îd ; cité dans l’article TDV parmi les principaux maîtres d’Abû Dâwûd.',
    'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında geçer.':
      '‘Abdullâh b. Maslama al-Qa‘nabî ; mentionné dans l’article TDV parmi les principaux maîtres d’Abû Dâwûd.',
    'Süleyman b. Harb; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un önde gelen hocalarından biri olarak yer alır.':
      'Sulaymân b. Harb ; figure dans l’article TDV parmi les maîtres éminents d’Abû Dâwûd.',
    'İbn Ebî Şeybe kardeşler (Ebû Bekir ve Osmân); TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.':
      'Les frères Ibn Abî Shayba (Abû Bakr et ‘Uthmân) ; comptés dans l’article TDV parmi les maîtres notables d’Abû Dâwûd.',
    'en-Nüfeylî; TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Harrân’daki başlıca hocalarındandır.':
      'An-Nufaylî ; principal maître d’Abû Dâwûd à Harrân selon l’article TDV.',
    'Hadisin ilk kaynağı Hz. Peygamber Muhammed Mustafa (ﷺ).':
      'Source première du hadith : le Prophète Muhammad (ﷺ).',
  },
  narratorBios: {
    "PDF'te bilgi yok": 'Aucune information biographique dans le PDF.',
    'İsnadda adı zikredilmeyen mübhem râvî (4745 ve 4757 no.lu hadislerde geçer).':
      'Transmetteur anonyme (mubham) non nommé dans la chaîne (hadiths 4745 et 4757).',
    'İsnadlarda (ör. Ömer b. Yûnus, Hafs b. Ömer, Abdullah b. Ömer) yer alır; râvî detayı açısından bakınız: Ebû Dâvûd maddesi / PDF.':
      'Nom présent dans les chaînes (ex. ‘Umar b. Yûnus, Hafs b. ‘Umar, ‘Abdullâh b. ‘Umar) ; voir l’article Abû Dâwûd / PDF.',
    'Sahâbî Enes b. Mâlik (r.a.); 4740-4742 ve 4771. hadislerde Hz. Peygamber’e 10 (veya 7-9) yıl hizmet ettiğini nakleder.':
      'Compagnon Anas b. Mâlik (qu’Allah l’agrée) ; rapporte aux hadiths 4740–4742 et 4771 avoir servi le Prophète ﷺ dix (ou sept à neuf) ans.',
    'Süleyman b. Harb (Ebû Dâvûd’un Basra ve Mekke’deki önde gelen şeyhlerindendir; TDV Ebû Dâvûd maddesi) veya Süleyman el-A‘meş.':
      'Sulaymân b. Harb (maître majeur d’Abû Dâwûd à Bassora et La Mecque, article TDV) ou Sulaymân al-A‘mash.',
    'İsnadlarda Muhammed b. el-Münkedir, Muhammed b. Amr, Muhammed b. Kesîr, Muhammed b. Osmân ve Muhammed b. es-Sabbâh gibi râvîlerin adıdır.':
      'Prénom porté dans les chaînes par Muhammad b. al-Munkadir, Muhammad b. ‘Amr, Muhammad b. Kathîr, Muhammad b. ‘Uthmân et Muhammad b. as-Sabbâh.',
    'Sahâbî Ebû Hüreyre (r.a.); 4743, 4748 ve 4757. hadislerin sahâbî râvîsidir.':
      'Compagnon Abû Hurayra (qu’Allah l’agrée) ; transmetteur des hadiths 4743, 4748 et 4757.',
    'Ebû Dâvûd’un Harrânlı şeyhi en-Nüfeylî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Harrân’daki başlıca hocalarından biri olarak anılır.':
      'An-Nufaylî, maître d’Abû Dâwûd à Harrân, mentionné parmi ses principaux professeurs dans l’article TDV.',
    '4744’te İbn Abbâs (sahâbî), 4760’ta Ebû Dâvûd’un şeyhi Abbâs el-Anberî olarak geçer.':
      'Désigne le Compagnon Ibn ‘Abbâs (4744) et le maître d’Abû Dâwûd ‘Abbâs al-‘Anbarî (4760).',
    'TDV Ebû Dâvûd maddesine göre Ahmed b. Hanbel (Ebû Dâvûd’un Bağdat’taki en büyük hocası), ayrıca isnadlarda Ahmed b. Amr b. es-Serh, Ahmed b. Menî‘ ve Ahmed b. Yûnus yer alır.':
      'Selon l’article TDV, Ahmad b. Hanbal (grand maître d’Abû Dâwûd à Bagdad) ; les chaînes citent aussi Ahmad b. ‘Amr b. as-Sarh, Ahmad b. Manî‘ et Ahmad b. Yûnus.',
    'Kuteybe b. Saîd TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.':
      'Qutayba b. Sa‘îd, cité dans l’article TDV parmi les maîtres majeurs d’Abû Dâwûd.',
    '4745’te Muâz b. Enes el-Cühenî, 4747’de Sahâbî Muâz b. Cebel (r.a.).':
      'Mu‘âdh b. Anas al-Juhanî (4745) et le Compagnon Mu‘âdh b. Jabal (4747).',
    'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889); es-Sünen musannifi.':
      'Abû Dâwûd Sulaymân b. al-Ash‘ath as-Sijistânî (202–275 / 817–889), compilateur des Sunan.',
    'Osmân b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.':
      '‘Uthmân b. Abî Shayba, compté parmi les maîtres éminents d’Abû Dâwûd dans l’article TDV.',
    'Osmân b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde hocaları arasında zikredilir.':
      '‘Uthmân b. Abî Shayba, mentionné parmi ses maîtres dans l’article TDV.',
    'Ebû Bekir ve Osmân kardeşlerin dedesi; TDV Ebû Dâvûd maddesinde “İbn Ebî Şeybe kardeşler” Ebû Dâvûd’un hocaları arasında geçer.':
      'Grand-père des frères Abû Bakr et ‘Uthmân (Ibn Abî Shayba), mentionnés comme maîtres d’Abû Dâwûd dans l’article TDV.',
    '4777 no.lu hadis dipnotunda “وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ” diyerek ihtiyatlı ref‘ ifadesi kullanan meşhur tâbiîn âlimi.':
      'Célèbre savant des Successeurs utilisant au hadith 4777 la formule prudente d’attribution : « Je ne le connais que du Prophète ﷺ ».',
    '4747’de râvî Cerîr b. Abdülhamîd; 4776’da Sahâbî Cerîr b. Abdullah el-Becelî (r.a.).':
      'Le transmetteur Jarîr b. ‘Abd al-Hamîd (4747) et le Compagnon Jarîr b. ‘Abdillâh al-Bajalî (4776).',
    'Sahâbî Muâz b. Cebel’in (r.a.) babası; hadis 4747’de geçer.':
      'Père du Compagnon Mu‘âdh b. Jabal ; mentionné au hadith 4747.',
    'Ebû Bekir b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde hocaları arasında geçer.':
      'Abû Bakr b. Abî Shayba, cité parmi les maîtres d’Abû Dâwûd dans l’article TDV.',
    '4748. hadisin sahâbî râvîsi Süleyman b. Surad (r.a.).':
      'Compagnon Sulaymân b. Surad, transmetteur du hadith 4748.',
    'TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Bağdat’taki en büyük hocası, fıkıh ve hadis üstadı Ahmed b. Hanbel.':
      'Selon l’article TDV, Ahmad b. Hanbal, le plus grand maître d’Abû Dâwûd en fiqh et en hadith à Bagdad.',
    'Süleyman b. Harb, TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarındandır.':
      'Sulaymân b. Harb, l’un des principaux maîtres d’Abû Dâwûd selon l’article TDV.',
    '4750’de Tâbiî Ebu’l-Esved ed-Düelî, 4770’te Sahâbî Mikdâd b. el-Esved (r.a.).':
      'Le Successeur Abû l-Aswad ad-Du’alî (4750) et le Compagnon al-Miqdâd b. al-Aswad (4770).',
    'Sahâbî Ebû Zer el-Gıfârî (r.a.); 4749 ve 4750 (mürsel tarîk) hadislerinin kaynağıdır.':
      'Compagnon Abû Dharr al-Ghifârî ; source des hadiths 4749 et 4750 (voie mursal).',
    '4751 no.lu hadiste “San‘a halkının vâizi (el-Kâss) Ebû Vâil” olarak nitelenir.':
      'Qualifié au hadith 4751 d’« Abû Wâ’il, prédicateur (al-Qâss) des gens de Sanaa ».',
    'Hadis 4751’de “أَهْلِ صَنْعَاءَ الْقَاصَّ” ifadesiyle Ebû Vâil’in sıfatıdır.':
      'Épithète d’Abû Wâ’il au hadith 4751 (« prédicateur des gens de Sanaa »).',
    '4751’de babası ve dedesiyle Yemen’de geçen olayın anlatıcısı Urve b. Muhammed es-Sa‘dî; 4752’de Urve b. ez-Zübeyr.':
      '‘Urwa b. Muhammad as-Sa‘dî, narrateur de l’épisode au Yémen (4751), et ‘Urwa b. az-Zubayr (4752).',
    '4751’de “ceddî” Atıyye b. Sa‘d / Urve bağlantısı; ayrıca Ebû Mes‘ûd el-Bedrî (4764).':
      'Lien de parenté avec ‘Atiyya b. Sa‘d (4751) ; également Abû Mas‘ûd al-Badrî (4764).',
    'Müminlerin annesi Hz. Âişe (r.anhâ); 4752, 4753, 4758, 4759 ve 4774 no.lu hadisleri nakleder.':
      'La Mère des croyants ‘Â’isha (qu’Allah l’agrée) ; transmet les hadiths 4752, 4753, 4758, 4759 et 4774.',
    'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki meşhur hocalarından biri olarak anılır.':
      'Musaddad b. Musarhad, célèbre maître d’Abû Dâwûd à Bassora selon l’article TDV.',
    '4756 no.lu hadis dipnotunda Selm el-Alevî’nin hadis âlimlerince zayıf görüldüğü ve yıldızları gözlemleme kıssası kaydedilir.':
      'La note du hadith 4756 indique que Salm al-‘Alawî est jugé faible par les critiques et rapporte son observation des étoiles.',
    '4756. hadis dipnotuna göre astronomi/yıldızlarla ilgilendiği için bu lakabı almıştır.':
      'Selon la note du hadith 4756, il reçut ce surnom pour son intérêt porté aux astres.',
    'Süfyân es-Sevrî (4757, 4768) ve Süfyân b. Uyeyne (4758).':
      'Sufyân ath-Thawrî (4757, 4768) et Sufyân b. ‘Uyayna (4758).',
    'Yahyâ b. Ebî Kesîr (4757); ayrıca TDV Ebû Dâvûd maddesinde Yahyâ b. Maîn Ebû Dâvûd’un hocası olarak geçer.':
      'Yahyâ b. Abî Kathîr (4757) ; l’article TDV cite également Yahyâ b. Ma‘în parmi les maîtres d’Abû Dâwûd.',
    'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında anılır.':
      '‘Abdullâh b. Maslama al-Qa‘nabî, compté parmi les principaux maîtres d’Abû Dâwûd dans l’article TDV.',
    'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un başlıca şeyhlerinden biri olarak anılır.':
      'Qutayba b. Sa‘îd, cité parmi les grands maîtres d’Abû Dâwûd dans l’article TDV.',
    '4766 no.lu hadis dipnotunda “Keyhârânî veya Kûhârânî” nisbesiyle İbrâhim b. Nâfi‘in dayısı İbn Ya‘kûb olduğu belirtilir.':
      'La note du hadith 4766 identifie Ibn Ya‘qûb (nisba Kayhârânî ou Kûhârânî) comme l’oncle maternel d’Ibrâhîm b. Nâfi‘.',
    '4766 no.lu hadis dipnotuna göre “Keyhârânî” veya “Kûhârânî” biçiminde nisbe edilir; İbrâhim b. Nâfi‘in dayısıdır.':
      'Selon la note du hadith 4766, sa nisba se lit Kayhârânî ou Kûhârânî ; oncle maternel d’Ibrâhîm b. Nâfi‘.',
    'Sahâbî Ebü’d-Derdâ (r.a.) ve eşi/râvîsi Ümmü’d-Derdâ (4766).':
      'Le Compagnon Abû d-Dardâ’ et son épouse/transmetteuse Umm ad-Dardâ’ (4766).',
    '4767 no.lu hadisin sahâbî râvîsi Ebû Ümâme el-Bâhilî (r.a.).':
      'Le Compagnon Abû Umâma al-Bâhilî, transmetteur du hadith 4767.',
    '4768 no.lu hadisin sahâbî râvîsi Hârise b. Vehb el-Huzâî (r.a.).':
      'Le Compagnon Hâritha b. Wahb al-Khuzâ‘î, transmetteur du hadith 4768.',
    '4772 no.lu hadisin sahâbî râvîsi Ebû Bekre (Nüfey‘ b. el-Hâris r.a.).':
      'Le Compagnon Abû Bakra (Nufay‘ b. al-Hârith), transmetteur du hadith 4772.',
    '4774 no.lu hadisin sahâbî râvîsi Abdullah b. Mugaffel (r.a.).':
      'Le Compagnon ‘Abdullâh b. Mughaffal, transmetteur du hadith 4774.',
    '4777 no.lu hadisin sahâbî râvîsi Sa‘d b. Ebî Vakkās (r.a.).':
      'Le Compagnon Sa‘d b. Abî Waqqâs, transmetteur du hadith 4777.',
    '4751 no.lu hadiste Urve’nin dedesi; sahâbî veya tâbiî olarak geçer.':
      'Grand-père de ‘Urwa au hadith 4751 ; mentionné comme Compagnon ou Successeur.',
    '4763. hadisin sahâbî râvîsi İmrân b. Husayn (Ebû Nüceyd r.a.).':
      'Le Compagnon ‘Imrân b. Husayn (Abû Nujayd), transmetteur du hadith 4763.',
    '4763. hadiste İmrân b. Husayn ile konuşan Büşeyr b. Ka‘b.':
      'Bushayr b. Ka‘b, interlocuteur de ‘Imrân b. Husayn au hadith 4763.',
    'Sahâbî İmrân b. Husayn’ın (r.a.) künyesi Ebû Nüceyd’dir (4763).':
      'Abû Nujayd est la kunya du Compagnon ‘Imrân b. Husayn (4763).',
    'Sahâbî Mikdâd b. el-Esved (r.a.); 4770. hadiste aşırı övgü karşısında yüzüne toprak serpmiştir.':
      'Le Compagnon al-Miqdâd b. al-Aswad ; au hadith 4770, il jeta de la poussière au visage d’un flatteur.',
  },
};
