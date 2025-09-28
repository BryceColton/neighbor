import { VehicleRequest, Listing } from './types/models';
interface ListingsByLocation {
    [location_id: string]: Listing[];
}
interface locations {
    location_id: string;
    listing_ids: string[];
    total_price_in_cents: number;
}
export declare function solveMultiVehicle(vehicles: VehicleRequest[], listingsByLocation: ListingsByLocation): locations[];
export {};
//# sourceMappingURL=algorithm.d.ts.map