/* ═══════════════════════════════════════════════════════════
   MADAR DIGITAL MENU — script.js  (FIXED VERSION)
   ─────────────────────────────────────────────────────────
   BUGS FIXED:
   ① NoModificationAllowedError (×2149)
     – outerHTML cannot be set on an element that has no parent.
     – Root cause 1: `appetizers` category was broken — the items
       array was nested INSIDE another object that itself had an
       items array (data structure error). findItem() returned
       category-meta objects that have no real DOM card, so
       updateAllCardControls tried to replace outerHTML on
       detached nodes.
     – Root cause 2: updateAllCardControls() used outerHTML
       replacement without a parentNode guard.
     – Root cause 3: The DOTD img used a JS comma-expression
       `('/path', 600, 400)` which evaluates to just `400`.
   ② 404 Not Found
     – soft-drink.jpg and detox.jpg were .jpg not .webp —
       replaced with safe Unsplash fallbacks.
   ③ Deprecated meta tag
     – Fixed in index.html (mobile-web-app-capable).
   All other logic unchanged.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. TRANSLATIONS
═══════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  ar: {
    hero_eyebrow: 'سفارة المطبخ العربي في موسكو',
    hero_title: 'تجربة طعام لا تُنسى',
    hero_sub: 'تصفّح قائمتنا، اختر ما يعجبك',
    halal: 'حلال 100%',
    five_star: '5 نجوم',
    fresh: 'طازج يومياً',
    view_gallery: 'معرض الصور',
    gallery_title: 'معرض الصور',
    chefs_special: 'اختيارات الشيف',
    offers_title: 'عروض وكومبو',
    cart_title: 'طلبي',
    cart_empty: 'القائمة فارغة — أضف أطباقك!',
    total: 'الإجمالي',
    show_order: 'عرض الطلب للنادل',
    order_ready: 'طلبك جاهز!',
    order_hint: 'أرِ هذه الشاشة للنادل 🙏',
    clear_order: 'مسح الطلب',
    add_to_cart: 'إضافة',
    recommended: 'موصى به',
    chefs_pick: 'اختيار الشيف',
    dish_of_day: 'طبق اليوم',
    dotd_label: '✦ طبق اليوم',
    offer_label: 'عرض',
    page_title: 'مدار — قائمة الطعام',
    splash_sub: 'سفارة المطبخ العربي',
  },
  en: {
    hero_eyebrow: 'Embassy of Arab Cuisine in Moscow',
    hero_title: 'An Unforgettable Dining Experience',
    hero_sub: 'Browse our menu and choose your favourites',
    halal: 'Halal 100%',
    five_star: '5-Star',
    fresh: 'Daily Fresh',
    view_gallery: 'Photo Gallery',
    gallery_title: 'Photo Gallery',
    chefs_special: "Chef's Picks",
    offers_title: 'Offers & Combos',
    cart_title: 'My Order',
    cart_empty: 'No items yet — add your favourites!',
    total: 'Total',
    show_order: 'Show Order to Waiter',
    order_ready: 'Your Order is Ready!',
    order_hint: 'Show this screen to your waiter 🙏',
    clear_order: 'Clear Order',
    add_to_cart: 'Add',
    recommended: 'Recommended',
    chefs_pick: "Chef's Pick",
    dish_of_day: 'Dish of the Day',
    dotd_label: '✦ Dish of the Day',
    offer_label: 'Offer',
    page_title: 'Madar — Digital Menu',
    splash_sub: 'Embassy of Arab Cuisine',
  },
  ru: {
    hero_eyebrow: 'Посольство арабской кухни в Москве',
    hero_title: 'Незабываемый гастрономический опыт',
    hero_sub: 'Листайте меню и выбирайте любимые блюда',
    halal: 'Халяль 100%',
    five_star: '5 звёзд',
    fresh: 'Свежее каждый день',
    view_gallery: 'Галерея',
    gallery_title: 'Галерея блюд',
    chefs_special: 'Выбор шеф-повара',
    offers_title: 'Акции и комбо',
    cart_title: 'Мой заказ',
    cart_empty: 'Заказ пустой — добавьте блюда!',
    total: 'Итого',
    show_order: 'Показать заказ официанту',
    order_ready: 'Ваш заказ готов!',
    order_hint: 'Покажите этот экран официанту 🙏',
    clear_order: 'Очистить заказ',
    add_to_cart: 'Добавить',
    recommended: 'Рекомендуем',
    chefs_pick: 'Выбор шефа',
    dish_of_day: 'Блюдо дня',
    dotd_label: '✦ Блюдо дня',
    offer_label: 'Акция',
    page_title: 'Мадар — Цифровое меню',
    splash_sub: 'Посольство арабской кухни',
  },
};

/* ═══════════════════════════════════════════════════════════
   2. MENU DATA
   ─────────────────────────────────────────────────────────
   BUG FIX ①: The `appetizers` category in the original code
   had a BROKEN structure — the items array contained another
   full category object (with its own id/icon/name/items)
   instead of flat item objects. This caused findItem() to
   return category-meta objects that were never mounted into
   the DOM, so setting outerHTML on their (non-existent)
   parent node threw 2149 errors.
   FIXED: appetizers.items is now a plain flat array of items.
═══════════════════════════════════════════════════════════ */

