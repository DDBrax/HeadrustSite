// Shipping calculator for continental US only
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
];

// Shipping zones based on distance from Arizona (band's location)
const SHIPPING_ZONES = {
  // Zone 1: Southwest (closest)
  zone1: ['AZ', 'NM', 'NV', 'UT', 'CO'],
  // Zone 2: West and some central states
  zone2: ['CA', 'OR', 'WA', 'ID', 'MT', 'WY', 'TX', 'OK'],
  // Zone 3: Central states
  zone3: ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'AR', 'LA'],
  // Zone 4: Eastern states
  zone4: ['WI', 'IL', 'IN', 'MI', 'OH', 'KY', 'TN', 'MS', 'AL', 'GA', 'FL', 'SC', 'NC', 'VA', 'WV', 'MD', 'DE', 'PA', 'NJ', 'NY', 'CT', 'RI', 'MA', 'VT', 'NH', 'ME', 'DC']
};

// Shipping rates by zone (base rate for first item + additional per item)
const SHIPPING_RATES = {
  zone1: { base: 4.99, additional: 2.00 },
  zone2: { base: 6.99, additional: 2.50 },
  zone3: { base: 8.99, additional: 3.00 },
  zone4: { base: 10.99, additional: 3.50 }
};

export interface ShippingCalculation {
  shippingCost: number;
  zone: string;
  itemCount: number;
  formattedCost: string;
}

export function calculateShipping(
  shirtQuantity: number = 0,
  hatQuantity: number = 0,
  albumQuantity: number = 0,
  state: string
): ShippingCalculation {
  // Get shipping zone
  let zone = 'zone4'; // Default to most expensive
  
  for (const [zoneName, states] of Object.entries(SHIPPING_ZONES)) {
    if (states.includes(state.toUpperCase())) {
      zone = zoneName;
      break;
    }
  }

  const totalItems = shirtQuantity + hatQuantity + albumQuantity;
  
  if (totalItems === 0) {
    return {
      shippingCost: 0,
      zone,
      itemCount: 0,
      formattedCost: '$0.00'
    };
  }

  const rates = SHIPPING_RATES[zone as keyof typeof SHIPPING_RATES];
  const shippingCost = rates.base + (rates.additional * (totalItems - 1));

  return {
    shippingCost,
    zone,
    itemCount: totalItems,
    formattedCost: `$${shippingCost.toFixed(2)}`
  };
}

// Free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 100;

// Tucson coordinates for distance calculation
const TUCSON_COORDS = {
  lat: 32.2217,
  lng: -110.9265
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if location is within 15 miles of Tucson
function isWithinTucsonDeliveryArea(lat: number, lng: number): boolean {
  const distance = calculateDistance(TUCSON_COORDS.lat, TUCSON_COORDS.lng, lat, lng);
  return distance <= 15;
}

export function getShippingCostWithFreeShipping(
  subtotal: number,
  shippingCalculation: ShippingCalculation,
  city: string = "",
  zipCode: string = "",
  latitude?: number,
  longitude?: number
): ShippingCalculation {
  // Free shipping for orders $100 or more
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return {
      ...shippingCalculation,
      shippingCost: 0,
      formattedCost: 'FREE'
    };
  }

  // Check if within 15-mile radius of Tucson using coordinates
  if (latitude && longitude && isWithinTucsonDeliveryArea(latitude, longitude)) {
    return {
      ...shippingCalculation,
      shippingCost: 0,
      formattedCost: 'FREE (Local Delivery)'
    };
  }

  // Free shipping for local Tucson area cities (fallback for known cities)
  const localCities = ['tucson', 'marana', 'oro valley', 'sahuarita', 'catalina foothills', 'casas adobes', 'flowing wells', 'tanque verde'];
  if (city && localCities.includes(city.toLowerCase())) {
    return {
      ...shippingCalculation,
      shippingCost: 0,
      formattedCost: 'FREE (Local Delivery)'
    };
  }

  return shippingCalculation;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}