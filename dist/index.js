"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const algorithm_1 = require("./algorithm");
const listings_json_1 = __importDefault(require("./data/listings.json"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://127.0.0.1:5500' }));
app.use(express_1.default.json());
const listingsByLocation = listings_json_1.default.reduce((acc, l) => {
    var _a;
    (acc[_a = l.location_id] || (acc[_a] = [])).push(l);
    return acc;
}, {});
app.post('/', (req, res) => {
    try {
        const vehicles = req.body;
        if (!Array.isArray(vehicles) || vehicles.length === 0) {
            return res.status(400).json({ error: 'Body must be a non-empty array' });
        }
        const results = (0, algorithm_1.solveMultiVehicle)(vehicles, listingsByLocation);
        res.json(results);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal error' });
    }
});
const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map