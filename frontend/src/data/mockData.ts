export interface Item {
  id: string;
  reportId: string;
  userId?: string;
  type: 'lost' | 'found' | 'recovered';
  name: string;
  category: string;
  brand?: string;
  color?: string;
  description: string;
  uniqueFeatures?: string;
  date: string;
  time?: string;
  location: string;
  storageLocation?: string;
  status: 'active' | 'pending_match' | 'claimed' | 'recovered';
  image: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  role: 'student' | 'admin';
  phone?: string;
}

export interface LocationStat {
  location: string;
  reportCount: number;
  lostCount: number;
  foundCount: number;
}

export interface Claim {
  id: string;
  itemId: string;
  userId: string;
  userBeliefReason: string;
  uniqueFeatureAnswer: string;
  lastSeenLocationAnswer: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  itemName?: string;
  itemCategory?: string;
  itemLocation?: string;
  itemImage?: string;
  userName?: string;
  userEmail?: string;
}

export const initialItems: Item[] = [
  {
    id: 'item-101',
    reportId: 'RET-L-2026-001',
    userId: 'u1',
    type: 'lost',
    name: 'Black Backpack',
    category: 'Bags',
    brand: 'Swissgear',
    color: 'Black',
    description: 'Black Swissgear laptop backpack containing CSE textbooks and notebook.',
    uniqueFeatures: 'Keychain with blue turtle and slight scratch on front pocket zipper.',
    date: '2026-09-18',
    time: '09:30 AM',
    location: 'CSE Block',
    status: 'pending_match',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    contactName: 'Alex Vance',
    contactEmail: 'student@campus.edu',
    contactPhone: '+1 555-0192'
  },
  {
    id: 'item-102',
    reportId: 'RET-F-2026-001',
    userId: 'u2',
    type: 'found',
    name: 'Black College Backpack',
    category: 'Bags',
    brand: 'Swissgear',
    color: 'Black',
    description: 'Found black laptop backpack on 3rd floor CSE Block near Lab 4.',
    uniqueFeatures: 'Has a blue turtle keychain attached to side ring.',
    date: '2026-09-18',
    time: '11:15 AM',
    location: 'CSE Block',
    storageLocation: 'Campus Security Office, Admin Room 102',
    status: 'claimed',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    contactName: 'Officer Ryan',
    contactEmail: 'security@campus.edu',
    contactPhone: '+1 555-0100'
  },
  {
    id: 'item-103',
    reportId: 'RET-L-2026-002',
    userId: 'u1',
    type: 'lost',
    name: 'Blue Water Bottle',
    category: 'Accessories',
    brand: 'Hydro Flask',
    color: 'Blue',
    description: 'Matte cobalt blue 32oz Hydro Flask with stainless steel lid.',
    uniqueFeatures: 'Oracle Hackathon sticker pasted near the top rim.',
    date: '2026-09-17',
    time: '01:00 PM',
    location: 'Canteen',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    contactName: 'Alex Vance',
    contactEmail: 'student@campus.edu',
    contactPhone: '+1 555-0192'
  },
  {
    id: 'item-104',
    reportId: 'RET-F-2026-002',
    userId: 'u2',
    type: 'found',
    name: 'Blue Bottle',
    category: 'Accessories',
    brand: 'Hydro Flask',
    color: 'Blue',
    description: 'Insulated blue water bottle left at Canteen table 12.',
    uniqueFeatures: 'Has tech hackathon sticker.',
    date: '2026-09-17',
    time: '02:30 PM',
    location: 'Canteen',
    storageLocation: 'Canteen Lost & Found Box',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    contactName: 'Canteen Staff',
    contactEmail: 'canteen@campus.edu',
    contactPhone: '+1 555-0144'
  },
  {
    id: 'item-105',
    reportId: 'RET-L-2026-003',
    userId: 'u1',
    type: 'lost',
    name: 'Student ID Card',
    category: 'ID Cards',
    brand: 'Campus ID',
    color: 'White',
    description: 'Official Campus Student ID Card belonging to Computer Science Department.',
    uniqueFeatures: 'ID No: CS-2024-8841 with lanyard attached.',
    date: '2026-09-19',
    time: '10:00 AM',
    location: 'Library',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    contactName: 'Alex Vance',
    contactEmail: 'student@campus.edu',
    contactPhone: '+1 555-0192'
  },
  {
    id: 'item-106',
    reportId: 'RET-F-2026-003',
    userId: 'u2',
    type: 'found',
    name: 'Student ID Card (CSE)',
    category: 'ID Cards',
    brand: 'Campus ID',
    color: 'White',
    description: 'Found CS student ID card on 2nd floor silent reading zone.',
    uniqueFeatures: 'Black campus logo lanyard.',
    date: '2026-09-19',
    time: '10:45 AM',
    location: 'Library',
    storageLocation: 'Library Front Desk',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    contactName: 'Library Staff',
    contactEmail: 'library@campus.edu',
    contactPhone: '+1 555-0188'
  },
  {
    id: 'item-107',
    reportId: 'RET-L-2026-004',
    userId: 'u1',
    type: 'lost',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    brand: 'Apple',
    color: 'White',
    description: 'AirPods Pro in white charging case.',
    uniqueFeatures: 'Transparent silicone case cover with small scratch on back hinge.',
    date: '2026-09-16',
    time: '04:00 PM',
    location: 'Sports Ground',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    contactName: 'Alex Vance',
    contactEmail: 'student@campus.edu',
    contactPhone: '+1 555-0192'
  },
  {
    id: 'item-108',
    reportId: 'RET-F-2026-004',
    userId: 'u2',
    type: 'found',
    name: 'White Earbuds Case',
    category: 'Electronics',
    brand: 'Apple',
    color: 'White',
    description: 'AirPods case found near basketball court bleachers.',
    uniqueFeatures: 'Clear outer sleeve cover.',
    date: '2026-09-16',
    time: '05:30 PM',
    location: 'Sports Ground',
    storageLocation: 'Sports Complex Desk',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    contactName: 'Coach Dave',
    contactEmail: 'sports@campus.edu',
    contactPhone: '+1 555-0167'
  },
  {
    id: 'item-109',
    reportId: 'RET-L-2026-005',
    userId: 'u1',
    type: 'lost',
    name: 'Mathematics Book',
    category: 'Books',
    brand: 'Pearson',
    color: 'Blue',
    description: 'Discrete Mathematics 8th Edition textbook.',
    uniqueFeatures: 'Highlighter marks on Chapter 3 & student name inside cover.',
    date: '2026-09-15',
    time: '11:00 AM',
    location: 'Hostel',
    status: 'recovered',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    contactName: 'Alex Vance',
    contactEmail: 'student@campus.edu',
    contactPhone: '+1 555-0192'
  },
  {
    id: 'item-110',
    reportId: 'RET-F-2026-005',
    userId: 'u2',
    type: 'found',
    name: 'Engineering Mathematics Book',
    category: 'Books',
    brand: 'Pearson',
    color: 'Blue',
    description: 'Found textbook in Hostel Block B common study hall.',
    uniqueFeatures: 'Has yellow post-it note bookmarks.',
    date: '2026-09-15',
    time: '01:00 PM',
    location: 'Hostel',
    storageLocation: 'Hostel Warden Office',
    status: 'recovered',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    contactName: 'Warden Office',
    contactEmail: 'hostel@campus.edu',
    contactPhone: '+1 555-0122'
  },
  {
    id: 'item-111',
    reportId: 'RET-L-2026-006',
    userId: 'u1',
    type: 'lost',
    name: 'Black Leather Wallet',
    category: 'Wallets',
    brand: 'Fossil',
    color: 'Black',
    description: 'Black bi-fold leather wallet with silver brand logo.',
    uniqueFeatures: 'Contains student metro pass and driver license.',
    date: '2026-09-18',
    time: '08:45 AM',
    location: 'CSE Block',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    contactName: 'Alex Vance',
    contactEmail: 'student@campus.edu',
    contactPhone: '+1 555-0192'
  },
  {
    id: 'item-112',
    reportId: 'RET-F-2026-006',
    userId: 'u2',
    type: 'found',
    name: 'Black Wallet',
    category: 'Wallets',
    brand: 'Fossil',
    color: 'Black',
    description: 'Black leather wallet found under staircase in CSE Block.',
    uniqueFeatures: 'Contains silver logo badge.',
    date: '2026-09-18',
    time: '09:30 AM',
    location: 'CSE Block',
    storageLocation: 'Department Office Room 301',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    contactName: 'Dept Assistant',
    contactEmail: 'csedept@campus.edu',
    contactPhone: '+1 555-0155'
  }
];

