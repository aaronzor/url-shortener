import express from 'express';

// Import Controllers
import {
    register,
    login,
    logout,
    getMe,
    resetPassword,
    updateDetails,
    updatePassword,
    forgotPassword
} from '../controllers/auth.js';

// Define router
const router = express.Router();

// Import Middleware
import { protect } from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/forgotpassword', forgotPassword);

export { router as authRoutes };
