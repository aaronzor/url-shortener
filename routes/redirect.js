import express from 'express';
import { redirectUrl } from '../controllers/url.js';

const router = express.Router();

router.get('/:urlid', redirectUrl);

export { router as redirectRoute };
