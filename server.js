// Imports
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
// Security Imports
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

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Mount route files
app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} on port ${PORT}`.red.bgGreen
            .bold
    )
);
