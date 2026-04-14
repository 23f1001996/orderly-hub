// Mock data for the restaurant management app

export const mockStats = [
  { label: 'Revenue', value: '₹96,840', trend: 12.5, icon: 'IndianRupee' },
  { label: 'Orders Today', value: '64', trend: 8.3, icon: 'ShoppingBag' },
  { label: 'Customers', value: '142', trend: -2.1, icon: 'Users' },
  { label: 'Avg Order', value: '₹520', trend: 5.0, icon: 'TrendingUp' },
];

export const mockTables = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  seats: [2, 4, 4, 6, 2, 4, 8, 2, 4, 6, 2, 4, 4, 6, 2, 4, 8, 2, 4, 6][i],
  status: (['available', 'occupied', 'available', 'occupied', 'reserved', 'available', 'occupied', 'available', 'available', 'occupied', 'available', 'reserved', 'available', 'occupied', 'available', 'available', 'occupied', 'available', 'available', 'available'] as const)[i],
  waiter: i % 3 === 1 ? 'Priya Sharma' : i % 3 === 2 ? 'Rahul Verma' : undefined,
  orderTotal: i % 3 === 1 ? (Math.random() * 3000 + 500).toFixed(2) : undefined,
}));

export const mockCategories = [
  { id: 1, name: 'Starters', itemCount: 8 },
  { id: 2, name: 'Main Course', itemCount: 12 },
  { id: 3, name: 'Breads', itemCount: 6 },
  { id: 4, name: 'Desserts', itemCount: 6 },
  { id: 5, name: 'Beverages', itemCount: 10 },
  { id: 6, name: 'Biryani', itemCount: 5 },
];

export const mockMenuItems = [
  { id: 1, name: 'Paneer Tikka', description: 'Marinated cottage cheese, tandoor grilled, mint chutney', price: 320, category: 'Starters', available: true },
  { id: 2, name: 'Chicken Malai Kebab', description: 'Cream marinated chicken, cashew paste, saffron', price: 380, category: 'Starters', available: true },
  { id: 3, name: 'Crispy Samosa', description: 'Spiced potato filling, tamarind & green chutney', price: 180, category: 'Starters', available: true },
  { id: 4, name: 'Mutton Galouti Kebab', description: 'Lucknowi style, melt-in-mouth, ulte tawa paratha', price: 450, category: 'Starters', available: false },
  { id: 5, name: 'Butter Chicken', description: 'Tandoori chicken, creamy tomato makhani gravy', price: 420, category: 'Main Course', available: true },
  { id: 6, name: 'Dal Makhani', description: 'Black lentils, slow-cooked overnight, cream finish', price: 320, category: 'Main Course', available: true },
  { id: 7, name: 'Rogan Josh', description: 'Kashmiri lamb curry, aromatic spices, saffron', price: 520, category: 'Main Course', available: true },
  { id: 8, name: 'Palak Paneer', description: 'Spinach gravy, cottage cheese, garlic temper', price: 300, category: 'Main Course', available: true },
  { id: 9, name: 'Prawn Curry', description: 'Coastal style, coconut milk, curry leaves', price: 480, category: 'Main Course', available: true },
  { id: 10, name: 'Gulab Jamun', description: 'Deep-fried milk dumplings, rose cardamom syrup', price: 180, category: 'Desserts', available: true },
  { id: 11, name: 'Rasmalai', description: 'Soft paneer discs, saffron milk, pistachios', price: 200, category: 'Desserts', available: true },
  { id: 12, name: 'Kulfi Falooda', description: 'Traditional Indian ice cream, vermicelli, rose syrup', price: 220, category: 'Desserts', available: true },
  { id: 13, name: 'Masala Chai', description: 'Spiced Indian tea, ginger, cardamom', price: 80, category: 'Beverages', available: true },
  { id: 14, name: 'Mango Lassi', description: 'Alphonso mango, yogurt, cardamom', price: 150, category: 'Beverages', available: true },
  { id: 15, name: 'Hyderabadi Biryani', description: 'Dum cooked, basmati rice, aromatic spices, raita', price: 450, category: 'Biryani', available: true },
];

