/**
 * İzmir ilçeleri ve mahalleleri veritabanı.
 * Müşteri il olarak İzmir'i sabit görür, ilçe seçtiğinde ilgili mahalleler otomatik olarak listelenir.
 */

export interface IzmirDistrict {
  id: string;
  name: string;
  neighborhoods: string[];
  deliveryFee: number; // 0 TL for central, modest for far districts
  isFastDelivery: boolean; // 90 min express available
  estimatedMinutes: string;
  isActive?: boolean; // Bölgenin aktif/açık veya kapalı olma durumu
}

export const IZMIR_DISTRICTS: IzmirDistrict[] = [
  {
    id: 'konak',
    name: 'Konak (Alsancak, Kordon, Çankaya)',
    neighborhoods: [
      'Alsancak',
      'Kültür (Lozan / Montrö)',
      'Göztepe',
      'Güzelyalı',
      'Mithatpaşa',
      'Pasaport',
      'Akdeniz',
      'Ali Çetinkaya',
      'Mimar Sinan',
      'Kahramanlar',
      'Basmane',
      'Çankaya',
      'Eşrefpaşa',
      'Mehmet Ali Akman',
      'Kılıç Reis',
      'Piri Reis',
      'Murat Reis',
      'Turgut Reis',
      'Kemal Reis',
      'Güngör',
      'Çınarlı',
      'Hilal',
      'Halkapınar',
      'Yenişehir',
      'Yağhaneler',
      'Boğaziçi',
      'Gültepe',
      'Kadifekale',
      'Ballıkuyu',
      'Barbaros',
      'Fevzi Paşa',
      'İsmet Kaptan',
      'Saygı',
      'Ferahlı',
      'Zeytinlik'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '60 - 90 dk'
  },
  {
    id: 'karsiyaka',
    name: 'Karşıyaka (Bostanlı, Mavişehir, Çarşı)',
    neighborhoods: [
      'Bostanlı',
      'Mavişehir',
      'Aksoy',
      'Alaybey',
      'Atakent',
      'Bahariye',
      'Bahçelievler',
      'Bahriye Üçok',
      'Cumhuriyet',
      'Dedebaşı',
      'Demirköprü',
      'Donanmacı (Karşıyaka Çarşı)',
      'Fikri Altay',
      'Goncalar',
      'İmbatlı',
      'İnönü',
      'Latife Hanım',
      'Mustafa Kemal',
      'Nergiz',
      'Örnekköy',
      'Sancaklı',
      'Şemikler',
      'Tersane',
      'Tuna',
      'Yalı',
      'Yamanlar',
      'Zübeyde Hanım'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '60 - 90 dk'
  },
  {
    id: 'bornova',
    name: 'Bornova (Küçükpark, Özkanlar, Evka 3)',
    neighborhoods: [
      'Kazımdirik (Küçükpark / Forum / Gediz)',
      'Erzene (Ege Üniversitesi)',
      'Evka 3',
      'Evka 4',
      'Özkanlar',
      'Yeşilova',
      'Rafetpaşa',
      'Atatürk',
      'Mevlana',
      'İnönü',
      'Işıkkent',
      'Doğanlar',
      'Kızılay',
      'Çamdibi',
      'Yıldırım Beyazıt',
      'Ergene',
      'Barbaros',
      'Birlik',
      'Çamkule',
      'Egemenlik',
      'Gökdere',
      'Gürpınar',
      'Işıklar',
      'Karacaoğlan',
      'Kavaklıdere',
      'Koşukavak',
      'Meriç',
      'Merkez',
      'Naldöken',
      'Serintepe',
      'Tuna',
      'Ümit',
      'Yeşilçam',
      'Zafer',
      'Çiçekli',
      'Yakaköy'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '60 - 90 dk'
  },
  {
    id: 'bayrakli',
    name: 'Bayraklı (Manavkuyu, Mansuroğlu, Adalet)',
    neighborhoods: [
      'Manavkuyu',
      'Mansuroğlu',
      'Adalet (Folkart / Yeni Kent Merkezi)',
      'Osmangazi',
      'Postacılar',
      'Soğukkuyu',
      'Tepekule',
      'Turan',
      'Yamanlar',
      'Fuat Edip Baksı',
      'Emek',
      'Onur',
      'Alparslan',
      'Bayraklı Merkez',
      'Cengizhan',
      'Çiçek',
      'Doğançay',
      'Gümüşpala',
      'Körfez',
      'Muhittin Erener',
      'Org. Nafiz Gürman',
      'R. Şevket İnce'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '60 - 90 dk'
  },
  {
    id: 'cigli',
    name: 'Çiğli (Ataşehir, Egekent, Balatçık)',
    neighborhoods: [
      'Ataşehir',
      'Balatçık (Katip Çelebi Üniv.)',
      'Egekent',
      'Evka 5',
      'Evka 2',
      'Evka 6',
      'Maltepe',
      'İnönü',
      'İzkent',
      'Köyiçi',
      'Uğur Mumcu',
      'Küçükçiğli',
      'Harmandalı Gazi Mustafa Kemal',
      'Ahmet Efendi',
      'Aydınlıkevler',
      'Cumhuriyet',
      'Çağdaş',
      'Esentepe',
      'Güzeltepe',
      'Kaklıç',
      'Sasalı (Doğal Yaşam Parkı)',
      'Şirintepe',
      'Yakakent',
      'Yenimahalle'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '75 - 100 dk'
  },
  {
    id: 'buca',
    name: 'Buca (Şirinyer, Buca Koop, Dokuzçeşmeler)',
    neighborhoods: [
      'Şirinyer (Vali Rahmi Bey)',
      'Efeler',
      'Buca Koop',
      'Çamlıkule',
      'Adatepe (Dokuzçeşmeler)',
      'Gaziler',
      'Hürriyet',
      'Yaylacık',
      'Kuruçeşme (Tınaztepe Kampüs)',
      'Yenigün',
      'Menderes',
      'Barış',
      'Yiğitler',
      'Ufuk',
      'Akıncılar',
      'Atatürk',
      'Çamlık',
      'Dicle',
      'Dumlupınar',
      'Fırat',
      'Göksu',
      'Güven',
      'İnkılap',
      'İnönü',
      'İzkent',
      'Karanfil',
      'Kozağaç',
      'Laleli',
      'Murathan',
      'Mustafa Kemal',
      'Seyhan',
      'Şirinkapı',
      'Yeşilbağlar',
      'Yıldız',
      'Zafer'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '75 - 100 dk'
  },
  {
    id: 'balcova',
    name: 'Balçova (Teleferik, İnciraltı, Korutürk)',
    neighborhoods: [
      'Teleferik',
      'Korutürk (Ekonomi Üniv.)',
      'Eğitim',
      'Fevzi Çakmak',
      'İnciraltı',
      'Çetin Emeç',
      'Onur',
      'Bahçelerarası'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '60 - 90 dk'
  },
  {
    id: 'narlidere',
    name: 'Narlıdere (Sahilevleri, Ilıca)',
    neighborhoods: [
      'Sahilevleri',
      'Ilıca (DEÜ Tıp Fak.)',
      'Huzur',
      'Limanreis',
      'Çatalkaya',
      'Yenikale',
      '2. İnönü',
      'Narlı',
      'Altıevler',
      'Atatürk',
      'Çamtepe'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '60 - 90 dk'
  },
  {
    id: 'karabaglar',
    name: 'Karabağlar (Üçkuyular, Poligon, Basın Sitesi)',
    neighborhoods: [
      'Üçkuyular (İstinyePark)',
      'Fahrettin Altay',
      'Basın Sitesi',
      'Bahçelievler',
      'Poligon',
      'Bozyaka',
      'Yeşilyurt',
      'Vatan',
      'Kibar',
      'Refet Bele',
      'Yurdoğlu',
      'Kazım Karabekir',
      'Arap Hasan',
      'Cennetoğlu',
      'Çalıkuşu',
      'Devrim',
      'Doğanay',
      'Esenlik',
      'Esentepe',
      'Esenyalı',
      'Gazi',
      'General Asım Gündüz',
      'General Kazım Özalp',
      'Gülyaka',
      'Günaltay',
      'Limontepe',
      'Maliyeciler',
      'Muammer Akar',
      'Peker',
      'Salih Omurtak',
      'Sarıyer',
      'Sevgi',
      'Tahsin Yazıcı',
      'Uğur Mumcu',
      'Yüzbaşı Şerafettin'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '60 - 90 dk'
  },
  {
    id: 'gaziemir',
    name: 'Gaziemir (Optimum, Aktepe, Sevgi)',
    neighborhoods: [
      'Aktepe',
      'Atıfbey (Gaziemir Merkez)',
      'Beyazevler (Optimum / Fuar İzmir)',
      'Binbaşı Reşatbey',
      'Dokuz Eylül',
      'Emrez',
      'Fatih',
      'Gazi',
      'Gazikent',
      'Hürriyet',
      'Irmak',
      'Menderes',
      'Sevgi',
      'Yeşil Mahalle',
      'Zafer',
      'Sarnıç'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '75 - 100 dk'
  },
  {
    id: 'urla',
    name: 'Urla (İskele, Kalabak, Çamlıçay)',
    neighborhoods: [
      'Urla İskele',
      'Kalabak',
      'Çamlıçay',
      'Zeytinalanı',
      'Hacı İsa',
      'Yenikent',
      'Sırasöğütler',
      'Torasan',
      'Güvendik',
      'Gülbahçe',
      'Özbek',
      'Yağcılar'
    ],
    deliveryFee: 75,
    isFastDelivery: false,
    estimatedMinutes: '120 - 150 dk'
  },
  {
    id: 'guzelbahce',
    name: 'Güzelbahçe (Yalı, Yelki)',
    neighborhoods: [
      'Yalı',
      'Maltepe',
      'Çelebi',
      'Kahramandere',
      'Yelki',
      'Mustafa Kemal Paşa',
      'Küçükkaya'
    ],
    deliveryFee: 0,
    isFastDelivery: true,
    estimatedMinutes: '90 - 120 dk'
  },
  {
    id: 'seferihisar',
    name: 'Seferihisar (Sığacık, Camikebir)',
    neighborhoods: [
      'Sığacık',
      'Camikebir',
      'Hıdırlık',
      'Tepecik',
      'Çolak İbrahim Bey',
      'Turabiye',
      'Ürkmez',
      'Doğanbey'
    ],
    deliveryFee: 90,
    isFastDelivery: false,
    estimatedMinutes: '120 - 180 dk'
  },
  {
    id: 'menemen',
    name: 'Menemen (Ulukent, Seyrek, Koyundere)',
    neighborhoods: [
      'Ulukent',
      'Kasımpaşa',
      'Esatpaşa',
      'Koyundere',
      'Asarlık',
      'Seyrek',
      'İnönü',
      '75. Yıl'
    ],
    deliveryFee: 50,
    isFastDelivery: false,
    estimatedMinutes: '90 - 120 dk'
  },
  {
    id: 'torbali',
    name: 'Torbalı (Ayrancılar, Tepeköy)',
    neighborhoods: [
      'Ayrancılar',
      'Tepeköy',
      'Muratbey',
      'Ertuğrul',
      'Alpkent',
      'Torbalı Merkez',
      'Cumhuriyet'
    ],
    deliveryFee: 70,
    isFastDelivery: false,
    estimatedMinutes: '120 - 150 dk'
  },
  {
    id: 'cesme',
    name: 'Çeşme (Alaçatı, Ilıca, Dalyan)',
    neighborhoods: [
      'Alaçatı',
      'Ilıca',
      'Dalyan',
      'Çiftlik',
      'Reisdere',
      'Ovacık',
      'Musalla',
      'İsmet İnönü'
    ],
    deliveryFee: 150,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'menderes',
    name: 'Menderes (Özdere, Gümüldür)',
    neighborhoods: [
      'Cüneytbey',
      'Kasımpaşa',
      'Görece',
      'Özdere',
      'Gümüldür',
      'Ahmetbeyli',
      'Tekeli',
      'Oğlananası'
    ],
    deliveryFee: 85,
    isFastDelivery: false,
    estimatedMinutes: '120 - 150 dk'
  },
  {
    id: 'kemalpasa',
    name: 'Kemalpaşa (Ulucak, Ören, Bağyurdu)',
    neighborhoods: [
      'Kemalpaşa Merkez (Sekiz Eylül)',
      'Mehmet Akif Ersoy',
      'Ulucak',
      'Ören',
      'Bağyurdu',
      'Armutlu',
      'Yukarı Kızılca',
      'Aşağı Kızılca'
    ],
    deliveryFee: 65,
    isFastDelivery: false,
    estimatedMinutes: '90 - 120 dk'
  },
  {
    id: 'aliaga',
    name: 'Aliağa (Siteler, Yalı)',
    neighborhoods: [
      'Siteler',
      'Yalı',
      'Kazım Dirik',
      'Kurtuluş',
      'Yeni Mahalle',
      'Helvacı',
      'Şakran (Yenişakran)'
    ],
    deliveryFee: 95,
    isFastDelivery: false,
    estimatedMinutes: '120 - 160 dk'
  },
  {
    id: 'foca',
    name: 'Foça (Eski Foça, Yeni Foça)',
    neighborhoods: [
      'Eski Foça (İsmetpaşa)',
      'Fevzipaşa',
      'Yeni Foça (Fatih)',
      'Mustafa Kemal Atatürk',
      'Kozbeyli',
      'Bağarası'
    ],
    deliveryFee: 110,
    isFastDelivery: false,
    estimatedMinutes: '120 - 180 dk'
  },
  {
    id: 'selcuk',
    name: 'Selçuk (Efes, Şirince)',
    neighborhoods: [
      'Cumhuriyet',
      'Zafer',
      '14 Mayıs',
      'İsabey',
      'Şirince',
      'Pamucak',
      'Çamlık'
    ],
    deliveryFee: 120,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'dikili',
    name: 'Dikili (Çandarlı, Salimbey)',
    neighborhoods: [
      'Salimbey',
      'İsmetpaşa',
      'Gazipaşa',
      'Çandarlı',
      'Bademli',
      'Kabakum'
    ],
    deliveryFee: 130,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'bergama',
    name: 'Bergama (Zafer, Ertuğrul)',
    neighborhoods: [
      'İslamsaray',
      'Ertuğrul',
      'Zafer',
      'Maltepe',
      'Atmaca',
      'Gazipaşa',
      'Ayaskent'
    ],
    deliveryFee: 140,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'tire',
    name: 'Tire (Dört Eylül, Fatih)',
    neighborhoods: [
      'İbni Melek',
      'Dört Eylül',
      'Fatih',
      'Atatürk',
      'Cumhuriyet',
      'Yeni Mahalle'
    ],
    deliveryFee: 130,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'odemis',
    name: 'Ödemiş (Gölcük, Birgi)',
    neighborhoods: [
      'Zafer',
      'Umurbey',
      'Akıncılar',
      'Bengisu',
      'Cumhuriyet',
      'Birgi',
      'Gölcük'
    ],
    deliveryFee: 140,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'karaburun',
    name: 'Karaburun (Mordoğan, İskele)',
    neighborhoods: [
      'Mordoğan',
      'İskele',
      'Merkez',
      'Saip',
      'Hasseki'
    ],
    deliveryFee: 150,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'kinik',
    name: 'Kınık (Fatih, Türkcedit)',
    neighborhoods: [
      'Fatih',
      'Türkcedit',
      'Osmaniye',
      'Yeni Mahalle'
    ],
    deliveryFee: 150,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'kiraz',
    name: 'Kiraz (Cumhuriyet, İstiklal)',
    neighborhoods: [
      'Cumhuriyet',
      'İstiklal',
      'Yeni Mahalle'
    ],
    deliveryFee: 150,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  },
  {
    id: 'beydag',
    name: 'Beydağ (Atatürk, Cumhuriyet)',
    neighborhoods: [
      'Atatürk',
      'Cumhuriyet',
      'Beyköy'
    ],
    deliveryFee: 150,
    isFastDelivery: false,
    estimatedMinutes: 'Aynı Gün Özel Sefer'
  }
];

export { getStreetsForDistrictAndNeighborhood } from './izmirStreetDatabase';

export const DELIVERY_TIME_SLOTS = [
  'Hemen / En Hızlı (90 dk içinde ekspres)',
  'Bugün 11:00 - 14:00 (Öğle Arası)',
  'Bugün 14:00 - 17:00 (Öğleden Sonra)',
  'Bugün 17:00 - 20:00 (Akşam Teslimatı)',
  'Bugün 20:00 - 22:30 (Gece Sürprizi)',
  'Yarın 09:30 - 13:00 (Sabah Teslimatı)',
  'Yarın 13:00 - 18:00 (Öğleden Sonra)',
  'Yarın 18:00 - 21:30 (Akşam Teslimatı)',
  'İleri Bir Tarih (Özel Gün / Randevulu)'
];

export const CARD_NOTE_PRESETS = [
  {
    label: 'Sevgiliye & Aşk',
    text: 'Gözlerinin değdiği her yer çiçek açıyor sevgilim. Hayatımın en güzel baharısın, iyi ki varsın!'
  },
  {
    label: 'Doğum Günü',
    text: 'Yeni yaşın sana sağlık, mutluluk ve kalbinden geçen tüm güzellikleri getirsin. Doğum günün kutlu olsun!'
  },
  {
    label: 'Özür Dilerim',
    text: 'Seni kırmak dünyadaki en son isteyeceğim şeydi. Özür dilerim, beni affet lütfen. Seni çok seviyorum.'
  },
  {
    label: 'Yıldönümü',
    text: 'Birlikte geçen her an hayatımın en kıymetli hediyesi. Nice mutlu, huzur dolu, el ele yıllarımıza sevgilim.'
  },
  {
    label: 'Tebrik & Yeni İş',
    text: 'Yeni görevinde ve adımlarında sonsuz başarılar dilerim. Başarılarının daim olması dileğiyle!'
  },
  {
    label: 'Geçmiş Olsun',
    text: 'En kısa zamanda sağlığına kavuşup o neşeli kahkahalarını duymak dileğiyle. Çok geçmiş olsun!'
  }
];
