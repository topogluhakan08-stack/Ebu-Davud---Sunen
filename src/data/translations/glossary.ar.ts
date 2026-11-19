import type { GlossaryAndIsnadPack } from './lexiconTypes';

export const GLOSSARY_PACK_AR: GlossaryAndIsnadPack = {
  categories: {
    sened_sihhat: 'الإسناد ودرجات الصحة',
    telif_turleri: 'أنواع المصنفات والسنن',
    tahkik_hasiye: 'التحقيق والحاشية والرموز',
  },
  layers: {
    prophet: 'المصدر · النبوة ﷺ',
    sahabi: 'طبقة الصحابة',
    tabiin: 'طبقة التابعين',
    etba: 'أتباع التابعين / الشيوخ',
    musannif: 'المصنّف (أبو داود)',
  },
  terms: {
    isnad: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'الإِسْنَادُ / السَّنَدُ',
      definition:
        'سلسلة الرجال الموصلة إلى متن الحديث عن النبي ﷺ أو أول قائل له. ونقد الإسناد هو المعيار الأساس للحكم على صحة الحديث والتحقق من اتصال السماع بين الرواة.',
      exampleInApp:
        'يُعرض في تبويب «سلسلة الإسناد» بكل بطاقة حديث مرتبًا بالطبقات من المصنّف (أبي داود) حتى الصحابي والنبي ﷺ.',
      relatedLabel: 'عرض إسناد الحديث ٤٧٤٠',
    },
    metin: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'المَتْنُ',
      definition:
        'ما ينتهي إليه السند من الكلام من قول أو فعل أو تقرير. وضبط ألفاظه بالحركات ومقابلة النسخ وفهم جذور كلماته أساس استنباط الأحكام والآداب.',
      exampleInApp:
        'في جميع أحاديث كتاب الأدب الثمانية والثلاثين (٤٧٤٠–٤٧٧٧) فُصل المتن عن الإسناد مع تشكيل كامل وتحليل صرفي ونحوي لكل كلمة.',
      relatedLabel: 'تصفح متون الأحاديث الـ ٣٨',
    },
    mursel: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'الحَدِيثُ المُرْسَلُ',
      definition:
        'ما رواه التابعي عن النبي ﷺ مباشرة دون ذكر الصحابي الواسطة. وقد بيّن أبو داود في رسالته إلى أهل مكة أنه يُعمل بالمرسل إذا لم يوجد في الباب حديث مسند صحيح.',
      exampleInApp:
        'تضم السنن نحو ٦٠٠ حديث مرسل، كما أفرد أبو داود كتابًا مستقلًا بعنوان «المراسيل» (انظر أيضًا تعليق الحديث ٤٧٥٠).',
      relatedLabel: 'عرض منهج السنن',
    },
    musned: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'الحَدِيثُ المُسْنَدُ',
      definition:
        'الحديث الذي اتصل إسناده مرفوعًا إلى النبي ﷺ من أوله إلى آخره دون سقط في رواته، ويُذكر غالبًا في مقابل الحديث المرسل.',
      exampleInApp:
        'أكد أبو داود في رسالته إلى أهل مكة أنه لا يحتج بالمرسل مع وجود حديث مسند متصل في المسألة.',
      relatedLabel: 'مبادئ رسالة مكة الستة',
    },
    muttasil: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'المُتَّصِلُ (الاِتِّصَالُ)',
      definition:
        'الإسناد الذي سمع فيه كل راوٍ الحديث ممن فوقه سماعًا مباشرًا أو بطريق تحمّل معتبر دون انقطاع.',
      exampleInApp:
        'في الحديث ٤٧٥٠ قارن أبو داود بين اتصال طريق بكر والحديث ٤٧٤٩ وقال: «وهذا أصحّ الحديثين».',
      relatedLabel: 'عرض المقارنة في الحديث ٤٧٥٠',
    },
    sahih: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'الحَدِيثُ الصَّحِيحُ',
      definition:
        'ما اتصل سنده بنقل العدل الضابط عن مثله إلى منتهاه من غير شذوذ ولا علة، وهو أعلى درجات القبول. وما اتفق على تخريجه البخاري ومسلم يُعرف بـ «المتفق عليه».',
      exampleInApp:
        'تتفق أحاديث عديدة في كتاب الأدب (مثل ٤٧٤٠ و٤٧٤٦ و٤٧٤٨ و٤٧٥٢ و٤٧٥٣ و٤٧٦٢ و٤٧٧١ و٤٧٧٤) مع تخريج البخاري ومسلم.',
      relatedLabel: 'الأحاديث المشتركة مع الصحيحين',
    },
    hasen: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'الحَدِيثُ الحَسَنُ',
      definition:
        'الحديث المقبول الذي اتصل سنده برواة عدول خفّ ضبط بعضهم قليلًا عن رتبة الصحيح مع السلامة من الشذوذ والعلة. وكان لأبي داود والترمذي دور رائد في ترسيخ هذا المصطلح.',
      exampleInApp:
        'يرى ابن الصلاح وغيره أن ما سكت عنه أبو داود في السنن أو وصفه بالصالح يرتقي إلى رتبة الحسن على الأقل.',
      relatedLabel: 'درجات الصحة في السنن',
    },
    munker: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'الحَدِيثُ المُنْكَرُ',
      definition:
        'ما تفرد به الراوي الضعيف مخالفًا للثقات. وإذا لم يجد أبو داود في الباب غيره أورده وبيّن نكارته صراحة.',
      exampleInApp:
        'هو الحكم النقدي الصريح المقابل لقاعدته في رسالة مكة: «وما لم أذكر فيه شيئًا فهو صالح».',
      relatedLabel: 'قاعدة السكوت والمنكر',
    },
    zayif: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'الحَدِيثُ الضَّعِيفُ',
      definition:
        'ما فقد شرطًا من شروط الصحيح أو الحسن. ويرى أبو داود أن الحديث الذي لم يشتد ضعفه أولى من محض الرأي والقياس عند الفقهاء فيُذكر في أبواب الفقه.',
      exampleInApp:
        'الأحاديث المنتقدة في السنن يبيّنها أبو داود نفسه أو شراح الكتاب كالمنذري وابن القيم والألباني.',
      relatedLabel: 'منهج أبي داود في الضعيف والرأي',
    },
    sukut: {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'سُكُوتُ أَبِي دَاوُدَ',
      definition:
        'ترك أبي داود التعقيب على الحديث بجرح أو تضعيف بعد روايته في السنن؛ وقد صرّح بأن ما سكت عنه فهو «صالح» للاحتجاج أو الاعتبار.',
      exampleInApp:
        'يسكت عن غالبية الأحاديث، بينما يصرّح بالترجيح في مواضع مثل الحديث ٤٧٥٠ بقوله: «وهذا أصحّ الحديثين».',
      relatedLabel: 'دراسة قاعدة السكوت',
    },
    ahkam: {
      categoryLabel: 'أنواع المصنفات والسنن',
      term: 'أَحَادِيثُ الأَحْكَامِ',
      definition:
        'الأحاديث التي تُستنبط منها الأحكام الفقهية العملية في العبادات والمعاملات والأسرة والجنايات، وهي عماد كتب السنن المرتبة على أبواب الفقه.',
      exampleInApp:
        'انتقى أبو داود ٤٨٠٠ حديث من بين ٥٠٠ ألف حديث مع التركيز على أحاديث الأحكام، وألحق بها أبوابًا في الآداب والزهد ككتاب الأدب.',
      relatedLabel: 'الهوية الفقهية وأحاديث الأحكام',
    },
    'cerh-tadil': {
      categoryLabel: 'الإسناد ودرجات الصحة',
      term: 'الجَرْحُ وَالتَّعْدِيلُ',
      definition:
        'العلم الباحث في أحوال الرواة من حيث العدالة والضبط للحكم عليهم بالوثاقة والصدق أو بالضعف والترك.',
      exampleInApp:
        'كان أبو داود إمامًا في الجرح والتعديل، وتُعد «سؤالات أبي عبيد الآجري» و«تسمية الإخوة» من أهم مصادره في هذا الفن.',
      relatedLabel: 'جهود أبي داود في نقد الرواة',
    },
    tahric: {
      categoryLabel: 'التحقيق والحاشية والرموز',
      term: 'التَّخْرِيجُ',
      definition:
        'عزو الحديث إلى مصادره الأصلية الأخرى (البخاري ومسلم والترمذي والنسائي وابن ماجه وأحمد) مع بيان مواضعه وأرقامه.',
      exampleInApp:
        'يظهر في تحقيق الشيخ محمد عوامة وفي شارات المصادر أعلى كل بطاقة حديث مثل «البخاري / مسلم / النسائي [4605]».',
      relatedLabel: 'تصفح شارات التخريج',
    },
    mustahrec: {
      categoryLabel: 'أنواع المصنفات والسنن',
      term: 'المُسْتَخْرَجُ',
      definition:
        'أن يعمد حافظ إلى كتاب حديثي كسنن أبي داود فيخرج أحاديثه بأسانيد لنفسه من غير طريق صاحب الكتاب فيلتقي معه في شيخه أو من فوقه.',
      exampleInApp:
        'من أبرز المستخرجات على السنن أعمال أبي نعيم الأصبهاني وقاسم بن أصبغ.',
      relatedLabel: 'الدراسات حول السنن',
    },
    zevaid: {
      categoryLabel: 'أنواع المصنفات والسنن',
      term: 'الزَّوَائِدُ',
      definition:
        'مصنفات تفرد الأحاديث التي زادها كتاب حديثي على غيره من الكتب الأصول كالصحيحين أو بقية الكتب الستة.',
      exampleInApp:
        'أُلّفت كتب زوائد لسنن أبي داود على الصحيحين وعلى سائر كتب السنن.',
      relatedLabel: 'مكتبة الشروح والدراسات',
    },
    serh: {
      categoryLabel: 'أنواع المصنفات والسنن',
      term: 'الشَّرْحُ',
      definition:
        'تأليف يفسر غريب ألفاظ الحديث ويبين دقائقه الصرفية والنحوية واختلاف طرقه واستنباطاته الفقهية.',
      exampleInApp:
        'أول شروح السنن «معالم السنن» للخطابي، وتلاه ابن القيم والعظيم آبادي (عون المعبود) والسهارنفوري (بذل المجهود).',
      relatedLabel: 'أهم ٩ شروح للسنن',
    },
    ihtisar: {
      categoryLabel: 'أنواع المصنفات والسنن',
      term: 'الاِخْتِصَارُ / المُخْتَصَرُ',
      definition:
        'تهذيب الكتاب الحديثي بحذف الأسانيد المكررة أو الطرق المتعددة لتقريبه للقراءة والحفظ والمراجعة.',
      exampleInApp:
        '«مختصر سنن أبي داود» لزكي الدين المنذري هو مصدر الأرقام المعقوفة مثل [4605] في الحواشي.',
      relatedLabel: 'مختصر المنذري والدراسات',
    },
    'hasiye-rumuz': {
      categoryLabel: 'التحقيق والحاشية والرموز',
      term: 'التَّحْقِيقُ وَرُمُوزُ النُّسَخِ (ك، ص، د، م)',
      definition:
        'الرموز المستعملة في حواشي تحقيق محمد عوامة لبيان الفروق اللفظية وعناوين الأبواب بين النسخ الخطية (مثل ك وص) والروايات.',
      exampleInApp:
        'في الباب الرابع ورد في الحاشية «من حاشية ك فقط» تنبيهًا على انفراد حاشية النسخة (ك) بتلك الترجمة.',
      relatedLabel: 'عرض حاشية الحديث ٤٧٤٧',
    },
  },
  isnadUi: {
    treeTitle: 'شجرة الإسناد الكلاسيكية',
    narratorNodeUnit: 'راوٍ',
    multiTarikBadge: 'تعدّد الطرق',
    cautionBadge: 'تنبيه إسنادي',
    dirProphetToMusannif: 'من النبي ﷺ إلى أبي داود',
    dirMusannifToProphet: 'من أبي داود إلى المصدر',
    zoomInAria: 'تكبير شجرة الإسناد',
    zoomOutAria: 'تصغير شجرة الإسناد',
    resetZoomAria: 'إعادة ضبط التكبير',
    collapseBtn: 'تصغير',
    fullscreenBtn: 'ملء الشاشة',
    tabakaSuffix: 'الطبقة',
    dragHint: 'اسحب للتنقل · كبّر للتفاصيل · اضغط على أي راوٍ لعرض ترجمته',
    closeBtn: 'إغلاق',
    closeNarratorAria: 'إغلاق بطاقة الراوي',
    whoIsLabel: 'ترجمة مختصرة (مصادر الملف):',
    otherHadithsPrefix: 'أحاديث أخرى ورد فيها هذا الراوي',
    otherHadithsUnit: 'أحاديث',
    noOtherHadiths: 'لم يرد هذا الراوي في حديث آخر ضمن هذه الأحاديث الـ ٣٨.',
    moreHadithsSuffix: 'أحاديث أخرى',
    fullArabicIsnadHeader: 'نص الإسناد العربي الكامل',
    fullscreenDialogAria: 'شجرة الإسناد بملء الشاشة',
    exampleInAppLabel: 'مثال في التطبيق:',
    noPdfBio: 'لا توجد معلومات ترجمة إضافية في الملف',
    branchTarik: 'طريق',
    branchKol: 'فرع',
  },
  isnadNotes: {
    'Musannif (ö. 275/889)': 'المصنّف (ت ٢٧٥ هـ / ٨٨٩ م)',
    'Hâşiye k: eş-Şa‘îrî nisbesi eklenir': 'في حاشية (ك): تُضاف نسبة «الشعيري».',
    'Hz. Peygamber’e 7–9/10 yıl hizmet eden sahâbî': 'الصحابي الذي خدم النبي ﷺ سبعًا إلى عشر سنين.',
    'Kābûs, İbn Abbâs’a yetişememiş, babası vasıtasıyla rivayet etmiştir':
      'لم يدرك قابوس ابن عباس، بل روى عنه بواسطة أبيه.',
    'Râvi Ebû Merhûm’un adını Abdürrahîm b. Meymûn olarak açıklar':
      'يبيّن أن اسم أبي مرحوم هو عبد الرحيم بن ميمون.',
    'Diğer nüshalarda kardeşi Ebû Bekir b. Ebî Şeybe geçer':
      'في سائر النسخ ورد أخوه أبو بكر بن أبي شيبة.',
    'Ebû Dâvûd’un Bağdat’taki başlıca hocası (el-Müsned V, 152)':
      'أكبر شيوخ أبي داود في بغداد (المسند ٥/١٥٢).',
    '“Bu iki rivayetin en sahihidir” değerlendirmesini yapar':
      'يرجّح بقوله: «وهذا أصحّ الحديثين».',
    'Mürsel tarik; Ebû Dâvûd, Ebû Harb’ın Ebû Zer’den doğrudan semâının mahfuz olmadığını belirterek bu tariki tercih eder':
      'طريق مرسل؛ يرجّحه أبو داود مبينًا أن سماع أبي حرب من أبي ذر غير محفوظ.',
    'Ebû Dâvûd’un iki hocası lafız değil mâna birliğiyle nakleder':
      'يروي شيخا أبي داود الحديث متفقَين في المعنى.',
    'Selm el-Alevî hakkındaki cerh ve nisbe açıklamasını ekler':
      'يضيف بيان الجرح والنسبة المتعلقة بسلم العلوي.',
    'Zayıf râvi; Benî Alî b. Sûd nisbesine mensuptur':
      'راوٍ ضعيف؛ يُنسب إلى بني علي بن سود.',
    'Şu‘be’den yalnızca bu hadisi rivayet ettiği hâşiyede sorulur':
      'ورد في الحاشية التساؤل حول اقتصار روايته عن شعبة على هذا الحديث.',
    'Ebû’l-Velîd/Hafs’ın “haddesenâ” lafzını Muhammed b. Kesîr’in “ahberenâ” lafzından ayırmaya özen gösterir':
      'يُعنى بالتمييز الدقيق بين لفظ «حدثنا» لأبي الوليد وحفص ولفظ «أخبرنا» لمحمد بن كثير.',
    'Keyhârânî veya Kûhârânî şeklinde nisbe edilir; İbrâhim b. Nâfi‘in dayısıdır':
      'يُنسب الكيهاراني أو الكوهاراني، وهو خال إبراهيم بن نافع.',
  },
  cautionReasons: {
    'Mübhem râvî (عَنْ رَجُلٍ)': 'راوٍ مبهم (عَنْ رَجُلٍ)',
    'Tarîk 1’de mübhem râvî (عَنْ رَجُلٍ)': 'راوٍ مبهم في الطريق الأول (عَنْ رَجُلٍ)',
    'Nüsha/şeyh farkı notu (Osmân / Ebû Bekir)': 'فرق نسخة/شيخ (عثمان / أبو بكر)',
    'Mürsel isnad (Bekr -> Ebû Zer arası inkıtâ)': 'إسناد مرسل (انقطاع بين بكر وأبي ذر)',
    'Dipnotta zayıf/eleştirilen râvî kaydı': 'تنبيه في الحاشية على راوٍ ضعيف أو منتقَد',
    'İhtiyatlı ref‘ (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)':
      'رفعٌ على سبيل الاحتياط (وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ)',
  },
  tdvKnownBios: {
    'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889). TDV İslâm Ansiklopedisi maddesine göre es-Sünen’i 500.000 hadis arasından 4800 (4800-5274) hadis seçerek telif etmiştir.':
      'أبو داود سليمان بن الأشعث السجستاني (٢٠٢–٢٧٥ هـ / ٨١٧–٨٨٩ م). انتقى كتابه «السنن» من ٥٠٠ ألف حديث فاختار منها ٤٨٠٠ حديث (تصل في بعض الروايات إلى ٥٢٧٤).',
    'TDV Ebû Dâvûd maddesine göre Bağdat’taki en büyük hocasıdır; fıkıh ve ilim çizgisinde kendisinden çok etkilenmiştir.':
      'أكبر شيوخ أبي داود في بغداد؛ تأثر به كثيرًا في منهجه الفقهي والحديثي.',
    'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki önde gelen hocaları arasında anılır.':
      'مسدد بن مسرهد؛ من أبرز شيوخ أبي داود في البصرة.',
    'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.':
      'قتيبة بن سعيد؛ من كبار شيوخ أبي داود المذكورين في ترجمته.',
    'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında geçer.':
      'عبد الله بن مسلمة القعنبي؛ من أبرز شيوخ أبي داود.',
    'Süleyman b. Harb; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un önde gelen hocalarından biri olarak yer alır.':
      'سليمان بن حرب؛ من كبار شيوخ أبي داود في البصرة ومكة.',
    'İbn Ebî Şeybe kardeşler (Ebû Bekir ve Osmân); TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.':
      'الأخوان أبو بكر وعثمان ابنا أبي شيبة؛ من شيوخ أبي داود البارزين.',
    'en-Nüfeylî; TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Harrân’daki başlıca hocalarındandır.':
      'النفيلي؛ من أبرز شيوخ أبي داود في حرّان.',
    'Hadisin ilk kaynağı Hz. Peygamber Muhammed Mustafa (ﷺ).':
      'المصدر الأول للحديث: رسول الله محمد ﷺ.',
  },
  narratorBios: {
    "PDF'te bilgi yok": 'لا توجد معلومات إضافية في الملف.',
    'İsnadda adı zikredilmeyen mübhem râvî (4745 ve 4757 no.lu hadislerde geçer).':
      'راوٍ مبهم لم يُسمَّ في الإسناد (ورد في الحديثين ٤٧٤٥ و٤٧٥٧).',
    'İsnadlarda (ör. Ömer b. Yûnus, Hafs b. Ömer, Abdullah b. Ömer) yer alır; râvî detayı açısından bakınız: Ebû Dâvûd maddesi / PDF.':
      'اسم يتكرر في الأسانيد (مثل عمر بن يونس، وحفص بن عمر، وعبد الله بن عمر).',
    'Sahâbî Enes b. Mâlik (r.a.); 4740-4742 ve 4771. hadislerde Hz. Peygamber’e 10 (veya 7-9) yıl hizmet ettiğini nakleder.':
      'الصحابي الجليل أنس بن مالك رضي الله عنه؛ يروي في الأحاديث ٤٧٤٠–٤٧٤٢ و٤٧٧١ خدمته للنبي ﷺ عشر سنين (أو سبعًا إلى تسع).',
    'Süleyman b. Harb (Ebû Dâvûd’un Basra ve Mekke’deki önde gelen şeyhlerindendir; TDV Ebû Dâvûd maddesi) veya Süleyman el-A‘meş.':
      'سليمان بن حرب (من كبار شيوخ أبي داود في البصرة ومكة) أو سليمان الأعمش.',
    'İsnadlarda Muhammed b. el-Münkedir, Muhammed b. Amr, Muhammed b. Kesîr, Muhammed b. Osmân ve Muhammed b. es-Sabbâh gibi râvîlerin adıdır.':
      'اسم لعدة رواة في الأسانيد مثل محمد بن المنكدر، ومحمد بن عمرو، ومحمد بن كثير، ومحمد بن عثمان، ومحمد بن الصباح.',
    'Sahâbî Ebû Hüreyre (r.a.); 4743, 4748 ve 4757. hadislerin sahâbî râvîsidir.':
      'الصحابي الجليل أبو هريرة رضي الله عنه؛ راوي الأحاديث ٤٧٤٣ و٤٧٤٨ و٤٧٥٧.',
    'Ebû Dâvûd’un Harrânlı şeyhi en-Nüfeylî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Harrân’daki başlıca hocalarından biri olarak anılır.':
      'النفيلي شيخ أبي داود في حرّان ومن أبرز شيوخه.',
    '4744’te İbn Abbâs (sahâbî), 4760’ta Ebû Dâvûd’un şeyhi Abbâs el-Anberî olarak geçer.':
      'يُراد به الصحابي ابن عباس في ٤٧٤٤، وشيخ أبي داود العباس العنبري في ٤٧٦٠.',
    'TDV Ebû Dâvûd maddesine göre Ahmed b. Hanbel (Ebû Dâvûd’un Bağdat’taki en büyük hocası), ayrıca isnadlarda Ahmed b. Amr b. es-Serh, Ahmed b. Menî‘ ve Ahmed b. Yûnus yer alır.':
      'الإمام أحمد بن حنبل (أكبر شيوخ أبي داود ببغداد)، كما ورد في الأسانيد أحمد بن عمرو بن السرح وأحمد بن منيع وأحمد بن يونس.',
    'Kuteybe b. Saîd TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarından biri olarak zikredilir.':
      'قتيبة بن سعيد؛ من كبار شيوخ أبي داود.',
    '4745’te Muâz b. Enes el-Cühenî, 4747’de Sahâbî Muâz b. Cebel (r.a.).':
      'معاذ بن أنس الجهني (٤٧٤٥)، والصحابي معاذ بن جبل رضي الله عنه (٤٧٤٧).',
    'Ebû Dâvûd Süleymân b. el-Eş‘as es-Sicistânî (202-275/817-889); es-Sünen musannifi.':
      'أبو داود سليمان بن الأشعث السجستاني (٢٠٢–٢٧٥ هـ)، مصنّف السنن.',
    'Osmân b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un öne çıkan hocaları arasında sayılır.':
      'عثمان بن أبي شيبة؛ من شيوخ أبي داود البارزين.',
    'Osmân b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde hocaları arasında zikredilir.':
      'عثمان بن أبي شيبة؛ من شيوخ أبي داود.',
    'Ebû Bekir ve Osmân kardeşlerin dedesi; TDV Ebû Dâvûd maddesinde “İbn Ebî Şeybe kardeşler” Ebû Dâvûd’un hocaları arasında geçer.':
      'جدّ الأخوين أبي بكر وعثمان ابني أبي شيبة، وهما من شيوخ أبي داود.',
    '4777 no.lu hadis dipnotunda “وَلَا أَعْلَمُهُ إِلَّا عَنِ النَّبِيِّ ﷺ” diyerek ihtiyatlı ref‘ ifadesi kullanan meşhur tâbiîn âlimi.':
      'الإمام التابعي المشهور الذي استعمل صيغة الاحتياط في الحديث ٤٧٧٧: «ولا أعلمه إلا عن النبي ﷺ».',
    '4747’de râvî Cerîr b. Abdülhamîd; 4776’da Sahâbî Cerîr b. Abdullah el-Becelî (r.a.).':
      'الراوي جرير بن عبد الحميد (٤٧٤٧)، والصحابي جرير بن عبد الله البجلي رضي الله عنه (٤٧٧٦).',
    'Sahâbî Muâz b. Cebel’in (r.a.) babası; hadis 4747’de geçer.':
      'والد الصحابي معاذ بن جبل رضي الله عنه؛ ورد في الحديث ٤٧٤٧.',
    'Ebû Bekir b. Ebî Şeybe; TDV Ebû Dâvûd maddesinde hocaları arasında geçer.':
      'أبو بكر بن أبي شيبة؛ من شيوخ أبي داود.',
    '4748. hadisin sahâbî râvîsi Süleyman b. Surad (r.a.).':
      'الصحابي سليمان بن صُرَد رضي الله عنه، راوي الحديث ٤٧٤٨.',
    'TDV Ebû Dâvûd maddesine göre Ebû Dâvûd’un Bağdat’taki en büyük hocası, fıkıh ve hadis üstadı Ahmed b. Hanbel.':
      'الإمام أحمد بن حنبل، أكبر شيوخ أبي داود في الفقه والحديث ببغداد.',
    'Süleyman b. Harb, TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocalarındandır.':
      'سليمان بن حرب، من أبرز شيوخ أبي داود.',
    '4750’de Tâbiî Ebu’l-Esved ed-Düelî, 4770’te Sahâbî Mikdâd b. el-Esved (r.a.).':
      'التابعي أبو الأسود الدؤلي (٤٧٥٠)، والصحابي المقداد بن الأسود رضي الله عنه (٤٧٧٠).',
    'Sahâbî Ebû Zer el-Gıfârî (r.a.); 4749 ve 4750 (mürsel tarîk) hadislerinin kaynağıdır.':
      'الصحابي أبو ذر الغفاري رضي الله عنه؛ مصدر الحديثين ٤٧٤٩ و٤٧٥٠ (الطريق المرسل).',
    '4751 no.lu hadiste “San‘a halkının vâizi (el-Kâss) Ebû Vâil” olarak nitelenir.':
      'وُصف في الحديث ٤٧٥١ بأنه «أبو وائل القاصّ من أهل صنعاء».',
    'Hadis 4751’de “أَهْلِ صَنْعَاءَ الْقَاصَّ” ifadesiyle Ebû Vâil’in sıfatıdır.':
      'صفة أبي وائل في الحديث ٤٧٥١: «أهل صنعاء القاصّ».',
    '4751’de babası ve dedesiyle Yemen’de geçen olayın anlatıcısı Urve b. Muhammed es-Sa‘dî; 4752’de Urve b. ez-Zübeyr.':
      'عروة بن محمد السعدي راوي قصة اليمن (٤٧٥١)، وعروة بن الزبير (٤٧٥٢).',
    '4751’de “ceddî” Atıyye b. Sa‘d / Urve bağlantısı; ayrıca Ebû Mes‘ûd el-Bedrî (4764).':
      'عطية بن سعد جدّ عروة في ٤٧٥١، وكذلك الصحابي أبو مسعود البدري في ٤٧٦٤.',
    'Müminlerin annesi Hz. Âişe (r.anhâ); 4752, 4753, 4758, 4759 ve 4774 no.lu hadisleri nakleder.':
      'أم المؤمنين عائشة رضي الله عنها؛ راوية الأحاديث ٤٧٥٢ و٤٧٥٣ و٤٧٥٨ و٤٧٥٩ و٤٧٧٤.',
    'Müsedded b. Müserhed; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un Basra’daki meşhur hocalarından biri olarak anılır.':
      'مسدد بن مسرهد؛ من أشهر شيوخ أبي داود في البصرة.',
    '4756 no.lu hadis dipnotunda Selm el-Alevî’nin hadis âlimlerince zayıf görüldüğü ve yıldızları gözlemleme kıssası kaydedilir.':
      'ورد في حاشية الحديث ٤٧٥٦ تضعيف سلم العلوي وقصة نظره في النجوم.',
    '4756. hadis dipnotuna göre astronomi/yıldızlarla ilgilendiği için bu lakabı almıştır.':
      'ذُكر في حاشية ٤٧٥٦ أنه لُقّب بذلك لاشتغاله بالنجوم.',
    'Süfyân es-Sevrî (4757, 4768) ve Süfyân b. Uyeyne (4758).':
      'سفيان الثوري (٤٧٥٧، ٤٧٦٨) وسفيان بن عيينة (٤٧٥٨).',
    'Yahyâ b. Ebî Kesîr (4757); ayrıca TDV Ebû Dâvûd maddesinde Yahyâ b. Maîn Ebû Dâvûd’un hocası olarak geçer.':
      'يحيى بن أبي كثير (٤٧٥٧)، كما يرد يحيى بن معين ضمن شيوخ أبي داود.',
    'Abdullah b. Mesleme el-Ka‘nebî; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un belli başlı hocaları arasında anılır.':
      'عبد الله بن مسلمة القعنبي؛ من أبرز شيوخ أبي داود.',
    'Kuteybe b. Saîd; TDV Ebû Dâvûd maddesinde Ebû Dâvûd’un başlıca şeyhlerinden biri olarak anılır.':
      'قتيبة بن سعيد؛ من كبار شيوخ أبي داود.',
    '4766 no.lu hadis dipnotunda “Keyhârânî veya Kûhârânî” nisbesiyle İbrâhim b. Nâfi‘in dayısı İbn Ya‘kûb olduğu belirtilir.':
      'تذكر حاشية الحديث ٤٧٦٦ أن ابن يعقوب (الكيهاراني أو الكوهاراني) هو خال إبراهيم بن نافع.',
    '4766 no.lu hadis dipnotuna göre “Keyhârânî” veya “Kûhârânî” biçiminde nisbe edilir; İbrâhim b. Nâfi‘in dayısıdır.':
      'تُضبط نسبته في حاشية ٤٧٦٦ «الكيهاراني» أو «الكوهاراني»، وهو خال إبراهيم بن نافع.',
    'Sahâbî Ebü’d-Derdâ (r.a.) ve eşi/râvîsi Ümmü’d-Derdâ (4766).':
      'الصحابي أبو الدرداء رضي الله عنه وزوجه أم الدرداء (٤٧٦٦).',
    '4767 no.lu hadisin sahâbî râvîsi Ebû Ümâme el-Bâhilî (r.a.).':
      'الصحابي أبو أمامة الباهلي رضي الله عنه، راوي الحديث ٤٧٦٧.',
    '4768 no.lu hadisin sahâbî râvîsi Hârise b. Vehb el-Huzâî (r.a.).':
      'الصحابي حارثة بن وهب الخزاعي رضي الله عنه، راوي الحديث ٤٧٦٨.',
    '4772 no.lu hadisin sahâbî râvîsi Ebû Bekre (Nüfey‘ b. el-Hâris r.a.).':
      'الصحابي أبو بكرة نفيع بن الحارث رضي الله عنه، راوي الحديث ٤٧٧٢.',
    '4774 no.lu hadisin sahâbî râvîsi Abdullah b. Mugaffel (r.a.).':
      'الصحابي عبد الله بن مغفل رضي الله عنه، راوي الحديث ٤٧٧٤.',
    '4777 no.lu hadisin sahâbî râvîsi Sa‘d b. Ebî Vakkās (r.a.).':
      'الصحابي سعد بن أبي وقاص رضي الله عنه، راوي الحديث ٤٧٧٧.',
    '4751 no.lu hadiste Urve’nin dedesi; sahâbî veya tâbiî olarak geçer.':
      'جدّ عروة في الحديث ٤٧٥١؛ يُذكر في الصحابة أو التابعين.',
    '4763. hadisin sahâbî râvîsi İmrân b. Husayn (Ebû Nüceyd r.a.).':
      'الصحابي عمران بن حصين (أبو نجيد) رضي الله عنه، راوي الحديث ٤٧٦٣.',
    '4763. hadiste İmrân b. Husayn ile konuşan Büşeyr b. Ka‘b.':
      'بشير بن كعب محاور عمران بن حصين في الحديث ٤٧٦٣.',
    'Sahâbî İmrân b. Husayn’ın (r.a.) künyesi Ebû Nüceyd’dir (4763).':
      'أبو نجيد هي كنية الصحابي عمران بن حصين رضي الله عنه (٤٧٦٣).',
    'Sahâbî Mikdâd b. el-Esved (r.a.); 4770. hadiste aşırı övgü karşısında yüzüne toprak serpmiştir.':
      'الصحابي المقداد بن الأسود رضي الله عنه؛ حثا التراب في وجه المدّاح في الحديث ٤٧٧٠.',
  },
};
