import React, { useState, useEffect } from 'react';
import { X, FileText, RotateCcw, Truck, ShieldCheck } from 'lucide-react';

export type LegalTab = 'mesafeli_satis' | 'iptal_iade' | 'teslimat' | 'gizlilik';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  initialTab: LegalTab;
  onClose: () => void;
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  initialTab,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs: { id: LegalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'mesafeli_satis', label: 'Mesafeli Satış Sözleşmesi', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'iptal_iade', label: 'İptal & İade Politikası', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: 'teslimat', label: 'Teslimat Bilgileri', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'gizlilik', label: 'Gizlilik & KVKK', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-80 bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-stone-900">
              Velvet Rose · Yasal Bilgilendirme ve Sözleşmeler
            </h2>
            <p className="text-[11px] text-stone-500">
              velvetrose.com.tr · 6502 Sayılı Tüketicinin Korunması Hakkında Kanun Uyarınca
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-stone-200 flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
          {activeTab === 'mesafeli_satis' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
                MESAFELİ SATIŞ SÖZLEŞMESİ
              </h3>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">1. TARAFLAR</h4>
                <p>
                  <strong>SATICI:</strong> Velvet Rose Çiçek Tasarım Atölyesi (Ayhan Yüksel)<br />
                  <strong>Adres:</strong> Gediz Caddesi No: 3/1D Bornova / İZMİR<br />
                  <strong>Telefon:</strong> 0532 513 86 58<br />
                  <strong>E-posta:</strong> velvetroseizmir@gmail.com<br />
                  <strong>Web Sitesi:</strong> https://velvetrose.com.tr
                </p>
                <p className="mt-2">
                  <strong>ALICI:</strong> velvetrose.com.tr internet sitesi üzerinden sipariş veren, ödeme ve teslimat formunda adı, soyadı, telefon numarası, e-posta ve teslimat adresi bilgileri yer alan tüketici.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">2. SÖZLEŞMENİN KONUSU</h4>
                <p>
                  İşbu sözleşmenin konusu, ALICI’nın SATICI’ya ait velvetrose.com.tr internet sitesinden elektronik ortamda siparişini verdiği, nitelikleri ve satış fiyatı sitede belirtilen taze çiçek aranjmanları, buketler ve tamamlayıcı hediyelik ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">3. SÖZLEŞME KONUSU ÜRÜN, FİYAT VE ÖDEME</h4>
                <p>
                  Ürünlerin cinsi, türü, adedi, satış bedeli ve seçilen teslimat bölgesine göre teslimat ücreti sipariş özetinde ve ödeme ekranında KDV dahil toplam tutar olarak gösterilir. Ödemeler PayTR Sanal POS altyapısı üzerinden 256-bit SSL güvencesiyle kredi/banka kartı ile tek çekim veya taksitli olarak ya da Havale/EFT yöntemiyle gerçekleştirilir.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">4. TESLİMAT KOŞULLARI</h4>
                <p>
                  Siparişler, ALICI tarafından seçilen tarih ve saat diliminde, SATICI’nın İzmir Bornova atölyesinde hazırlanarak klimalı özel dağıtım araçları ile İzmir ili içerisindeki aktif teslimat adresine bizzat teslim edilir. Çiçekler canlı ve doğal ürünler olduğundan, mevsimsel koşullara bağlı olarak aranjmanın ana konseptine ve değerine sadık kalınmak kaydıyla yan çiçek ve ambalaj tonlarında küçük doğal farklılıklar bulunabilir.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">5. CAYMA HAKKI VE İSTİSNALARI</h4>
                <p>
                  Mesafeli Sözleşmeler Yönetmeliği’nin 15. maddesinin 1. fıkrasının (c) bendi uyarınca; <strong>çabuk bozulabilen veya son kullanma tarihi geçebilecek malların (taze kesme çiçekler, canlı bitkiler, gıda/çikolata ürünleri)</strong> ve (b) bendi uyarınca tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan ürünlerin teslimine ilişkin sözleşmelerde ALICI’nın cayma hakkı bulunmamaktadır. Ancak hazırlık ve kurye çıkışından önce yapılan iptal talepleri ile ayıplı/hasarlı teslimat durumlarında İptal ve İade Politikası hükümleri uygulanır.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">6. YETKİLİ MAHKEME</h4>
                <p>
                  İşbu sözleşmeden doğabilecek uyuşmazlıklarda Ticaret Bakanlığı tarafından ilan edilen değere kadar İzmir Tüketici Hakem Heyetleri, bu değerin üzerindeki uyuşmazlıklarda ise İzmir Tüketici Mahkemeleri yetkilidir.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'iptal_iade' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
                İPTAL VE İADE POLİTİKASI
              </h3>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">1. SİPARİŞ İPTAL KOŞULLARI</h4>
                <p>
                  Siparişiniz atölyemizde henüz hazırlanmaya başlanmadan ve kuryeye teslim edilmeden önce <strong>0532 513 86 58</strong> numaralı telefon / WhatsApp hattımız veya <strong>velvetroseizmir@gmail.com</strong> adresi üzerinden bizimle iletişime geçerek siparişinizi ücretsiz olarak iptal edebilir veya teslimat tarih/saat değişikliği talep edebilirsiniz.
                </p>
                <p className="mt-2">
                  Çiçeğiniz siparişe özel kesilip tanzim edildikten veya kurye dağıtımına çıktıktan sonra canlı ürün niteliği nedeniyle standart iptal işlemi yapılamamaktadır.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">2. TAZE ÇİÇEK VE İADE İSTİSNASI</h4>
                <p>
                  6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği Madde 15/1-c gereğince, taze kesme çiçekler, canlı saksı bitkileri ve çikolata gibi çabuk bozulabilen ürünlerde teslimat sonrası sebepsiz cayma hakkı ve iade uygulanamamaktadır.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">3. HASARLI, KUSURLU VEYA EKSİK TESLİMAT DURUMU</h4>
                <p>
                  Müşteri memnuniyeti bizim için esastır. Teslim edilen üründe taşıma kaynaklı bir hasar, solma veya sipariş içeriğiyle uyumsuzluk olması halinde, teslimatın yapıldığı gün içerisinde ürünün fotoğrafını <strong>0532 513 86 58</strong> WhatsApp hattımıza veya <strong>velvetroseizmir@gmail.com</strong> adresine iletmeniz yeterlidir. Yapılan inceleme sonrasında talebinize göre:
                </p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1">
                  <li>Aynı gün ücretsiz yeni ürün (telafi gönderimi) yapılır, veya</li>
                  <li>Ödediğiniz tutarın tamamı kesintisiz olarak iade edilir.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">4. ÜCRET İADESİ SÜRECİ</h4>
                <p>
                  Onaylanan iptal ve iade işlemlerinde ödeme tutarı, ödemeyi yaptığınız kredi/banka kartına PayTR altyapısı üzerinden <strong>en geç 3 iş günü</strong> içerisinde iade edilir. Tutarın kartınıza veya banka hesabınıza yansıması bankanızın işlem sürelerine bağlı olarak 2-7 iş günü arasında değişebilir. Havale/EFT ödemelerinde iade, talebinizdeki IBAN hesabına 2 iş günü içinde gönderilir.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'teslimat' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
                TESLİMAT BİLGİLERİ VE KOŞULLARI
              </h3>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">1. TESLİMAT BÖLGESİ</h4>
                <p>
                  Velvet Rose (velvetrose.com.tr), çiçeklerin %100 tazeliğini ve formunu korumak amacıyla kargo firmalarıyla gönderim yapmamaktadır. Tüm siparişler <strong>İzmir Bornova (Gediz Caddesi No: 3/1D)</strong> atölyemizden kendi klimalı özel araçlarımız ve deneyimli çiçek kuryelerimiz ile <strong>yalnızca İzmir ili sınırları içerisindeki aktif ilçelere</strong> teslim edilmektedir.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">2. AYNI GÜN TESLİMAT VE SAAT DİLİMLERİ</h4>
                <p>
                  Haftanın 7 günü (Pazartesi - Pazar) saat <strong>08:30 – 22:00</strong> arasında teslimat yapılmaktadır. Sipariş formunda seçtiğiniz tarih ve saat aralığında (ör. Sabah 09:30-13:00, Öğle 11:00-14:00, Öğleden Sonra 14:00-17:00, Akşam 17:00-20:00) teslimat gerçekleştirilir.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">3. TESLİMAT ÜCRETLERİ</h4>
                <p>
                  İzmir merkez ilçelerine (Bornova, Karşıyaka, Konak, Bayraklı, Buca vb.) teslimat <strong>ücretsizdir</strong>. Çevre ve sahil ilçeleri için mesafeye göre belirlenen güncel teslimat ücreti, sipariş ve ödeme aşamasında ilçe seçimi yaptığınızda şeffaf şekilde toplam tutara yansıtılır.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">4. ALICININ ADRESTE BULUNAMAMASI</h4>
                <p>
                  Alıcının adreste bulunamaması halinde kuryemiz alıcı veya gönderici ile telefonla iletişime geçer. Alıcının veya göndericinin onayı ile çiçek; apartman görevlisine, komşuya, iş yeri güvenliğine veya resepsiyona imza karşılığı teslim edilir ve sipariş sahibine bilgi verilir. Yanlış/eksik adres bildirilmesi durumunda ikinci teslimat yönlendirmesi için ek kurye bedeli uygulanabilir.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'gizlilik' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
                GİZLİLİK POLİTİKASI VE KVKK AYDINLATMA METNİ
              </h3>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">1. VERİ SORUMLUSU</h4>
                <p>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla <strong>Velvet Rose Çiçek Tasarım Atölyesi (Ayhan Yüksel)</strong> tarafından yalnızca siparişinizin hazırlanması, teslimatı ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">2. KART VE ÖDEME GÜVENLİĞİ</h4>
                <p>
                  velvetrose.com.tr üzerinden yapılan kredi kartı ve banka kartı ödemeleri, BDDK lisanslı ödeme kuruluşu <strong>PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş.</strong> altyapısı ve 256-bit SSL şifreleme protokolü üzerinden gerçekleştirilir. Kredi kartı numaranız, son kullanma tarihiniz ve CVV güvenlik kodunuz sistemlerimizde kesinlikle kaydedilmez ve saklanmaz.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">3. KİŞİSEL VERİLERİN PAYLAŞIMI VE HAKLARINIZ</h4>
                <p>
                  Sipariş sırasında paylaştığınız gönderici, alıcı ve teslimat adresi bilgileri üçüncü kişilerle ticari amaçla paylaşılmaz. KVKK’nın 11. maddesi kapsamındaki bilgi talep etme, düzeltme ve silme haklarınız için <strong>velvetroseizmir@gmail.com</strong> adresine e-posta gönderebilirsiniz.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <span className="text-stone-500">
            Velvet Rose · Gediz Cad. No: 3/1D Bornova / İzmir
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
