import NodeGeocoder from 'node-geocoder';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: './config/.env' });

// Set options
const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

// Define Geocoder
const geocoder = NodeGeocoder(options);

export default geocoder;