const IMG = (id, w = 400, h = 300) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const MENU_DATA = {
  categories: [

    /* ── SALADS ────────────────────────────────────────── */
    {
      id: 'salads',
      icon: '🥗',
      name: { ar: 'السلطات', en: 'Salads', ru: 'Салаты' },
      items: [
        // 🔹 العناصر الأصلية من البيانات الأولى (21 عنصر)
    {
      id: 'sal2',
      emoji: '🥗',
      name: {
        ar: 'سلطة يونانية طازجة',
        en: 'Greek Salad',
        ru: 'Свежий по-гречески'
      },
      desc: {
        ar: 'خضار طازجة مع جبنة فيتا وزيت زيتون',
        en: 'Fresh vegetables with feta cheese',
        ru: 'Свежие овощи с сыром фета'
      },
      options: [{ label: '250 g', price: 850 }],
      img: '/photo-qr-menu/salads/greek.webp'
    },

    {
      id: 'sal3',
      emoji: '🥗',
      name: {
        ar: 'سلطة الفجل مع البيض',
        en: 'Radish Salad with Egg',
        ru: 'Редис с яйцом'
      },
      desc: {
        ar: 'فجل طازج مع بيض وصلصة كريمية',
        en: 'Radish with egg and creamy dressing',
        ru: 'Редис, яйцо, сливочный соус'
      },
      options: [{ label: '300 g', price: 620 }],
      img: '/photo-qr-menu/salads/radish.webp'
    },

    {
      id: 'sal4',
      emoji: '🥗',
      name: {
        ar: 'سلطة الكمثرى مع الجبن الأزرق',
        en: 'Pear & Blue Cheese Salad',
        ru: 'Салат с грушей и сыром дорблю'
      },
      desc: {
        ar: 'كمثرى مع جبن دوربلو وصلصة خاصة',
        en: 'Salad with pear and dorblu cheese',
        ru: 'Салат с грушей и сыром дорблю'
      },
      options: [{ label: '350 g', price: 1200 }],
      img: '/photo-qr-menu/salads/pear.webp'
    },

    {
      id: 'sal5',
      emoji: '🥗',
      name: {
        ar: 'سلطة تشيم-تشيم',
        en: 'Chim-Chim Salad',
        ru: 'Салат Чим-Чим'
      },
      desc: {
        ar: 'خضار مخللة متبلة بأسلوب آسيوي',
        en: 'Marinated vegetables Asian style',
        ru: 'Маринованные овощи'
      },
      options: [{ label: '300 g', price: 670 }],
      img: '/photo-qr-menu/salads/chim.webp'
    },

    {
      id: 'sal6',
      emoji: '🥗',
      name: {
        ar: 'أشيتشوك',
        en: 'Achichuk',
        ru: 'Ачичук'
      },
      desc: {
        ar: 'طماطم طازجة مع بصل وفلفل حار',
        en: 'Tomatoes with onion and chili pepper',
        ru: 'Помидоры с луком и перцем'
      },
      options: [{ label: '200 g', price: 650 }],
      img: '/photo-qr-menu/salads/achichuk.webp'
    },

    {
      id: 'sal7',
      emoji: '🥗',
      name: {
        ar: 'سلطة خضار طازجة',
        en: 'Fresh Vegetable Salad',
        ru: 'Салат из свежих овощей'
      },
      desc: {
        ar: 'خضار موسمية طازجة مع اختيار من الصلصات',
        en: 'Fresh vegetables with dressing of choice',
        ru: 'Свежие овощи'
      },
      options: [{ label: '170 g', price: 620 }],
      img: '/photo-qr-menu/salads/fresh.webp'
    },

    {
      id: 'sal8',
      emoji: '🥗',
      name: {
        ar: 'سلطة الشمندر مع جبنة فيتا',
        en: 'Beetroot & Feta Salad',
        ru: 'Свекла с сыром фета'
      },
      desc: {
        ar: 'شمندر مسلوق مع جبنة فيتا وصلصة خفيفة',
        en: 'Boiled beetroot with feta cheese',
        ru: 'Свекла с сыром фета'
      },
      options: [{ label: '250 g', price: 685 }],
      img: '/photo-qr-menu/salads/beet.webp'
    },

    {
      id: 'sal9',
      emoji: '🥗',
      name: {
        ar: 'سلطة لسان البقر مع الخضار',
        en: 'Beef Tongue Salad',
        ru: 'Салат с языком'
      },
      desc: {
        ar: 'لسان بقر مع خضار طازجة وصلصة خاصة',
        en: 'Beef tongue with vegetables',
        ru: 'Язык с овощами'
      },
      options: [{ label: '250 g', price: 960 }],
      img: '/photo-qr-menu/salads/tongue.webp'
    },

    {
      id: 'sal10',
      emoji: '🥗',
      name: {
        ar: 'سلطة فونتشوز',
        en: 'Funchoza Salad',
        ru: 'Салат из фунчозы'
      },
      desc: {
        ar: 'نودلز زجاجية مع خضار وصلصة آسيوية',
        en: 'Glass noodles with vegetables',
        ru: 'Фунчоза с овощами'
      },
      options: [{ label: '230 g', price: 750 }],
      img: '/photo-qr-menu/salads/funchoza.webp'
    },

    {
      id: 'sal11',
      emoji: '🥗',
      name: {
        ar: 'سلطة شرقية مع لحم البقر',
        en: 'Oriental Beef Salad',
        ru: 'Восточный салат с говядиной'
      },
      desc: {
        ar: 'لحم بقر مع خضار وصلصة شرقية',
        en: 'Beef with vegetables and sauce',
        ru: 'Говядина с овощами'
      },
      options: [{ label: '220 g', price: 920 }],
      img: '/photo-qr-menu/salads/oriental.webp'
    },

    {
      id: 'sal12',
      emoji: '🥗',
      name: {
        ar: 'سلطة دجاج مع البرتقال',
        en: 'Chicken Orange Salad',
        ru: 'Салат с курицей и апельсином'
      },
      desc: {
        ar: 'دجاج مع شرائح برتقال وخضار طازجة',
        en: 'Chicken with orange and greens',
        ru: 'Курица с апельсином'
      },
      options: [{ label: '300 g', price: 895 }],
      img: '/photo-qr-menu/salads/chicken-orange.webp'
    },

    {
      id: 'sal13',
      emoji: '🥗',
      name: {
        ar: 'رنجة تحت الفرو',
        en: 'Herring Under Fur',
        ru: 'Селёдка под шубой'
      },
      desc: {
        ar: 'رنجة مع بطاطا وشمندر ومايونيز',
        en: 'Herring with potato, beetroot and mayo',
        ru: 'Сельдь, картофель, свекла'
      },
      options: [{ label: '400 g', price: 680 }],
      img: '/photo-qr-menu/salads/herring.webp'
    },

    {
      id: 'sal14',
      emoji: '🥗',
      name: {
        ar: 'سلطة أوليفيه',
        en: 'Olivier Salad',
        ru: 'Оливье'
      },
      desc: {
        ar: 'بطاطا وجزر وبيض مع مايونيز',
        en: 'Potato salad with mayonnaise',
        ru: 'Картофельный салат'
      },
      options: [{ label: '250 g', price: 620 }],
      img: '/photo-qr-menu/salads/olivier.webp'
    },

    {
      id: 'sal15',
      emoji: '🥗',
      name: {
        ar: 'سلطة فتوش عربية',
        en: 'Fattoush',
        ru: 'Арабский салат Фаттуш'
      },
      desc: {
        ar: 'خضار طازجة مع خبز مقرمش ودبس الرمان',
        en: 'Vegetables with crispy bread',
        ru: 'Овощи с хлебом'
      },
      options: [{ label: '380 g', price: 890 }],
      img: '/photo-qr-menu/salads/fattoush.webp'
    },

    {
      id: 'sal16',
      emoji: '🥗',
      name: {
        ar: 'سلطة المطعم الخاصة',
        en: 'Signature Salad',
        ru: 'Фирменный салат'
      },
      desc: {
        ar: 'خضار طازجة مع جبنة وصلصة مميزة',
        en: 'Signature mix with cheese',
        ru: 'Фирменный салат'
      },
      options: [{ label: '300 g', price: 950 }],
      img: '/photo-qr-menu/salads/signature.webp'
    },

    {
      id: 'sal17',
      emoji: '🥗',
      name: {
        ar: 'سلطة دجاج مع الفطر',
        en: 'Chicken & Mushroom Salad',
        ru: 'Салат с курицей и грибами'
      },
      desc: {
        ar: 'دجاج مع فطر وخضار وصلصة كريمية',
        en: 'Chicken with mushrooms',
        ru: 'Курица с грибами'
      },
      options: [{ label: '300 g', price: 820 }],
      img: '/photo-qr-menu/salads/chicken-mushroom.webp'
    },

    {
      id: 'sal18',
      emoji: '🥗',
      name: {
        ar: 'سلطة سيزر بالدجاج',
        en: 'Caesar with Chicken',
        ru: 'Цезарь с курицей'
      },
      desc: {
        ar: 'خس، دجاج، جبنة بارميزان، صوص سيزر',
        en: 'Chicken Caesar salad',
        ru: 'Салат Цезарь'
      },
      options: [{ label: '300 g', price: 860 }],
      img: '/photo-qr-menu/salads/caesar.webp'
    },

    {
      id: 'sal19',
      emoji: '🥗',
      name: {
        ar: 'سلطة سيزر بالروبيان',
        en: 'Caesar with Shrimp',
        ru: 'Цезарь с креветками'
      },
      desc: {
        ar: 'سيزر مع روبيان وجبنة بارميزان',
        en: 'Caesar with shrimp',
        ru: 'Цезарь с креветками'
      },
      options: [{ label: '300 g', price: 1020 }],
      img: '/photo-qr-menu/salads/caesar-shrimp.webp'
    },

    {
      id: 'sal20',
      emoji: '🥗',
      name: {
        ar: 'سلطة لحم مع خضار',
        en: 'Beef Salad',
        ru: 'Салат с говядиной'
      },
      desc: {
        ar: 'لحم بقر مع خضار طازجة وصلصة خاصة',
        en: 'Beef with vegetables',
        ru: 'Говядина с овощами'
      },
      options: [{ label: '280 g', price: 940 }],
      img: '/photo-qr-menu/salads/beef.webp'
    },

    {
      id: 'sal21',
      emoji: '🥗',
      name: {
        ar: 'سلطة كابريس',
        en: 'Caprice Salad',
        ru: 'Каприз'
      },
      desc: {
        ar: 'بطاطا مع صوص خاص ونكهة مميزة',
        en: 'Potato salad',
        ru: 'Картофельный салат'
      },
      options: [{ label: '300 g', price: 875 }],
      img: '/photo-qr-menu/salads/caprice.webp'
    },

        {
          id: 's1',
          emoji: '🥗',
          name: { ar: 'تبولة', en: 'Tabbouleh', ru: 'Табуле' },
          desc: { ar: 'بقدونس طازج مع برغل وطماطم وزيت زيتون', en: 'Fresh parsley, bulgur, tomatoes & olive oil', ru: 'Свежая петрушка, булгур, помидоры и оливковое масло' },
          options: [{ label: '250 g', price: 610 }],
          img: '/photo-qr-menu/salads/tabola.webp'
        }

      ]
    },



    /* ── soob ────────────────────────────────────────── */
    {
      id: 'soob',
      icon: '🥗',
      name: { ar: 'الشوربات', en: 'Soups', ru: 'Супы' },
      items: [

        {
          id: 's1',
          emoji: '🍜',
          name: {
            ar: 'شوربة تشوتشبارا',
            en: 'Chuchvara',
            ru: 'Чучвара'
          },
          desc: {
            ar: 'شوربة مع دامبلينغ آسيوية صغيرة، تقدم مع مرق اللحم والبصل الأخضر',
            en: 'Soup with little Asian dumplings, served on broth and green onions',
            ru: 'Суп с маленькими азиатскими пельменями, подаётся с бульоном и зелёным луком'
          },
          weight: 320,
          price: 780,
          img: '/photo-qr-menu/soups/chuchvara.webp'
        },
        {
          id: 's2',
          emoji: '🍲',
          name: {
            ar: 'شوربة شوربا',
            en: 'Shurpa',
            ru: 'Шурпа'
          },
          desc: {
            ar: 'شوربة لحم غنية مع بطاطا وجزر',
            en: 'Soup of nomadic peoples. Amber rich broth with meat, potatoes and carrots',
            ru: 'Суп народов кочевников. Насыщенный бульон с мясом, картофелем и морковью'
          },
          weight: 340,
          price: 850,
          img: '/photo-qr-menu/soups/shurpa.webp'
        },
        {
          id: 's3',
          emoji: '🥣',
          name: {
            ar: 'لاغمان كازاخي',
            en: 'Kazakh Lagman',
            ru: 'Лагман по-казахски'
          },
          desc: {
            ar: 'مرق غني مع لحم وبصل وجزر ونودلز',
            en: 'Rich meat broth with onion, beef and thinly rolled handmade noodles',
            ru: 'Насыщенный бульон с мясом, луком, морковью и лапшой'
          },
          weight: 320,
          price: 780,
          img: '/photo-qr-menu/soups/lagman.webp'
        },
        {
          id: 's4',
          emoji: '🐟',
          name: {
            ar: 'شوربة أوخا',
            en: 'Fish soup',
            ru: 'Уха наваристая'
          },
          desc: {
            ar: 'شوربة سمك غنية حسب وصفة خاصة',
            en: 'Rich soup according to a special recipe',
            ru: 'По специальному рецепту с рыбным бульоном'
          },
          weight: 320,
          price: 780,
          img: '/photo-qr-menu/soups/ukha.webp'
        },
        {
          id: 's5',
          emoji: '🍖',
          name: {
            ar: 'شوربة كرات اللحم',
            en: 'Soup with meatballs',
            ru: 'Суп с фрикадельками'
          },
          desc: {
            ar: 'شوربة منزلية مع كرات لحم وجزر',
            en: 'Homemade soup with meat broth with meatballs, potatoes and carrots',
            ru: 'Домашний суп с мясным бульоном, фрикадельками и овощами'
          },
          weight: 320,
          price: 785,
          img: '/photo-qr-menu/soups/meatballs.webp'
        },
        {
          id: 's6',
          emoji: '🥕',
          name: {
            ar: 'مينستروني',
            en: 'Minestrone',
            ru: 'Суп овощной Минестроне'
          },
          desc: {
            ar: 'شوربة خضار إيطالية',
            en: 'Vegetable soup Minestrone',
            ru: 'Овощной суп Минестроне'
          },
          weight: 320,
          price: 620,
          img: '/photo-qr-menu/soups/minestrone.webp'
        },
        {
          id: 's7',
          emoji: '🌶️',
          name: {
            ar: 'شوربة العدس التركية',
            en: 'Turkish lentil soup',
            ru: 'Турецкий чечевичный суп'
          },
          desc: {
            ar: 'شوربة عدس كريمية',
            en: 'Cream of lentil soup',
            ru: 'Крем-суп из чечевицы'
          },
          weight: 320,
          price: 650,
          img: '/photo-qr-menu/soups/lentil.webp'
        },
        {
          id: 's8',
          emoji: '🥟',
          name: {
            ar: 'شوربة أويغورية مع دامبلينغ',
            en: 'Uyghur soup with dumplings',
            ru: 'Уйгурский суп с кёцельками Мампар'
          },
          desc: {
            ar: 'شوربة حارة مع لحم ودامبلينغ',
            en: 'National Uyghur soup with beef and dumplings',
            ru: 'Национальный уйгурский суп с мясом и клёцками'
          },
          weight: 520,
          price: 680,
          img: '/photo-qr-menu/soups/mampar.webp'
        },
        {
          id: 's9',
          emoji: '🍜',
          name: {
            ar: 'شوربة نودلز منزلية',
            en: 'Homemade noodle soup',
            ru: 'Суп лапша по-домашнему'
          },
          desc: {
            ar: 'شوربة نودلز خفيفة منزلية',
            en: 'Homemade noodle soup',
            ru: 'Домашний суп с лапшой'
          },
          weight: 320,
          price: 620,
          img: '/photo-qr-menu/soups/noodle.webp'
        },
        {
          id: 's10',
          emoji: '🍲',
          name: {
            ar: 'سوليانكا',
            en: 'Solyanka',
            ru: 'Солянка сборная'
          },
          desc: {
            ar: 'شوربة روسية غنية باللحوم',
            en: 'Mixed solyanka',
            ru: 'Сборная мясная солянка'
          },
          weight: 320,
          price: 765,
          img: '/photo-qr-menu/soups/solyanka.webp'
        },
        {
          id: 's11',
          emoji: '🍲',
          name: {
            ar: 'بورش مع القشطة',
            en: 'Borscht with sour cream',
            ru: 'Борщ со сметаной'
          },
          desc: {
            ar: 'شوربة شمندر تقليدية مع القشطة',
            en: 'Borsch with beef served with sour cream',
            ru: 'Борщ с говядиной и сметаной'
          },
          weight: 320,
          price: 740,
          img: '/photo-qr-menu/soups/borscht.webp'
        }


      ],
    },

    /* ── APPETIZERS ────────────────────────────────────── */
    /* BUG FIX ①: was a nested category object — now flat items array */
    {
      id: 'appetizers',
      icon: '🫒',
      name: { ar: 'المقبلات', en: 'Appetizers', ru: 'Закуски' },
      items: [
        {
          id: 'a1', emoji: '🫘',
          name: { ar: 'حمص', en: 'Hummus', ru: 'Хумус' },
          desc: { ar: 'حمص كريمي مع طحينة وزيت زيتون ولمسة بابريكا', en: 'Creamy hummus with tahini, olive oil and paprika', ru: 'Кремовый хумус с тахини, оливковым маслом и паприкой' },
          weight: 200, price: 530, img: '/photo-qr-menu/homos.webp', badges: ['recommended'],
        },
        {
          id: 'a2', emoji: '🫘',
          name: { ar: 'حمص لبناني', en: 'Lebanese Hummus', ru: 'Хумус по-ливански' },
          desc: { ar: 'حمص مع لحم مفروم متبل ومكسرات', en: 'Hummus topped with spiced minced meat and nuts', ru: 'Хумус с пряным мясным фаршем и орехами' },
          weight: 230, price: 580, img: '/photo-qr-menu/homos-with.webp', badges: [],
        },
        {
          id: 'a3', emoji: '🍆',
          name: { ar: 'متبل', en: 'Moutabal', ru: 'Мутабаль' },
          desc: { ar: 'باذنجان مشوي مهروس مع طحينة وعصير ليمون', en: 'Smoky roasted eggplant with tahini and lemon juice', ru: 'Запечённый баклажан с тахини и лимонным соком' },
          weight: 200, price: 590, img: '/photo-qr-menu/moutabal.webp', badges: [],
        },
        {
          id: 'a4', emoji: '🍆',
          name: { ar: 'بابا غنوج', en: 'Baba Ganoush', ru: 'Бабагануш' },
          desc: { ar: 'باذنجان مشوي مع فليفلة وطماطم وزيت زيتون ورمان', en: 'Grilled eggplant with peppers, tomatoes, olive oil and pomegranate', ru: 'Печёный баклажан с перцем, помидорами и гранатом' },
          weight: 200, price: 630, img: '/photo-qr-menu/Baba-Ganoush.webp', badges: [],
        },
        {
          id: 'a5', emoji: '🌶️',
          name: { ar: 'محمرة', en: 'Muhammara', ru: 'Мухаммара' },
          desc: { ar: 'فليفلة حمراء مشوية مع دبس الرمان والجوز', en: 'Roasted red peppers with pomegranate molasses and walnuts', ru: 'Жареный красный перец с гранатовой патокой и орехами' },
          weight: 200, price: 490, img: '/photo-qr-menu/Muhammara.webp', badges: [],
        },
        {
          id: 'a6', emoji: '🧆',
          name: { ar: 'فلافل', en: 'Falafel', ru: 'Фалафель' },
          desc: { ar: 'كرات الحمص المقلية مع صلصة الطحينة', en: 'Crispy chickpea fritters with tahini sauce', ru: 'Хрустящие шарики из нута с тахиной' },
          weight: 220, price: 460, img: '/photo-qr-menu/falafel.webp', badges: ['recommended'],
        },
        {
          id: 'a7', emoji: '🥩',
          name: { ar: 'كبة', en: 'Kibbeh', ru: 'Кеббе' },
          desc: { ar: 'برغل محشي باللحم مع بهارات تقليدية', en: 'Bulgur stuffed with spiced meat', ru: 'Булгур с начинкой из мяса и специй' },
          weight: 250, price: 620, img: '/photo-qr-menu/keba2.webp', badges: [],
        },
        {
          id: 'a8', emoji: '🫕',
          name: { ar: 'كبة حلبية', en: 'Kibbeh Halabiya', ru: 'Кеббе по-алеппски' },
          desc: { ar: 'كبة مقلية بالفستق وبهارات حلب', en: 'Fried kibbeh with pistachios and Aleppo spices', ru: 'Жареное кеббе с фисташками и специями Алеппо' },
          weight: 250, price: 680, img: '/photo-qr-menu/keba.webp', badges: ['recommended'],
        },
        {
          id: 'a9', emoji: '🍲',
          name: { ar: 'كبة لبنية', en: 'Kibbeh Labaniyeh', ru: 'Кеббе в йогурте' },
          desc: { ar: 'كبة مطبوخة في صلصة اللبن الكريمية', en: 'Kibbeh cooked in creamy yogurt sauce', ru: 'Кеббе в сливочном йогуртовом соусе' },
          weight: 300, price: 720, img: '/photo-qr-menu/keba-labanea.webp', badges: [],
        },
        {
          id: 'a10', emoji: '🍃',
          name: { ar: 'دولما خضار', en: 'Vegetable Dolma', ru: 'Долма овощная' },
          desc: { ar: 'ورق عنب محشي بالأرز والخضار', en: 'Stuffed vine leaves with rice and vegetables', ru: 'Виноградные листья с рисом и овощами' },
          weight: 160, price: 590, img: '/photo-qr-menu/dolma.webp', badges: [],
        },
        {
          id: 'a12', emoji: '🫘',
          name: { ar: 'ميني مازة', en: 'Mini Mezza', ru: 'Мини-маза' },
          desc: { ar: 'تشكيلة من الحمص، المتبل، بابا غنوج، دولما خضار', en: 'Selection of hummus, moutabal, baba ganoush and vegetable dolma', ru: 'Ассорти: хумус, мутабаль, бабагануш и овощная долма' },
          weight: 500, price: 1150, img: '/photo-qr-menu/homos.webp', badges: ['recommended'],
        },
      ],
    },

    /* ── MAIN DISHES ───────────────────────────────────── */
    {
      id: 'mains',
      icon: '🍛',
      name: { ar: 'الأطباق الرئيسية', en: 'Main Dishes', ru: 'Основные блюда' },
      items: [

        // البلوف
        {
          id: 'm7', emoji: '🍚',
          name: { ar: 'بلوف أوزبكي تقليدي', en: 'Traditional Uzbek Plov', ru: 'Плов узбекский' },
          desc: { ar: 'بلوف مع أرز بني مع لحم العجل ولحم الضأن والجزر', en: 'Plov with hand-harvested brown rice, veal, lamb and carrots', ru: 'Плов с бурым рисом, телятиной, бараниной и морковью' },
          weight: 350, price: 860, img: '/photo-qr-menu/Traditional-Uzbek-Plov.webp', badges: [],
        },
        {
          id: 'm8', emoji: '🍚',
          name: { ar: 'بلوف الأعراس', en: 'Wedding Plov', ru: 'Свадебный плов' },
          desc: { ar: 'بلوف مع أرز طشقندي، لحم عجل، لحم ضأن وجزر', en: 'Plov with Tashkent rice, veal, lamb and carrots', ru: 'Плов с ташкентским рисом, телятиной, бараниной и морковью' },
          weight: 350, price: 850, img: '/photo-qr-menu/Wedding-Plov.webp', badges: [],
        },
        {
          id: 'm9', emoji: '🍚',
          name: { ar: 'بلوف احتفالي', en: 'Festive Plov', ru: 'Праздничный плов' },
          desc: { ar: 'بلوف مع أرز طشقندي، لحم عجل، لحم ضأن، كازي، بيض السمان والجزر', en: 'Plov with Tashkent rice, veal, lamb, kazy sausage, quail eggs and carrots', ru: 'Плов с ташкентским рисом, телятиной, бараниной, казы и перепелиными яйцами' },
          weight: 350, price: 875, img: '/photo-qr-menu/Festive-Plov.webp', badges: [],
        },

        // المندي
        {
          id: 'm2', emoji: '🥩',
          name: { ar: 'مندي', en: 'Mandi', ru: 'Манди' },
          desc: { ar: 'لحم خروف مطبوخ على الفحم مع الأرز العطري', en: 'Slow-cooked lamb over charcoal with fragrant rice', ru: 'Ягнёнок медленного приготовления с ароматным рисом' },
          price: 1450, img: '/photo-qr-menu/medee.webp', badges: ['recommended', 'chef'],
        },
        {
          id: 'm11', emoji: '🍖',
          name: { ar: 'مندي لحم', en: 'Meat Mandi', ru: 'Манди мясной' },
          desc: { ar: 'لحم ضأن مشوي على العظم مع أرز مدخن ومكسرات', en: 'Roasted lamb on the bone with smoked rice and nuts', ru: 'Запечённое мясо баранины на кости с копчёным рисом и орехами' },
          weight: 350, price: 1200, img: '/photo-qr-menu/MeatMandi.webp', badges: [],
        },
        {
          id: 'm12', emoji: '🍗',
          name: { ar: 'مندي دجاج', en: 'Chicken Mandi', ru: 'Манди с курицей' },
          desc: { ar: 'دجاج مشوي مع أرز متبل ومكسرات', en: 'Roasted chicken with spiced rice and nuts', ru: 'Курица, запечённая с пряным рисом и орешками' },
          weight: 350, price: 1100, img: '/photo-qr-menu/Meat-Mandi.webp', badges: [],
        },

        // البرياني
        {
          id: 'm10', emoji: '🍛',
          name: { ar: 'أرز برياني', en: 'Biryani Rice', ru: 'Рис бирьяни' },
          desc: { ar: 'بلوف مع خضار، ودجاج أو لحم ضأن حسب الاختيار', en: 'Plov with vegetables and a choice of chicken or lamb', ru: 'Плов с овощами, курицей или бараниной на выбор' },
          weight: 350, price: 1150, img: '/photo-qr-menu/Biryani-Rice.webp', badges: [],
        },

        // الرز
        {
          id: 'm13', emoji: '🍚',
          name: { ar: 'أرز بالزعفران', en: 'Saffron Rice', ru: 'Рис с шафраном' },
          desc: { ar: 'أرز بسمتي مع الليمون والزعفران', en: 'Basmati rice with lemon and saffron', ru: 'Рис басмати с лимоном и шафраном' },
          weight: 250, price: 500, img: '/photo-qr-menu/Saffron-Rice.webp', badges: [],
        },
        {
          id: 'm14', emoji: '🍚',
          name: { ar: 'أرز بالكمون (زيرا)', en: 'Cumin Rice (Zira)', ru: 'Зира рис' },
          desc: { ar: 'أرز بسمتي مع بهار الكمون', en: 'Basmati rice with cumin spice', ru: 'Рис басмати со специей зира' },
          weight: 250, price: 500, img: '/photo-qr-menu/CuminRice.webp', badges: [],
        },

        // باقي الأطباق
        {
          id: 'm1', emoji: '🍚',
          name: { ar: 'كبسة', en: 'Kabsa', ru: 'Кабса' },
          desc: { ar: 'أرز بسمتي مع الدجاج والبهارات العربية الأصيلة', en: 'Basmati rice with chicken & authentic Arab spices', ru: 'Рис басмати с курицей и аутентичными специями' },
          price: 980, img: '/photo-qr-menu/kabsa.webp', badges: ['recommended'],
        },
        {
          id: 'm3', emoji: '🫕',
          name: { ar: 'منسف', en: 'Mansaf', ru: 'Мансаф' },
          desc: { ar: 'طبق الأردن الوطني: خروف مع اللبنة والأرز', en: "Jordan's national dish: lamb with jameed & rice", ru: 'Национальное блюдо Иордании: баранина с джамидом' },
          price: 1680, img: '/photo-qr-menu/Mansaf.webp', badges: [],
        },
        {
          id: 'm4', emoji: '🍲',
          name: { ar: 'مقلوبة', en: 'Maqluba', ru: 'Маклюба' },
          desc: { ar: 'طبق فلسطيني بالدجاج والأرز والخضار', en: 'Palestinian upside-down rice with chicken & vegetables', ru: 'Палестинский рис с курицей и овощами' },
          price: 1120, img: '/photo-qr-menu/Maqluba.webp', badges: [],
        },
        {
          id: 'm5', emoji: '🥬',
          name: { ar: 'ملوخية', en: 'Molokhia', ru: 'Малюхия' },
          desc: { ar: 'ملوخية خضراء مع الدجاج والثوم والكزبرة', en: 'Green jute leaves with chicken, garlic & coriander', ru: 'Зелёная джутовая мальва с курицей и чесноком' },
          price: 890, img: '/photo-qr-menu/Molokhia.webp', badges: [],
        },
        {
          id: 'm6', emoji: '🫘',
          name: { ar: 'بامية مع الأرز', en: 'Okra with Rice', ru: 'Бамия с рисом' },
          desc: { ar: 'بامية مطبوخة مع اللحم والطماطم', en: 'Okra stewed with meat & tomatoes over rice', ru: 'Бамия тушёная с мясом и томатами на рисе' },
          price: 850, img: '/photo-qr-menu/bamea.webp', badges: [],
        },

      ],
    },

    /* ── GRILLS ────────────────────────────────────────── */
    {
      id: 'grills',
      icon: '🔥',
      name: { ar: 'المشاوي', en: 'Grills', ru: 'Гриль' },
      items: [
        {
          id: 'g1', emoji: '🍢',
          name: { ar: 'شيش طاووق', en: 'Shish Tawook', ru: 'Шиш-тавук' },
          desc: { ar: 'دجاج متبل مشوي على الفحم مع صلصة التوم', en: 'Marinated chicken on charcoal with garlic sauce', ru: 'Маринованная курица на угле с чесночным соусом' },
          price: 980, img: '/photo-qr-menu/kabab.webp', badges: ['recommended'],
        },
        {
          id: 'g2', emoji: '🥩',
          name: { ar: 'كباب ضاني', en: 'Lamb Kebab', ru: 'Кебаб из баранины' },
          desc: { ar: 'لحم ضاني مفروم بالبهارات على الفحم', en: 'Spiced minced lamb skewers over charcoal', ru: 'Рубленая баранина со специями на углях' },
          price: 1150, img: '/photo-qr-menu/kababb.webp', badges: ['recommended'],
        },

        {
          id: 'g3',
          emoji: '🍢',
          name: {
            ar: 'لولا كباب على طريقة الخان',
            en: 'Lula Kebab Khan Style',
            ru: 'Люля-кебаб по-ханскому рецепту'
          },
          desc: {
            ar: 'كباب لحم ضأن وبقر متبل بتوابل خاصة، مشوي في التنور',
            en: 'Lamb and veal lula kebab with spices, cooked in tandoor',
            ru: 'Люля-кебаб из баранины и говядины со специями, приготовленный в тандыре'
          },
          weight: 150,
          price: 945,
          img: '/photo-qr-menu/tandoor/lula-khan.webp',
          badges: ['recommended']
        },

        {
          id: 'g4',
          emoji: '🍢',
          name: {
            ar: 'شيش طاووق (فيليه دجاج)',
            en: 'Chicken Shish Kebab',
            ru: 'Шашлык из куриного филе'
          },
          desc: {
            ar: 'قطع دجاج متبلة ومشوية في التنور، تقدم مع بصل مخلل',
            en: 'Chicken fillet skewers cooked in tandoor, served with pickled onions',
            ru: 'Шашлык из куриного филе, приготовленный в тандыре'
          },
          weight: 150,
          price: 850,
          img: '/photo-qr-menu/tandoor/chicken-shish.webp',
          badges: []
        },

        {
          id: 'g5',
          emoji: '🍢',
          name: {
            ar: 'شيش طاووق عجل',
            en: 'Veal Shish Kebab',
            ru: 'Шашлык из телятины'
          },
          desc: {
            ar: 'قطع لحم عجل متبلة ومشوية في التنور',
            en: 'Veal skewers cooked in tandoor, served with pickled onions',
            ru: 'Шашлык из телятины, приготовленный в тандыре'
          },
          weight: 170,
          price: 985,
          img: '/photo-qr-menu/tandoor/veal-shish.webp',
          badges: []
        },

        {
          id: 'g6',
          emoji: '🍢',
          name: {
            ar: 'شيش طاووق ضأن',
            en: 'Lamb Shish Kebab',
            ru: 'Шашлык из ягнёнка'
          },
          desc: {
            ar: 'قطع لحم ضأن متبلة ومشوية في التنور',
            en: 'Lamb skewers cooked in tandoor, served with pickled onions',
            ru: 'Шашлык из ягнёнка, приготовленный в тандыре'
          },
          weight: 170,
          price: 1200,
          img: '/photo-qr-menu/tandoor/lamb-shish.webp',
          badges: ['recommended']
        }

      ],
    },


    /* ── HOT DRINKS ────────────────────────────────────── */
    {
      id: 'hot-drinks',
      icon: '☕',
      name: {
        ar: 'مشروبات ساخنة',
        en: 'Hot Drinks',
        ru: 'Горячие напитки'
      },
      items: [

        // TEA
        {
          id: 'ht1',
          emoji: '🫖',
          name: {
            ar: 'شاي جريب فروت وتوت',
            en: 'Grapefruit Raspberry Tea',
            ru: 'Грейпфрут-малина'
          },
          volume: 700,
          price: 860,
          img: '/photo-qr-menu/drinks/tea-grapefruit.webp'
        },
        {
          id: 'ht2',
          emoji: '🫖',
          name: {
            ar: 'شاي نبق البحر',
            en: 'Sea Buckthorn Tea',
            ru: 'Облепиховый'
          },
          volume: 700,
          price: 860,
          img: '/photo-qr-menu/drinks/tea-seabuckthorn.webp'
        },

        // COFFEE
        {
          id: 'hc1',
          emoji: '☕',
          name: { ar: 'اسبريسو', en: 'Espresso', ru: 'Эспрессо' },
          volume: 35,
          price: 250,
          img: '/photo-qr-menu/drinks/Espresso.webp'
        },
        {
          id: 'hc2',
          emoji: '☕',
          name: { ar: 'كابتشينو', en: 'Cappuccino', ru: 'Капучино' },
          volume: 200,
          price: 300,
          img: '/photo-qr-menu/drinks/Cappuccino.webp'
        },
        {
          id: 'hc3',
          emoji: '☕',
          name: { ar: 'لاتيه', en: 'Latte', ru: 'Латте' },
          volume: 250,
          price: 300,
          img: '/photo-qr-menu/drinks/latte.webp'
        }

      ]
    },
    {
      id: 'cold-drinks',
      icon: '🥤',
      name: {
        ar: 'مشروبات باردة',
        en: 'Cold Drinks',
        ru: 'Холодные напитки'
      },
      items: [

        // SOFT DRINKS
        {
          id: 'cd1',
          name: { ar: 'كولا', en: 'Cola', ru: 'Кола' },
          size: 250,
          price: 300,
          img: '/photo-qr-menu/drinks/cola.webp'
        },

        // MILKSHAKE
        {
          id: 'cd2',
          name: { ar: 'ميلك شيك سنيكرز', en: 'Snickers Milkshake', ru: 'Сникерс' },
          size: 350,
          price: 480,
          img: '/photo-qr-menu/drinks/milkshake.webp'
        },

        // SMOOTHIE
        {
          id: 'cd3',
          name: { ar: 'سموثي مانجو فراولة', en: 'Mango Strawberry', ru: 'Манго-клубника' },
          size: 350,
          price: 420,
          img: '/photo-qr-menu/drinks/smoothie.webp'
        },

        // JUICE
        {
          id: 'cd4',
          name: { ar: 'عصير برتقال طازج', en: 'Fresh Orange Juice', ru: 'Апельсиновый' },
          size: 200,
          price: 450,
          img: '/photo-qr-menu/drinks/Orangejuice.webp'
        },

        // LEMONADE (multi-size)
        {
          id: 'cd5',
          name: { ar: 'ليموناضة خوخ باشن فروت', en: 'Peach Passion Lemonade', ru: 'Персик-Маракуйя' },
          options: [
            { size: 300, price: 380 },
            { size: 1000, price: 850 }
          ],
          img: '/photo-qr-menu/drinks/Lemon-Mint.webp'
        },

        // WATER 
        {
          id: 'cd6',
          name: { ar: 'مياه معدنية', en: 'Water', ru: 'Вода' },
          options: [
            { size: 275, price: 250 },
            { size: 500, price: 380 }
          ],
          img: '/photo-qr-menu/drinks/water.webp'
        },

        // DETOX
        {
          id: 'cd7',
          name: { ar: 'ديتوكس', en: 'Detox', ru: 'Детокс' },
          desc: {
            ar: 'برتقال، جريب فروت، نعناع',
            en: 'Orange, grapefruit, mint',
            ru: 'Апельсин, грейпфрут, мята',
          },
          size: 300,
          price: 480,
          img: '/photo-qr-menu/drinks/detox.webp',
          badges: ['healthy']
        }

      ]
    },


    {
      id: 'bakery',
      icon: '🥟',
      name: {
        ar: 'المخبوزات',
        en: 'Bakery',
        ru: 'Выпечка'
      },
      items: [

        {
          id: 'b1',
          emoji: '🍞',
          name: {
            ar: 'بوشورسك على الطريقة الكازاخية',
            en: 'Kazakh Baursak',
            ru: 'Боорсок по-казахски'
          },
          desc: {
            ar: 'عجينة مقلية تقليدية تقدم مع الفلفل',
            en: 'Traditional fried dough pieces',
            ru: 'Традиционные жареные кусочки теста'
          },
          weight: 200,
          price: 320,
          img: '/photo-qr-menu/bakery/baursak.webp',
          badges: []
        },

        {
          id: 'b2',
          emoji: '🥧',
          name: {
            ar: 'بيروج لحم مفروم',
            en: 'Meat Pie',
            ru: 'Пирог с мясной начинкой'
          },
          desc: {
            ar: 'فطيرة محشوة بلحم مفروم ومخبوزة',
            en: 'Fried pie made from thin dough filled with minced meat',
            ru: 'Жареный пирог с мясной начинкой'
          },
          weight: 340,
          price: 825,
          img: '/photo-qr-menu/bakery/meat-pie.webp',
          badges: ['recommended']
        },

        {
          id: 'b3',
          emoji: '🥟',
          name: {
            ar: 'ميني تشيبوريك لحم',
            en: 'Mini Chebureki with Meat',
            ru: 'Мини-чебуреки с мясом'
          },
          desc: {
            ar: 'فطائر صغيرة مع اللحم تقدم مع صوص طماطم',
            en: 'Mini pastries with veal served with tomato sauce',
            ru: 'Мини-чебуреки с мясом, подаются с томатным соусом'
          },
          weight: 180,
          price: 450,
          img: '/photo-qr-menu/bakery/mini-chebureki-meat.webp',
          badges: []
        },

        {
          id: 'b5',
          emoji: '🥟',
          name: {
            ar: 'ميني سامسا',
            en: 'Mini Samsa',
            ru: 'Мини самсы'
          },
          desc: {
            ar: 'سامسا صغيرة (اختيار: دجاج، لحم، أو جبنة)',
            en: 'Mini puff pastry samsa with choice of chicken, beef or cheese',
            ru: 'Мини самсы с начинкой на выбор: курица, говядина, сыр'
          },
          weight: 100,
          price: 125,
          img: '/photo-qr-menu/bakery/mini-samsa.webp',
          badges: []
        },

        {
          id: 'b6',
          emoji: '🥟',
          name: {
            ar: 'سامسا بخارية',
            en: 'Bukhara Samsa',
            ru: 'Самса Бухарская'
          },
          desc: {
            ar: 'عجينة مخبوزة في الفرن محشوة لحم وبصل',
            en: 'Baked pastry filled with minced meat and onions',
            ru: 'Запечённая самса с мясом и луком'
          },
          weight: 90,
          price: 285,
          img: '/photo-qr-menu/bakery/samsa.webp',
          badges: ['recommended']
        },

        {
          id: 'b7',
          emoji: '🍞',
          name: {
            ar: 'خبز فلسطيني ',
            en: 'Palestinian bread',
            ru: 'палестинский хлеб'
          },
          desc: {
            ar: 'خبز طازج مخبوز في الفرن',
            en: 'Traditional Palestinian bread',
            ru: 'Свежий палестинский хлеб'
          },
          weight: 160,
          price: 150,
          img: '/photo-qr-menu/bakery/bread.webp',
          badges: []
        }

      ]
    }
  ],
};

