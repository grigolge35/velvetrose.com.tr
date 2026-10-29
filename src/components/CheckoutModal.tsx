import React, { useState, useMemo, useEffect } from 'react';
import { X, MapPin, Calendar, Clock, Heart, CreditCard, ShieldCheck, Check, ArrowRight, Truck, PenLine, Sparkles, Mail, Eye, RotateCcw, Copy, CheckCheck, Smartphone, Lock, AlertCircle, Building2, Search, ChevronDown, ChevronUp, CheckCircle2, List } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { IZMIR_DISTRICTS, DELIVERY_TIME_SLOTS, CARD_NOTE_PRESETS, getStreetsForDistrictAndNeighborhood } from '../data/izmirDistricts';

export const CheckoutModal: React.FC = () => {
  const { activeModal, setActiveModal, cart, cartTotal, placeOrder, paymentSettings, activeDistricts } = useShop();

  // District state (defaults to bornova if active, or first active district)
  const [selectedDistrictId, setSelectedDistrictId] = useState(() => {
    return activeDistricts.some(d => d.id === 'bornova') ? 'bornova' : (activeDistricts[0]?.id || 'bornova');
  });

  // Ensure selected district is always an active district
  const currentDistrict = useMemo(() => {
    return activeDistricts.find(d => d.id === selectedDistrictId) || activeDistricts[0] || IZMIR_DISTRICTS[0];
  }, [activeDistricts, selectedDistrictId]);

  useEffect(() => {
    if (activeDistricts.length > 0 && !activeDistricts.some(d => d.id === selectedDistrictId)) {
      setSelectedDistrictId(activeDistricts[0].id);
    }
  }, [activeDistricts, selectedDistrictId]);

  const [selectedNeighborhood, setSelectedNeighborhood] = useState(() => {
    return currentDistrict.neighborhoods[0] || 'Kazımdirik (Küçükpark / Forum / Gediz)';
  });

  // Available streets for the selected district and neighborhood (2026 NVİ standartları)
  const availableStreets = useMemo(() => {
    return getStreetsForDistrictAndNeighborhood(selectedDistrictId, selectedNeighborhood);
  }, [selectedDistrictId, selectedNeighborhood]);

  // Prominent / Popular avenues & boulevards in this neighborhood for quick one-click chips
  const popularStreets = useMemo(() => {
    return availableStreets.slice(0, 5);
  }, [availableStreets]);

  // Street picker drawer / popover state
  const [showStreetPicker, setShowStreetPicker] = useState(false);
  const [streetSearchQuery, setStreetSearchQuery] = useState('');
  const [streetCategoryTab, setStreetCategoryTab] = useState<'all' | 'avenues' | 'numbered'>('all');

  // Address fields (defaults to first street: Gediz Caddesi in Kazımdirik)
  const [streetAddress, setStreetAddress] = useState(() => {
    const streets = getStreetsForDistrictAndNeighborhood('bornova', 'Kazımdirik (Küçükpark / Forum / Gediz)');
    return streets[0] || 'Gediz Caddesi (Velvet Rose Atölye No: 3/1D)';
  });
  const [buildingNo, setBuildingNo] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [addressDescription, setAddressDescription] = useState('');

  // Filtered street list inside the interactive street browser
  const filteredStreetsForPicker = useMemo(() => {
    let list = availableStreets;
    if (streetCategoryTab === 'avenues') {
      list = list.filter(s => s.includes('Caddesi') || s.includes('Bulvarı') || s.includes('Meydanı') || s.includes('Yolu') || s.includes('Sitesi') || s.includes('Blokları'));
    } else if (streetCategoryTab === 'numbered') {
      list = list.filter(s => s.includes('Sokak') && !s.includes('Caddesi'));
    }

    if (!streetSearchQuery.trim()) return list;
    const q = streetSearchQuery.toLowerCase().trim();
    return list.filter(s => s.toLowerCase().includes(q));
  }, [availableStreets, streetCategoryTab, streetSearchQuery]);

  // Live autocomplete suggestions when customer is typing in the street input
  const liveAddressSuggestions = useMemo(() => {
    if (!streetAddress || streetAddress.trim().length < 2) return [];
    const q = streetAddress.toLowerCase().trim();
    return availableStreets.filter(s => s.toLowerCase().includes(q) && s.toLowerCase() !== q).slice(0, 6);
  }, [availableStreets, streetAddress]);

  // Delivery timing
  const [deliveryDate, setDeliveryDate] = useState('Bugün');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(DELIVERY_TIME_SLOTS[0]);

  // Recipient info
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [relationship, setRelationship] = useState('Sevgiliye / Eşe');

  // Sender info
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Card / Gift Note state
  const [cardNote, setCardNote] = useState('');
  const [cardSenderName, setCardSenderName] = useState('');
  const [cardTheme, setCardTheme] = useState<string>('white');

  // Payment (Only Credit Card and Bank Transfer / EFT - Kapıda ödeme removed)
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer'>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [installment, setInstallment] = useState<number>(1);
  const [copiedIban, setCopiedIban] = useState<boolean>(false);

  // 3D Secure Simulation Modal
  const [show3DSecureModal, setShow3DSecureModal] = useState<boolean>(false);
  const [smsCode, setSmsCode] = useState<string>('842910');
  const [isProcessing3D, setIsProcessing3D] = useState<boolean>(false);

  // Step wizard
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formError, setFormError] = useState('');

  if (activeModal !== 'checkout') {
    return null;
  }

  // When district changes, update neighborhood and streets
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistId = e.target.value;
    setSelectedDistrictId(newDistId);
    setShowStreetPicker(false);
    setStreetSearchQuery('');
    const newDist = activeDistricts.find(d => d.id === newDistId);
    if (newDist && newDist.neighborhoods.length > 0) {
      const firstNeigh = newDist.neighborhoods[0];
      setSelectedNeighborhood(firstNeigh);
      const streets = getStreetsForDistrictAndNeighborhood(newDistId, firstNeigh);
      setStreetAddress(streets[0] || '');
    }
  };

  // When neighborhood changes, update available streets and pick the first one
  const handleNeighborhoodChange = (newNeigh: string) => {
    setSelectedNeighborhood(newNeigh);
    setShowStreetPicker(false);
    setStreetSearchQuery('');
    const streets = getStreetsForDistrictAndNeighborhood(selectedDistrictId, newNeigh);
    setStreetAddress(streets[0] || '');
  };

  const handleApplyPresetNote = (text: string) => {
    setCardNote(text);
  };

  const deliveryFee = currentDistrict.deliveryFee;
  const grandTotal = cartTotal + deliveryFee;

  const handleNextStep = () => {
    setFormError('');
    if (activeDistricts.length === 0) {
      setFormError('Şu an için aktif teslimat bölgesi bulunmamaktadır. Lütfen bizimle WhatsApp üzerinden iletişime geçiniz.');
      return;
    }
    if (currentStep === 1) {
      if (!selectedNeighborhood || !streetAddress.trim()) {
        setFormError('Lütfen mahalle ve cadde/sokak adres bilgilerini eksiksiz doldurun.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!recipientName.trim() || !recipientPhone.trim() || !senderName.trim() || !senderPhone.trim()) {
        setFormError('Lütfen alıcı ve gönderici ad ve telefon bilgilerini girin.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const executeFinalOrder = () => {
    placeOrder({
      items: cart,
      totalAmount: grandTotal,
      recipient: {
        name: recipientName.trim(),
        phone: recipientPhone.trim(),
        relationship
      },
      sender: {
        name: senderName.trim(),
        phone: senderPhone.trim(),
        email: senderEmail.trim(),
        isAnonymous
      },
      deliveryAddress: {
        city: 'İzmir',
        district: currentDistrict.name,
        neighborhood: selectedNeighborhood,
        streetAddress: streetAddress.trim(),
        buildingNo: buildingNo.trim(),
        apartmentNo: apartmentNo.trim(),
        addressDescription: addressDescription.trim()
      },
      deliveryDate,
      deliveryTimeSlot,
      cardNote: cardNote.trim(),
      cardSenderName: cardSenderName.trim() || (isAnonymous ? 'Gizli Hayran' : senderName.trim()),
      cardTheme,
      paymentMethod,
      paymentGateway: paymentMethod === 'credit_card' ? paymentSettings.activeGateway : undefined,
      installment: paymentMethod === 'credit_card' ? installment : undefined
    });

    // Reset local wizard state
    setShow3DSecureModal(false);
    setIsProcessing3D(false);
    setCurrentStep(1);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cart.length === 0) {
      setFormError('Sepetinizde ürün bulunmuyor.');
      return;
    }

    if (paymentMethod === 'credit_card') {
      // Light validation: if user typed something incomplete
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length > 0 && cleanCard.length < 15) {
        setFormError('Lütfen geçerli bir 16 haneli kredi/banka kartı numarası girin.');
        return;
      }
      setShow3DSecureModal(true);
      return;
    }

    // Bank transfer
    executeFinalOrder();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/velvet-rose-premium-logo_a1210b70.png"
              alt="Velvet Rose"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain hidden sm:block max-w-[160px] sm:max-w-[200px]"
            />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-0.5">
                <Truck className="w-3.5 h-3.5 text-rose-600" />
                <span>Velvet Rose Güvenli Sipariş</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-medium text-stone-900">
                Teslimat & Sipariş Formu
              </h2>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Wizard Progress Bar */}
        <div className="grid grid-cols-3 border-b border-stone-200 text-xs font-medium bg-stone-100/50">
          <div
            className={`py-2.5 px-4 text-center border-r border-stone-200 transition-colors ${
              currentStep === 1 ? 'bg-white text-rose-700 font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            1. İzmir Adres & Saat
          </div>
          <div
            className={`py-2.5 px-4 text-center border-r border-stone-200 transition-colors ${
              currentStep === 2 ? 'bg-white text-rose-700 font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            2. Alıcı & Hediye Kartı Notu
          </div>
          <div
            className={`py-2.5 px-4 text-center transition-colors ${
              currentStep === 3 ? 'bg-white text-rose-700 font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            3. Ödeme & Onay
          </div>
        </div>

        {/* Error notification if any */}
        {formError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800">
            {formError}
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: IZMIR ADRES & ZAMAN */}
          {currentStep === 1 && (
            <div className="space-y-5">
              
              {/* Province / City: Fixed to İzmir */}
              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold block">
                    Teslimat İli (Sabit Bölge)
                  </span>
                  <div className="text-base font-bold text-stone-900 flex items-center gap-2 mt-0.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>İzmir (Tüm İlçeler ve Mahalleler)</span>
                  </div>
                </div>
                <span className="text-xs bg-white text-rose-800 font-semibold px-2.5 py-1 rounded-md border border-rose-200">
                  Sabit İl
                </span>
              </div>

              {/* District & Dynamic Neighborhood Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* District Select */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>İlçe Seçiniz *</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {activeDistricts.length} Aktif Bölge
                    </span>
                  </label>
                  {activeDistricts.length > 0 ? (
                    <select
                      value={currentDistrict.id}
                      onChange={handleDistrictChange}
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600 cursor-pointer"
                    >
                      {activeDistricts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} {d.deliveryFee === 0 ? '(Ücretsiz)' : `(+${d.deliveryFee} ₺)`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 text-red-700 font-medium">
                      Aktif teslimat ilçesi bulunmamaktadır.
                    </div>
                  )}
                </div>

                {/* Dynamic Neighborhood Select */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                    <span>Mahalle Seçiniz *</span>
                    <span className="text-[10px] text-stone-400 font-normal">({currentDistrict.neighborhoods.length} Mahalle)</span>
                  </label>
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => handleNeighborhoodChange(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600 cursor-pointer"
                  >
                    {currentDistrict.neighborhoods.map((n) => (
                      <option key={n} value={n}>
                        {n} Mahallesi
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Selectable Street & Avenue (2026 Sokak & Cadde Seçimi - Eksiksiz & Seçmeli) */}
              <div className="p-4 bg-stone-50/90 border border-stone-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-200/80 pb-2">
                  <label className="block text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Cadde / Sokak / Bulvar Seçiniz *</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      ({selectedNeighborhood} · {availableStreets.length} Cadde/Sokak)
                    </span>
                  </label>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>2026 Tüm Mahalle ve Sokaklar Eksiksiz</span>
                  </span>
                </div>

                {/* Primary Street Combobox & Direct Typing Input */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        list="izmir-street-datalist"
                        required
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="Cadde, bulvar veya sokak no yazın ya da listeden seçin... (Örn: Latife Hanım, 7412, Gediz)"
                        className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg pl-9 pr-9 py-2.5 text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600 shadow-2xs"
                      />
                      <MapPin className="w-4 h-4 text-rose-600 absolute left-3 top-3 pointer-events-none" />
                      
                      {streetAddress && (
                        <button
                          type="button"
                          onClick={() => setStreetAddress('')}
                          className="text-stone-400 hover:text-stone-700 text-xs font-semibold absolute right-3 top-2.5 p-1 hover:bg-stone-100 rounded-md transition-colors"
                          title="Temizle"
                        >
                          ✕
                        </button>
                      )}

                      {/* Native HTML5 Datalist for automatic mobile & browser autocomplete */}
                      <datalist id="izmir-street-datalist">
                        {availableStreets.map((street) => (
                          <option key={street} value={street} />
                        ))}
                      </datalist>
                    </div>

                    {/* Toggle Full Street Explorer Button */}
                    <button
                      type="button"
                      onClick={() => setShowStreetPicker(!showStreetPicker)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                        showStreetPicker
                          ? 'bg-rose-700 text-white border-rose-700 ring-2 ring-rose-200'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>{showStreetPicker ? 'Listeyi Kapat' : 'Tüm Sokakları Gör'}</span>
                      {showStreetPicker ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* Live Suggestions Dropdown (when customer starts typing) */}
                  {liveAddressSuggestions.length > 0 && !showStreetPicker && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-stone-200 rounded-xl shadow-lg z-20 overflow-hidden divide-y divide-stone-100 animate-in fade-in duration-150">
                      <div className="px-3 py-1.5 bg-stone-50 text-[11px] font-semibold text-stone-500 flex items-center justify-between">
                        <span>Eşleşen Sokaklar / Caddeler:</span>
                        <span className="text-[10px] text-stone-400">Tıklayıp Seçin</span>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {liveAddressSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => setStreetAddress(suggestion)}
                            className="w-full text-left px-3.5 py-2 text-xs text-stone-800 hover:bg-rose-50 hover:text-rose-900 transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-rose-600">📍</span>
                              <span className="font-medium group-hover:font-semibold">{suggestion}</span>
                            </span>
                            <span className="text-[10px] text-stone-400 group-hover:text-rose-600 font-semibold">
                              Seç →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Selection Chips for Prominent Neighborhood Avenues */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-600" />
                      <span>Bu Mahallenin Ana Caddeleri & Bulvarları:</span>
                    </span>
                    <span className="text-[10px] text-stone-400">Tek tıkla seçin</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {popularStreets.map((street) => (
                      <button
                        key={street}
                        type="button"
                        onClick={() => setStreetAddress(street)}
                        className={`px-2.5 py-1 text-[11px] rounded-lg whitespace-nowrap transition-all border cursor-pointer ${
                          streetAddress === street
                            ? 'bg-rose-100/80 text-rose-900 border-rose-400 font-bold ring-1 ring-rose-400'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-stone-300 font-medium'
                        }`}
                      >
                        📍 {street}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expandable Full Street Explorer Panel */}
                {showStreetPicker && (
                  <div className="p-3 bg-white border border-rose-200 rounded-xl shadow-xs space-y-3 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900">
                          {selectedNeighborhood} Mahallesi Sokak & Cadde Rehberi
                        </span>
                        <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          {availableStreets.length} Toplam
                        </span>
                      </div>

                      {/* Filter Tabs */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setStreetCategoryTab('all')}
                          className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                            streetCategoryTab === 'all'
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          Tümü ({availableStreets.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStreetCategoryTab('avenues')}
                          className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                            streetCategoryTab === 'avenues'
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          🌟 Caddeler & Bulvarlar
                        </button>
                        <button
                          type="button"
                          onClick={() => setStreetCategoryTab('numbered')}
                          className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                            streetCategoryTab === 'numbered'
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          📍 Numaralı Sokaklar
                        </button>
                      </div>
                    </div>

                    {/* Filter search within picker */}
                    <div className="relative">
                      <input
                        type="text"
                        value={streetSearchQuery}
                        onChange={(e) => setStreetSearchQuery(e.target.value)}
                        placeholder="Sokak no veya cadde adına göre süz... (Örn: 7412, Zübeyde, Gediz)"
                        className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
                    </div>

                    {/* Street Grid */}
                    <div className="max-h-56 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 p-1 bg-stone-50/50 rounded-lg border border-stone-200/70">
                      {filteredStreetsForPicker.length > 0 ? (
                        filteredStreetsForPicker.map((street) => {
                          const isSelected = streetAddress === street;
                          return (
                            <button
                              key={street}
                              type="button"
                              onClick={() => {
                                setStreetAddress(street);
                                setShowStreetPicker(false);
                              }}
                              className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer border ${
                                isSelected
                                  ? 'bg-rose-700 text-white border-rose-700 font-bold shadow-xs'
                                  : 'bg-white hover:bg-rose-50 text-stone-800 hover:text-rose-900 border-stone-200 hover:border-rose-300'
                              }`}
                            >
                              <span className="truncate pr-1">{street}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-6 text-center text-stone-500 text-xs">
                          <p>Aramanızla eşleşen sokak bulunamadı.</p>
                          <p className="text-[11px] text-stone-400 mt-1">
                            Dilerseniz özel adresinizi doğrudan yukarıdaki metin kutusuna yazabilirsiniz.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                      <span>💡 Listede olmayan özel bir site, rezidans veya blok adı varsa yukarıdaki kutuya doğrudan yazabilirsiniz.</span>
                      <button
                        type="button"
                        onClick={() => setShowStreetPicker(false)}
                        className="text-rose-700 hover:text-rose-900 font-semibold cursor-pointer shrink-0 ml-2"
                      >
                        Tamam / Kapat
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Building & Apartment details */}
              <div className="space-y-3">

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Bina / Dış Kapı No
                    </label>
                    <input
                      type="text"
                      value={buildingNo}
                      onChange={(e) => setBuildingNo(e.target.value)}
                      placeholder="Örn: 24"
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      İç Kapı / Daire No
                    </label>
                    <input
                      type="text"
                      value={apartmentNo}
                      onChange={(e) => setApartmentNo(e.target.value)}
                      placeholder="Örn: 5"
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Kuryemiz İçin Adres Tarifi / Not
                  </label>
                  <input
                    type="text"
                    value={addressDescription}
                    onChange={(e) => setAddressDescription(e.target.value)}
                    placeholder="Örn: Tramvay durağı arkası, güvenliğe teslim edilebilir."
                    className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                  />
                </div>
              </div>

              {/* Delivery Timing */}
              <div className="pt-3 border-t border-stone-200">
                <h4 className="text-xs font-semibold text-stone-800 mb-2.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-700" />
                  <span>Teslimat Tarihi ve Saat Dilimi</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Tarih
                    </label>
                    <select
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                    >
                      <option value="Bugün">Bugün (Aynı Gün Teslim)</option>
                      <option value="Yarın">Yarın</option>
                      <option value="Haftasonu">Haftasonu Randevulu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Saat Aralığı
                    </label>
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                    >
                      {DELIVERY_TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: RECIPIENT, SENDER & CARD NOTE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              
              {/* Recipient details */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>Çiçeği Teslim Alacak Kişi (Alıcı)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Alıcı Adı Soyadı *
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Örn: Ayşe Demir"
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Alıcı Cep Telefonu *
                    </label>
                    <input
                      type="tel"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="0532 000 00 00"
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* Sender details */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Siparişi Veren Kişi (Gönderici)
                  </h4>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-rose-800 font-semibold">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-rose-700 focus:ring-rose-600"
                    />
                    <span>İsmim Gizli Kalsın (Anonim)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Örn: Can Yılmaz"
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Telefonunuz (Takip SMS'i) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="0542 000 00 00"
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      E-Posta Adresiniz
                    </label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="can@example.com"
                      className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* GIFT NOTE (HEDİYE KARTI NOTU) SECTION */}
              <div className="bg-white rounded-2xl border-2 border-rose-200/80 p-5 shadow-xs space-y-4">
                
                {/* Header with Icon and Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                        <PenLine className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 tracking-tight">
                        Hediye Kartı Notu <span className="text-rose-700 font-sans font-semibold text-xs">(Gift Note)</span>
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Ücretsiz Özel Baskı
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Çiçek teslimatınızla birlikte zarif bir zarf içinde alıcıya teslim edilecek kişisel mesajınız.
                    </p>
                  </div>

                  {cardNote && (
                    <button
                      type="button"
                      onClick={() => setCardNote('')}
                      className="text-[11px] text-stone-400 hover:text-rose-600 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Notu Temizle</span>
                    </button>
                  )}
                </div>

                {/* 1. Quick Occasion Note Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-600" />
                      <span>İlham Alın (Hazır Kart Mesajları):</span>
                    </span>
                    <span className="text-[10px] text-stone-400">Tek tıkla ekleyin, dilediğiniz gibi düzenleyin</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {CARD_NOTE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleApplyPresetNote(preset.text)}
                        className="px-2.5 py-1.5 text-[11px] font-medium bg-stone-100 hover:bg-rose-50 hover:text-rose-800 text-stone-700 rounded-lg whitespace-nowrap transition-all border border-stone-200/80 hover:border-rose-300 cursor-pointer"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Main Gift Note Text Area */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="gift-note-textarea" className="block text-xs font-bold text-stone-800">
                      Kişisel Hediye Mesajınız / Gift Note Mesajı *
                    </label>
                    <span className={`text-[11px] font-mono tabular-nums ${cardNote.length > 300 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                      {cardNote.length} / 350 karakter
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      id="gift-note-textarea"
                      rows={4}
                      maxLength={350}
                      value={cardNote}
                      onChange={(e) => setCardNote(e.target.value)}
                      placeholder="Sevdiklerinize hislerinizi anlatacak anlamlı bir hediye notu yazın... (Örn: Gözlerinin değdiği her yer çiçek açıyor sevgilim. Hayatımın en güzel baharısın, iyi ki varsın!)"
                      className="w-full text-xs sm:text-sm bg-stone-50/70 border border-stone-300 rounded-xl p-3.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white transition-all leading-relaxed placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* 3. Card Signature & Card Theme Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
                  
                  {/* Signature on Card */}
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Karta Basılacak İmza / İsim
                    </label>
                    <input
                      type="text"
                      value={cardSenderName}
                      onChange={(e) => setCardSenderName(e.target.value)}
                      placeholder={isAnonymous ? 'Gizli kalacak (İmza basılmaz)' : `Örn: ${senderName || 'Can Y.'}`}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600 focus:bg-white"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Boş bırakılırsa gönderici adınız kullanılır.
                    </span>
                  </div>

                  {/* Physical Card Paper Style */}
                  <div className="sm:col-span-7">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Basılacak Kart Teması & Zarf
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/80">
                      <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 shadow-2xs flex items-center justify-center text-sm shrink-0">
                        ✉️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">Tek Tip Standart Beyaz Normal Kart & Zarf</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Standart
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                          Tüm siparişlerde lüks dokulu beyaz karton ve beyaz zarf kullanılır. Mesaj kartınızın sol alt köşesinde Velvet Rose ibaresi yer alır.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 4. Live Physical Greeting Card Mockup Preview */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-rose-600" />
                      <span>Fiziksel Kart Baskı Önizlemesi (Physical Card Preview)</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      Standart Beyaz Kart
                    </span>
                  </div>

                  {/* Standard Crisp White Physical Card */}
                  <div className="rounded-xl p-5 border border-stone-200 bg-white text-stone-900 shadow-xs relative overflow-hidden">
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3 text-xs">
                      <span className="font-semibold tracking-wider uppercase text-[10px] text-stone-400">
                        Hediye Mesaj Kartı
                      </span>
                      <span className="text-stone-600 font-medium text-xs">
                        {recipientName ? `Kime: ${recipientName}` : 'Kime: Özel Biri'}
                      </span>
                    </div>

                    {/* Card Body text */}
                    <p
                      className={`text-xs sm:text-sm leading-relaxed min-h-[52px] text-stone-800 ${
                        cardNote ? 'font-serif italic' : 'text-stone-400 font-sans not-italic'
                      }`}
                    >
                      {cardNote ? (
                        `"${cardNote}"`
                      ) : (
                        '(Yukarıdaki metin alanına hediye notunuzu yazdığınızda burada basılacak kart şeklinde anlık önizleme görünecektir...)'
                      )}
                    </p>

                    {/* Card Footer: Sol alt köşede Velvet Rose, sağ alt köşede imza */}
                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-xs sm:text-[13px] tracking-wider text-rose-900">
                          Velvet Rose
                        </span>
                        <span className="text-[9px] text-stone-400 uppercase tracking-widest hidden sm:inline">
                          • Çiçek Tasarım Atölyesi
                        </span>
                      </div>
                      <span className="font-serif font-semibold italic text-stone-800 text-xs sm:text-sm">
                        — {cardSenderName || (isAnonymous ? 'Gizli Hayran' : senderName || 'Sevgilerimle')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: PAYMENT & SUMMARY */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-2.5">
                  Ödeme Yöntemini Seçiniz *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Credit Card / Sanal POS */}
                  <label
                    className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-rose-700 bg-rose-50/50 ring-2 ring-rose-700/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-rose-700" />
                        <span className="text-xs font-bold text-stone-900">Kredi / Banka Kartı</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className="text-rose-700 focus:ring-rose-600"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-stone-100 text-stone-800">
                        {paymentSettings.activeGateway === 'paytr' ? 'PayTR Sanal POS' : 'Ziraat Bankası POS'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">3D Secure 2.0</span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1">
                      Peşin veya Taksitli Güvenli Ödeme
                    </span>
                  </label>

                  {/* Bank Transfer / FAST */}
                  <label
                    className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-rose-700 bg-rose-50/50 ring-2 ring-rose-700/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-700" />
                        <span className="text-xs font-bold text-stone-900">Havale / FAST / EFT</span>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="text-rose-700 focus:ring-rose-600"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        FAST 7/24
                      </span>
                      <span className="text-[10px] text-stone-600 font-medium">Anında Hesap Onayı</span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1">
                      Ziraat Bankası IBAN ile Transfer
                    </span>
                  </label>

                </div>
              </div>

              {/* CREDIT CARD DETAILS & ACTIVE GATEWAY BRANDING */}
              {paymentMethod === 'credit_card' && (
                <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  
                  {/* Gateway Header Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2.5">
                      {paymentSettings.activeGateway === 'paytr' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-black tracking-tight text-blue-900 font-sans">
                            Pay<span className="text-cyan-600">TR</span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            Sanal POS
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black tracking-tight text-red-700 font-sans">
                            T.C. Ziraat Bankası
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                            VPOD POS
                          </span>
                        </div>
                      )}
                      <span className="text-stone-300">|</span>
                      <span className="text-xs font-semibold text-stone-700">3D Secure Doğrulama</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>256-Bit SSL Şifreli Ağ Geçidi</span>
                    </div>
                  </div>

                  {/* Test Mode Notification if enabled in admin */}
                  {((paymentSettings.activeGateway === 'paytr' && paymentSettings.paytr.testMode) ||
                    (paymentSettings.activeGateway === 'ziraat' && paymentSettings.ziraat.testMode)) && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-medium">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Test Modu Devrede:</strong> {paymentSettings.activeGateway === 'paytr' ? 'PayTR Test API' : 'Ziraat VPOD Test'} modu etkindir. Kartınızdan gerçek çekim yapılmaz.
                      </span>
                    </div>
                  )}

                  {/* Installment Selector (Taksit Seçenekleri) */}
                  {((paymentSettings.activeGateway === 'paytr' && paymentSettings.paytr.installmentEnabled) ||
                    (paymentSettings.activeGateway === 'ziraat' && paymentSettings.ziraat.installmentEnabled)) && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-stone-800">
                          Taksit Seçimi <span className="text-stone-400 font-normal">(Vade farksız taksit avantajı)</span>
                        </label>
                        <span className="text-[10px] text-stone-500">Tüm kartlara taksit uygulanabilir</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { count: 1, label: 'Tek Çekim' },
                          { count: 2, label: '2 Taksit' },
                          { count: 3, label: '3 Taksit' },
                          { count: 6, label: '6 Taksit' },
                        ].map((opt) => {
                          const perMonth = Math.round(grandTotal / opt.count);
                          return (
                            <button
                              key={opt.count}
                              type="button"
                              onClick={() => setInstallment(opt.count)}
                              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                                installment === opt.count
                                  ? 'bg-rose-50/80 border-rose-600 ring-1 ring-rose-600 text-rose-950 font-bold'
                                  : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                              }`}
                            >
                              <div className="text-xs font-bold">{opt.label}</div>
                              <div className="text-[11px] text-stone-600 mt-0.5 tabular-nums">
                                {opt.count === 1 ? `${grandTotal.toLocaleString('tr-TR')} ₺` : `${opt.count} x ${perMonth.toLocaleString('tr-TR')} ₺`}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Card Form Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Kart Üzerindeki İsim Soyisim *
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Selin Yılmaz"
                        value={cardHolder || senderName}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Kart Numarası *
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          // Format 16 digits into blocks of 4
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
                          setCardNumber(formatted);
                        }}
                        placeholder="•••• •••• •••• •••• (Örn: 5400 0000 0000 0000)"
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Son Kullanma Tarihi (AA/YY) *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (val.length >= 3) {
                              val = `${val.slice(0, 2)}/${val.slice(2)}`;
                            }
                            setCardExpiry(val);
                          }}
                          placeholder="12/28"
                          className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-rose-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Güvenlik Kodu (CVC/CVV) *
                        </label>
                        <input
                          type="text"
                          maxLength={3}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          placeholder="385"
                          className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-rose-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accepted Card Schemes Strip */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-200">
                    <span className="font-medium">Kabul Edilen Kartlar:</span>
                    <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-stone-700">
                      <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200">Troy</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200">Visa</span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200">MasterCard</span>
                    </div>
                  </div>

                </div>
              )}

              {/* BANK TRANSFER (HAVALE / FAST / EFT) DETAILS */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 sm:p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-700" />
                      <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                        {paymentSettings.bankTransfer.bankName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      FAST 7/24 Aktif
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-stone-700">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Hesap Sahibi / Firma Unvanı:</span>
                      <span className="font-bold text-stone-900">{paymentSettings.bankTransfer.accountHolder}</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">IBAN Numarası:</span>
                        <span className="font-mono font-bold text-sm text-stone-900 tracking-wider">
                          {paymentSettings.bankTransfer.iban}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(paymentSettings.bankTransfer.iban.replace(/\s+/g, ''));
                          setCopiedIban(true);
                          setTimeout(() => setCopiedIban(false), 2500);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        {copiedIban ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIban ? 'IBAN Kopyalandı!' : 'IBAN Kopyala'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                      <div>
                        <span className="text-stone-400 block">Şube:</span>
                        <span className="font-semibold text-stone-800">{paymentSettings.bankTransfer.branchCode}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Hesap No:</span>
                        <span className="font-semibold text-stone-800">{paymentSettings.bankTransfer.accountNumber}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-100/60 rounded-lg text-blue-900 text-xs leading-relaxed border border-blue-200">
                      ℹ️ <strong>Önemli:</strong> {paymentSettings.bankTransfer.noteInstruction}
                    </div>
                  </div>
                </div>
              )}

              {/* Gift Note Confirmation Summary in Step 3 */}
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-rose-700" />
                    <span>Basılacak Hediye Kartı Notu (Gift Note)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-rose-700 hover:text-rose-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <PenLine className="w-3 h-3" />
                    <span>Düzenle</span>
                  </button>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Standart Beyaz Kart & Zarf</span>
                    <span>{recipientName ? `Alıcı: ${recipientName}` : ''}</span>
                  </div>
                  <p className="italic text-stone-800 font-serif leading-relaxed">
                    {cardNote ? `"${cardNote}"` : '(Hediye notu eklenmedi - boş kart gönderilecek)'}
                  </p>
                  <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="font-serif font-bold tracking-wider text-rose-900">
                      Velvet Rose
                    </span>
                    <span className="font-serif italic font-semibold text-stone-800">
                      — {cardSenderName || (isAnonymous ? 'Gizli Hayran' : senderName || 'İmzasız')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Recap summary table */}
              <div className="p-4 bg-stone-100/70 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Teslimat Adresi:</span>
                  <span className="font-semibold text-stone-900 text-right">
                    İzmir, {currentDistrict.name} · {selectedNeighborhood} Mah.
                    <br />
                    <span className="text-stone-700 font-normal text-[11px]">
                      📍 {streetAddress} {buildingNo ? `No: ${buildingNo}` : ''} {apartmentNo ? `D: ${apartmentNo}` : ''}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Alıcı:</span>
                  <span className="font-semibold text-stone-900">{recipientName || 'Belirtilmedi'}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Zamanlama:</span>
                  <span className="font-semibold text-stone-900">{deliveryDate} - {deliveryTimeSlot}</span>
                </div>
                <div className="flex justify-between text-stone-600 pt-2 border-t border-stone-200">
                  <span>Çiçek & Hediye Toplamı:</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {cartTotal.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>İlçe Teslimat Bedeli:</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {deliveryFee === 0 ? 'Ücretsiz (0 ₺)' : `+${deliveryFee.toLocaleString('tr-TR')} ₺`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-300">
                  <span>Ödenecek Toplam Tutar:</span>
                  <span className="text-base text-rose-800 tabular-nums">
                    {grandTotal.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Wizard Navigation Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Geri Dön
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Sonraki Adım</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitOrder}
              className="flex items-center gap-2 px-7 py-3 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {paymentMethod === 'credit_card'
                  ? (paymentSettings.activeGateway === 'paytr' ? 'PayTR 3D Secure ile Öde' : 'Ziraat 3D Secure ile Öde')
                  : 'Siparişi Onayla & Takibe Başla'}
              </span>
            </button>
          )}
        </div>

      </div>

      {/* 3D SECURE VERIFICATION MODAL OVERLAY (FOR PAYTR & ZIRAAT BANKASI SANAL POS) */}
      {show3DSecureModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D Secure Gateway Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              paymentSettings.activeGateway === 'paytr'
                ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white'
                : 'bg-gradient-to-r from-red-800 via-red-700 to-rose-900 text-white'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <span>
                      {paymentSettings.activeGateway === 'paytr' ? 'PayTR 3D Secure v2' : 'Ziraat Bankası 3D Secure'}
                    </span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                      BKM Express
                    </span>
                  </div>
                  <div className="text-[11px] opacity-80">
                    Banka Güvenli Kimlik Doğrulama Servisi
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShow3DSecureModal(false)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3D Secure Content */}
            <div className="p-5 space-y-4 text-xs">
              
              {/* Transaction Summary Card */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Üye İşyeri:</span>
                  <span className="font-semibold text-stone-900">Velvet Rose Çiçekçilik</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">İşlem Tutarı:</span>
                  <span className="font-bold text-rose-800 text-sm tabular-nums">
                    {grandTotal.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Ödeme Şekli:</span>
                  <span className="font-medium text-stone-900">
                    {installment === 1 ? 'Tek Çekim (Peşin)' : `${installment} Taksit (${Math.round(grandTotal / installment).toLocaleString('tr-TR')} ₺/ay)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Kart Numarası:</span>
                  <span className="font-mono text-stone-800">
                    •••• •••• •••• {cardNumber.replace(/\s+/g, '').slice(-4) || '5824'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Gönderilen Numara:</span>
                  <span className="font-mono text-stone-800">
                    05** *** **{senderPhone.replace(/\D/g, '').slice(-2) || '42'}
                  </span>
                </div>
              </div>

              {/* SMS Code Verification Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                    <span>SMS Doğrulama Kodu</span>
                  </label>
                  <span className="text-[11px] font-mono text-rose-700 font-semibold">
                    Kalan Süre: 02:45
                  </span>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6 Haneli Kod (Örn: 842910)"
                  className="w-full text-center text-lg tracking-widest font-mono font-bold bg-stone-50 border-2 border-stone-300 rounded-xl p-2.5 text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-200"
                />

                <p className="text-[11px] text-stone-500 text-center">
                  * Test ortamında doğrulama kodu otomatik doldurulmuştur.
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {paymentSettings.activeGateway === 'paytr'
                    ? 'PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş. Lisanslı'
                    : 'T.C. Ziraat Bankası A.Ş. Güvenli Sanal POS'}
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={isProcessing3D}
                  onClick={() => {
                    setIsProcessing3D(true);
                    setTimeout(() => {
                      executeFinalOrder();
                    }, 1000);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentSettings.activeGateway === 'paytr'
                      ? 'bg-blue-800 hover:bg-blue-900'
                      : 'bg-red-700 hover:bg-red-800'
                  }`}
                >
                  {isProcessing3D ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Banka Onayı Alınıyor...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ödemeyi Doğrula ve Siparişi Tamamla</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isProcessing3D}
                  onClick={() => setShow3DSecureModal(false)}
                  className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
                >
                  İptal Et ve Geri Dön
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
