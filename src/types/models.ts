export interface VehicleRequest {
    length: number;
    quantity: number;
  }

  
export interface Listing {
  id: string;
  length: number;
  width: number;
  location_id: string;
  price_in_cents: number;
}