import express from 'express';

import { getCards, createCard, updateCard, deleteCard, getUserCards, lockCard } from '../controllers/cards.js';
import auth from '../middleware/auth.js';

import { upload, deleteImg } from '../controllers/upload.js';

const router = express.Router();

router.get('/', getCards);
router.get('/user', auth, getUserCards);
router.post('/', auth, upload.single('photo'), createCard);
router.patch('/:id', auth, deleteImg, upload.single('photo'), updateCard);
router.patch('/:id/locked', auth, lockCard);
router.delete('/:id', auth, deleteImg, deleteCard);

export default router;