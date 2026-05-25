export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface Dealer {
  id: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  phone: string;
  email: string;
  logoUrl: string;
  certifiedBrands: string[];
  listingsCount: number;
}

export interface Specification {
  engine: string;
  power: string;
  torque: string;
  acceleration: string; // 0-60 mph
  topSpeed: string;
  weight: string;
  batteryRange?: string; // For EV / Hybrid
  driveTrain: string;
}

export interface CarColor {
  name: string;
  hex: string;
  glowHex: string; // Dynamic neon headlight or underglow colors
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel';
  transmission: 'Automatic' | 'Manual' | 'Dual-Clutch';
  country: string;
  category: 'Supercar' | 'Hypercar' | 'Sedan' | 'SUV' | 'Coupe';
  heroImage: string;
  imageGallery: string[];
  specifications: Specification;
  colors: CarColor[];
  features: string[];
  dealerId: string;
  rating: number;
  reviews: Review[];
  reviewsCount: number;
  accentColor: string; // Tailwind glow utility color
  isNewArrival?: boolean;
  isPopular?: boolean;
}

export interface FilterState {
  searchQuery: string;
  brand: string;
  model: string;
  year: string;
  maxPrice: number;
  fuelType: string;
  transmission: string;
  country: string;
  mileage: string;
}

export interface UserState {
  isLoggedIn: boolean;
  user: {
    name: string;
    email: string;
    avatar: string;
    favorites: string[]; // List of carIds
    savedSearches: string[];
    role: 'buyer' | 'seller';
  } | null;
}