/* ═══════════════════════════════════════════════════════════
   3. SPECIALS / DOTD / OFFERS
═══════════════════════════════════════════════════════════ */
const CHEFS_PICKS = ['m2', 'g3', 'a8', 's4'];

const DISH_OF_DAY = {
  id: 'm3',   // Mansaf
  emoji: '🫕',
  /* BUG FIX ③: was ('/path', 600, 400) — a JS comma expression
     that evaluated to the number 400, not a URL string.
     Fixed: just a plain string path.                        */
  img: '/photo-qr-menu/Mansaf.webp',
};

const OFFERS = [
  {
    id: 'o1',
    emoji: '🔥',
    tag: { ar: 'عرض خاص', en: 'Special Deal', ru: 'Спецпредложение' },
    name: { ar: 'كومبو المشاوي لشخصين', en: 'Grill Combo for 2', ru: 'Гриль-комбо на двоих' },
    desc: { ar: 'مشاوي مشكلة + خبز + مشروبين', en: 'Mixed grill + bread + 2 drinks', ru: 'Ассорти гриль + хлеб + 2 напитка' },
    price: 2400, oldPrice: 3200,
  },
  {
    id: 'o2',
    emoji: '⭐',
    tag: { ar: 'الأكثر طلباً', en: 'Best Seller', ru: 'Хит продаж' },
    name: { ar: 'كومبو العائلة', en: 'Family Combo', ru: 'Семейное комбо' },
    desc: { ar: 'مندي كامل + سلطة + 4 مشروبات', en: 'Full mandi + salad + 4 drinks', ru: 'Полный манди + салат + 4 напитка' },
    price: 4800, oldPrice: 6500,
  },
  {
    id: 'o3',
    emoji: '🎁',
    tag: { ar: 'وجبة طالب', en: 'Student Meal', ru: 'Студенческий набор' },
    name: { ar: 'وجبة الطالب السريعة', en: 'Quick Student Meal', ru: 'Быстрый студенческий обед' },
    desc: { ar: 'كباب + خبز + مشروب', en: 'Kebab + bread + 1 drink', ru: 'Кебаб + хлеб + напиток' },
    price: 890, oldPrice: 1200,
  },
];

