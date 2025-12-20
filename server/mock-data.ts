// Mock data for development - used when database is unavailable
export const mockBusinesses = [
  {
    id: '1',
    slug: 'gleam-detail',
    name: 'Gleam Detail',
    description: 'Premium car detailing and ceramic coating',
    logoUrl: null,
    primaryColor: '#1E90FF',
    secondaryColor: '#FFD60A',
    accentColor: '#FFFFFF',
    contactEmail: 'info@gleamdetail.com',
    contactPhone: '+1-555-0100',
    address: '123 Main St, Anytown USA',
    website: 'https://gleamdetail.example.com',
    qrCodeUrl: null,
    isActive: true,
    createdAt: new Date(),
  },
];

export const mockServices = [
  {
    id: '1',
    businessId: '1',
    name: 'Express Exterior',
    description: 'Full exterior wash and dry',
    category: 'exterior',
    price: '95.00',
    duration: 35,
    imageUrl: null,
    features: JSON.stringify(['Full exterior wash', 'Tire dressing', 'Rim cleaning']),
    isActive: true,
  },
  {
    id: '2',
    businessId: '1',
    name: 'Gold Wash',
    description: 'Full exterior and interior wash',
    category: 'exterior',
    price: '145.00',
    duration: 62,
    imageUrl: null,
    features: JSON.stringify(['Full exterior wash', 'Interior vacuum', 'Door jambs']),
    isActive: true,
  },
];

export const mockMembershipPlans = [
  {
    id: '1',
    name: 'Weekly Wash Club',
    description: 'Weekly professional exterior wash',
    frequency: 'weekly',
    pricePerMonth: '149.00',
    serviceIncluded: 'Express Exterior',
    features: JSON.stringify(['Weekly exterior wash', 'Priority scheduling', '10% off add-ons']),
    savingsPercent: 60,
    isPopular: false,
    isActive: true,
  },
  {
    id: '2',
    name: 'Fortnightly Fresh',
    description: 'Bi-weekly washes',
    frequency: 'fortnightly',
    pricePerMonth: '99.00',
    serviceIncluded: 'Express Exterior',
    features: JSON.stringify(['Bi-weekly exterior wash', 'Flexible scheduling']),
    savingsPercent: 45,
    isPopular: true,
    isActive: true,
  },
];
