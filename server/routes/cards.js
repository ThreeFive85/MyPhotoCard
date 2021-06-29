import express from 'express';

import { getCards, createCard, updateCard, deleteCard } from '../controllers/cards.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.patch('/:id', auth, updateCard);
router.delete('/:id', auth, deleteCard);

export default router;