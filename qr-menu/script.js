/* ═══════════════════════════════════════════════════════════
   MADAR DIGITAL MENU — script.js
   Vanilla JS. No frameworks. No dependencies.
   All data, translations, cart logic, and rendering here.
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
   Images: high-quality Unsplash URLs (curated for food).
   Price in Russian Roubles (₽). Easily editable.
═══════════════════════════════════════════════════════════ */

// Helper: create Unsplash URL by keyword (free, no key needed)
const IMG = (id, w = 400, h = 300) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const MENU_DATA = {
  categories: [
    {
      id: 'salads',
      icon: '🥗',
      name: { ar: 'السلطات', en: 'Salads', ru: 'Салаты' },
      items: [
        {
          id: 's1', emoji: '🥗',
          name: { ar: 'تبولة', en: 'Tabbouleh', ru: 'Табуле' },
          desc: { ar: 'بقدونس طازج مع برغل وطماطم وزيت زيتون', en: 'Fresh parsley, bulgur, tomatoes & olive oil', ru: 'Свежая петрушка, булгур, помидоры и оливковое масло' },
          price: 550, img: IMG('1512621776951-a57ef161980b'), badges: ['recommended'],
        },
        {
          id: 's2', emoji: '🥙',
          name: { ar: 'فتوش', en: 'Fattoush', ru: 'Фатуш' },
          desc: { ar: 'خضار طازجة مع خبز مقرمش ودبس الرمان', en: 'Fresh vegetables with crispy bread & pomegranate molasses', ru: 'Свежие овощи с хрустящим хлебом и гранатовой патокой' },
          price: 520, img: IMG('1540189549416-57e41b0e5842'), badges: [],
        },
        {
          id: 's3', emoji: '🥗',
          name: { ar: 'سيزر بالدجاج', en: 'Caesar Salad (Chicken)', ru: 'Цезарь с курицей' },
          desc: { ar: 'خس روماني، دجاج مشوي، جبنة بارميزان، كروتون', en: 'Romaine, grilled chicken, Parmesan, croutons', ru: 'Ромен, куриная грудка, пармезан, гренки' },
          price: 680, img: IMG('1528207776446-aaaf5d4df5b1'), badges: [],
        },
        {
          id: 's4', emoji: '🦐',
          name: { ar: 'سيزر بالروبيان', en: 'Caesar Salad (Shrimp)', ru: 'Цезарь с креветками' },
          desc: { ar: 'خس روماني مع روبيان مشوي وجبنة بارميزان', en: 'Romaine with grilled shrimp & Parmesan', ru: 'Ромен с жареными креветками и пармезаном' },
          price: 850, img: IMG('1551218808-84a27ca84a7e'), badges: ['recommended'],
        },
        {
          id: 's5', emoji: '🫒',
          name: { ar: 'سلطة يونانية', en: 'Greek Salad', ru: 'Греческий салат' },
          desc: { ar: 'خيار وطماطم وزيتون وجبنة فيتا', en: 'Cucumber, tomatoes, olives & feta cheese', ru: 'Огурец, помидоры, оливки и сыр фета' },
          price: 580, img: IMG('1540189549416-57e41b0e5842'), badges: [],
        },
        {
          id: 's6', emoji: '🥬',
          name: { ar: 'كولسلو', en: 'Coleslaw', ru: 'Коул Слоу' },
          desc: { ar: 'ملفوف طازج مع جزر وصلصة المايونيز', en: 'Fresh cabbage with carrot & creamy dressing', ru: 'Свежая капуста с морковью и сливочной заправкой' },
          price: 420, img: IMG('1512621776951-a57ef161980b'), badges: [],
        },
        {
          id: 's7', emoji: '🫚',
          name: { ar: 'سلطة الشمندر', en: 'Beetroot Salad', ru: 'Салат из свёклы' },
          desc: { ar: 'شمندر مشوي مع جوز وجبنة بارميزان', en: 'Roasted beetroot with walnuts & Parmesan', ru: 'Запечённая свёкла с грецкими орехами и пармезаном' },
          price: 490, img: IMG('1546069901-ba9599a7e63c'), badges: [],
        },
      ],
    },
    {
      id: 'appetizers',
      icon: '🫒',
      name: { ar: 'المقبلات', en: 'Appetizers', ru: 'Закуски' },
      items: [
        {
          id: 'a1', emoji: '🫘',
          name: { ar: 'حمص', en: 'Hummus', ru: 'Хумус' },
          desc: { ar: 'حمص كريمي مع زيت زيتون وبابريكا', en: 'Creamy hummus with olive oil & paprika', ru: 'Кремовый хумус с оливковым маслом и паприкой' },
          price: 490, img: IMG('1618449407797-5f09ce785ab6'), badges: ['recommended'],
        },
        {
          id: 'a2', emoji: '🫘',
          name: { ar: 'حمص لبناني', en: 'Lebanese Hummus', ru: 'Ливанский хумус' },
          desc: { ar: 'حمص مع لحم مفروم ومكسرات', en: 'Hummus topped with spiced minced meat & nuts', ru: 'Хумус с пряным мясным фаршем и орехами' },
          price: 680, img: IMG('1583394293544-5dfa4be2c784'), badges: [],
        },
        {
          id: 'a3', emoji: '🍆',
          name: { ar: 'متبل', en: 'Moutabal', ru: 'Мутаббаль' },
          desc: { ar: 'باذنجان مشوي مهروس مع طحينة وليمون', en: 'Smoky roasted aubergine with tahini & lemon', ru: 'Запечённый баклажан с тахиной и лимоном' },
          price: 510, img: IMG('1512621776951-a57ef161980b'), badges: [],
        },
        {
          id: 'a4', emoji: '🌶️',
          name: { ar: 'محمرة', en: 'Muhammara', ru: 'Мухаммара' },
          desc: { ar: 'فليفلة حمراء مشوية مع رمان وبهارات', en: 'Roasted red peppers with pomegranate & spices', ru: 'Жареный красный перец с гранатом и специями' },
          price: 490, img: IMG('1540189549416-57e41b0e5842'), badges: [],
        },
        {
          id: 'a5', emoji: '🧆',
          name: { ar: 'فلافل', en: 'Falafel', ru: 'Фалафель' },
          desc: { ar: 'كرات الحمص المقلي مع صلصة الطحينة', en: 'Crispy chickpea fritters with tahini dip', ru: 'Хрустящие котлеты из нута с тахиной' },
          price: 460, img: IMG('1583394293544-5dfa4be2c784'), badges: ['recommended'],
        },
        {
          id: 'a6', emoji: '🥩',
          name: { ar: 'كبة', en: 'Kibbeh', ru: 'Кеббе' },
          desc: { ar: 'برغل ولحم مع بهارات الكبة الأصيلة', en: 'Bulgur & lamb with authentic kibbeh spices', ru: 'Булгур и баранина с аутентичными специями' },
          price: 620, img: IMG('1414235077428-338989a2e8c0'), badges: [],
        },
        {
          id: 'a7', emoji: '🫕',
          name: { ar: 'كبة حلبية', en: 'Kibbeh Halabiya', ru: 'Кеббе по-алеппски' },
          desc: { ar: 'كبة مقلية بالفستق وبهارات حلب', en: 'Fried kibbeh with Aleppo pistachios & spices', ru: 'Жареное кеббе с фисташками и специями Алеппо' },
          price: 680, img: IMG('1546069901-ba9599a7e63c'), badges: ['recommended'],
        },
        {
          id: 'a8', emoji: '🍲',
          name: { ar: 'كبة لبنية', en: 'Kibbeh Labaniyeh', ru: 'Кеббе в йогурте' },
          desc: { ar: 'كبة مطبوخة في صلصة اللبن الكريمية', en: 'Kibbeh simmered in creamy yoghurt sauce', ru: 'Кеббе в сливочном йогуртовом соусе' },
          price: 720, img: IMG('1512621776951-a57ef161980b'), badges: [],
        },
      ],
    },
    {
      id: 'mains',
      icon: '🍛',
      name: { ar: 'الأطباق الرئيسية', en: 'Main Dishes', ru: 'Основные блюда' },
      items: [
        {
          id: 'm1', emoji: '🍚',
          name: { ar: 'كبسة', en: 'Kabsa', ru: 'Кабса' },
          desc: { ar: 'أرز بسمتي مع الدجاج والبهارات العربية الأصيلة', en: 'Basmati rice with chicken & authentic Arab spices', ru: 'Рис басмати с курицей и аутентичными специями' },
          price: 980, img: IMG('1567620832903-9fc6debc209f'), badges: ['recommended'],
        },
        {
          id: 'm2', emoji: '🥩',
          name: { ar: 'مندي', en: 'Mandi', ru: 'Манди' },
          desc: { ar: 'لحم خروف مطبوخ على الفحم مع الأرز العطري', en: 'Slow-cooked lamb over charcoal with fragrant rice', ru: 'Ягнёнок медленного приготовления с ароматным рисом' },
          price: 1450, img: IMG('1414235077428-338989a2e8c0'), badges: ['recommended', 'chef'],
        },
        {
          id: 'm3', emoji: '🫕',
          name: { ar: 'منسف', en: 'Mansaf', ru: 'Мансаф' },
          desc: { ar: 'طبق الأردن الوطني: خروف مع اللبنة والأرز', en: 'Jordan\'s national dish: lamb with jameed & rice', ru: 'Национальное блюдо Иордании: баранина с джамидом' },
          price: 1680, img: IMG('1565557623262-b51f2ed2bf15'), badges: [],
        },
        {
          id: 'm4', emoji: '🍲',
          name: { ar: 'مقلوبة', en: 'Maqluba', ru: 'Маклюба' },
          desc: { ar: 'طبق فلسطيني بالدجاج والأرز والخضار', en: 'Palestinian upside-down rice with chicken & vegetables', ru: 'Палестинский рис с курицей и овощами' },
          price: 1120, img: IMG('1546069901-ba9599a7e63c'), badges: [],
        },
        {
          id: 'm5', emoji: '🥬',
          name: { ar: 'ملوخية', en: 'Molokhia', ru: 'Малюхия' },
          desc: { ar: 'ملوخية خضراء مع الدجاج والثوم والكزبرة', en: 'Green jute leaves with chicken, garlic & coriander', ru: 'Зелёная джутовая мальва с курицей и чесноком' },
          price: 890, img: IMG('1512621776951-a57ef161980b'), badges: [],
        },
        {
          id: 'm6', emoji: '🫘',
          name: { ar: 'بامية مع الأرز', en: 'Okra with Rice', ru: 'Бамия с рисом' },
          desc: { ar: 'بامية مطبوخة مع اللحم والطماطم', en: 'Okra stewed with meat & tomatoes over rice', ru: 'Бамия тушёная с мясом и томатами на рисе' },
          price: 850, img: IMG('1565557623262-b51f2ed2bf15'), badges: [],
        },
      ],
    },
    {
      id: 'grills',
      icon: '🔥',
      name: { ar: 'المشاوي', en: 'Grills', ru: 'Гриль' },
      items: [
        {
          id: 'g1', emoji: '🍢',
          name: { ar: 'شيش طاووق', en: 'Shish Tawook', ru: 'Шиш-тавук' },
          desc: { ar: 'دجاج متبل مشوي على الفحم مع صلصة التوم', en: 'Marinated chicken on charcoal with garlic sauce', ru: 'Маринованная курица на угле с чесночным соусом' },
          price: 980, img: IMG('1529042355636-0e759cfe3b6d'), badges: ['recommended'],
        },
        {
          id: 'g2', emoji: '🥩',
          name: { ar: 'كباب ضاني', en: 'Lamb Kebab', ru: 'Кебаб из баранины' },
          desc: { ar: 'لحم ضاني مفروم بالبهارات على الفحم', en: 'Spiced minced lamb skewers over charcoal', ru: 'Рубленая баранина со специями на углях' },
          price: 1150, img: IMG('1555939594-58d7cb561d38'), badges: ['recommended'],
        },
        {
          id: 'g3', emoji: '🔥',
          name: { ar: 'مشاوي مشكلة', en: 'Mixed Grill', ru: 'Ассорти гриль' },
          desc: { ar: 'تشكيلة من الدجاج والكباب والكفتة المشوية', en: 'Assorted grilled chicken, kebab & kofta', ru: 'Ассорти из курицы, кебаба и кофты на гриле' },
          price: 1650, img: IMG('1529042355636-0e759cfe3b6d'), badges: ['recommended', 'chef'],
        },
        {
          id: 'g4', emoji: '🍗',
          name: { ar: 'دجاج مشوي', en: 'Grilled Chicken', ru: 'Курица на гриле' },
          desc: { ar: 'دجاج كامل مشوي بالليمون والأعشاب', en: 'Whole chicken grilled with lemon & herbs', ru: 'Целая курица с лимоном и травами на гриле' },
          price: 1280, img: IMG('1601050690597-df0568f70950'), badges: [],
        },
        {
          id: 'g5', emoji: '🍡',
          name: { ar: 'كفتة', en: 'Kofta', ru: 'Кофта' },
          desc: { ar: 'لحم مفروم بالبهارات والبصل والبقدونس', en: 'Minced meat with spices, onion & parsley', ru: 'Рубленое мясо с приправами, луком и петрушкой' },
          price: 980, img: IMG('1555939594-58d7cb561d38'), badges: [],
        },
      ],
    },
    {
      id: 'juices',
      icon: '🥤',
      name: { ar: 'العصائر', en: 'Juices', ru: 'Соки' },
      items: [
        { id: 'j1', emoji: '🍊', name: { ar: 'برتقال', en: 'Orange', ru: 'Апельсин' }, desc: { ar: 'عصير برتقال طازج 100%', en: '100% fresh squeezed orange juice', ru: '100% свежевыжатый апельсиновый сок' }, price: 320, img: IMG('1613478223719-75c2b0a5ab2b'), badges: [] },
        { id: 'j2', emoji: '🥭', name: { ar: 'مانجو', en: 'Mango', ru: 'Манго' }, desc: { ar: 'مانجو طازجة ناعمة ومنعشة', en: 'Fresh smooth refreshing mango', ru: 'Свежий, гладкий, освежающий манго' }, price: 380, img: IMG('1553279768-865429fa0078'), badges: ['recommended'] },
        { id: 'j3', emoji: '🍓', name: { ar: 'فراولة', en: 'Strawberry', ru: 'Клубника' }, desc: { ar: 'عصير فراولة طازج مع الحليب', en: 'Fresh strawberry with milk', ru: 'Свежая клубника с молоком' }, price: 360, img: IMG('1565299624596-8c5f60e0b7e0'), badges: [] },
        { id: 'j4', emoji: '🍋', name: { ar: 'ليمون بالنعناع', en: 'Lemon Mint', ru: 'Лимон с мятой' }, desc: { ar: 'ليمون طازج مع نعناع منعش', en: 'Fresh lemon with refreshing mint', ru: 'Свежий лимон с мятой' }, price: 290, img: IMG('1556679343-c7306c1976ad'), badges: ['recommended'] },
        { id: 'j5', emoji: '🍈', name: { ar: 'جوافة', en: 'Guava', ru: 'Гуава' }, desc: { ar: 'عصير جوافة طازج بطعم لا يُقاوم', en: 'Fresh guava juice with irresistible flavour', ru: 'Свежий сок гуавы с неотразимым вкусом' }, price: 340, img: IMG('1613478223719-75c2b0a5ab2b'), badges: [] },
        { id: 'j6', emoji: '🍍', name: { ar: 'أناناس', en: 'Pineapple', ru: 'Ананас' }, desc: { ar: 'أناناس طازج حلو وحامض', en: 'Fresh sweet & tangy pineapple', ru: 'Свежий сладко-терпкий ананас' }, price: 350, img: IMG('1570913149827-d2ac81ad3030'), badges: [] },
        { id: 'j7', emoji: '🍉', name: { ar: 'بطيخ', en: 'Watermelon', ru: 'Арбуз' }, desc: { ar: 'عصير بطيخ منعش وبارد', en: 'Cool refreshing watermelon juice', ru: 'Прохладный освежающий сок арбуза' }, price: 290, img: IMG('1553279768-865429fa0078'), badges: [] },
        { id: 'j8', emoji: '🍎', name: { ar: 'تفاح', en: 'Apple', ru: 'Яблоко' }, desc: { ar: 'عصير تفاح طازج ناعم', en: 'Fresh smooth apple juice', ru: 'Свежий гладкий яблочный сок' }, price: 290, img: IMG('1504674900247-0877df9cc836'), badges: [] },
        { id: 'j9', emoji: '🥕', name: { ar: 'جزر', en: 'Carrot', ru: 'Морковь' }, desc: { ar: 'عصير جزر طازج غني بالفيتامينات', en: 'Fresh vitamin-rich carrot juice', ru: 'Свежий богатый витаминами морковный сок' }, price: 290, img: IMG('1613478223719-75c2b0a5ab2b'), badges: [] },
        { id: 'j10', emoji: '🍹', name: { ar: 'كوكتيل مشكل', en: 'Mixed Cocktail', ru: 'Смешанный коктейль' }, desc: { ar: 'تشكيلة من أطيب الفواكه الطازجة', en: 'A blend of the finest fresh fruits', ru: 'Смесь лучших свежих фруктов' }, price: 430, img: IMG('1490474418585-ba9bad8fd0ea'), badges: ['recommended'] },
      ],
    },
    {
      id: 'drinks',
      icon: '☕',
      name: { ar: 'المشروبات الساخنة', en: 'Hot Drinks', ru: 'Горячие напитки' },
      items: [
        { id: 'd1', emoji: '🫖', name: { ar: 'قهوة عربية', en: 'Arabic Coffee', ru: 'Арабский кофе' }, desc: { ar: 'قهوة عربية أصيلة بالهيل والزعفران', en: 'Authentic Arabic coffee with cardamom & saffron', ru: 'Аутентичный арабский кофе с кардамоном' }, price: 220, img: IMG('1504674900247-0877df9cc836'), badges: ['recommended'] },
        { id: 'd2', emoji: '☕', name: { ar: 'إسبريسو', en: 'Espresso', ru: 'Эспрессо' }, desc: { ar: 'إسبريسو إيطالي مركز', en: 'Concentrated Italian espresso', ru: 'Концентрированный итальянский эспрессо' }, price: 180, img: IMG('1497935586351-b67a49e012bf'), badges: [] },
        { id: 'd3', emoji: '☕', name: { ar: 'كابتشينو', en: 'Cappuccino', ru: 'Капучино' }, desc: { ar: 'كابتشينو كريمي بالحليب المحلوب', en: 'Creamy cappuccino with steamed milk', ru: 'Кремовое капучино с паровым молоком' }, price: 260, img: IMG('1504674900247-0877df9cc836'), badges: [] },
        { id: 'd4', emoji: '🍵', name: { ar: 'شاي', en: 'Tea', ru: 'Чай' }, desc: { ar: 'شاي أحمر أو أخضر مع نعناع', en: 'Black or green tea with mint', ru: 'Чёрный или зелёный чай с мятой' }, price: 160, img: IMG('1556679343-c7306c1976ad'), badges: [] },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════
   3. SPECIAL DATA — Chef's Picks, DOTD, Offers
═══════════════════════════════════════════════════════════ */
const CHEFS_PICKS = ['m2', 'g3', 'a7', 's4']; // item IDs marked as chef specials

const DISH_OF_DAY = {
  id: 'm2', // references MENU_DATA item
  emoji: '🥩',
  img: IMG('1414235077428-338989a2e8c0', 600, 400),
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

// Gallery images (food photos from Unsplash)
const GALLERY_ITEMS = [
  { id: 'ga1', emoji: '🥩', img: IMG('1414235077428-338989a2e8c0', 600, 600), label: { ar: 'مندي', en: 'Mandi', ru: 'Манди' } },
  { id: 'ga2', emoji: '🔥', img: IMG('1529042355636-0e759cfe3b6d', 600, 600), label: { ar: 'مشاوي', en: 'Grills', ru: 'Гриль' } },
  { id: 'ga3', emoji: '🫘', img: IMG('1618449407797-5f09ce785ab6', 600, 600), label: { ar: 'حمص', en: 'Hummus', ru: 'Хумус' } },
  { id: 'ga4', emoji: '🍚', img: IMG('1567620832903-9fc6debc209f', 600, 600), label: { ar: 'كبسة', en: 'Kabsa', ru: 'Кабса' } },
  { id: 'ga5', emoji: '🥗', img: IMG('1512621776951-a57ef161980b', 600, 600), label: { ar: 'سلطات', en: 'Salads', ru: 'Салаты' } },
  { id: 'ga6', emoji: '🧆', img: IMG('1583394293544-5dfa4be2c784', 600, 600), label: { ar: 'مقبلات', en: 'Starters', ru: 'Закуски' } },
  { id: 'ga7', emoji: '🍹', img: IMG('1490474418585-ba9bad8fd0ea', 600, 600), label: { ar: 'عصائر', en: 'Juices', ru: 'Соки' } },
  { id: 'ga8', emoji: '☕', img: IMG('1504674900247-0877df9cc836', 600, 600), label: { ar: 'مشروبات', en: 'Drinks', ru: 'Напитки' } },
  { id: 'ga9', emoji: '🍗', img: IMG('1601050690597-df0568f70950', 600, 600), label: { ar: 'دجاج مشوي', en: 'Grilled Chicken', ru: 'Курица' } },
];

/* ═══════════════════════════════════════════════════════════
   4. STATE
═══════════════════════════════════════════════════════════ */
const state = {
  lang: 'ar',
  cart: [],   // [{ id, name, price, emoji, qty }]
};

/* ═══════════════════════════════════════════════════════════
   5. HELPERS
═══════════════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function t(key) {
  return TRANSLATIONS[state.lang]?.[key] ?? TRANSLATIONS.ar[key] ?? key;
}
function loc(obj) {
  return obj?.[state.lang] ?? obj?.ar ?? '';
}
function formatPrice(p) { return p.toLocaleString() + ' ₽'; }

// Find item across all categories by ID
function findItem(id) {
  for (const cat of MENU_DATA.categories) {
    const item = cat.items.find(i => i.id === id);
    if (item) return item;
  }
  return null;
}

// Cart helpers
function getCartItem(id) { return state.cart.find(i => i.id === id); }
function cartTotal() { return state.cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount() { return state.cart.reduce((s, i) => s + i.qty, 0); }

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
   7. I18N — apply translations to DOM
═══════════════════════════════════════════════════════════ */
function applyTranslations() {
  const dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  const lang = state.lang;
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
  document.body.className = `lang-${lang}`;
  document.title = t('page_title');

  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
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
  $$('.cat-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.catId === activeCatId);
  });
  // Scroll tab into view
  const activeBtn = $(`.cat-tab[data-cat-id="${activeCatId}"]`);
  activeBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function scrollToSection(catId) {
  const sec = $(`#sec-${catId}`);
  if (!sec) return;
  const headerH = $('#site-header')?.offsetHeight ?? 108;
  const y = sec.getBoundingClientRect().top + window.scrollY - headerH - 8;
  window.scrollTo({ top: y, behavior: 'smooth' });
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
        <img class="special-img" src="${item.img}" alt="${loc(item.name)}" loading="lazy" onerror="this.style.display='none';this.parentNode.querySelector('.sph')&&(this.parentNode.querySelector('.sph').style.display='flex')">
        <div class="sph card-img-placeholder" style="display:none">${item.emoji}</div>
      </div>
      <div class="special-body">
        <div class="special-chip">⭐ ${t('chefs_pick')}</div>
        <div class="special-name">${loc(item.name)}</div>
        <div class="special-footer">
          <span class="special-price">${formatPrice(item.price)}</span>
          ${renderAddBtn(item)}
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
    <img class="dotd-img" src="${DISH_OF_DAY.img}" alt="${loc(item.name)}" loading="lazy" onerror="this.src='';this.outerHTML='<div class=dotd-img style=display:flex;align-items:center;justify-content:center;font-size:4rem;background:var(--c-bg-3)>${item.emoji}</div>'">
    <div class="dotd-body">
      <div class="dotd-badge">${t('dotd_label')}</div>
      <div class="dotd-name">${loc(item.name)}</div>
      <div class="dotd-desc">${loc(item.desc)}</div>
      <div class="dotd-price">${formatPrice(item.price)}</div>
      <div style="margin-top:10px">${renderAddBtn(item)}</div>
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
    head.innerHTML = `
      <span class="menu-section-icon">${cat.icon}</span>
      <h2 class="menu-section-title" id="cat-h-${cat.id}">${loc(cat.name)}</h2>`;
    sec.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'menu-grid';

    cat.items.forEach(item => {
      const card = buildMenuCard(item);
      grid.appendChild(card);
    });

    sec.appendChild(grid);
    container.appendChild(sec);
  });

  // Observe for fade-up
  observeFadeUp();
}

function buildMenuCard(item) {
  const inCart = getCartItem(item.id);
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
      ? `<img class="card-img" src="${item.img}" alt="${loc(item.name)}" loading="lazy" onerror="this.style.display='none'">
           <div class="card-img-placeholder" style="display:none">${item.emoji}</div>`
      : `<div class="card-img-placeholder">${item.emoji}</div>`}
    </div>
    <div class="card-body">
      <div class="card-name">${loc(item.name)}</div>
      <div class="card-desc">${loc(item.desc)}</div>
      <div class="card-footer">
        <span class="card-price">${formatPrice(item.price)}</span>
        <div class="card-ctrl-wrap">${renderAddBtn(item)}</div>
      </div>
    </div>`;

  // Fix img fallback
  const img = card.querySelector('.card-img');
  const ph = card.querySelector('.card-img-placeholder');
  if (img && ph) {
    img.addEventListener('error', () => { img.style.display = 'none'; ph.style.display = 'flex'; });
  }

  attachCardEvents(card, item);
  return card;
}

// Render the add/qty button HTML
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

// Attach add/qty button events to a card/row container
function attachCardEvents(container, item) {
  container.addEventListener('click', e => {
    const addBtn = e.target.closest('.btn-add');
    const incBtn = e.target.closest('.btn-qty-inc');
    const decBtn = e.target.closest('.btn-qty-dec');

    if (addBtn) {
      addToCart(item);
      return;
    }
    if (incBtn) {
      changeQty(item.id, 1);
      return;
    }
    if (decBtn) {
      changeQty(item.id, -1);
      return;
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   13. CART LOGIC
═══════════════════════════════════════════════════════════ */
function addToCart(item) {
  const existing = getCartItem(item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      emoji: item.emoji,
      qty: 1,
    });
  }
  updateAllCardControls(item.id);
  updateCartUI();
  animateBadge();
  showToast(`${loc(item.name)} ✓`);
}

function changeQty(itemId, delta) {
  const ci = getCartItem(itemId);
  if (!ci) return;
  ci.qty += delta;
  if (ci.qty <= 0) {
    state.cart = state.cart.filter(i => i.id !== itemId);
  }
  updateAllCardControls(itemId);
  updateCartUI();
  animateBadge();
}

// Refresh all card controls (in menu grid) for an item
function updateAllCardControls(itemId) {
  // In menu grid
  $$(`[data-item-id="${itemId}"]`).forEach(btn => {
    const card = btn.closest('.menu-card');
    const specialCard = btn.closest('.special-card-large');
    const dotdCard = btn.closest('.dotd-card');
    const parent = card || specialCard || dotdCard;
    if (!parent) return;
    const wrap = parent.querySelector('.card-ctrl-wrap') || parent.querySelector('.special-footer');
    if (!wrap) return;
    const item = findItem(itemId);
    if (!item) return;

    // Replace button/ctrl
    const oldBtn = wrap.querySelector('.btn-add');
    const oldCtrl = wrap.querySelector('.qty-ctrl');
    const newHTML = renderAddBtn(item);
    if (oldBtn) oldBtn.outerHTML = newHTML;
    if (oldCtrl) oldCtrl.outerHTML = newHTML;
    attachCardEvents(parent, item);
  });

  // Also update dotd and specials "footer" add buttons
  const dotdWrap = $('.dotd-body [style*="margin-top"]');
  if (dotdWrap) {
    const item = findItem(itemId);
    if (item) {
      const btn = dotdWrap.querySelector('.btn-add');
      const ctrl = dotdWrap.querySelector('.qty-ctrl');
      if (btn || ctrl) {
        if (btn) btn.outerHTML = renderAddBtn(item);
        if (ctrl) ctrl.outerHTML = renderAddBtn(item);
        attachCardEvents($('.dotd-card'), item);
      }
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   14. CART UI
═══════════════════════════════════════════════════════════ */
function updateCartUI() {
  const count = cartCount();
  const total = cartTotal();

  // Badges
  $$('#cart-badge, #fc-count').forEach(el => { el.textContent = count; });
  $$('#fc-total').forEach(el => { el.textContent = formatPrice(total); });
  $$('#cart-total').forEach(el => { el.textContent = formatPrice(total); });

  // Floating cart visibility
  const floating = $('#floating-cart');
  floating?.classList.toggle('visible', count > 0);

  // Empty/list toggle
  const emptyEl = $('#cart-empty');
  const listEl = $('#cart-list');
  const footerEl = $('#cart-footer');
  const showBtn = $('#btn-show-order');

  if (emptyEl) emptyEl.style.display = count === 0 ? 'flex' : 'none';
  if (listEl) renderCartList();
  if (showBtn) showBtn.disabled = count === 0;
  if (footerEl) footerEl.style.display = count === 0 ? 'none' : 'flex';
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
      const delta = btn.dataset.action === 'inc' ? 1 : -1;
      changeQty(btn.dataset.id, delta);
    });
    list.appendChild(li);
  });
}

function animateBadge() {
  const badge = $('#cart-badge');
  badge?.classList.remove('bump');
  void badge?.offsetWidth; // reflow
  badge?.classList.add('bump');
}

/* ═══════════════════════════════════════════════════════════
   15. CART PANEL OPEN/CLOSE
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

  // Timestamp
  const ts = $('#order-timestamp');
  if (ts) {
    const now = new Date();
    ts.textContent = now.toLocaleTimeString(state.lang === 'ar' ? 'ar-SA' : state.lang === 'ru' ? 'ru-RU' : 'en-GB',
      { hour: '2-digit', minute: '2-digit' });
  }

  // Items
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
  // Reset all card controls
  MENU_DATA.categories.forEach(cat => cat.items.forEach(item => {
    $$(`[data-item-id="${item.id}"] .qty-ctrl`).forEach(ctrl => {
      ctrl.outerHTML = `<button class="btn-add" data-item-id="${item.id}" aria-label="${t('add_to_cart')}">+</button>`;
    });
  }));
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
           onerror="this.style.display='none';this.parentNode.querySelector('.gallery-emoji-placeholder').style.display='flex'">
      <div class="gallery-emoji-placeholder" style="display:none">${item.emoji}</div>
      <div class="gallery-item-label">${loc(item.label)}</div>`;
    grid.appendChild(div);
  });
}

