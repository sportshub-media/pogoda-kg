// Weather FAQ content — Kyrgyzstan-wide (homepage) and per-city (dedicated
// city pages). Grounded in real regional climate data (Kyrgyzhydromet /
// published climate references), written distinctly per city rather than
// templated stat-swapping — both to target real "weather in X in winter/
// summer" search queries and to avoid the near-duplicate content Google
// flags across templated pages. Pure data module (no DOM/page side effects),
// so it's safe for both build.js (SSR + FAQPage JSON-LD) and app.js
// (re-render on client-side language switch) to import directly.

export const HOME_FAQ = {
  EN: [
    { q: "What is Kyrgyzstan's climate like?", a: "Kyrgyzstan has a sharply continental climate that changes dramatically with elevation — hot, dry summers in low valleys around Bishkek, Osh and Jalal-Abad, and much harsher winters in high mountain regions like Naryn." },
    { q: "What is the best time to visit Kyrgyzstan?", a: "Late May through September is generally best, when mountain passes are open and lakeside spots like Issyk-Kul are at their warmest. July and August bring the strongest heat in the south, while June and September are milder with fewer crowds." },
    { q: "How cold does it get in Kyrgyzstan in winter?", a: "It varies sharply by region: lowland cities like Bishkek typically see winter nights around -7°C to -10°C, while high-altitude Naryn regularly drops to -20°C or colder, with extreme cold snaps reaching -40°C." }
  ],
  RU: [
    { q: "Какой климат в Кыргызстане?", a: "В Кыргызстане резко континентальный климат, который сильно меняется с высотой — жаркое сухое лето в низинных долинах вокруг Бишкека, Оша и Джалал-Абада, и куда более суровые зимы в высокогорных районах, таких как Нарын." },
    { q: "Когда лучше всего ехать в Кыргызстан?", a: "Обычно лучшее время — с конца мая по сентябрь, когда открыты горные перевалы, а такие места, как Иссык-Куль, наиболее тёплые. Июль и август приносят самую сильную жару на юге, а июнь и сентябрь мягче и менее многолюдны." },
    { q: "Насколько холодно в Кыргызстане зимой?", a: "Это сильно зависит от региона: в низинных городах вроде Бишкека зимние ночи обычно держатся около -7...-10°C, тогда как высокогорный Нарын регулярно опускается до -20°C и ниже, а в самые суровые морозы столбик термометра может достигать -40°C." }
  ],
  KG: [
    { q: "Кыргызстандын климаты кандай?", a: "Кыргызстанда бийиктикке жараша курч өзгөрүүчү континенталдык климат бар — Бишкек, Ош, Жалал-Абад тегерегиндеги ойдуң өрөөндөрдө ысык, кургак жай, ал эми Нарын сыяктуу бийик тоолуу райондордо алда канча катаал кыш." },
    { q: "Кыргызстанга баруу үчүн эң ыңгайлуу мезгил качан?", a: "Адатта майдын аягынан сентябрга чейинки мезгил эң ылайыктуу, тоо ашуулары ачык турат, ал эми Ысык-Көл сыяктуу жерлер эң жылуу болот. Июль-августта түштүктө эң катуу ысык болот, ал эми июнь менен сентябрь жумшагыраак, эл азыраак." },
    { q: "Кыргызстанда кышында канчалык суук болот?", a: "Бул региондон региондо катуу айырмаланат: Бишкек сыяктуу ойдуң шаарларда кышкы түндөр адатта -7...-10°C тегерегинде болот, ал эми бийик тоолуу Нарын дайыма -20°Cден төмөн, эң катуу суукта -40°Cге чейин түшөт." }
  ]
};

