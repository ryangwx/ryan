
import { Product, DinasName } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bakpia Pathok 25 Premium',
    description: 'Bakpia legendaris dengan isian kacang hijau kupas lembut.',
    price: 45000,
    category: 'Oleh-Oleh',
    subCategory: 'Snack',
    dinas: DinasName.KOPERASI_UKM,
    imageUrl: 'https://picsum.photos/seed/bakpia/400/300',
    location: 'Kota Yogyakarta',
    rating: 4.8,
    isApproved: true,
    status: 'APPROVED',
    ownerId: 'owner_1'
  },
  {
    id: '2',
    name: 'Royal Ambarrukmo Hotel',
    description: 'Hotel bintang 5 bersejarah dengan fasilitas keraton.',
    price: 1500000,
    category: 'Penginapan',
    subCategory: 'Hotel Bintang 5',
    dinas: DinasName.PARIWISATA,
    imageUrl: 'https://picsum.photos/seed/hotel1/400/300',
    location: 'Sleman',
    rating: 4.9,
    isApproved: true,
    status: 'APPROVED',
    ownerId: 'owner_2'
  },
  {
    id: '3',
    name: 'Tiket Museum Sonobudoyo',
    description: 'Museum sejarah dan kebudayaan Jawa terlengkap.',
    price: 10000,
    category: 'Museum',
    subCategory: 'Seni & Budaya',
    dinas: DinasName.KEBUDAYAAN,
    imageUrl: 'https://picsum.photos/seed/museum/400/300',
    location: 'Kota Yogyakarta',
    rating: 4.7,
    isApproved: true,
    status: 'APPROVED',
    ownerId: 'owner_3'
  },
  {
    id: '4',
    name: 'Sewa Becak Listrik Malioboro',
    description: 'Keliling Malioboro dengan becak ramah lingkungan.',
    price: 50000,
    category: 'Transportasi Tradisional',
    subCategory: 'Becak Listrik',
    dinas: DinasName.PERHUBUNGAN,
    imageUrl: 'https://picsum.photos/seed/becak/400/300',
    location: 'Malioboro',
    rating: 4.5,
    isApproved: true,
    status: 'APPROVED',
    ownerId: 'owner_4'
  }
];