export const initialLocations: LocationStat[] = [
  { location: 'CSE Block', reportCount: 12, lostCount: 7, foundCount: 5 },
  { location: 'Library', reportCount: 8, lostCount: 5, foundCount: 3 },
  { location: 'Canteen', reportCount: 15, lostCount: 9, foundCount: 6 },
  { location: 'Sports Ground', reportCount: 6, lostCount: 4, foundCount: 2 },
  { location: 'Hostel', reportCount: 9, lostCount: 5, foundCount: 4 },
  { location: 'Auditorium', reportCount: 4, lostCount: 2, foundCount: 2 },
  { location: 'Lab', reportCount: 7, lostCount: 4, foundCount: 3 },
  { location: 'Parking', reportCount: 3, lostCount: 2, foundCount: 1 }
];

export const demoStudentUser: User = {
  id: 'u1',
  name: 'Alex Vance',
  email: 'student@campus.edu',
  department: 'Computer Science & Engineering',
  year: 'Year 3',
  role: 'student',
  phone: '+1 555-0192'
};

export const demoAdminUser: User = {
  id: 'u2',
  name: 'Prof. Sarah Jenkins',
  email: 'admin@campus.edu',
  department: 'Campus Security',
  year: 'Faculty / Admin',
  role: 'admin',
  phone: '+1 555-0100'
};
