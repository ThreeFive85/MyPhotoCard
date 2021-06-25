import express from 'express';

import { getCards } from '../controllers/cards.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCards);

export default router;