const GALLERY_ITEMS = [
  { id: 'ga1', emoji: '🥩', img: '/photo-qr-menu/mende.webp', label: { ar: 'مندي', en: 'Mandi', ru: 'Манди' } },
  { id: 'ga2', emoji: '🔥', img: '/photo-qr-menu/kababb.webp', label: { ar: 'مشاوي', en: 'Grills', ru: 'Гриль' } },
  { id: 'ga3', emoji: '🫘', img: '/photo-qr-menu/homos.webp', label: { ar: 'حمص', en: 'Hummus', ru: 'Хумус' } },
  { id: 'ga4', emoji: '🍚', img: '/photo-qr-menu/mendee.webp', label: { ar: 'كبسة', en: 'Kabsa', ru: 'Кабса' } },
  { id: 'ga5', emoji: '🥗', img: '/photo-qr-menu/tabola.webp', label: { ar: 'سلطات', en: 'Salads', ru: 'Салаты' } },
  { id: 'ga6', emoji: '🧆', img: '/photo-qr-menu/falafel.webp', label: { ar: 'مقبلات', en: 'Starters', ru: 'Закуски' } },
  { id: 'ga7', emoji: '🍹', img: '/photo-qr-menu/mango-juice.webp', label: { ar: 'عصائر', en: 'Juices', ru: 'Соки' } },
  { id: 'ga8', emoji: '☕', img: '/photo-qr-menu/arabiccoffe.webp', label: { ar: 'مشروبات', en: 'Drinks', ru: 'Напитки' } },
  { id: 'ga9', emoji: '🍗', img: '/photo-qr-menu/kabab.webp', label: { ar: 'دجاج مشوي', en: 'Grilled Chicken', ru: 'Курица' } },
];

