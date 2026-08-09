// Pogoda Kg - Weather News & Blog Manager (Multilingual Support: EN, KG, RU)
import { initTheme } from './theme.js';
import { initLangSwitcher, getCurrentLang } from './i18n.js';

export const BLOG_POSTS = [
  {
    id: "post-rain-naryn-issyk-kul-aug-8",
    slug: "rain-thunder-return-naryn-issyk-kul-overnight-august-8",
    image: "/assets/images/news_heavy_rain.webp",
    translations: {
      EN: {
        title: "Rain and Thunder Return to Naryn and Issyk-Kul Overnight August 8",
        category: "Mountain Weather",
        date: "August 9, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Rising cloud cover brings rain and thunderstorms to Naryn and Issyk-Kul overnight into August 8, ending a run of clear highland skies.",
        content: `
          <p>After a dry, hot start to August, cloud cover has been steadily building across Kyrgyzstan's highland regions since <strong>August 4</strong>. <strong>Kyrgyzhydromet</strong> forecasters expect the shift to bring rain and thunderstorms to parts of <strong>Naryn</strong> and <strong>Issyk-Kul</strong> regions overnight into August 8, ending a run of clear, sun-baked days at higher elevations.</p>
          <h3>Following the Summer's Hottest Stretch</h3>
          <p>The change follows the summer's hottest stretch, when daytime highs in the southern lowlands touched <strong>+39°C</strong> between July 31 and August 3. Residents and travelers in the highlands should expect cooler, more unsettled conditions overnight, with clearer skies likely to return once the front passes.</p>
          <p>Drivers heading through mountain routes in Naryn and Issyk-Kul regions overnight should watch for reduced visibility and wet road surfaces until the storms clear.</p>
          <h3>Update, August 9</h3>
          <p>The unsettled pattern is continuing today, with <strong>Kyrgyzhydromet</strong> forecasting fresh rain across Naryn and Issyk-Kul regions while the south stays hot and dry. See the <a href="/blog/august-9-regional-forecast-kyrgyzstan-temperature-spread.html">full August 9 regional forecast</a> for details.</p>
        `
      },
      KG: {
        title: "Нарын жана Ысык-Көлгө түнкүсүн жамгыр менен күркүрөө кайтты",
        category: "Тоо аба ырайы",
        date: "9-август, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Булуттуулуктун көбөйүшү Нарын жана Ысык-Көлгө 8-августка карай түнкүсүн жамгыр менен күркүрөө алып келет.",
        content: `
          <p>Августтун кургак, ысык башталышынан кийин Кыргызстандын тоолуу региондорунда <strong>4-августтан</strong> бери булуттуулук акырындык менен көбөйүп жатат. <strong>Кыргызгидромет</strong> синоптиктери бул өзгөрүү <strong>Нарын</strong> жана <strong>Ысык-Көл</strong> облустарынын айрым жерлерине 8-августка карай түнкүсүн жамгыр жана күн күркүрөөсүн алып келет деп божомолдоп жатышат, бул бийик тоолуу аймактардагы ачык, күнгө куурулган күндөрдүн тизмегин токтотот.</p>
          <h3>Жайдын эң ысык мезгилинен кийин</h3>
          <p>Бул өзгөрүү 31-июль менен 3-август аралыгында түштүк тектир аймактарда күндүзгү температура <strong>+39°C</strong>ге жеткен жайдын эң ысык мезгилинен кийин келүүдө. Тоолуу аймактардагы тургундар жана саякатчылар түнкүсүн салкыныраак, туруксузураак аба ырайын күтүшү керек, ал эми фронт өткөндөн кийин асман кайра ачылат.</p>
          <h3>Жаңылануу, 9-август</h3>
          <p>Туруксуз аба ырайы бүгүн да улантылууда: <strong>Кыргызгидромет</strong> Нарын жана Ысык-Көл облустарында дагы жамгыр жаайт деп божомолдоп жатат, ал эми түштүктө ысык, кургак аба ырайы сакталууда. Толук маалымат үчүн <a href="/blog/august-9-regional-forecast-kyrgyzstan-temperature-spread.html">9-августка карата региондук божомолду</a> караңыз.</p>
        `
      },
      RU: {
        title: "Дождь и гроза вернулись в Нарын и на Иссык-Куль ночью",
        category: "Погода в горах",
        date: "9 августа 2026",
        author: "Pogoda Weather Team",
        excerpt: "Нарастающая облачность принесёт дожди и грозы в Нарынскую и Иссык-Кульскую области в ночь на 8 августа.",
        content: `
          <p>После сухого и жаркого начала августа облачность в горных регионах Кыргызстана постепенно нарастает с <strong>4 августа</strong>. Синоптики <strong>Кыргызгидромета</strong> ожидают, что эта перемена принесёт дожди и грозы в отдельные районы <strong>Нарынской</strong> и <strong>Иссык-Кульской</strong> областей в ночь на 8 августа, положив конец череде ясных, знойных дней в высокогорье.</p>
          <h3>После самого жаркого периода лета</h3>
          <p>Эта перемена следует за самым жарким периодом лета, когда с 31 июля по 3 августа дневная температура в южных низменных районах достигала <strong>+39°C</strong>. Жителям и путешественникам в горных районах стоит ожидать более прохладной и неустойчивой погоды в ночные часы, а после прохождения фронта небо вновь прояснится.</p>
          <p>Водителям, следующим через горные перевалы Нарынской и Иссык-Кульской областей ночью, стоит быть внимательными из-за сниженной видимости и мокрого дорожного покрытия до окончания непогоды.</p>
          <h3>Обновление, 9 августа</h3>
          <p>Неустойчивая погода сохраняется и сегодня: <strong>Кыргызгидромет</strong> прогнозирует новые дожди в Нарынской и Иссык-Кульской областях, тогда как на юге страны сохраняется жаркая и сухая погода. Подробности — в <a href="/blog/august-9-regional-forecast-kyrgyzstan-temperature-spread.html">полном прогнозе по регионам на 9 августа</a>.</p>
        `
      }
    }
  },
  {
    id: "post-aug-9-regional-forecast",
    slug: "august-9-regional-forecast-kyrgyzstan-temperature-spread",
    image: "/assets/images/hero_mountains.webp",
    translations: {
      EN: {
        title: "August 9 Regional Forecast: +27°C in Issyk-Kul to +39°C in the South",
        category: "Regional Forecast",
        date: "August 9, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Kyrgyzstan sees another hot day: up to +39°C in Osh, Jalal-Abad and Batken versus +27°C in Issyk-Kul, plus rain forecast for Naryn.",
        content: `
          <p>The heat has climbed another notch across Kyrgyzstan's south today, with <strong>Osh, Jalal-Abad, and Batken</strong> regions all forecast to hit <strong>+39°C</strong> — the hottest readings of the week. <strong>Chuy</strong> region and the capital <strong>Bishkek</strong> follow close behind at up to +37°C, while <strong>Talas</strong> region reaches +36°C.</p>
          <h3>Highlands Stay Noticeably Cooler</h3>
          <p><strong>Issyk-Kul</strong> region remains the coolest corner of the country at +11°C to +27°C, and <strong>Naryn</strong> region ranges from a chilly +8°C overnight to +30°C by afternoon — a 12-degree spread between the highlands and the southern lowlands.</p>
          <h3>Rain Expected in Naryn and Issyk-Kul</h3>
          <p>Unlike the dry south, Kyrgyzhydromet forecasts rain today across <strong>Naryn</strong> and <strong>Issyk-Kul</strong> regions, with cloud cover and a chance of brief afternoon showers in the foothill and mountain zones of Chuy and Talas as well.</p>
          <h3>August 9 Regional Temperatures</h3>
          <ul>
            <li><strong>Osh, Jalal-Abad, Batken:</strong> Night +18°C, Day +39°C.</li>
            <li><strong>Chuy Region:</strong> Night +16°C, Day +37°C.</li>
            <li><strong>Bishkek:</strong> Night +19°C, Day +37°C.</li>
            <li><strong>Talas Region:</strong> Night +13°C, Day +36°C.</li>
            <li><strong>Naryn Region:</strong> Night +8°C, Day +30°C, rain expected.</li>
            <li><strong>Issyk-Kul Region:</strong> Night +11°C, Day +27°C, rain expected.</li>
          </ul>
        `
      },
      KG: {
        title: "9-августка карата божомол: Ысык-Көлдө +27°C, түштүктө +39°C",
        category: "Региондук божомол",
        date: "9-август, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Кыргызстанда дагы бир ысык күн: Ош, Жалал-Абад, Баткенде +39°Cге чейин, Ысык-Көлдө +27°C, Нарында жамгыр күтүлүүдө.",
        content: `
          <p>Бүгүн Кыргызстандын түштүгүндө ысык дагы бир баскычка көтөрүлдү: <strong>Ош, Жалал-Абад жана Баткен</strong> облустарында температура <strong>+39°C</strong>ге жетет деп божомолдонууда — бул жумадагы эң жогорку көрсөткүч. <strong>Чүй</strong> облусу жана борбор калаа <strong>Бишкек</strong> +37°Cге чейин жакын турат, ал эми <strong>Талас</strong> облусунда +36°C болот.</p>
          <h3>Тоолуу аймактар алда канча салкын</h3>
          <p><strong>Ысык-Көл</strong> облусу өлкөнүн эң салкын бурчу бойдон калууда: +11...+27°C. <strong>Нарын</strong> облусунда түнкүсүн салкын +8°C, ал эми түштөн кийин +30°Cге чейин жетет — бул тоолуу аймактар менен түштүк тектир жерлердин ортосундагы 12 градус айырма.</p>
          <h3>Нарын жана Ысык-Көлдө жамгыр күтүлүүдө</h3>
          <p>Кургак түштүктөн айырмаланып, Кыргызгидромет бүгүн <strong>Нарын</strong> жана <strong>Ысык-Көл</strong> облустарында жамгыр жаайт деп божомолдоп жатат, ошондой эле Чүй жана Таластын тоо этегиндеги жана тоолуу аймактарында түштөн кийин кыска мөөнөттүү жамгыр жааш ыктымал.</p>
          <h3>9-августка карата региондук температура</h3>
          <ul>
            <li><strong>Ош, Жалал-Абад, Баткен:</strong> түнкүсүн +18°C, күндүз +39°C.</li>
            <li><strong>Чүй облусу:</strong> түнкүсүн +16°C, күндүз +37°C.</li>
            <li><strong>Бишкек:</strong> түнкүсүн +19°C, күндүз +37°C.</li>
            <li><strong>Талас облусу:</strong> түнкүсүн +13°C, күндүз +36°C.</li>
            <li><strong>Нарын облусу:</strong> түнкүсүн +8°C, күндүз +30°C, жамгыр күтүлүүдө.</li>
            <li><strong>Ысык-Көл облусу:</strong> түнкүсүн +11°C, күндүз +27°C, жамгыр күтүлүүдө.</li>
          </ul>
        `
      },
      RU: {
        title: "Прогноз на 9 августа: +27° на Иссык-Куле, +39° на юге",
        category: "Региональный прогноз",
        date: "9 августа 2026",
        author: "Pogoda Weather Team",
        excerpt: "В Кыргызстане ещё один жаркий день: до +39°C в Оше, Джалал-Абаде и Баткене против +27°C на Иссык-Куле, в Нарыне ожидаются дожди.",
        content: `
          <p>Жара на юге Кыргызстана сегодня поднялась ещё на ступень: в <strong>Ошской, Джалал-Абадской и Баткенской</strong> областях ожидается <strong>+39°C</strong> — самые высокие показатели за неделю. <strong>Чуйская</strong> область и столица <strong>Бишкек</strong> следуют почти вплотную, до +37°C, в <strong>Таласской</strong> области — до +36°C.</p>
          <h3>В горах заметно прохладнее</h3>
          <p><strong>Иссык-Кульская</strong> область остаётся самым прохладным уголком страны: +11...+27°C. В <strong>Нарынской</strong> области ночью прохладно — +8°C, а днём температура поднимается до +30°C — разница с южными низменными районами достигает 12 градусов.</p>
          <h3>В Нарыне и на Иссык-Куле ожидаются дожди</h3>
          <p>В отличие от сухого юга, Кыргызгидромет прогнозирует сегодня дожди в <strong>Нарынской</strong> и <strong>Иссык-Кульской</strong> областях, а также облачность и вероятность кратковременных ливней во второй половине дня в предгорных и горных зонах Чуйской и Таласской областей.</p>
          <h3>Температура воздуха по областям (9 августа)</h3>
          <ul>
            <li><strong>Ош, Джалал-Абад, Баткен:</strong> ночью +18°C, днём +39°C.</li>
            <li><strong>Чуйская область:</strong> ночью +16°C, днём +37°C.</li>
            <li><strong>Бишкек:</strong> ночью +19°C, днём +37°C.</li>
            <li><strong>Таласская область:</strong> ночью +13°C, днём +36°C.</li>
            <li><strong>Нарынская область:</strong> ночью +8°C, днём +30°C, ожидаются дожди.</li>
            <li><strong>Иссык-Кульская область:</strong> ночью +11°C, днём +27°C, ожидаются дожди.</li>
          </ul>
        `
      }
    }
  },
  {
    id: "post-heatwave-peak-39",
    slug: "kyrgyzstan-heatwave-peaks-39-degrees-relief-expected",
    image: "/assets/images/gallery_osh.webp",
    translations: {
      EN: {
        title: "Kyrgyzstan Heatwave Peaks at +39°C, Relief Expected by August 8",
        category: "Heatwave",
        date: "August 9, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Kyrgyzhydromet recorded highs up to +39°C in southern Kyrgyzstan in early August, with the heat expected to ease by August 8.",
        content: `
          <p>Kyrgyzstan's hottest stretch of the summer arrived between July 31 and August 3, with <strong>Kyrgyzhydromet</strong> recording daytime highs up to <strong>+39°C</strong> in the country's southern lowlands. Osh, Jalal-Abad, and Batken regions bore the brunt of the heat, while most other areas stayed within the seasonal norm for early August.</p>
          <h3>Cloud Cover Building Since August 4</h3>
          <p>Forecasters say cloud cover has been steadily increasing since August 4, and rain has already returned to parts of Naryn region. According to Kyrgyzhydromet's preliminary outlook, the heat is expected to ease by August 8 as the weather pattern shifts, bringing relief after days of extreme southern temperatures.</p>
          <p>Residents in Osh, Jalal-Abad, and Batken should continue taking precautions against heat stress until the pattern change arrives — staying hydrated, limiting midday sun exposure, and watering crops generously in the meantime.</p>
          <h3>Update, August 9</h3>
          <p>The relief was short-lived: daytime highs have climbed back to <strong>+39°C</strong> in Osh, Jalal-Abad, and Batken regions today, while the north and highlands stay much cooler, with rain forecast for Naryn and Issyk-Kul regions. See the <a href="/blog/august-9-regional-forecast-kyrgyzstan-temperature-spread.html">full August 9 regional forecast</a> for details.</p>
        `
      },
      KG: {
        title: "Кыргызстанда ысык +39°Сге жетти, 8-августка карай басаңдайт",
        category: "Ысык аба ырайы",
        date: "9-август, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Кыргызгидромет август айынын башында түштүк Кыргызстанда +39°Cге чейинки ысыкты каттады, ысык 8-августка карай басаңдайт.",
        content: `
          <p>Бул жайдын эң ысык мезгили 31-июль менен 3-август аралыгында болду: <strong>Кыргызгидромет</strong>тин маалыматы боюнча, өлкөнүн түштүк тектир аймактарында күндүзгү температура <strong>+39°C</strong>ге чейин жетти. Эң катуу ысык Ош, Жалал-Абад жана Баткен облустарында сезилди, ал эми башка көпчүлүк аймактарда температура август айынын башы үчүн калыпка туура келди.</p>
          <h3>4-августтан бери булуттуулук көбөйүүдө</h3>
          <p>Синоптиктердин айтымында, 4-августтан тартып булуттуулук акырындык менен көбөйүп жатат, Нарын облусунун айрым жерлеринде жамгыр кайра башталды. Кыргызгидметтин алдын ала божомолуна ылайык, аба ырайынын өзгөрүшүнө байланыштуу ысык 8-августка карай басаңдайт, бул түштүктөгү катуу ысыктан кийин жеңилдик алып келет.</p>
          <p>Ош, Жалал-Абад жана Баткен тургундарына аба ырайы өзгөргөнгө чейин ысыктан сак болуу сунушталат: суусундукту көп ичип, түштүн ысыгынан алыс болуп, эгин талааларды мол сугарыңыз.</p>
          <h3>Жаңылануу, 9-август</h3>
          <p>Жеңилдик узакка созулган жок: бүгүн Ош, Жалал-Абад жана Баткен облустарында күндүзгү температура кайра <strong>+39°C</strong>ге көтөрүлдү, ал эми түндүктө жана тоолуу аймактарда бир топ салкын, Нарын жана Ысык-Көл облустарында жамгыр күтүлүүдө. Толук маалымат үчүн <a href="/blog/august-9-regional-forecast-kyrgyzstan-temperature-spread.html">9-августка карата региондук божомолду</a> караңыз.</p>
        `
      },
      RU: {
        title: "Жара в Кыргызстане достигла +39°, спадёт к 8 августа",
        category: "Жара",
        date: "9 августа 2026",
        author: "Pogoda Weather Team",
        excerpt: "Кыргызгидромет зафиксировал жару до +39°C на юге Кыргызстана в начале августа — потепление спадёт к 8 августа.",
        content: `
          <p>Самая жаркая пора этого лета в Кыргызстане пришлась на период с 31 июля по 3 августа: по данным <strong>Кыргызгидромета</strong>, дневная температура в южных низменных районах республики поднималась до <strong>+39°C</strong>. Сильнее всего жара ощущалась в Ошской, Джалал-Абадской и Баткенской областях, тогда как в большинстве других регионов температура держалась в пределах климатической нормы для начала августа.</p>
          <h3>Облачность нарастает с 4 августа</h3>
          <p>По словам синоптиков, с 4 августа облачность постепенно нарастает, а в отдельных районах Нарынской области уже возобновились дожди. Согласно предварительному прогнозу Кыргызгидромета, к 8 августа жара пойдёт на спад — смена погодного фона принесёт долгожданное облегчение после нескольких дней аномальной жары на юге страны.</p>
          <p>Жителям Ошской, Джалал-Абадской и Баткенской областей рекомендуется соблюдать меры предосторожности до смены погоды: пить больше воды, избегать полуденного солнца и обильно поливать посевы.</p>
          <h3>Обновление, 9 августа</h3>
          <p>Облегчение оказалось недолгим: сегодня дневная температура в Ошской, Джалал-Абадской и Баткенской областях вновь поднялась до <strong>+39°C</strong>, тогда как на севере и в горах заметно прохладнее, а в Нарынской и Иссык-Кульской областях ожидаются дожди. Подробности — в <a href="/blog/august-9-regional-forecast-kyrgyzstan-temperature-spread.html">полном прогнозе по регионам на 9 августа</a>.</p>
        `
      }
    }
  },
  {
    id: "post-aug-6-bishkek-weather",
    slug: "kyrgyzstan-weather-august-6-forecast-bishkek-heatwave",
    image: "/assets/images/august_6_kyrgyzstan_weather.webp",
    translations: {
      EN: {
        title: "Bishkek Reaches +33°C with Rain Across Issyk-Kul: August 6 Forecast",
        category: "Weather Forecast",
        date: "August 5, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Bishkek stays clear and hot up to +33°C on August 6, while thunderstorms hit the Issyk-Kul region and mountain areas.",
        content: `
          <p>According to Kyrgyzgidromet, dry and warm conditions will prevail in <strong>Bishkek</strong> on August 6. Daytime temperatures are set to reach <strong>+31...+33°C</strong>, with nighttime lows around <strong>+16...+18°C</strong>. Westerly winds will blow at 4–9 m/s.</p>
          <h3>Regional Weather Breakdown</h3>
          <p>Overnight, rain and thunderstorms are expected across most of the Issyk-Kul region, with localized showers in Chuy, Osh, and Naryn. Talas, Jalal-Abad, and Batken regions will remain dry overnight.</p>
          <p>During the day, showers and thunderstorms will persist across Issyk-Kul and higher elevation mountain zones. The agricultural and valley areas of Osh, Batken, Jalal-Abad, and Talas will enjoy clear, dry summer skies.</p>
          <h3>August 6 Regional Temperatures</h3>
          <ul>
            <li><strong>Chuy Region:</strong> Night +13...+18°C, Day +29...+34°C.</li>
            <li><strong>Talas Region:</strong> Night +10...+15°C, Day +31...+36°C.</li>
            <li><strong>Osh & Jalal-Abad:</strong> Night +17...+22°C, Day +31...+36°C.</li>
            <li><strong>Batken Region:</strong> Night +17...+22°C, Day +31...+36°C.</li>
            <li><strong>Issyk-Kul (Cholpon-Ata):</strong> Periodic rain and thunderstorms. Night +12...+14°C, Day +20...+22°C. Lake water temperature: +21.9...+23.3°C.</li>
            <li><strong>Naryn Region:</strong> Night +8...+13°C, Day +20...+25°C.</li>
          </ul>
        `
      },
      KG: {
        title: "Бишкекте жаан-чачынсыз +33°С ысык: 6-августка карата аба ырайы",
        category: "Аба ырайы",
        date: "5-август, 2026",
        author: "Pogoda Weather Team",
        excerpt: "6-августта Бишкекте жаан-чачынсыз +33°Сге чейин ысыйт. Ысык-Көл облусунда жана тоолуу аймактарда жамгыр жаап, күн күркүрөйт.",
        content: `
          <p>Кыргызгидрометтин маалыматы боюнча, 6-августта борбор калаабыз <strong>Бишкекте</strong> жаан-чачын күтүлбөйт. Күндүз абанын температурасы <strong>+31...+33°C</strong>, ал эми түнкүсүн <strong>+16...+18°C</strong> болот. Батыштан соккон шамалдын ылдамдыгы 4-9 м/с.</p>
          <h3>Региондор боюнча сереп</h3>
          <p>Түнкүсүн Ысык-Көл облусунун көпчүлүк аймактарында, ошондой эле Чүй, Ош жана Нарын облустарынын айрым жерлеринде өткүн өтүп, күн күркүрөйт. Талас, Жалал-Абад жана Баткенде жаан-чачын күтүлбөйт.</p>
          <p>Күндүз Ысык-Көлдүн көпчүлүк жеринде, Ош, Жалал-Абад, Баткен жана Таластын тоолуу аймактарында жамгыр жаайт. Түштүк облустардын өрөөндөрүндө күн ачык болот.</p>
          <h3>Абанын температурасы (6-август):</h3>
          <ul>
            <li><strong>Чүй облусу:</strong> түнкүсүн +13...+18°C, күндүз +29...+34°C.</li>
            <li><strong>Талас облусу:</strong> түнкүсүн +10...+15°C, күндүз +31...+36°C.</li>
            <li><strong>Ош жана Жалал-Абад:</strong> түнкүсүн +17...+22°C, күндүз +31...+36°C.</li>
            <li><strong>Баткен облусу:</strong> түнкүсүн +17...+22°C, күндүз +31...+36°C.</li>
            <li><strong>Ысык-Көл (Чолпон-Ата):</strong> мезгил-мезгили менен жамгыр жаап, күн күркүрөйт. Түнкүсүн +12...+14°C, күндүз +20...+22°C. Суунун температурасы: +21.9...+23.3°C.</li>
            <li><strong>Нарын облусу:</strong> түнкүсүн +8...+13°C, күндүз +20...+25°C.</li>
          </ul>
        `
      },
      RU: {
        title: "В Бишкеке без осадков, днем жарко до +33° — прогноз погоды на 6 августа",
        category: "Погода",
        date: "5 августа 2026",
        author: "Pogoda Weather Team",
        excerpt: "В Бишкеке 6 августа без осадков и до +33°C. В Иссык-Кульской области и горных районах дожди с грозами.",
        content: `
          <p>По данным Кыргызгидромета, 6 августа в столице Кыргызстана — городе <strong>Бишкек</strong> — осадков не ожидается. Дневная температура воздуха поднимается до <strong>+31...+33°C</strong>, ночная минимальная температура составит <strong>+16...+18°C</strong>. Ветер западный, 4-9 м/с.</p>
          <h3>Обзор погоды по регионам Кыргызстана</h3>
          <p>В ночное время на большей части территории Иссык-Кульской области, а также местами в Чуйской, Ошской и Нарынской областях пройдут дожди с грозами. В Таласской, Жалал-Абадской и Баткенской областях осадков не ожидается.</p>
          <p>Днем дожди и грозы сохранятся на большей части Иссык-Кульской области, а также в горных и предгорных районах. В долинах южных областей (Ош, Баткен, Жалал-Абад) и в зоне земледелия Таласской области осадков не прогнозируется.</p>
          <h3>Температура воздуха по областям (6 августа):</h3>
          <ul>
            <li><strong>Чуйская область:</strong> ночью +13...+18°C, днем +29...+34°C.</li>
            <li><strong>Таласская область:</strong> ночью +10...+15°C, днем +31...+36°C.</li>
            <li><strong>Ошская и Жалал-Абадская области:</strong> ночью +17...+22°C, днем +31...+36°C.</li>
            <li><strong>Баткенская область:</strong> ночью +17...+22°C, днем +31...+36°C.</li>
            <li><strong>Иссык-Кульская область (Чолпон-Ата):</strong> в Чолпон-Ате временами дождь, гроза. Ночью +12...+14°C, днем +20...+22°C. Температура воды у северного побережья озера Иссык-Куль составляет +21.9...+23.3°C.</li>
            <li><strong>Нарынская область:</strong> ночью +8...+13°C, днем +20...+25°C.</li>
          </ul>
        `
      }
    }
  },
  {
    id: "post-aug-3-10",
    slug: "august-3-10-kyrgyzstan-weather-forecast-rain-to-extreme-heat",
    image: "/assets/images/august_weather_split.jpg",
    translations: {
      EN: {
        title: "From Rain to Extreme Heat: Kyrgyzstan Weather Forecast for August 3-10",
        category: "Weather Forecast",
        date: "August 4, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Kyrgyzstan will experience a shift from rainy and unsettled weather to intense, scorching heat up to +38°C by August 10 as an anticyclone strengthens.",
        content: `
          <p>From August 3 to 5, a high-pressure area is shifting northward, allowing a more humid and unstable air mass to enter Kyrgyzstan. This atmospheric shift will lead to increased cloudiness and precipitation across the republic. In the Issyk-Kul region, the combination of mountainous terrain and the large body of water will enhance convection, resulting in thunderstorms. In Cholpon-Ata, the probability of precipitation rises to 93–97% during these days, with thunderstorms forecast for August 4. Light precipitation, primarily drizzle, is also possible in Bishkek, Naryn, Osh, and Manas. Concurrently, winds will strengthen, with gusts reaching up to 13 m/s in Talas.</p>
          <h3>Return of the Heatwave</h3>
          <p>After August 5, the anticyclone is expected to intensify and re-establish its position over the region. The humid air mass will be displaced, clouds will dissipate, and the weather will become dry and clear once again. As the air within the high-pressure zone continues to warm over several consecutive days, the heat will intensify, peaking by August 9–10. Daytime temperatures are forecast to reach +37...+38°C in Bishkek and Manas, and +32...+36°C in Osh, Batken, and Talas. Nighttime temperatures will also remain high, staying above +20...+22°C in Bishkek and Manas.</p>
          <p>The coolest weather during this period will be in the mountainous regions. In Naryn, daytime temperatures will range between +14...+31°C, accompanied by periodic drizzle.</p>
          <h3>Detailed Forecast Highlights</h3>
          <ul>
            <li><strong>Bishkek:</strong> Transitioning from light drizzle and +27...+30°C on August 4 to clear, scorching days reaching +38°C by August 10.</li>
            <li><strong>Issyk-Kul (Cholpon-Ata):</strong> High probability of rain and thunderstorms early in the week, cooling down to +19...+24°C, before stabilizing to clear skies and +23°C towards the weekend.</li>
            <li><strong>Osh & Batken:</strong> Heavy rain (showers) possible on August 4, quickly clearing up to deliver intense +36°C heat by August 9-10.</li>
            <li><strong>Naryn:</strong> Consistently cooler alpine climate. Frequent drizzle expected with daytime highs hovering comfortably between +20°C and +27°C.</li>
          </ul>
        `
      },
      KG: {
        title: "Жамгырдан катуу ысыкка чейин: Кыргызстанда 3-10-августка карата аба ырайы",
        category: "Аба ырайы",
        date: "4-август, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Кыргызстанда 10-августка чейин антициклондун күчөшү менен жаан-чачындуу аба ырайынан +38°Cге чейин жеткен катуу ысыкка өтүшү күтүлүүдө.",
        content: `
          <p>3-августтан 5-августка чейин жогорку басымдуу аймак түндүккө жылып, Кыргызстанга нымдуу жана туруксуз аба массасы кирет. Бул өзгөрүү булуттуулуктун жана жаан-чачындын көбөйүшүнө алып келет. Ысык-Көл облусунда тоолуу рельеф жана чоң суу сактагыч конвекцияны күчөтүп, күн күркүрөшү мүмкүн. Чолпон-Атада бул күндөрү жаан-чачындын ыктымалдыгы 93–97% га чейин жогорулайт, ал эми 4-августта күн күркүрөшү күтүлөт. Бишкек, Нарын, Ош жана Манаста бир аз жаан, негизинен майда жамгыр жаашы мүмкүн. Ошол эле учурда шамал күчөп, Таласта анын ылдамдыгы 13 м/с жетиши ыктымал.</p>
          <h3>Ысыктын кайтып келиши</h3>
          <p>5-августтан кийин антициклондун күчөшү жана аймакта өз ордун калыбына келтириши күтүлүүдө. Нымдуу аба массасы сүрүлүп чыгып, булуттар тарап, аба ырайы кайрадан кургак жана ачык болот. Жогорку басымдуу аймактагы аба бир нече күн катары менен жылып тургандыктан, ысык күчөп, 9-10-августта эң жогорку чекке жетет. Бишкекте жана Манаста күндүз +37...+38°C, Ош, Баткен жана Таласта +32...+36°C чейин ысык болушу күтүлөт. Түнкү температура да жогору бойдон калат — Бишкек менен Манаста +20...+22°Cден төмөн түшпөйт.</p>
          <p>Бул мезгилдеги эң салкын аба ырайы тоолуу аймактарда сакталат. Нарында күндүзгү температура +14...+31°C чегинде болуп, мезгил-мезгили менен майда жамгыр жаап турат.</p>
          <h3>Кыскача маалымат</h3>
          <ul>
            <li><strong>Бишкек:</strong> 4-августта майда жамгыр жаап, +27...+30°C жылуу болот, ал эми 10-августка карата ачык, катуу ысык күтүлүп, температура +38°Cге чейин жетет.</li>
            <li><strong>Ысык-Көл (Чолпон-Ата):</strong> Аптанын башында жаан-чачын жана күн күркүрөө ыктымалдыгы жогору болуп, +19...+24°Cге чейин салкындайт. Дем алыш күндөрү аба ырайы турукташып, ачык асман жана +23°C күтүлөт.</li>
            <li><strong>Ош жана Баткен:</strong> 4-августта нөшөрлөгөн жамгыр жаашы мүмкүн, андан кийин аба ырайы тез ачылып, 9-10-августта +36°Cге чейин ысыйт.</li>
            <li><strong>Нарын:</strong> Тоолуу климат сакталат. Күндүз температура +20°Cден +27°Cге чейин жылып, көп учурда майда жамгыр жаашы күтүлөт.</li>
          </ul>
        `
      },
      RU: {
        title: "От дождей к аномальной жаре: Прогноз погоды в Кыргызстане на 3-10 августа",
        category: "Прогноз погоды",
        date: "4 августа, 2026",
        author: "Pogoda Weather Team",
        excerpt: "Кыргызстан ожидает переход от дождливой и неустойчивой погоды к сильной жаре до +38°C к 10 августа по мере усиления антициклона.",
        content: `
          <p>С 3 по 5 августа область высокого давления смещается к северу, и в республику заходит более влажная и неустойчивая воздушная масса. Это приведет к росту облачности и осадкам, а в районе Иссык-Куля — из-за влияния горного рельефа и большого водоема, усиливающих конвекцию, возникают грозы. В Чолпон-Ате вероятность осадков в эти дни поднимается до 93–97%, а 4 августа прогнозируется гроза. Небольшие осадки возможны также в Бишкеке, Нарыне, Оше и Манасе, хотя по большей части это морось. Одновременно усиливается ветер — в Таласе порывы могут достигать 13 м/с.</p>
          <h3>Возвращение жары</h3>
          <p>После 5 августа ожидается усиление антициклона и восстановления его положения над регионом. Влажная воздушная масса вытеснится, облачность рассеется, погода снова станет сухой и ясной. Поскольку воздух в зоне высокого давления продолжит прогреваться несколько дней подряд, жара усилится и достигнет пика к 9-10 августа: в Бишкеке и Манасе днем прогнозируется до +37...+38°C, в Оше, Баткене и Таласе — до +32...+36°C. Ночные температуры также остаются высокими — в Бишкеке и Манасе они не опускаются ниже +20...+22°C.</p>
          <p>Наиболее прохладная погода в этот период сохранится в горных районах — в Нарыне дневные температуры будут держаться в пределах +14...+31°C с периодическими моросящими дождями.</p>
          <h3>Детали по городам</h3>
          <ul>
            <li><strong>Бишкек:</strong> 4 августа ожидается морось и +27...+30°C, а к 10 августа установится ясная и жаркая погода с температурой до +38°C.</li>
            <li><strong>Иссык-Куль (Чолпон-Ата):</strong> В начале недели высокая вероятность дождей и гроз с похолоданием до +19...+24°C, затем погода стабилизируется, ожидается ясное небо и +23°C к выходным.</li>
            <li><strong>Ош и Баткен:</strong> 4 августа возможны ливни, которые быстро сменятся ясной погодой. К 9-10 августа температура поднимется до +36°C.</li>
            <li><strong>Нарын:</strong> Сохранится прохладный горный климат. Ожидается частая морось, дневная температура будет комфортной: от +20°C до +27°C.</li>
          </ul>
        `
      }
    }
  },
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
          <img src="${post.image}" alt="${data.title}" class="news-card-img" loading="lazy">
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