// Additional general-Kyrgyzstan questions for the dedicated /faq page (kept
// separate from HOME_FAQ so the homepage section itself stays short — the
// full FAQ page shows HOME_FAQ + MORE_GENERAL_FAQ together).
export const MORE_GENERAL_FAQ = {
  EN: [
    { q: "Does it rain a lot in Kyrgyzstan?", a: "Not for most of the year — Kyrgyzstan's climate is largely dry, but spring (March through June) is the wettest stretch, with April and May typically bringing the most rain, especially in the foothills. Summers turn hot and dry, particularly in the southern valleys." },
    { q: "When is the rainy season in Kyrgyzstan?", a: "The rainy season generally runs from March to June, with April and May the wettest months — foothill areas can see 60mm to 150mm of rain in April alone. By July, most regions dry out considerably." },
    { q: "What should I pack for a trip to Kyrgyzstan?", a: "Pack in layers regardless of season. Even in summer, mountain nights can drop close to 0°C while lowland afternoons reach +30°C, so bring a warm fleece or wool sweater and a windproof, waterproof jacket alongside lighter clothing for the valleys. Sturdy trekking shoes are essential if you're heading into the mountains." },
    { q: "How much snow does Kyrgyzstan get in winter?", a: "It varies enormously by region — high-altitude areas like Naryn see regular, heavy snowfall through the winter, while some intermountain basins near Issyk-Kul stay comparatively snow-free. Lowland cities like Bishkek typically get light-to-moderate snow on 9 to 11 days a month between December and February." },
    { q: "What causes mudflows (sel) in Kyrgyzstan's mountains?", a: "Mudflows, known locally as \"sel,\" are triggered by intense rainfall in mountainous and foothill areas, especially during the summer storm season. Kyrgyzstan's Ministry of Emergency Situations regularly issues storm warnings advising against travel into mountain gorges or camping near riverbeds when heavy rain is forecast." }
  ],
  RU: [
    { q: "В Кыргызстане часто идут дожди?", a: "Большую часть года — нет: климат в Кыргызстане в основном сухой, но весна (с марта по июнь) — самый дождливый период, при этом больше всего осадков обычно выпадает в апреле и мае, особенно в предгорьях. Лето становится жарким и сухим, особенно в южных долинах." },
    { q: "Когда в Кыргызстане сезон дождей?", a: "Сезон дождей обычно длится с марта по июнь, самые дождливые месяцы — апрель и май: в предгорьях в апреле может выпадать от 60 до 150 мм осадков. К июлю большинство регионов заметно подсыхает." },
    { q: "Что взять с собой в поездку в Кыргызстан?", a: "Берите одежду многослойно, независимо от сезона. Даже летом ночью в горах температура может опускаться почти до 0°C, тогда как днём в долинах бывает до +30°C, поэтому возьмите тёплый флис или шерстяной свитер и непродуваемую непромокаемую куртку вместе с лёгкой одеждой для долин. Если планируете горные походы, обязательно нужна прочная треккинговая обувь." },
    { q: "Сколько снега выпадает в Кыргызстане зимой?", a: "Это сильно зависит от региона: в высокогорных районах вроде Нарына зимой регулярно выпадает много снега, тогда как некоторые межгорные котловины у Иссык-Куля остаются сравнительно малоснежными. В низинных городах вроде Бишкека обычно бывает небольшой-умеренный снег в течение 9-11 дней в месяц с декабря по февраль." },
    { q: "Что вызывает сели в горах Кыргызстана?", a: "Сели вызываются интенсивными ливнями в горных и предгорных районах, особенно в летний грозовой сезон. МЧС Кыргызской Республики регулярно объявляет штормовые предупреждения, рекомендуя воздержаться от поездок в горные ущелья и от лагерей у русел рек при прогнозе сильных дождей." }
  ],
  KG: [
    { q: "Кыргызстанда көп жамгыр жаайбы?", a: "Жылдын көпчүлүк бөлүгүндө — жок: Кыргызстандын климаты негизинен кургак, бирок жаз (мартан июнга чейин) эң жамгырлуу мезгил, эң көп жамгыр адатта апрель менен майда жаайт, өзгөчө тоо этектеринде. Жай ысык жана кургак болуп калат, өзгөчө түштүк өрөөндөрдө." },
    { q: "Кыргызстанда жамгыр мезгили качан?", a: "Жамгыр мезгили адатта мартан июнга чейин созулат, эң жамгырлуу айлар — апрель менен май: тоо этегиндеги аймактарда апрелде 60-150 мм жамгыр жаашы мүмкүн. Июлга карай көпчүлүк региондор кыйла кургайт." },
    { q: "Кыргызстанга сапарга эмне алып барыш керек?", a: "Мезгилине карабастан катмарлап кийинүү керек. Жайында да тоодо түнкүсүн температура нөлгө жакын түшүшү мүмкүн, ал эми күндүз өрөөндөрдө +30°Cге чейин жетет, ошондуктан жылуу флис же жүн свитер жана шамалдан, жамгырдан коргогон курткасын жеңил кийимдер менен кошо алып жүрүңүз. Тоого чыгууну пландасаңыз, бекем треккинг бут кийими сөзсүз керек." },
    { q: "Кыргызстанда кышында канча кар жаайт?", a: "Бул региондон региондо катуу айырмаланат: Нарын сыяктуу бийик тоолуу райондордо кышында дайыма көп кар жаайт, ал эми Ысык-Көл жанындагы кээ бир тоо аралык ойдуңдарда кар салыштырмалуу аз болот. Бишкек сыяктуу ойдуң шаарларда адатта декабрдан февралга чейин айына 9-11 күн орточо кар жаайт." },
    { q: "Кыргызстандын тоолорунда селди эмне пайда кылат?", a: "Сел тоолуу жана тоо этегиндеги райондордогу катуу жамгырлардан пайда болот, өзгөчө жайкы бороон мезгилинде. Кыргыз Республикасынын ӨКМи катуу жамгыр божомолдонгондо тоо капчыгайларына баруудан жана дарыя жээктеринде лагерь тигүүдөн алыс болууну сунуштап, штормдук эскертүүлөрдү үзгүлтүксүз жарыялайт." }
  ]
};