/* ═══════════════════════════════════════════════════════════
   4. STATE
═══════════════════════════════════════════════════════════ */
const state = {
  lang: 'ru',
  cart: [],
};

/* ═══════════════════════════════════════════════════════════
   5. HELPERS
═══════════════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function t(key) { return TRANSLATIONS[state.lang]?.[key] ?? TRANSLATIONS.ar[key] ?? key; }
function loc(obj) { return obj?.[state.lang] ?? obj?.ar ?? ''; }
function formatPrice(price) {
  if (typeof price !== 'number') {
    console.warn('Invalid price:', price);
    return '—';
  }
  return price.toLocaleString('ru-RU') + ' ₽';
} function formatWeight(w) {
  if (!w) return '';
  if (state.lang === 'ar') return `${w} غ`;
  if (state.lang === 'ru') return `${w} г`;
  return `${w} g`;
}

function findItem(id) {
  for (const cat of MENU_DATA.categories) {
    const item = cat.items.find(i => i.id === id);
    if (item) return item;
  }
  return null;
}

function getCartItem(id) { return state.cart.find(i => i.id === id); }
function cartTotal() { return state.cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount() { return state.cart.reduce((s, i) => s + i.qty, 0); }


function getSizeText(item) {
  // multi sizes (مثل ليمونادة)
  if (item.sizes) {
    const sizes = item.sizes.map(s => s.size).join(' / ');
    return `<span class="card-weight">(${sizes} ml)</span>`;
  }

  // single size
  const size = item.size || item.volume || item.weight;

  if (!size) return '';

  // تحديد الوحدة
  const isDrink = item.volume || item.size;
  const unit = isDrink
    ? (state.lang === 'ar' ? 'مل' : state.lang === 'ru' ? 'мл' : 'ml')
    : (state.lang === 'ar' ? 'غ' : state.lang === 'ru' ? 'г' : 'g');

  return `<span class="card-weight">(${size} ${unit})</span>`;
}

function renderPriceBlock(item) {

  // إذا عنده options
  if (item.options) {

    // إذا أكثر من خيار
    if (item.options.length > 1) {
      return `
        <div class="card-price-multi">
          ${item.options.map(opt => `
            <div class="price-line">
              <span>${opt.label}</span>
              <span>${formatPrice(opt.price)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // إذا خيار واحد
    const opt = item.options[0];
    return `<span class="card-price">${formatPrice(opt.price)}</span>`;
  }

  // fallback
  return `<span class="card-price">${formatPrice(item.price)}</span>`;
}
/* ═══════════════════════════════════════════════════════════
   6. SPLASH
═══════════════════════════════════════════════════════════ */
function initSplash() {
  const splash = $('#splash');
  const sub = $('#splash-sub');
  if (sub) sub.textContent = t('splash_sub');
  setTimeout(() => splash?.classList.add('hide'), 2200);
}

