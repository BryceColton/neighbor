import { VehicleRequest, Listing } from './types/models';

interface ListingsByLocation {
  [location_id: string]: Listing[];
}

interface locations {
      location_id: string,
      listing_ids: string[],
      total_price_in_cents: number
}

export function solveMultiVehicle(
  vehicles: VehicleRequest[],
  listingsByLocation: ListingsByLocation
): locations[] {

  // Sorting vehicles by largest to smalles length based off of the minimum length required
  // This will help know which vehicles should go in which locations
  const spreadVehicles: number[] = 
  vehicles
  .flatMap(vehicle => Array.from({ length: vehicle.quantity }, () => vehicle.length ))
  .sort((a, b) => b - a)

  const results: locations[] = [];



    for (const [location_id, listings] of Object.entries(listingsByLocation)) {
      if (cheapestSubset(spreadVehicles, listings)) {
        results.push({
          location_id,
          listing_ids: listings.map(listing => listing.id),
          total_price_in_cents: listings.reduce((s, l) => s + l.price_in_cents, 0)
        });
      }
    }

  //    The results should:
  // 1. Include every possible location that could store all requested vehicles
  // 1. Include the cheapest possible combination of listings per location
  // 1. Include only one result per location_id
  // 1. Be sorted by the total price in cents, ascending
  results.sort ((a, b) => a.total_price_in_cents - b.total_price_in_cents);
  return results;
}


function vehiclesFit(vehicleLengths: number[], listings: Listing[]): boolean {
  const remaining = listings.map(listing => ({ rem: listing.length}))

  for (const v of vehicleLengths) {
    let placed = false;
    for (const slot of remaining) {
      if (slot.rem >= v) {
        slot.rem -= v;
        placed = true;
        break;
      }
    }
    if (!placed) return false;
  }
  return true;
}


function cheapestSubset(vehicleLengths: number[], listings: Listing[]): Listing[] | null {
  if (!listings.length) return null;
  // Get listings sorted by price per length, which sites are most cost effective
  const sorted = [...listings].sort(
    (a,b) => (a.price_in_cents / a.length) - (b.price_in_cents / b.length)
  );

  const selectedListings: Listing[] = [];
  for (const l of sorted) {
    selectedListings.push(l);
    if (vehiclesFit(vehicleLengths, selectedListings)) {
      for (let i = selectedListings.length - 1; i >= 0; i--) {
        const test = selectedListings.slice(0, i).concat(selectedListings.slice(i + 1));
        if (vehiclesFit(vehicleLengths, test)) {
          selectedListings.splice(i, 1);
        }
      }
      return selectedListings;
    }
  }
  return null;
}