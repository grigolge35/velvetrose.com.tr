export type FlowerCategory = 
  | 'dogum_gunu' 
  | 'yildonumu' 
  | 'ask_romantik' 
  | 'yeni_is' 
  | 'gecmis_olsun' 
  | 'ozur' 
  | 'icimden_geldi' 
  | 'ozel_tasarim_celenk' 
  | 'guller' 
  | 'orkideler' 
  | 'kutuda' 
  | 'vazo';

export interface FlowerProduct {
  id: string;
  name: string;
  category: FlowerCategory;
  categories?: FlowerCategory[];
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  stemCount?: number;
  height?: string;
  dimensions?: string;
  vaseIncluded: boolean;
  tags: string[];
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isSameDay: boolean;
  rating: number;
  reviewsCount: number;
  hasCampaign?: boolean;
  originalPrice?: number;
  campaignDiscountPercent?: number;
}

export interface ExtraGift {
  id: string;
  name: string;
  category: 'cikolata' | 'pelus' | 'balon' | 'vazo' | 'kart' | 'mum';
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  badge?: string;
}

export interface SelectedGift {
  gift: ExtraGift;
  quantity: number;
}

export interface CartItem {
  cartItemId: string;
  product: FlowerProduct;
  quantity: number;
  selectedGifts: SelectedGift[];
}

export type OrderStatus = 'received' | 'preparing' | 'courier' | 'delivered';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  title: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  items: CartItem[];
  totalAmount: number;
  recipient: {
    name: string;
    phone: string;
    relationship?: string;
  };
  sender: {
    name: string;
    phone: string;
    email: string;
    isAnonymous: boolean;
  };
  deliveryAddress: {
    city: 'İzmir';
    district: string;
    neighborhood: string;
    streetAddress: string;
    buildingNo?: string;
    apartmentNo?: string;
    addressDescription?: string;
  };
  deliveryDate: string;
  deliveryTimeSlot: string;
  cardNote: string;
  cardSenderName: string;
  cardTheme?: 'white' | 'calligraphy' | 'romantic' | 'luxury' | 'botanical' | string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  paymentGateway?: ActivePaymentGateway;
  installment?: number;
}

export type ActivePaymentGateway = 'paytr' | 'ziraat';

export interface PaytrGatewayConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
  installmentEnabled: boolean;
  maxInstallments: number;
}

export interface ZiraatGatewayConfig {
  merchantId: string;
  terminalId: string;
  storeKey: string;
  apiUser: string;
  testMode: boolean;
  installmentEnabled: boolean;
  maxInstallments: number;
}

export interface BankTransferConfig {
  bankName: string;
  accountHolder: string;
  iban: string;
  branchCode: string;
  accountNumber: string;
  fastEnabled: boolean;
  noteInstruction: string;
}

export interface PaymentSettings {
  activeGateway: ActivePaymentGateway;
  paytr: PaytrGatewayConfig;
  ziraat: ZiraatGatewayConfig;
  bankTransfer: BankTransferConfig;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  readTime: string;
  keywords: string[];
  image: string;
}

export type { IzmirDistrict } from '../data/izmirDistricts';