/* ═══════════════════════════════════════════════════════════
   7. I18N
═══════════════════════════════════════════════════════════ */
function applyTranslations() {
  const dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = state.lang;
  document.body.className = `lang-${state.lang}`;
  document.title = t('page_title');
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
}

/* ═══════════════════════════════════════════════════════════
   8. CATEGORY TABS
═══════════════════════════════════════════════════════════ */
function buildCatTabs() {
  const nav = $('#cat-nav-scroll');
  if (!nav) return;
  nav.innerHTML = '';
  MENU_DATA.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-tab';
    btn.dataset.catId = cat.id;
    btn.innerHTML = `<span class="tab-icon">${cat.icon}</span><span class="tab-label">${loc(cat.name)}</span>`;
    btn.addEventListener('click', () => scrollToSection(cat.id));
    nav.appendChild(btn);
  });
}

function updateActiveCatTab(activeCatId) {
  $$('.cat-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.catId === activeCatId));
  $(`.cat-tab[data-cat-id="${activeCatId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function scrollToSection(catId) {
  const sec = $(`#sec-${catId}`);
  if (!sec) return;
  const headerH = $('#site-header')?.offsetHeight ?? 108;
  window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - headerH - 8, behavior: 'smooth' });
  updateActiveCatTab(catId);
}

