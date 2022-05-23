import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { newUrl, newUserUrl } from '../controllers/url.js';

const router = express.Router();

router.post('/newurl', newUrl);
router.post('/newuserurl', protect, newUserUrl);

export { router as urlRoutes };
