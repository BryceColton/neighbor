"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solveMultiVehicle = solveMultiVehicle;
function solveMultiVehicle(vehicles, listingsByLocation) {
    // Sorting vehicles by largest to smalles length based off of the minimum length
    const spreadVehicles = vehicles
        .flatMap(vehicle => Array.from({ length: vehicle.quantity }, () => vehicle.length))
        .sort((a, b) => b - a);
    const results = [];
    for (const [location_id, listings] of Object.entries(listingsByLocation)) {
        const subset = cheapestSubset(spreadVehicles, listings);
        if (subset) {
            results.push({
                location_id,
                listing_ids: subset.map(l => l.id),
                total_price_in_cents: subset.reduce((s, l) => s + l.price_in_cents, 0)
            });
        }
    }
    //    The results should:
    // 1. Include every possible location that could store all requested vehicles
    // 1. Include the cheapest possible combination of listings per location
    // 1. Include only one result per location_id
    // 1. Be sorted by the total price in cents, ascending
    results.sort((a, b) => a.total_price_in_cents - b.total_price_in_cents);
    return results;
}
function vehiclesFit(vehicleLengths, listings) {
    const remaining = listings.map(listing => ({ rem: listing.length }));
    for (const v of vehicleLengths) {
        let placed = false;
        for (const slot of remaining) {
            if (slot.rem >= v) {
                slot.rem -= v;
                placed = true;
                break;
            }
        }
        if (!placed)
            return false;
    }
    return true;
}
function cheapestSubset(vehicleLengths, listings) {
    if (!listings.length)
        return null;
    // Getting listings by price per length
    const sorted = listings
        .filter(l => l.length > 0)
        .sort((a, b) => (a.price_in_cents / a.length) - (b.price_in_cents / b.length));
    const selectedListings = [];
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
//# sourceMappingURL=algorithm.js.map