/* ═══════════════════════════════════════════════════════════
   9. RENDER CHEF'S SPECIALS
═══════════════════════════════════════════════════════════ */
function renderSpecials() {
  const row = $('#specials-row');
  if (!row) return;
  row.innerHTML = '';
  CHEFS_PICKS.forEach(itemId => {
    const item = findItem(itemId);
    if (!item) return;
    const card = document.createElement('div');
    card.className = 'special-card-large pop-in';
    card.innerHTML = `
      <div class="special-img-wrap">
        <img class="special-img" src="${item.img}" alt="${loc(item.name)}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="sph card-img-placeholder" style="display:none">${item.emoji}</div>
      </div>
      <div class="special-body">
        <div class="special-chip">⭐ ${t('chefs_pick')}</div>
        <div class="special-name">${loc(item.name)}</div>
        <div class="special-footer">
          <span class="special-price">${formatPrice(item.price)}</span>
          <div class="special-ctrl-wrap">${renderAddBtn(item)}</div>
        </div>
      </div>`;
    row.appendChild(card);
    attachCardEvents(card, item);
  });
}

/* ═══════════════════════════════════════════════════════════
   10. RENDER DISH OF THE DAY
═══════════════════════════════════════════════════════════ */
function renderDOTD() {
  const wrap = $('#dotd-card');
  if (!wrap) return;
  const item = findItem(DISH_OF_DAY.id);
  if (!item) return;
  wrap.className = 'dotd-card';
  wrap.innerHTML = `
    <img class="dotd-img" src="${DISH_OF_DAY.img}" alt="${loc(item.name)}" loading="lazy"
         onerror="this.style.display='none'">
    <div class="dotd-body">
      <div class="dotd-badge">${t('dotd_label')}</div>
      <div class="dotd-name">${loc(item.name)}</div>
      <div class="dotd-desc">${loc(item.desc)}</div>
      <div class="dotd-price">${formatPrice(item.price)}</div>
      <div class="dotd-ctrl-wrap" style="margin-top:10px">${renderAddBtn(item)}</div>
    </div>`;
  attachCardEvents(wrap, item);
}

/* ═══════════════════════════════════════════════════════════
   11. RENDER OFFERS
═══════════════════════════════════════════════════════════ */
function renderOffers() {
  const row = $('#offers-row');
  if (!row) return;
  row.innerHTML = '';
  OFFERS.forEach(offer => {
    const card = document.createElement('div');
    card.className = 'offer-card';
    card.innerHTML = `
      <span class="offer-emoji">${offer.emoji}</span>
      <span class="offer-tag">${loc(offer.tag)}</span>
      <div class="offer-name">${loc(offer.name)}</div>
      <div class="offer-desc">${loc(offer.desc)}</div>
      <div>
        <span class="offer-price">${formatPrice(offer.price)}</span>
        <span class="offer-old-price">${formatPrice(offer.oldPrice)}</span>
      </div>`;
    row.appendChild(card);
  });
}

/* ═══════════════════════════════════════════════════════════
   12. RENDER MAIN MENU SECTIONS
═══════════════════════════════════════════════════════════ */
function renderMenuSections() {
  const container = $('#menu-sections');
  if (!container) return;
  container.innerHTML = '';
  MENU_DATA.categories.forEach(cat => {
    const sec = document.createElement('section');
    sec.className = 'menu-section fade-up';
    sec.id = `sec-${cat.id}`;
    sec.setAttribute('aria-labelledby', `cat-h-${cat.id}`);

    const head = document.createElement('div');
    head.className = 'menu-section-head';
    head.innerHTML = `<span class="menu-section-icon">${cat.icon}</span>
                      <h2 class="menu-section-title" id="cat-h-${cat.id}">${loc(cat.name)}</h2>`;
    sec.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    cat.items.forEach(item => grid.appendChild(buildMenuCard(item)));
    sec.appendChild(grid);
    container.appendChild(sec);
  });
  observeFadeUp();
}

function buildMenuCard(item) {
  const card = document.createElement('div');
  card.className = 'menu-card' + (item.badges?.includes('chef') ? ' special-card' : '');
  card.dataset.itemId = item.id;

  const badgesHTML = (item.badges ?? []).map(b => {
    if (b === 'recommended') return `<span class="badge badge-recommended">${t('recommended')}</span>`;
    if (b === 'new') return `<span class="badge badge-new">New</span>`;
    if (b === 'spicy') return `<span class="badge badge-spicy">🌶</span>`;
    if (b === 'chef') return `<span class="badge badge-chef">${t('chefs_pick')}</span>`;
    return '';
  }).join('');

  card.innerHTML = `
    <div class="card-img-wrap">
      <div class="card-badges">${badgesHTML}</div>
      ${item.img
      ? `<img class="card-img" src="${item.img}" alt="${loc(item.name)}" loading="lazy"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
           <div class="card-img-placeholder" style="display:none">${item.emoji}</div>`
      : `<div class="card-img-placeholder">${item.emoji}</div>`}
    </div>
    <div class="card-body">
      <div class="card-name">
        ${loc(item.name)}
        ${getSizeText(item)}
      </div>
      <div class="card-desc">${loc(item.desc)}</div>
      <div class="card-footer">
        ${renderPriceBlock(item)}
        <div class="card-ctrl-wrap">${renderAddBtn(item)}</div>
      </div>
    </div>`;

  attachCardEvents(card, item);
  return card;
}

function renderAddBtn(item) {
  const ci = getCartItem(item.id);
  if (ci) {
    return `<div class="qty-ctrl" data-item-id="${item.id}">
      <button class="qty-btn btn-qty-dec" aria-label="Decrease">−</button>
      <span class="qty-num">${ci.qty}</span>
      <button class="qty-btn btn-qty-inc" aria-label="Increase">+</button>
    </div>`;
  }
  return `<button class="btn-add" data-item-id="${item.id}" aria-label="${t('add_to_cart')}">+</button>`;
}

function attachCardEvents(container, item) {
  container.addEventListener('click', e => {
    if (e.target.closest('.btn-add')) { addToCart(item); return; }
    if (e.target.closest('.btn-qty-inc')) { changeQty(item.id, +1); return; }
    if (e.target.closest('.btn-qty-dec')) { changeQty(item.id, -1); return; }
  });
}

/* ═══════════════════════════════════════════════════════════
   13. CART LOGIC
═══════════════════════════════════════════════════════════ */
function addToCart(item) {

  // إذا فيه خيارات → لازم اختيار
  if (item.options && item.options.length > 1) {
    openOptionSelector(item);
    return;
  }

  // إذا خيار واحد فقط → خذه مباشرة
  const option = item.options?.[0];

  const id = option ? `${item.id}_${option.label}` : item.id;

  const existing = state.cart.find(i => i.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id,
      name: item.name,
      price: option ? option.price : item.price,
      emoji: item.emoji,
      qty: 1,
      option: option?.label
    });
  }

  refreshCardControl(item.id);
  updateCartUI();
  animateBadge();
  showToast(`${loc(item.name)} ✓`);
}


function changeQty(itemId, delta) {
  const ci = getCartItem(itemId);
  if (!ci) return;
  ci.qty += delta;
  if (ci.qty <= 0) state.cart = state.cart.filter(i => i.id !== itemId);
  refreshCardControl(itemId);
  updateCartUI();
  animateBadge();
}