export const mockOrders = [
  { id: 1024, table: 4, items: [{ name: 'Paneer Tikka', qty: 2, price: 320 }, { name: 'Rogan Josh', qty: 1, price: 520 }, { name: 'Masala Chai', qty: 2, price: 80 }], total: 1320, status: 'completed' as const, time: '12:30 PM', customer: 'Amit Patel' },
  { id: 1025, table: 12, items: [{ name: 'Chicken Malai Kebab', qty: 1, price: 380 }, { name: 'Butter Chicken', qty: 2, price: 420 }, { name: 'Gulab Jamun', qty: 2, price: 180 }], total: 1580, status: 'preparing' as const, time: '1:15 PM', customer: 'Sneha Reddy' },
  { id: 1026, table: 7, items: [{ name: 'Crispy Samosa', qty: 2, price: 180 }, { name: 'Prawn Curry', qty: 1, price: 480 }], total: 840, status: 'served' as const, time: '1:45 PM', customer: 'Vikram Singh' },
  { id: 1027, table: 2, items: [{ name: 'Palak Paneer', qty: 1, price: 300 }, { name: 'Kulfi Falooda', qty: 1, price: 220 }, { name: 'Mango Lassi', qty: 1, price: 150 }], total: 670, status: 'preparing' as const, time: '2:00 PM', customer: 'Ananya Iyer' },
  { id: 1028, table: 10, items: [{ name: 'Hyderabadi Biryani', qty: 1, price: 450 }, { name: 'Rasmalai', qty: 1, price: 200 }], total: 650, status: 'pending' as const, time: '2:15 PM', customer: 'Rajesh Kumar' },
];

export const mockCustomers = [
  { id: 1, name: 'Amit Patel', email: 'amit@example.com', visits: 12, totalSpent: 14200, lastVisit: '2026-03-15' },
  { id: 2, name: 'Sneha Reddy', email: 'sneha@example.com', visits: 8, totalSpent: 9800, lastVisit: '2026-03-16' },
  { id: 3, name: 'Vikram Singh', email: 'vikram@example.com', visits: 5, totalSpent: 6400, lastVisit: '2026-03-14' },
  { id: 4, name: 'Ananya Iyer', email: 'ananya@example.com', visits: 15, totalSpent: 18600, lastVisit: '2026-03-17' },
  { id: 5, name: 'Rajesh Kumar', email: 'rajesh@example.com', visits: 3, totalSpent: 3800, lastVisit: '2026-03-12' },
];

export const mockStaff = [
  { id: 1, name: 'Priya Sharma', email: 'priya@spicepalace.com', role: 'waiter' as const, status: 'active' as const },
  { id: 2, name: 'Rahul Verma', email: 'rahul@spicepalace.com', role: 'waiter' as const, status: 'active' as const },
  { id: 3, name: 'Deepa Nair', email: 'deepa@spicepalace.com', role: 'waiter' as const, status: 'off-duty' as const },
  { id: 4, name: 'Suresh Menon', email: 'suresh@spicepalace.com', role: 'admin' as const, status: 'active' as const },
];

export const mockReviews = [
  { id: 1, customer: 'Amit Patel', dish: 'Butter Chicken', rating: 5, comment: 'Absolutely incredible. Best butter chicken in the city!', date: '2026-03-15' },
  { id: 2, customer: 'Sneha Reddy', dish: 'Chicken Malai Kebab', rating: 4, comment: 'Perfectly cooked, melt in mouth. Loved it!', date: '2026-03-16' },
  { id: 3, customer: 'Vikram Singh', dish: 'Gulab Jamun', rating: 5, comment: 'Classic dessert done right. Will come back for this alone.', date: '2026-03-14' },
  { id: 4, customer: 'Ananya Iyer', dish: 'Palak Paneer', rating: 3, comment: 'Good flavor but slightly too salty. Still enjoyable.', date: '2026-03-13' },
  { id: 5, customer: 'Rajesh Kumar', dish: 'Masala Chai', rating: 5, comment: 'Best chai I\'ve had outside home!', date: '2026-03-12' },
];

export const mockSalesData = [
  { day: 'Mon', revenue: 18200, orders: 32 },
  { day: 'Tue', revenue: 21400, orders: 38 },
  { day: 'Wed', revenue: 19600, orders: 35 },
  { day: 'Thu', revenue: 23800, orders: 42 },
  { day: 'Fri', revenue: 32000, orders: 56 },
  { day: 'Sat', revenue: 38400, orders: 64 },
  { day: 'Sun', revenue: 29000, orders: 48 },
];
