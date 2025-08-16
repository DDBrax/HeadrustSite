// City to ZIP code lookup functionality
// Note: This uses a basic lookup for common cities. For production,
// consider using a service like Zippopotam.us API or similar

interface CityZipData {
  city: string;
  state: string;
  zip: string;
}

// Sample data for major US cities - in production, this would be a comprehensive database
const CITY_ZIP_DATA: CityZipData[] = [
  // Arizona (band's home state)
  { city: "Phoenix", state: "AZ", zip: "85001" },
  { city: "Tucson", state: "AZ", zip: "85701" },
  { city: "Mesa", state: "AZ", zip: "85201" },
  { city: "Chandler", state: "AZ", zip: "85224" },
  { city: "Scottsdale", state: "AZ", zip: "85251" },
  { city: "Glendale", state: "AZ", zip: "85301" },
  { city: "Tempe", state: "AZ", zip: "85281" },
  
  // California (major cities)
  { city: "Los Angeles", state: "CA", zip: "90001" },
  { city: "San Francisco", state: "CA", zip: "94102" },
  { city: "San Diego", state: "CA", zip: "92101" },
  { city: "San Jose", state: "CA", zip: "95101" },
  { city: "Sacramento", state: "CA", zip: "95814" },
  { city: "Oakland", state: "CA", zip: "94601" },
  { city: "Fresno", state: "CA", zip: "93701" },
  
  // Texas
  { city: "Houston", state: "TX", zip: "77001" },
  { city: "Dallas", state: "TX", zip: "75201" },
  { city: "Austin", state: "TX", zip: "73301" },
  { city: "San Antonio", state: "TX", zip: "78201" },
  { city: "Fort Worth", state: "TX", zip: "76101" },
  
  // New York
  { city: "New York", state: "NY", zip: "10001" },
  { city: "Brooklyn", state: "NY", zip: "11201" },
  { city: "Queens", state: "NY", zip: "11101" },
  { city: "Buffalo", state: "NY", zip: "14201" },
  { city: "Rochester", state: "NY", zip: "14601" },
  
  // Florida
  { city: "Miami", state: "FL", zip: "33101" },
  { city: "Tampa", state: "FL", zip: "33601" },
  { city: "Orlando", state: "FL", zip: "32801" },
  { city: "Jacksonville", state: "FL", zip: "32201" },
  
  // Illinois
  { city: "Chicago", state: "IL", zip: "60601" },
  
  // Pennsylvania
  { city: "Philadelphia", state: "PA", zip: "19101" },
  { city: "Pittsburgh", state: "PA", zip: "15201" },
  
  // Ohio
  { city: "Columbus", state: "OH", zip: "43201" },
  { city: "Cleveland", state: "OH", zip: "44101" },
  { city: "Cincinnati", state: "OH", zip: "45201" },
  
  // Michigan
  { city: "Detroit", state: "MI", zip: "48201" },
  
  // Georgia
  { city: "Atlanta", state: "GA", zip: "30301" },
  
  // North Carolina
  { city: "Charlotte", state: "NC", zip: "28201" },
  { city: "Raleigh", state: "NC", zip: "27601" },
  
  // Tennessee
  { city: "Nashville", state: "TN", zip: "37201" },
  { city: "Memphis", state: "TN", zip: "38101" },
  
  // Washington
  { city: "Seattle", state: "WA", zip: "98101" },
  
  // Colorado
  { city: "Denver", state: "CO", zip: "80201" },
  
  // Oregon
  { city: "Portland", state: "OR", zip: "97201" },
  
  // Nevada
  { city: "Las Vegas", state: "NV", zip: "89101" },
  { city: "Reno", state: "NV", zip: "89501" },
  
  // Utah
  { city: "Salt Lake City", state: "UT", zip: "84101" },
  
  // New Mexico
  { city: "Albuquerque", state: "NM", zip: "87101" },
  { city: "Santa Fe", state: "NM", zip: "87501" },
];

export function findZipByCity(city: string, state: string): string | null {
  const normalizedCity = city.trim().toLowerCase();
  const normalizedState = state.trim().toUpperCase();
  
  const match = CITY_ZIP_DATA.find(
    data => 
      data.city.toLowerCase() === normalizedCity && 
      data.state === normalizedState
  );
  
  return match ? match.zip : null;
}

export function getCitySuggestions(input: string, state: string): string[] {
  if (!input || input.length < 2) return [];
  
  const normalizedInput = input.trim().toLowerCase();
  const normalizedState = state.trim().toUpperCase();
  
  return CITY_ZIP_DATA
    .filter(data => 
      data.state === normalizedState && 
      data.city.toLowerCase().includes(normalizedInput)
    )
    .map(data => data.city)
    .slice(0, 8); // Limit to 8 suggestions
}

// Alternative: Use Zippopotam.us API for real-time lookup
export async function lookupZipByAPI(city: string, state: string): Promise<string | null> {
  try {
    const response = await fetch(`http://api.zippopotam.us/us/${state}/${encodeURIComponent(city)}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.places && data.places.length > 0) {
      return data.places[0]['post code'];
    }
    return null;
  } catch (error) {
    console.warn('ZIP lookup API failed:', error);
    return null;
  }
}