function openGallery() {
  const overlay = $('#gallery-overlay');
  if (!overlay) return;
  overlay.removeAttribute('hidden');
  renderGallery();
}
function closeGallery() {
  $('#gallery-overlay')?.setAttribute('hidden', '');
}

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
   19. SCROLL OBSERVER
═══════════════════════════════════════════════════════════ */
function observeFadeUp() {
  const els = $$('.fade-up');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

// Track active section in viewport
function observeActiveCat() {
  if (!('IntersectionObserver' in window)) return;
  const secs = $$('.menu-section');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const catId = e.target.id.replace('sec-', '');
        updateActiveCatTab(catId);
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  secs.forEach(s => obs.observe(s));
}

// Header shadow on scroll
function handleHeaderScroll() {
  const header = $('#site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   20. LANGUAGE SWITCH
═══════════════════════════════════════════════════════════ */
function initLangSwitcher() {
  $$('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === state.lang) return;
      state.lang = lang;

      // Update button states
      $$('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
        b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
      });

      // Apply translations
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
  // Cart open
  $('#header-cart-btn')?.addEventListener('click', openCart);
  $('#floating-cart-btn')?.addEventListener('click', openCart);

  // Cart close
  $('#cart-close')?.addEventListener('click', closeCart);
  $('#cart-backdrop')?.addEventListener('click', closeCart);

  // Show order
  $('#btn-show-order')?.addEventListener('click', openOrderSummary);

  // Order close & clear
  $('#order-close')?.addEventListener('click', closeOrderSummary);
  $('#btn-clear-order')?.addEventListener('click', clearOrder);

  // Gallery
  $('#btn-gallery')?.addEventListener('click', openGallery);
  $('#gallery-close')?.addEventListener('click', closeGallery);
  $('#gallery-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeGallery(); });

  // Escape key to close any open overlay
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCart();
      closeGallery();
      closeOrderSummary();
    }
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

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
