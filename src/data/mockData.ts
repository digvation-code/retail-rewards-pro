import { Transaction, UserProfile, PointsHistory } from '@/types/loyalty';

export const mockUser: UserProfile = {
  id: 'user-001',
  name: 'Pandri Widyaksana',
  email: 'pandri@example.com',
  phone: '+62 812 3456 7890',
  membershipTier: 'Gold',
  totalPoints: 2490,
  pointsToNextTier: 250,
  memberSince: '2024-01-15',
  qrCode: 'LOYALTY-USER-001-2024',
};

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    merchantName: 'Coffee Bean',
    merchantLogo: '☕',
    date: '2025-07-03',
    amount: 45000,
    pointsEarned: 25,
    category: 'food',
    status: 'completed',
    receiptNumber: 'RCP-2025-0703-001',
    items: [
      { name: 'Caramel Latte', quantity: 1, price: 35000, pointsEarned: 18 },
      { name: 'Croissant', quantity: 1, price: 10000, pointsEarned: 7 },
    ],
  },
  {
    id: 'txn-002',
    merchantName: 'Grocery Mart',
    merchantLogo: '🛒',
    date: '2025-07-03',
    amount: 250000,
    pointsEarned: 25,
    category: 'grocery',
    status: 'completed',
    receiptNumber: 'RCP-2025-0703-002',
    items: [
      { name: 'Fresh Milk 1L', quantity: 2, price: 28000, pointsEarned: 5 },
      { name: 'Organic Eggs', quantity: 1, price: 45000, pointsEarned: 8 },
      { name: 'Whole Grain Bread', quantity: 1, price: 32000, pointsEarned: 6 },
      { name: 'Fresh Vegetables', quantity: 1, price: 145000, pointsEarned: 6 },
    ],
  },
  {
    id: 'txn-003',
    merchantName: 'Fashion Store',
    merchantLogo: '👕',
    date: '2025-07-02',
    amount: 450000,
    pointsEarned: 45,
    category: 'shopping',
    status: 'completed',
    receiptNumber: 'RCP-2025-0702-001',
    items: [
      { name: 'Cotton T-Shirt', quantity: 2, price: 200000, pointsEarned: 20 },
      { name: 'Denim Jeans', quantity: 1, price: 250000, pointsEarned: 25 },
    ],
  },
  {
    id: 'txn-004',
    merchantName: 'Cinema XXI',
    merchantLogo: '🎬',
    date: '2025-07-01',
    amount: 150000,
    pointsEarned: 30,
    category: 'entertainment',
    status: 'completed',
    receiptNumber: 'RCP-2025-0701-001',
    items: [
      { name: 'Movie Ticket', quantity: 2, price: 100000, pointsEarned: 20 },
      { name: 'Popcorn Combo', quantity: 1, price: 50000, pointsEarned: 10 },
    ],
  },
  {
    id: 'txn-005',
    merchantName: 'Bookstore',
    merchantLogo: '📚',
    date: '2025-06-30',
    amount: 175000,
    pointsEarned: 35,
    category: 'shopping',
    status: 'completed',
    receiptNumber: 'RCP-2025-0630-001',
    items: [
      { name: 'Best Seller Novel', quantity: 1, price: 95000, pointsEarned: 19 },
      { name: 'Notebook Set', quantity: 2, price: 80000, pointsEarned: 16 },
    ],
  },
  {
    id: 'txn-006',
    merchantName: 'Restaurant Padang',
    merchantLogo: '🍛',
    date: '2025-06-29',
    amount: 85000,
    pointsEarned: 17,
    category: 'food',
    status: 'completed',
    receiptNumber: 'RCP-2025-0629-001',
    items: [
      { name: 'Rendang Rice', quantity: 1, price: 45000, pointsEarned: 9 },
      { name: 'Iced Tea', quantity: 2, price: 20000, pointsEarned: 4 },
      { name: 'Dessert', quantity: 1, price: 20000, pointsEarned: 4 },
    ],
  },
];

export const mockPointsHistory: PointsHistory[] = [
  { id: 'ph-001', type: 'earned', points: 25, description: 'Coffee Purchase', date: '2025-07-03', transactionId: 'txn-001' },
  { id: 'ph-002', type: 'earned', points: 25, description: 'Grocery Shopping', date: '2025-07-03', transactionId: 'txn-002' },
  { id: 'ph-003', type: 'redeemed', points: 500, description: 'Voucher Redemption', date: '2025-07-02' },
  { id: 'ph-004', type: 'earned', points: 45, description: 'Fashion Shopping', date: '2025-07-02', transactionId: 'txn-003' },
  { id: 'ph-005', type: 'earned', points: 30, description: 'Cinema Visit', date: '2025-07-01', transactionId: 'txn-004' },
  { id: 'ph-006', type: 'earned', points: 35, description: 'Bookstore Purchase', date: '2025-06-30', transactionId: 'txn-005' },
];

export const getCategoryColor = (category: Transaction['category']) => {
  const colors = {
    food: 'bg-orange-100 text-orange-600',
    shopping: 'bg-pink-100 text-pink-600',
    grocery: 'bg-green-100 text-green-600',
    entertainment: 'bg-purple-100 text-purple-600',
    travel: 'bg-blue-100 text-blue-600',
    other: 'bg-gray-100 text-gray-600',
  };
  return colors[category];
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
