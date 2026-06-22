import express from 'express';
import { 
    createShowcase, 
    getShowcaseBySlug, 
    getShowcases,
    updateShowcase,
    deleteShowcase,
    getSellerShowcases
} from '../controllers/showcaseController.js';
import { protect, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getShowcases);
router.post('/', protect, seller, createShowcase);
router.get('/myshowcases', protect, seller, getSellerShowcases);

router.get('/:slug', getShowcaseBySlug);
router.put('/:id', protect, seller, updateShowcase);
router.delete('/:id', protect, seller, deleteShowcase);

export default router;