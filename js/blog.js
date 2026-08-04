// Pogoda Kg - Weather News & Blog Manager (Multilingual Support: EN, KG, RU)
import { initTheme } from './theme.js';
import { initLangSwitcher, getCurrentLang } from './i18n.js';

export const BLOG_POSTS = [
  {
    id: "post-0",
    slug: "bishkek-temperature-drop-across-kyrgyzstan-regions",
    image: "/assets/images/bishkek-temp-drop.jpg",
    translations: {
      EN: {
        title: "Bishkek Drops 5°C as Regional Cooling Front Spreads Across Kyrgyzstan",
        category: "Regional Weather",
        date: "August 4, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Morning temperatures in Bishkek fall to +24°C with light drizzle as cool alpine air lowers temperatures by 2°C to 5°C across all major cities in Kyrgyzstan.",
        content: `
          <p>Air temperatures in Bishkek dropped to +24°C on the morning of August 4—a noticeable 5°C drop compared to the +29°C recorded at the same time yesterday. The shift comes as a refreshing atmospheric cooling front sweeps across the Chuy Valley and surrounding highland regions of Kyrgyzstan.</p>
          <h3>Wind & Atmospheric Conditions in Bishkek</h3>
          <p>A gentle easterly wind of 2 m/s with gusts reaching up to 6 m/s accompanied a soft morning drizzle in Bishkek, contrasting with yesterday's dry westerly winds of 3 m/s (gusts to 8 m/s).</p>
          <h3>Nationwide Regional Breakdown</h3>
          <p>The cooling trend was observed across almost every major city and province in Kyrgyzstan:</p>
          <ul>
            <li><strong>Naryn:</strong> Experienced the most dramatic shift, falling from +23°C to +15°C under overcast mountain skies.</li>
            <li><strong>Cholpon-Ata (Issyk-Kul):</strong> Cooled from +23°C down to +19°C with moderate coastal drizzle.</li>
            <li><strong>Talas:</strong> Dropped from +26°C to +22°C under mostly clear skies.</li>
            <li><strong>Southern Regions (Osh, Batken, Manas):</strong> Registered mild decreases of 2°C to 3°C, with Osh at +30°C (down from +32°C), Batken at +26°C (down from +29°C), and Manas at +28°C (down from +30°C).</li>
          </ul>
          <p>Overall, August 4 brings cooler, comfortable weather to all 10 major municipal centers in Kyrgyzstan, providing relief from intense peak summer heat.</p>
        `
      },
      KG: {
        title: "Бишкекте абанын температурасы кечээкиге караганда 5°Cге төмөндөдү — салкындоо бардык региондорду каптады",
        category: "Аймактык аба ырайы",
        date: "4-август, 2026",
        author: "Pogoda синоптиктер тобу",
        excerpt: "4-август күнү эртең менен Бишкекте температура +24°Cге чейин түшүп, мамыр жамгыр жаады. Өлкөнүн аймактарында температура 2ден 5 градуска чейин төмөндөдү.",
        color: "Аймактык аба ырайы",
        content: `
          <p>4-август саат 09:30га карата Бишкек шаарында абанын температурасы +24°Cди түздү. Бул кечээки күнгө салыштырмалуу (+29°C) 5 градуска төмөн. Чүй өрөөнүнө жана тоолуу аймактарга салкын аба ма массасы келди.</p>
          <h3>Бишкектеги шамал жана жаан-чачын</h3>
          <p>Столицада чыгыштан соккон мелүүн шамалдын ылдамдыгы 2 м/сек (күчөшү 6 м/сек) түзүп, сыдырым майда жамгыр жаады. Кечээ күн ачык болуп, батыш шамалы 3–8 м/сек согуп жаткан эле.</p>
          <h3>Облустар боюнча аба ырайы маалыматы</h3>
          <p>Салкындоо Кыргызстандын бардык ири шаарларында катталды:</p>
          <ul>
            <li><strong>Нарын:</strong> Температура кескин төмөндөп, +23°Cден +15°Cге чейин түштү, күн булуттуу.</li>
            <li><strong>Чолпон-Ата (Ысык-Көл):</strong> +23°Cден +19°Cге чейин салкындап, майда жамгыр жаады.</li>
            <li><strong>Талас:</strong> +26°Cден +22°Cге чейин төмөндөдү.</li>
            <li><strong>Түштүк аймактар (Ош, Баткен, Манас):</strong> Ошто +30°C (кечээ +32°C), Баткенде +26°C (кечээ +29°C), Манаста +28°C (кечээ +30°C).</li>
          </ul>
          <p>Ошентип, 4-августта Кыргызстандын 10 ири шаарында тең аба ырайы салкындап, жайкы аптап убактылуу чегинди.</p>
        `
      },
      RU: {
        title: "В Бишкеке температура опустилась на 5°C по сравнению со вчерашним днем — похолодание охватило все регионы КР",
        category: "Региональная погода",
        date: "4 августа 2026",
        author: "Команда Pogoda",
        excerpt: "Утром 4 августа в Бишкеке зафиксировано +24°C с моросящим дождем. Снижение температуры на 2–5 градусов отмечено во всех городах Кыргызстана.",
        content: `
          <p>Температура воздуха в Бишкеке утром 4 августа составила +24°C — это на 5 градусов ниже, чем в это же время накануне (+29°C). Прохладный атмосферный фронт принес свежесть в Чуйскую долину и регионы республики.</p>
          <h3>Ветер и осадки в столице</h3>
          <p>В столице отмечается тихий восточный ветер со скоростью 2 м/с (порывы до 6 м/с) и умеренная морось. Днем ранее в городе дул западный ветер 3–8 м/с и стояла ясная погода.</p>
          <h3>Ситуация по регионам Кыргызстана</h3>
          <p>Снижение температуры зафиксировано практически во всех уголках страны:</p>
          <ul>
            <li><strong>Нарын:</strong> Наиболее заметный спад — с +23°C до +15°C, погода сменилась на пасмурную.</li>
            <li><strong>Чолпон-Ата (Иссык-Куль):</strong> Похолодало с +23°C до +19°C, сохраняется умеренная морось.</li>
            <li><strong>Талас:</strong> Столбики термометров опустились с +26°C до +22°C.</li>
            <li><strong>Юг республики (Ош, Баткен, Манас):</strong> В Оше +30°C (вчера +32°C), в Баткене +26°C (вчера +29°C), в Манасе +28°C (вчера +30°C).</li>
          </ul>
          <p>Таким образом, 4 августа во всех крупных населенных пунктах Кыргызстана температура оказалась на 2–5 градусов ниже вчерашних показателей.</p>
        `
      }
    }
  },
  {
    id: "post-1",
    slug: "tian-shan-mountain-passes-weather-advisory-for-drivers",
    image: "/assets/images/hero_mountains.webp",
    translations: {
      EN: {
        title: "Tian-Shan Mountain Passes Weather Advisory for Drivers",
        category: "Mountain Weather",
        date: "July 22, 2026",
        author: "Meteorologist Team",
        excerpt: "High altitude snow condition breakdown for Too-Ashuu and Ala-Bel mountain routes connecting Bishkek and Osh.",
        content: `
          <p>Drivers traveling between Bishkek and Osh are advised to stay updated on mountain weather conditions over the Tian-Shan range. High-altitude passes including Too-Ashuu (3,180m) and Ala-Bel (3,175m) experience swift weather shifts even during summer months.</p>
          <h3>Current Road & Temperature Status</h3>
          <p>Visibility remains clear above 2,500 meters, but sudden temperature drops in the evening can cause damp road surfaces to freeze. The Ministry of Emergency Situations recommends checking live forecast updates on Pogoda Kg before embarking on long alpine trips.</p>
          <ul>
            <li>Too-Ashuu Tunnel Pass: Clear, temp +8°C at peak.</li>
            <li>Ala-Bel Valley: Light rain showers expected after 16:00.</li>
            <li>Otmek Pass: Sunny with moderate wind speeds of 24 km/h.</li>
          </ul>
        `
      },
      KG: {
        title: "Тянь-Шань тоо ашууларындагы айдоочулар үчүн аба ырайы эскертүүсү",
        category: "Тоо аба ырайы",
        date: "22-июль, 2026",
        author: "Синоптиктер тобу",
        excerpt: "Бишкек жана Ош шаарларын байланыштырган Төө-Ашуу жана Ала-Бел тоо жолдорундагы кар жаашы жана аба ырайы маалыматы.",
        content: `
          <p>Бишкек жана Ош шаарларынын ортосунда жол тарткан айдоочуларга Тянь-Шань тоо кыркаларындагы аба ырайы тууралуу маалыматты байкап туруу сунушталат. Төө-Ашуу (3 180 м) жана Ала-Бел (3 175 м) бийик тоолуу ашууларында аба ырайы жай айларында да тез өзгөрүп турат.</p>
          <h3>Учурдагы жол жана температура абалы</h3>
          <p>2 500 метрден жогору бийиктикте көрүнүү ачык, бирок кечинде температура кескин төмөндөп, нымдуу жолдор тайгак болушу мүмкүн. Өзгөчө кырдаалдар министрлиги узак жолго чыгар алдында Pogoda Kg сайтынан түз ободогу божомолду текшерүүнү сунуштайт.</p>
          <ul>
            <li>Төө-Ашуу тоннели: Ачык, чокусунда температура +8°C.</li>
            <li>Ала-Бел өрөөнү: Саат 16:00дөн кийин өткүн өтүшү күтүлөт.</li>
            <li>Өтмөк ашуусу: Күн ачык, шамалдын ылдамдыгы 24 км/саат.</li>
          </ul>
        `
      },
      RU: {
        title: "Предупреждение о погоде на перевалах Тянь-Шаня для водителей",
        category: "Горная погода",
        date: "22 июля 2026",
        author: "Команда метеорологов",
        excerpt: "Обзор снежного покрова и погодных условий на горных трассах Тоо-Ашуу и Ала-Бель, соединяющих Бишкек и Ош.",
        content: `
          <p>Водителям, следующим по маршруту Бишкек — Ош, рекомендуется следить за обновлениями погодных условий на перевалах Тянь-Шаня. На высокогорных перевалах Тоо-Ашуу (3180 м) и Ала-Бель (3175 м) погода может резко меняться даже в летние месяцы.</p>
          <h3>Текущее состояние дорог и температура</h3>
          <p>Видимость на высоте более 2500 метров остается хорошей, однако вечернее похолодание может вызвать гололедицу на влажных участках дороги. МЧС рекомендует проверять свежий прогноз на Pogoda Kg перед дальними поездками.</p>
          <ul>
            <li>Перевал Тоо-Ашуу: Ясно, температура на пике +8°C.</li>
            <li>Долина Ала-Бель: После 16:00 ожидаются кратковременные дожди.</li>
            <li>Перевал Отмек: Солнечно, умеренный ветер до 24 км/ч.</li>
          </ul>
        `
      }
    }
  },
  {
    id: "post-2",
    slug: "heavy-rain-mountain-runoff-in-chuy-valley",
    image: "/assets/images/kara_balta.webp",
    translations: {
      EN: {
        title: "Heavy Rain & Mountain Runoff in Chuy Valley",
        category: "Rain Forecast",
        date: "July 21, 2026",
        author: "Pogoda Editor",
        excerpt: "Localized heavy rain showers expected in Bishkek, Kara-Balta, and Tokmok over the weekend.",
        content: `
          <p>An atmospheric front moving from the west brings increased humidity and evening thunderstorms across the Chuy Valley. Main urban centers including Bishkek and Kara-Balta will see short bursts of precipitation.</p>
          <p>Drainage systems in central Bishkek are monitored, and local drivers are reminded to slow down on wet tarmac during rush hours.</p>
        `
      },
      KG: {
        title: "Чүй өрөөнүндө нөшөрлөгөн жамгыр жана тоо сууларынын көбөйүшү",
        category: "Жамгыр божомолу",
        date: "21-июль, 2026",
        author: "Pogoda редактору",
        excerpt: "Дем алыш күндөрү Бишкек, Кара-Балта жана Токмок шаарларында нөшөрлөгөн жамгыр жаашы күтүлөт.",
        content: `
          <p>Батыштан жылган атмосфердик фронт Чүй өрөөнүнө жогорку нымдуулук жана кечки күн күркүрөөнү алып келет. Бишкек жана Кара-Балта шаарларында кыска мөөнөттүү жаан жаашы күтүлөт.</p>
          <p>Бишкектин борборундагы дренаждык системалар көзөмөлгө алынууда, ал эми айдоочуларга нымдуу жолдо ылдамдыкты азайтуу сунушталат.</p>
        `
      },
      RU: {
        title: "Сильные дожди и горные стоки в Чуйской долине",
        category: "Прогноз дождей",
        date: "21 июля 2026",
        author: "Редактор Pogoda",
        excerpt: "В Бишкеке, Кара-Балте и Токмаке на выходных ожидаются сильные кратковременные дожди.",
        content: `
          <p>Атмосферный фронт с запада принесет повышенную влажность и вечерние грозы в Чуйскую долину. В Бишкеке и Кара-Балте ожидаются кратковременные ливни.</p>
          <p>Дренажные системы столицы находятся под наблюдением. Водителям рекомендуется соблюдать дистанцию на мокрой дороге.</p>
        `
      }
    }
  },
  {
    id: "post-3",
    slug: "issyk-kul-summer-lake-weather-water-temperature-guide",
    image: "/assets/images/balykchy.webp",
    translations: {
      EN: {
        title: "Issyk-Kul Summer Lake Weather & Water Temperature Guide",
        category: "Issyk-Kul Region",
        date: "July 20, 2026",
        author: "Balykchy Bureau",
        excerpt: "Water temperature reaches 20°C in Cholpon-Ata and Balykchy with sunny weekend forecasts.",
        content: `
          <p>Lake Issyk-Kul is experiencing prime summer resort weather. Water surface temperatures in Cholpon-Ata, Balykchy, and Karakol bay have reached 19°C - 21°C. Offshore morning breezes remain gentle at 12 km/h.</p>
          <p>Vacationers can expect up to 10 hours of direct sunshine per day with low UV index during early morning hours.</p>
        `
      },
      KG: {
        title: "Ысык-Көлдүн жайкы аба ырайы жана суунун температурасы",
        category: "Ысык-Көл аймагы",
        date: "20-июль, 2026",
        author: "Балыкчы бюросу",
        excerpt: "Чолпон-Ата жана Балыкчыда суунун температурасы 20°Cге жетип, күн ачык болот.",
        content: `
          <p>Ысык-Көлдө жайкы курорттук сезон күчүндө. Чолпон-Ата, Балыкчы жана Каракол булуңунда суунун температурасы 19°C - 21°Cге жетти. Эртең мененки жээк шамалы саатына 12 км ылдамдыкта сыдырым согуп турат.</p>
          <p>Эс алуучулар күнүнө 10 саатка чейин күн нурун көрө алышат.</p>
        `
      },
      RU: {
        title: "Погода на Иссык-Куле и температура воды летом",
        category: "Регион Иссык-Куль",
        date: "20 июля 2026",
        author: "Бюро Балыкчы",
        excerpt: "Температура воды в Чолпон-Ате и Балыкчи достигла 20°C, на выходных ожидается солнечная погода.",
        content: `
          <p>На озере Иссык-Куль продолжается бархатный летний сезон. Температура воды в Чолпон-Ате, Балыкчи и Караколе достигла +19°C...+21°C. Утренний бриз умеренный — до 12 км/ч.</p>
          <p>Отдыхающих ждет до 10 часов прямого солнца в день при комфортном УФ-индексе по утрам.</p>
        `
      }
    }
  },
  {
    id: "post-4",
    slug: "bishkek-air-quality-weekly-uv-index-report",
    image: "/assets/images/bishkek.webp",
    translations: {
      EN: {
        title: "Bishkek Air Quality & Weekly UV Index Report",
        category: "Urban Climate",
        date: "July 19, 2026",
        author: "Climate Desk",
        excerpt: "Air quality index remains in the Good zone across Bishkek urban parks following recent rain showers.",
        content: `
          <p>Fresh mountain air currents down from Ala-Archa gorge have refreshed the atmosphere across Bishkek. The Air Quality Index (AQI) is currently reading 32 (Good), making it ideal for outdoor sports and city walks.</p>
        `
      },
      KG: {
        title: "Бишкектин абасынын сапаты жана жумалык УФ индекси",
        category: "Шаар климаты",
        date: "19-июль, 2026",
        author: "Климат бөлүмү",
        excerpt: "Акыркы жааган жамгырдан кийин Бишкектин сейил бактарында абанын сапаты таза бойдон калууда.",
        content: `
          <p>Ала-Арча капчыгайынан соккон таза тоо абасы Бишкектин атмосферасын жаңыртты. Абанын сапатынын индекси (AQI) учурда 32ни (Таза) түзүп, сейилдөө жана спорт үчүн абдан ыңгайлуу.</p>
        `
      },
      RU: {
        title: "Качество воздуха в Бишкеке и недельный УФ-индекс",
        category: "Городской климат",
        date: "19 июля 2026",
        author: "Отдел климата",
        excerpt: "После прошедших дождей индекс качества воздуха в парках Бишкека остается в зеленой зоне.",
        content: `
          <p>Свежие горные потоки из ущелья Ала-Арча очистили воздух над Бишкеком. Индекс качества воздуха (AQI) составляет 32 (Хорошо), что идеально для прогулок и спорта на открытом воздухе.</p>
        `
      }
    }
  },
  {
    id: "post-5",
    slug: "naryn-highland-snowfall-temperature-drop-outlook",
    image: "/assets/images/naryn.webp",
    translations: {
      EN: {
        title: "Naryn Highland Snowfall & Temperature Drop Outlook",
        category: "Mountain Weather",
        date: "July 18, 2026",
        author: "Naryn Station Desk",
        excerpt: "High elevation areas in Naryn region see sub-zero night temperatures and crisp mountain sun.",
        content: `
          <p>Naryn station reports crisp clear morning skies with night temperatures dipping near freezing at high elevations. Shepherds and mountain trekkers are advised to dress in layers.</p>
        `
      },
      KG: {
        title: "Нарын бийик тоолуу аймактарында кар жаашы жана суук түшүшү",
        category: "Тоо аба ырайы",
        date: "18-июль, 2026",
        author: "Нарын станциясы",
        excerpt: "Нарын облусунун бийик тоолуу аймактарында түнкүсүн абанын температурасы 0°Cден төмөндөйт.",
        content: `
          <p>Нарын метеостанциясы ачык эртең мененки асманды жана бийик тоолордо түнкү температуранын нөлгө жакындашын кабарлайт. Малчыларга жана туристтерге жылуу кийинүү сунушталат.</p>
        `
      },
      RU: {
        title: "Снегопады и похолодание в высокогорном Нарыне",
        category: "Горная погода",
        date: "18 июля 2026",
        author: "Станция Нарын",
        excerpt: "В высокогорных районах Нарынской области ночные температуры опускаются ниже нуля.",
        content: `
          <p>Метеостанция Нарына сообщает о ясном утреннем небе и ночных заморозках на высокогорье. Чабанам и туристам рекомендуется одеваться теплее.</p>
        `
      }
    }
  },
  {
    id: "post-6",
    slug: "karakol-peak-ski-winter-trail-forecast",
    image: "/assets/images/karakol.webp",
    translations: {
      EN: {
        title: "Karakol Peak Ski & Winter Trail Forecast",
        category: "Mountain Weather",
        date: "July 17, 2026",
        author: "Karakol Alpine Team",
        excerpt: "Karakol ski slopes report excellent powder snow conditions and clear alpine visibility.",
        content: `
          <p>Alpine snow monitoring equipment at Karakol base elevation (2,300m) shows pristine winter snow cover. Peak wind speeds remain under 15 km/h with high solar radiation.</p>
        `
      },
      KG: {
        title: "Каракол чокусу жана тоо лыжа жолдорунун божомолу",
        category: "Тоо аба ырайы",
        date: "17-июль, 2026",
        author: "Каракол альп тобу",
        excerpt: "Каракол тоо лыжа базасында кардын абалы жакшы жана тоодо көрүнүү ачык.",
        content: `
          <p>Каракол базасынын 2 300 м бийиктигиндеги кар мониторинги кардын калыңдыгы жакшы экенин көрсөтөт. Шамалдын ылдамдыгы саатына 15 кмден ашпайт.</p>
        `
      },
      RU: {
        title: "Прогноз погоды для горнолыжной базы Каракол",
        category: "Горная погода",
        date: "17 июля 2026",
        author: "Альпийская команда Каракола",
        excerpt: "На склонах базы Каракол отличный снежный покров и прекрасная видимость.",
        content: `
          <p>Снегомерное оборудование базы Каракол (2300 м) фиксирует отличный снежный покров. Скорость ветра на пиках не превышает 15 км/ч.</p>
        `
      }
    }
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  const currentLang = getCurrentLang() || 'KG';

  const gridContainer = document.getElementById('blogCardsGrid');
  if (gridContainer) {
    renderBlogPosts(BLOG_POSTS, currentLang);
    initLangSwitcher((lang) => {
      renderBlogPosts(BLOG_POSTS, lang);
    });
  } else {
    initSingleArticle(currentLang);
    initLangSwitcher((lang) => {
      initSingleArticle(lang);
    });
  }
});