export const CITY_FAQ = {
  bishkek: {
    EN: [
      { q: "What's the weather like in Bishkek in winter?", a: "Winters in Bishkek are cold and dry, with daytime temperatures often hovering near freezing and nights dropping to around -7°C or colder. Snow is common from December through February, typically falling on 9 to 11 days a month." },
      { q: "What's the weather like in Bishkek in summer?", a: "Summers are hot and largely dry, with daytime highs frequently climbing into the 30s°C. The city's continental climate brings sharp swings between a hot afternoon and a much cooler evening." },
      { q: "What's the best time to visit Bishkek?", a: "Late spring (May) and early autumn (September) offer the most comfortable conditions, avoiding both the winter cold and the peak summer heat." }
    ],
    RU: [
      { q: "Какая погода в Бишкеке зимой?", a: "Зимы в Бишкеке холодные и сухие: днём температура часто держится около нуля, а ночью опускается до -7°C и ниже. С декабря по февраль часто идёт снег — в среднем 9-11 снежных дней в месяц." },
      { q: "Какая погода в Бишкеке летом?", a: "Лето жаркое и в основном сухое, дневная температура часто поднимается выше +30°C. Резко континентальный климат города даёт заметный перепад между жарким днём и куда более прохладным вечером." },
      { q: "Когда лучше всего ехать в Бишкек?", a: "Поздняя весна (май) и начало осени (сентябрь) — самое комфортное время, без зимнего холода и пиковой летней жары." }
    ],
    KG: [
      { q: "Бишкекте кышында аба ырайы кандай?", a: "Бишкекте кыш суук жана кургак: күндүз температура көбүнчө нөлгө жакын турат, ал эми түнкүсүн -7°Cден төмөн түшөт. Декабрдан февралга чейин көбүнчө кар жаайт — айына орто эсеп менен 9-11 күн." },
      { q: "Бишкекте жайында аба ырайы кандай?", a: "Жай ысык жана негизинен кургак, күндүзгү температура көп учурда +30°Cден жогору көтөрүлөт. Шаардын курч континенталдык климаты ысык күн менен алда канча салкын кечтин ортосунда курч айырманы берет." },
      { q: "Бишкекке баруу үчүн эң ылайыктуу мезгил качан?", a: "Жаздын аягы (май) жана күздүн башы (сентябрь) эң ыңгайлуу мезгил, кыштын суугу да, жайдын эң ысыгы да жок." }
    ]
  },
  tokmok: {
    EN: [
      { q: "What's the weather like in Tokmok in winter?", a: "Like the rest of the Chuy valley, Tokmok has cold, dry winters, with nights regularly falling below freezing and periodic snow between December and February." },
      { q: "What's the weather like in Tokmok in summer?", a: "Summers in Tokmok are hot and dry, similar to nearby Bishkek, with daytime highs often reaching into the low-to-mid 30s°C." },
      { q: "What's the best time to visit Tokmok?", a: "May and September bring the mildest weather, sitting comfortably between the winter cold and the peak summer heat of the Chuy valley." }
    ],
    RU: [
      { q: "Какая погода в Токмоке зимой?", a: "Как и во всей Чуйской долине, зима в Токмоке холодная и сухая, ночи регулярно опускаются ниже нуля, а с декабря по февраль периодически идёт снег." },
      { q: "Какая погода в Токмоке летом?", a: "Лето в Токмоке жаркое и сухое, как и в соседнем Бишкеке, дневная температура часто достигает +30...+34°C." },
      { q: "Когда лучше всего ехать в Токмок?", a: "Май и сентябрь — самое мягкое время, между зимним холодом и пиковой летней жарой Чуйской долины." }
    ],
    KG: [
      { q: "Токмокто кышында аба ырайы кандай?", a: "Бүткүл Чүй өрөөнүндөгүдөй эле, Токмокто кыш суук жана кургак, түндөр дайыма нөлдөн төмөн түшөт, декабрдан февралга чейин мезгил-мезгили менен кар жаайт." },
      { q: "Токмокто жайында аба ырайы кандай?", a: "Токмоктогу жай, жакын жердеги Бишкектегидей эле, ысык жана кургак, күндүзгү температура көп учурда +30...+34°Cге жетет." },
      { q: "Токмокко баруу үчүн эң ылайыктуу мезгил качан?", a: "Май жана сентябрь — Чүй өрөөнүнүн кышкы суугу менен жайкы эң ысыгынын ортосундагы эң жумшак мезгил." }
    ]
  },
  osh: {
    EN: [
      { q: "What's the weather like in Osh in winter?", a: "Winters in Osh are relatively mild for Kyrgyzstan, with daytime temperatures often staying just above freezing, though nights turn consistently cold. Severe frost is uncommon compared to the north of the country." },
      { q: "What's the weather like in Osh in summer?", a: "Summers in Osh are hot, with daytime highs regularly passing +35°C and occasionally reaching +40°C, though evenings cool noticeably to around +16°C to +18°C." },
      { q: "What's the best time to visit Osh?", a: "April-May and September-October are the most comfortable months, avoiding both the intense summer heat and the coldest winter nights." }
    ],
    RU: [
      { q: "Какая погода в Оше зимой?", a: "Зима в Оше сравнительно мягкая для Кыргызстана: днём температура часто держится чуть выше нуля, хотя ночи стабильно холодные. Сильные морозы бывают редко — реже, чем на севере страны." },
      { q: "Какая погода в Оше летом?", a: "Лето в Оше жаркое: дневная температура регулярно превышает +35°C, иногда доходя до +40°C, хотя вечером заметно прохладнее — около +16...+18°C." },
      { q: "Когда лучше всего ехать в Ош?", a: "Апрель-май и сентябрь-октябрь — самые комфортные месяцы, без сильной летней жары и самых холодных зимних ночей." }
    ],
    KG: [
      { q: "Ошто кышында аба ырайы кандай?", a: "Ош үчүн кыш Кыргызстандын башка жерлерине караганда бир кыйла жумшак: күндүз температура көбүнчө нөлдөн бир аз жогору турат, бирок түндөр дайыма суук. Катуу аяз өлкөнүн түндүгүнө караганда сейрек кездешет." },
      { q: "Ошто жайында аба ырайы кандай?", a: "Ош үчүн жай ысык: күндүзгү температура тынымсыз +35°Cден ашат, кээде +40°Cге чейин жетет, бирок кечкурун байкаларлык салкындайт — +16...+18°C тегерегинде." },
      { q: "Ошко баруу үчүн эң ылайыктуу мезгил качан?", a: "Апрель-май жана сентябрь-октябрь эң ыңгайлуу айлар, катуу жайкы ысыктан жана эң суук кыштан алыс." }
    ]
  },
  uzgen: {
    EN: [
      { q: "What's the weather like in Uzgen in winter?", a: "Uzgen shares the Osh region's relatively mild winter climate, with daytime temperatures usually close to or just above freezing and only occasional hard frost." },
      { q: "What's the weather like in Uzgen in summer?", a: "Summers in Uzgen are hot, much like nearby Osh, with daytime temperatures regularly climbing above +35°C during the peak of the season." },
      { q: "What's the best time to visit Uzgen?", a: "Spring and early autumn bring the most comfortable weather, avoiding the harshest summer heat of the southern valley." }
    ],
    RU: [
      { q: "Какая погода в Узгене зимой?", a: "В Узгене, как и во всей Ошской области, зима сравнительно мягкая: дневная температура обычно держится около нуля или чуть выше, сильные морозы редки." },
      { q: "Какая погода в Узгене летом?", a: "Лето в Узгене жаркое, как и в соседнем Оше: дневная температура регулярно поднимается выше +35°C в разгар сезона." },
      { q: "Когда лучше всего ехать в Узген?", a: "Весна и начало осени — самое комфортное время, без сильнейшей летней жары южной долины." }
    ],
    KG: [
      { q: "Өзгөндө кышында аба ырайы кандай?", a: "Өзгөн Ош облусунун калган бөлүгүндөгүдөй эле салыштырмалуу жумшак кышы менен айырмаланат: күндүзгү температура адатта нөлгө жакын же андан бир аз жогору, катуу аяз сейрек болот." },
      { q: "Өзгөндө жайында аба ырайы кандай?", a: "Өзгөндөгү жай, жакын жердеги Оштогудай эле, ысык: сезондун чокусунда күндүзгү температура тынымсыз +35°Cден жогору көтөрүлөт." },
      { q: "Өзгөнгө баруу үчүн эң ылайыктуу мезгил качан?", a: "Жаз жана күздүн башы эң ыңгайлуу мезгил, түштүк өрөөндүн эң катуу жайкы ысыгынан алыс." }
    ]
  },
  'jalal-abad': {
    EN: [
      { q: "What's the weather like in Jalal-Abad in winter?", a: "Winters in Jalal-Abad are comparatively mild, with average temperatures hovering close to 0°C and only occasional hard freezes." },
      { q: "What's the weather like in Jalal-Abad in summer?", a: "Summers are hot and dry, with July temperatures averaging around +27°C and occasionally spiking well above +40°C during the hottest stretches." },
      { q: "What's the best time to visit Jalal-Abad?", a: "Late spring and early autumn offer the mildest conditions, avoiding the intense midsummer heat of the valley." }
    ],
    RU: [
      { q: "Какая погода в Джалал-Абаде зимой?", a: "Зима в Джалал-Абаде сравнительно мягкая: средняя температура держится около 0°C, сильные морозы бывают лишь изредка." },
      { q: "Какая погода в Джалал-Абаде летом?", a: "Лето жаркое и сухое: средняя температура июля около +27°C, а в самые жаркие периоды столбик термометра может подниматься значительно выше +40°C." },
      { q: "Когда лучше всего ехать в Джалал-Абад?", a: "Поздняя весна и начало осени дают самые мягкие условия, без изнуряющей жары середины лета в долине." }
    ],
    KG: [
      { q: "Жалал-Абадда кышында аба ырайы кандай?", a: "Жалал-Абадда кыш салыштырмалуу жумшак: орточо температура 0°Cге жакын турат, катуу аяз сейрек гана болот." },
      { q: "Жалал-Абадда жайында аба ырайы кандай?", a: "Жай ысык жана кургак: июлдун орточо температурасы +27°C тегерегинде, эң ысык мезгилдерде +40°Cден да жогору көтөрүлүшү мүмкүн." },
      { q: "Жалал-Абадга баруу үчүн эң ылайыктуу мезгил качан?", a: "Жаздын аягы жана күздүн башы өрөөндүн жайкы ысыгынан алыс, эң жумшак шарттарды берет." }
    ]
  },
  'kara-balta': {
    EN: [
      { q: "What's the weather like in Kara-Balta in winter?", a: "Kara-Balta sees a typical Chuy valley winter — cold and largely dry, with average daytime temperatures dipping toward freezing and colder nights common from December to February." },
      { q: "What's the weather like in Kara-Balta in summer?", a: "Summer in Kara-Balta is warm to hot, with daytime temperatures typically in the mid-20s°C and occasionally climbing higher during heat spells." },
      { q: "What's the best time to visit Kara-Balta?", a: "Late spring and early autumn offer the most balanced conditions, avoiding the extremes of the Chuy valley's winter cold and summer heat." }
    ],
    RU: [
      { q: "Какая погода в Кара-Балте зимой?", a: "В Кара-Балте, как и во всей Чуйской долине, зима холодная и в основном сухая: средняя дневная температура опускается к нулю, а с декабря по февраль часто бывают холодные ночи." },
      { q: "Какая погода в Кара-Балте летом?", a: "Лето в Кара-Балте тёплое, местами жаркое: дневная температура обычно держится в районе +23...+26°C, а в периоды жары поднимается выше." },
      { q: "Когда лучше всего ехать в Кара-Балту?", a: "Поздняя весна и начало осени дают самые сбалансированные условия, без крайностей зимнего холода и летней жары Чуйской долины." }
    ],
    KG: [
      { q: "Кара-Балтада кышында аба ырайы кандай?", a: "Кара-Балтада, бүткүл Чүй өрөөнүндөгүдөй эле, кыш суук жана негизинен кургак: орточо күндүзгү температура нөлгө жакындайт, декабрдан февралга чейин суук түндөр көп кездешет." },
      { q: "Кара-Балтада жайында аба ырайы кандай?", a: "Кара-Балтадагы жай жылуу, кээде ысык: күндүзгү температура адатта +23...+26°C тегерегинде, ысык мезгилдерде андан да жогору көтөрүлөт." },
      { q: "Кара-Балтага баруу үчүн эң ылайыктуу мезгил качан?", a: "Жаздын аягы жана күздүн башы Чүй өрөөнүнүн кышкы суугу менен жайкы ысыгынын ортосундагы эң тең салмактуу шарттарды берет." }
    ]
  },
  karakol: {
    EN: [
      { q: "What's the weather like in Karakol in winter?", a: "Karakol's winters are milder than much of highland Kyrgyzstan thanks to the nearby lake, which rarely freezes — January temperatures typically range from about -2°C to -10°C." },
      { q: "What's the weather like in Karakol in summer?", a: "Summers in Karakol are warm and dry without the intense heat of the southern valleys, with July temperatures generally around +17°C to +18°C — ideal for hiking and mountain excursions." },
      { q: "What's the best time to visit Karakol?", a: "Late June through September is the classic window, combining warm, stable weather with open mountain trails around the lake." }
    ],
    RU: [
      { q: "Какая погода в Караколе зимой?", a: "Зима в Караколе мягче, чем в большинстве высокогорных районов Кыргызстана, благодаря соседнему озеру, которое почти никогда не замерзает — температура в январе обычно держится в пределах -2...-10°C." },
      { q: "Какая погода в Караколе летом?", a: "Лето в Караколе тёплое и сухое, без изнуряющей жары южных долин: температура июля обычно около +17...+18°C — отличные условия для походов и горных экскурсий." },
      { q: "Когда лучше всего ехать в Каракол?", a: "С конца июня по сентябрь — классическое время: тёплая устойчивая погода сочетается с открытыми горными тропами вокруг озера." }
    ],
    KG: [
      { q: "Караколдо кышында аба ырайы кандай?", a: "Караколдогу кыш Кыргызстандын көпчүлүк бийик тоолуу райондоруна караганда жумшагыраак, себеби жанындагы көл дээрлик тоңбойт — январдагы температура адатта -2...-10°C аралыгында болот." },
      { q: "Караколдо жайында аба ырайы кандай?", a: "Караколдогу жай жылуу жана кургак, түштүк өрөөндөрдүн катуу ысыгы жок: июлдагы температура адатта +17...+18°C тегерегинде — жөө жүрүш жана тоо экскурсиялары үчүн эң ылайыктуу." },
      { q: "Караколго баруу үчүн эң ылайыктуу мезгил качан?", a: "Июндун аягынан сентябрга чейин — классикалык мезгил: жылуу, туруктуу аба ырайы көл тегерегиндеги ачык тоо жолдору менен айкалышат." }
    ]
  },
  balykchy: {
    EN: [
      { q: "What's the weather like in Balykchy in winter?", a: "Balykchy, on Issyk-Kul's western shore, shares the lake's moderating effect, with winter temperatures generally milder than in the surrounding highlands, though it's also drier and windier than the eastern shore." },
      { q: "What's the weather like in Balykchy in summer?", a: "Summers are warm and notably dry — the western end of the lake receives far less rainfall than Karakol's side, making for consistently sunny conditions." },
      { q: "What's the best time to visit Balykchy?", a: "Summer, from June through September, brings the warmest and driest conditions for exploring the lake's western shore." }
    ],
    RU: [
      { q: "Какая погода в Балыкчы зимой?", a: "Балыкчы на западном берегу Иссык-Куля тоже ощущает смягчающее влияние озера: зимние температуры обычно мягче, чем в окрестных высокогорьях, хотя здесь суше и ветренее, чем на восточном берегу." },
      { q: "Какая погода в Балыкчы летом?", a: "Лето тёплое и заметно сухое — западная оконечность озера получает намного меньше осадков, чем сторона Каракола, поэтому погода стабильно солнечная." },
      { q: "Когда лучше всего ехать в Балыкчы?", a: "Лето, с июня по сентябрь, приносит самые тёплые и сухие условия для знакомства с западным берегом озера." }
    ],
    KG: [
      { q: "Балыкчыда кышында аба ырайы кандай?", a: "Ысык-Көлдүн батыш жээгиндеги Балыкчы да көлдүн жумшартуучу таасирин сезет: кышкы температура тегеректеги бийик тоолорго караганда адатта жумшагыраак, бирок чыгыш жээкке караганда кургагыраак жана шамалдуураак." },
      { q: "Балыкчыда жайында аба ырайы кандай?", a: "Жай жылуу жана байкаларлык кургак — көлдүн батыш учу Каракол тарабына караганда алда канча аз жамгыр алат, ошондуктан аба ырайы туруктуу күндүү болот." },
      { q: "Балыкчыга баруу үчүн эң ылайыктуу мезгил качан?", a: "Июндан сентябрга чейинки жай көлдүн батыш жээгин кыдыруу үчүн эң жылуу жана эң кургак шарттарды берет." }
    ]
  },
  naryn: {
    EN: [
      { q: "What's the weather like in Naryn in winter?", a: "Naryn is the coldest city in Kyrgyzstan, with a January average around -13°C and daytime highs of -25°C considered normal during cold spells — nights can plunge toward -40°C in the harshest snaps." },
      { q: "What's the weather like in Naryn in summer?", a: "Summers are short but pleasantly warm, with a July average around +17°C, offering a welcome break from the long, harsh winter." },
      { q: "What's the best time to visit Naryn?", a: "July and August are by far the most comfortable months, since Naryn's high-altitude winters are severe even by Kyrgyzstan standards." }
    ],
    RU: [
      { q: "Какая погода в Нарыне зимой?", a: "Нарын — самый холодный город Кыргызстана: средняя температура января около -13°C, а дневные -25°C считаются нормой в морозные периоды — ночью столбик термометра может опускаться почти до -40°C в самые суровые дни." },
      { q: "Какая погода в Нарыне летом?", a: "Лето короткое, но приятно тёплое: средняя температура июля около +17°C — долгожданная передышка после долгой суровой зимы." },
      { q: "Когда лучше всего ехать в Нарын?", a: "Июль и август — безусловно самые комфортные месяцы, ведь высокогорная зима в Нарыне сурова даже по меркам Кыргызстана." }
    ],
    KG: [
      { q: "Нарында кышында аба ырайы кандай?", a: "Нарын — Кыргызстандын эң суук шаары: январдын орточо температурасы -13°C тегерегинде, ал эми суук мезгилдерде күндүзгү -25°C калыпка эсептелет — эң катуу суукта түндөр -40°Cге жакындашы мүмкүн." },
      { q: "Нарында жайында аба ырайы кандай?", a: "Жай кыска, бирок жагымдуу жылуу: июлдун орточо температурасы +17°C тегерегинде — узак жана катаал кыштан кийинки күтүлгөн эс алуу." },
      { q: "Нарынга баруу үчүн эң ылайыктуу мезгил качан?", a: "Июль жана август — эч талашсыз эң ыңгайлуу айлар, себеби Нарындын бийик тоолуу кышы Кыргызстандын өз чени боюнча да катаал." }
    ]
  },
  talas: {
    EN: [
      { q: "What's the weather like in Talas in winter?", a: "Talas has a continental valley climate with cold, dry winters, similar in character to Kyrgyzstan's other lowland regions, with temperatures regularly dropping below freezing overnight." },
      { q: "What's the weather like in Talas in summer?", a: "Summers in Talas are warm to hot, with daytime temperatures often climbing into the 30s°C during the peak of the season." },
      { q: "What's the best time to visit Talas?", a: "Late spring and early autumn provide the most comfortable balance between the region's cold winters and hot summers." }
    ],
    RU: [
      { q: "Какая погода в Таласе зимой?", a: "В Таласе континентальный климат долины с холодной сухой зимой, похожий по характеру на другие низинные регионы Кыргызстана: ночью температура регулярно опускается ниже нуля." },
      { q: "Какая погода в Таласе летом?", a: "Лето в Таласе тёплое, местами жаркое: в разгар сезона дневная температура часто поднимается выше +30°C." },
      { q: "Когда лучше всего ехать в Талас?", a: "Поздняя весна и начало осени дают самый комфортный баланс между холодной зимой и жарким летом региона." }
    ],
    KG: [
      { q: "Таласта кышында аба ырайы кандай?", a: "Таласта суук, кургак кышы бар континенталдык өрөөн климаты бар, мүнөзү боюнча Кыргызстандын башка ойдуң региондоруна окшош: түнкүсүн температура дайыма нөлдөн төмөн түшөт." },
      { q: "Таласта жайында аба ырайы кандай?", a: "Таласта жай жылуу, кээде ысык: сезондун чокусунда күндүзгү температура көп учурда +30°Cден жогору көтөрүлөт." },
      { q: "Таласка баруу үчүн эң ылайыктуу мезгил качан?", a: "Жаздын аягы жана күздүн башы региондун суук кышы менен ысык жайынын ортосундагы эң ыңгайлуу балансты берет." }
    ]
  }
};
