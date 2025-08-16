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
export const FREE_SHIPPING_THRESHOLD = 75;

export function getShippingCostWithFreeShipping(
  subtotal: number,
  shippingCalculation: ShippingCalculation
): ShippingCalculation {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return {
      ...shippingCalculation,
      shippingCost: 0,
      formattedCost: 'FREE'
    };
  }
  return shippingCalculation;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}