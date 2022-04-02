// Imports

import express from 'express';

// Import controllers
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/users.js';

// Define Router
const router = express.Router({ mergeParams: true });

// Import user model
import User from '../models/User.js';

// Import Middleware
import advancedResults from '../middleware/advancedResults.js';
import { protect, authorize } from '../middleware/auth.js';

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export { router as userRoutes };
