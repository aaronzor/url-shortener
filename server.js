// Imports
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';

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
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// Route Files
import { authRoutes } from './routes/auth.js';
import { userRoutes } from './routes/users.js';

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
app.use(express.static(path.join(__dirname, 'public')));

// Mount route files
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} on port ${PORT}`.red.bgGreen
            .bold
    )
);
