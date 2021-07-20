import express from 'express';

import { getCards, createCard, updateCard, deleteCard, getUserCards, lockCard } from '../controllers/cards.js';
import auth from '../middleware/auth.js';

import { upload } from '../controllers/upload.js';

const router = express.Router();

router.get('/', getCards);
router.get('/user', auth, getUserCards);
router.post('/', auth, upload.single('photo'), createCard);
router.patch('/:id', auth, updateCard);
router.patch('/:id/locked', auth, lockCard);
router.delete('/:id', auth, deleteCard);

export default router;