function renderBlogPosts(posts, lang = 'KG') {
  const container = document.getElementById('blogCardsGrid');
  if (!container) return;

  if (posts.length === 0) {
    const noResultsText = lang === 'KG' ? 'Сиздин издөөңүзгө дал келген макалалар табылган жок.' : (lang === 'RU' ? 'Статьи по вашему запросу не найдены.' : 'No weather articles found matching your filter.');
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding:40px; color:var(--text-sub);">${noResultsText}</p>`;
    return;
  }

  container.innerHTML = posts.map(post => {
    const data = post.translations[lang] || post.translations.EN;
    return `
      <a href="/blog/${post.slug}.html" style="text-decoration: none; color: inherit;">
        <div class="news-card" style="height: 380px;">
          <img src="${post.image}" alt="${data.title}" class="news-card-img">
          <div class="news-card-overlay">
            <span class="news-tag">${data.category}</span>
            <h3 class="news-title" style="font-size:18px;">${data.title}</h3>
            <p style="font-size:13px; opacity:0.85; margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${data.excerpt}</p>
            <div class="news-meta">
              <span><i class="fa-solid fa-user"></i> ${data.author}</span>
              <span><i class="fa-solid fa-calendar"></i> ${data.date}</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

function initSingleArticle(lang = 'KG') {
  const path = window.location.pathname;
  const post = BLOG_POSTS.find(p => path.includes(p.slug));
  if (!post) return;

  const data = post.translations[lang] || post.translations.EN;

  // Breadcrumbs
  const breadcrumbsSpans = document.querySelectorAll('.breadcrumbs-container span');
  if (breadcrumbsSpans.length > 0) {
    const lastSpan = breadcrumbsSpans[breadcrumbsSpans.length - 1];
    if (lastSpan) lastSpan.textContent = data.title;
  }

  // Back button
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    const backText = lang === 'KG' ? 'Жаңылыктарга кайтуу' : (lang === 'RU' ? 'Назад к новостям' : 'Back to News');
    backBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> ${backText}`;
  }

  // News tag
  const newsTag = document.querySelector('.news-tag');
  if (newsTag) newsTag.textContent = data.category;

  // Post title H1
  const postTitle = document.querySelector('.post-title');
  if (postTitle) postTitle.textContent = data.title;

  // Post Meta
  const postMeta = document.querySelector('.post-meta');
  if (postMeta) {
    postMeta.innerHTML = `
      <span><i class="fa-solid fa-user"></i> ${data.author}</span>
      <span><i class="fa-solid fa-calendar"></i> ${data.date}</span>
    `;
  }

  // Post Content
  const postContent = document.querySelector('.post-content');
  if (postContent) {
    postContent.innerHTML = data.content;
  }
}

// Search input handler on blog.html
const searchInput = document.getElementById('blogSearchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const lang = getCurrentLang() || 'KG';
    const filtered = BLOG_POSTS.filter(post => {
      const data = post.translations[lang] || post.translations.EN;
      return data.title.toLowerCase().includes(query) || data.excerpt.toLowerCase().includes(query);
    });
    renderBlogPosts(filtered, lang);
  });
}
