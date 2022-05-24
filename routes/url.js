import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import advancedResults from '../middleware/advancedResults.js';
import {
  newUrl,
  newUserUrl,
  deleteUrl,
  getUrl,
  getUrls,
  getUsersUrls,
} from '../controllers/url.js';
import Url from '../models/Url.js';

const router = express.Router({ mergeParams: true });

router.post('/newurl', newUrl);
router.post('/newuserurl', protect, newUserUrl);
router.get('/', advancedResults(Url), getUrls);
router.get('/getuserurl/:id', protect, getUsersUrls);

router.route('/:id').get(getUrl).delete(protect, deleteUrl);

export { router as urlRoutes };
