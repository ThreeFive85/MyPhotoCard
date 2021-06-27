import express from 'express';

import { getCards, createCard } from '../controllers/cards.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCards);
router.post('/', auth, createCard);

export default router;