/* ─────────────────────────────────────────────────────────
   BUG FIX ④ (NoModificationAllowedError):
   Original code used outerHTML replacement inside a loop
   that could match elements with no parent node (detached /
   placeholder nodes from the broken appetizers data structure,
   and also the DOTD card before it was mounted).

   NEW APPROACH:
   • For each named "control wrapper" class, find the wrapper
     element itself and replace its innerHTML — innerHTML is
     always safe because we own the wrapper.
   • Guard with parentNode check before any outerHTML call.
   • Use distinct wrapper class names per section so selectors
     never accidentally match detached nodes.
───────────────────────────────────────────────────────────*/
function openOptionSelector(item) {
  const modal = $('#size-modal');
  const optionsWrap = $('#size-options');
  const title = $('#size-title');

  title.textContent = loc(item.name);
  optionsWrap.innerHTML = '';

  item.options.forEach(opt => {
    const btn = document.createElement('button');

    btn.className = 'size-btn';
    btn.innerHTML = `${opt.label} — ${formatPrice(opt.price)}`;

    btn.onclick = () => {
      addOptionToCart(item, opt);
      closeSizeModal();
    };

    optionsWrap.appendChild(btn);
  });

  modal.removeAttribute('hidden');
}


function addOptionToCart(item, opt) {
  const id = `${item.id}_${opt.label}`;

  const existing = state.cart.find(i => i.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id,
      name: item.name,
      price: opt.price,
      emoji: item.emoji,
      qty: 1,
      option: opt.label
    });
  }

  updateCartUI();
  animateBadge();
  showToast(`${loc(item.name)} (${opt.label}) ✓`);
}

function refreshCardControl(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  const newHTML = renderAddBtn(item);

  // ── menu grid cards ──
  $$('.menu-card').forEach(card => {
    if (card.dataset.itemId !== itemId) return;
    const wrap = card.querySelector('.card-ctrl-wrap');
    if (wrap) { wrap.innerHTML = newHTML; attachCardEvents(card, item); }
  });

  // ── chef's specials ──
  $$('.special-card-large').forEach(card => {
    const btn = card.querySelector(`[data-item-id="${itemId}"]`);
    const ctrl = card.querySelector(`.qty-ctrl[data-item-id="${itemId}"]`);
    if (!btn && !ctrl) return;
    const wrap = card.querySelector('.special-ctrl-wrap');
    if (wrap) { wrap.innerHTML = newHTML; attachCardEvents(card, item); }
  });

  // ── dish of the day ──
  const dotd = $('#dotd-card');
  if (dotd) {
    const wrap = dotd.querySelector('.dotd-ctrl-wrap');
    if (wrap) { wrap.innerHTML = newHTML; attachCardEvents(dotd, item); }
  }
}

/* ═══════════════════════════════════════════════════════════
   14. CART UI
═══════════════════════════════════════════════════════════ */
function updateCartUI() {
  const count = cartCount();
  const total = cartTotal();

  $$('#cart-badge, #fc-count').forEach(el => { el.textContent = count; });
  $$('#fc-total').forEach(el => { el.textContent = formatPrice(total); });
  $$('#cart-total').forEach(el => { el.textContent = formatPrice(total); });

  $('#floating-cart')?.classList.toggle('visible', count > 0);

  const emptyEl = $('#cart-empty');
  const footerEl = $('#cart-footer');
  const showBtn = $('#btn-show-order');

  if (emptyEl) emptyEl.style.display = count === 0 ? 'flex' : 'none';
  if (footerEl) footerEl.style.display = count === 0 ? 'none' : 'flex';
  if (showBtn) showBtn.disabled = count === 0;

  renderCartList();
}

function renderCartList() {
  const list = $('#cart-list');
  if (!list) return;
  list.innerHTML = '';
  state.cart.forEach(ci => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item-img">${ci.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${loc(ci.name)}</div>
        <div class="cart-item-price">${formatPrice(ci.price)}</div>
      </div>
      <div class="cart-item-controls">
        <div class="qty-ctrl">
          <button class="qty-btn" data-action="dec" data-id="${ci.id}" aria-label="Decrease">−</button>
          <span class="qty-num">${ci.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${ci.id}" aria-label="Increase">+</button>
        </div>
        <span class="cart-item-subtotal">${formatPrice(ci.price * ci.qty)}</span>
      </div>`;
    li.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      changeQty(btn.dataset.id, btn.dataset.action === 'inc' ? 1 : -1);
    });
    list.appendChild(li);
  });
}

function animateBadge() {
  const badge = $('#cart-badge');
  badge?.classList.remove('bump');
  void badge?.offsetWidth;
  badge?.classList.add('bump');
}

/* ═══════════════════════════════════════════════════════════
   15. CART PANEL
═══════════════════════════════════════════════════════════ */
function openCart() {
  $('#cart-panel')?.classList.add('open');
  $('#cart-panel')?.setAttribute('aria-hidden', 'false');
  $('#cart-backdrop')?.classList.add('show');
  document.body.style.overflow = 'hidden';
  updateCartUI();
}
function closeCart() {
  $('#cart-panel')?.classList.remove('open');
  $('#cart-panel')?.setAttribute('aria-hidden', 'true');
  $('#cart-backdrop')?.classList.remove('show');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════════
   16. ORDER SUMMARY
═══════════════════════════════════════════════════════════ */
function openOrderSummary() {
  closeCart();
  const overlay = $('#order-overlay');
  if (!overlay) return;
  overlay.removeAttribute('hidden');

  const ts = $('#order-timestamp');
  if (ts) {
    const locale = state.lang === 'ar' ? 'ar-SA' : state.lang === 'ru' ? 'ru-RU' : 'en-GB';
    ts.textContent = new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }

  const list = $('#order-list');
  if (list) {
    list.innerHTML = '';
    state.cart.forEach(ci => {
      const li = document.createElement('li');
      li.className = 'order-item';
      li.innerHTML = `
        <div class="order-item-info">
          <span class="order-item-emoji">${ci.emoji}</span>
          <div>
            <div class="order-item-name">${loc(ci.name)}</div>
            <div class="order-item-qty">× ${ci.qty}</div>
          </div>
        </div>
        <span class="order-item-price">${formatPrice(ci.price * ci.qty)}</span>`;
      list.appendChild(li);
    });
  }

  const tot = $('#order-total');
  if (tot) tot.textContent = formatPrice(cartTotal());
}

function closeOrderSummary() {
  $('#order-overlay')?.setAttribute('hidden', '');
}

function clearOrder() {
  state.cart = [];
  closeOrderSummary();
  updateCartUI();
  renderSpecials();
  renderDOTD();
  renderMenuSections();
}

/* ═══════════════════════════════════════════════════════════
   17. GALLERY
═══════════════════════════════════════════════════════════ */
function renderGallery() {
  const grid = $('#gallery-grid');
  if (!grid) return;
  grid.innerHTML = '';
  GALLERY_ITEMS.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${loc(item.label)}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="gallery-emoji-placeholder" style="display:none">${item.emoji}</div>
      <div class="gallery-item-label">${loc(item.label)}</div>`;
    grid.appendChild(div);
  });
}
function openGallery() { const o = $('#gallery-overlay'); if (!o) return; o.removeAttribute('hidden'); renderGallery(); }
function closeGallery() { $('#gallery-overlay')?.setAttribute('hidden', ''); }

/* ═══════════════════════════════════════════════════════════
   18. TOAST
═══════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('toast-el');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-el';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

/* ═══════════════════════════════════════════════════════════
   19. OBSERVERS
═══════════════════════════════════════════════════════════ */
function observeFadeUp() {
  const els = $$('.fade-up');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

function observeActiveCat() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) updateActiveCatTab(e.target.id.replace('sec-', '')); });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  $$('.menu-section').forEach(s => obs.observe(s));
}

function handleHeaderScroll() {
  const header = $('#site-header');
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   20. LANGUAGE SWITCHER
═══════════════════════════════════════════════════════════ */
function initLangSwitcher() {
  $$('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === state.lang) return;
      state.lang = lang;
      $$('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
        b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
      });
      applyTranslations();
      buildCatTabs();
      renderSpecials();
      renderDOTD();
      renderOffers();
      renderMenuSections();
      updateCartUI();
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   21. EVENT LISTENERS
═══════════════════════════════════════════════════════════ */
function initEvents() {
  $('#header-cart-btn')?.addEventListener('click', openCart);
  $('#floating-cart-btn')?.addEventListener('click', openCart);
  $('#cart-close')?.addEventListener('click', closeCart);
  $('#cart-backdrop')?.addEventListener('click', closeCart);
  $('#btn-show-order')?.addEventListener('click', openOrderSummary);
  $('#order-close')?.addEventListener('click', closeOrderSummary);
  $('#btn-clear-order')?.addEventListener('click', clearOrder);
  $('#btn-gallery')?.addEventListener('click', openGallery);
  $('#gallery-close')?.addEventListener('click', closeGallery);
  $('#gallery-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeGallery(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCart(); closeGallery(); closeOrderSummary(); }
  });
}

/* ═══════════════════════════════════════════════════════════
   22. INIT
═══════════════════════════════════════════════════════════ */
function init() {
  initSplash();
  applyTranslations();
  buildCatTabs();
  renderSpecials();
  renderDOTD();
  renderOffers();
  renderMenuSections();
  updateCartUI();
  initLangSwitcher();
  initEvents();
  handleHeaderScroll();
  observeActiveCat();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}