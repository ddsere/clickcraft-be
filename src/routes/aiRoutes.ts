import express from 'express';
import { generateDescription } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-desc', generateDescription);

export default router;