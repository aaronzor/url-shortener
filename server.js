// Imports
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';
import { fileURLToPath } from 'url';

// Security Imports
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

// Middleware Imports
import cookieParser from 'cookie-parser';

// Database Import
import connectDB from './config/db.js';

// Load ENV vars
dotenv.config({ path: './config/.env' });

// Connect to Database
connectDB();

// Route Files
import { authRoutes } from './routes/auth.js';
import { userRoutes } from './routes/users.js';

//USECASE Route Files
import { resturantRoutes } from './USECASE/routes/resturants.js';
import { reviewRoutes } from './USECASE/routes/reviews.js';

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Mount route files
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// USECASE Mount Route Files
app.use('/api/v1/resturants', resturantRoutes);
app.use('/api/v1/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} on port ${PORT}`.red.bgGreen
            .bold
    )
);
