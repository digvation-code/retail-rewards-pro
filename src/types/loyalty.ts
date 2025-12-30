export interface Transaction {
  id: string;
  merchantName: string;
  date: string;
  amount: number;
  pointsEarned: number;
  category: 'food' | 'shopping' | 'grocery' | 'entertainment' | 'travel' | 'other';
  status: 'completed' | 'pending';
  receiptNumber: string;
  subtotal: number;
  tax: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'e_wallet' | 'cash';
  items?: TransactionItem[];
}

export interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
  pointsEarned: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  membershipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalPoints: number;
  pointsToNextTier: number;
  memberSince: string;
  qrCode: string;
}

export interface PointsHistory {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: string;
  transactionId?: string;
}
