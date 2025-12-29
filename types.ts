
export enum UserRole {
  WISATAWAN = 'WISATAWAN',
  PELAKU_USAHA = 'PELAKU_USAHA',
  ADMIN_DINAS = 'ADMIN_DINAS',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum DinasName {
  KOPERASI_UKM = 'Dinas Koperasi dan UKM DIY',
  PARIWISATA = 'Dinas Pariwisata DIY',
  PERHUBUNGAN = 'Dinas Perhubungan DIY',
  KEBUDAYAAN = 'Dinas Kebudayaan DIY',
  KOMINFO = 'Dinas Komunikasi dan Informatika DIY'
}

export type Category = 
  | 'Oleh-Oleh' 
  | 'Penginapan' 
  | 'Wisata' 
  | 'Kuliner' 
  | 'Parkir' 
  | 'Tour' 
  | 'Transportasi Tradisional' 
  | 'Transportasi Modern' 
  | 'Sewa Kendaraan' 
  | 'Museum' 
  | 'Event';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  subCategory: string;
  dinas: DinasName;
  imageUrl: string;
  location: string;
  rating: number;
  isApproved: boolean;
  status: 'PENDING' | 'APPROVED' | 'DISAPPROVED' | 'CORRECTION';
  ownerId: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  dinasAffiliation?: DinasName;
}

export interface Transaction {
  id: string;
  clientId: string;
  productId: string;
  transactionNo: string;
  location: string;
  time: string;
  amount: number;
  status: 'WAITING' | 'PAID';
  paymentMethod?: 'QRIS' | 'VA' | 'TRANSFER';
}
