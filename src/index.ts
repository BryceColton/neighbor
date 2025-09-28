import express from 'express';
import cors from 'cors';
import { solveMultiVehicle } from './algorithm'
import listings from './data/listings.json';
import { VehicleRequest } from './types/models';

const app = express();
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json());


type Listing = typeof listings[number];

interface GroupedListings {
    [location_id: string]: Listing[];
}

const listingsByLocation: GroupedListings = listings.reduce((acc, l: Listing) => {
    (acc[l.location_id] ||= []).push(l);
    return acc;
  }, {} as GroupedListings);

  
app.post('/', (req, res) => {
    try {
      const vehicles: VehicleRequest[] = req.body;
      if (!Array.isArray(vehicles) || vehicles.length === 0) {
        return res.status(400).json({ error: 'Body must be a non-empty array' });
      }
      const results = solveMultiVehicle(vehicles, listingsByLocation);
      res.json(results);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Internal error' });
    }
  });
  
  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });